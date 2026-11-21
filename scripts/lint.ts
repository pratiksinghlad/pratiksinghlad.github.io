import { API, type Project, type Snapshot } from "typescript/unstable/sync";
import {
  NodeFlags,
  SyntaxKind,
  type CallExpression,
  type Identifier,
  type Node,
  type PropertyAccessExpression,
  type SourceFile,
  type VariableDeclaration,
} from "typescript/unstable/ast";

// Components are PascalCase, hooks are useCamelCase, other functions and
// bindings are camelCase, and module-level literal constants are UPPER_SNAKE_CASE.
const MAX_FUNCTION_LINES = 40;
const CONFIG_FILE = "tsconfig.json";
const PASCAL_CASE = /^[A-Z][A-Za-z0-9]*$/;
const CAMEL_CASE = /^[a-z][A-Za-z0-9]*$/;
const HOOK_NAME = /^use[A-Z][A-Za-z0-9]*$/;
const UPPER_SNAKE = /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/;
const FUNCTION_KINDS = new Set<SyntaxKind>([
  SyntaxKind.FunctionDeclaration,
  SyntaxKind.FunctionExpression,
  SyntaxKind.ArrowFunction,
  SyntaxKind.MethodDeclaration,
  SyntaxKind.Constructor,
  SyntaxKind.GetAccessor,
  SyntaxKind.SetAccessor,
]);
const NESTED_FUNCTION_KINDS = new Set<SyntaxKind>([
  SyntaxKind.FunctionDeclaration,
  SyntaxKind.FunctionExpression,
  SyntaxKind.MethodDeclaration,
  SyntaxKind.Constructor,
  SyntaxKind.GetAccessor,
  SyntaxKind.SetAccessor,
]);
const JSX_KINDS = new Set<SyntaxKind>([
  SyntaxKind.JsxElement,
  SyntaxKind.JsxSelfClosingElement,
  SyntaxKind.JsxFragment,
]);
const LITERAL_KINDS = new Set<SyntaxKind>([
  SyntaxKind.StringLiteral,
  SyntaxKind.NumericLiteral,
  SyntaxKind.BigIntLiteral,
  SyntaxKind.NoSubstitutionTemplateLiteral,
  SyntaxKind.TemplateExpression,
  SyntaxKind.RegularExpressionLiteral,
  SyntaxKind.ArrayLiteralExpression,
  SyntaxKind.ObjectLiteralExpression,
  SyntaxKind.TrueKeyword,
  SyntaxKind.FalseKeyword,
  SyntaxKind.NullKeyword,
]);
const UNWRAP_KINDS = new Set<SyntaxKind>([
  SyntaxKind.AsExpression,
  SyntaxKind.SatisfiesExpression,
  SyntaxKind.TypeAssertionExpression,
  SyntaxKind.ParenthesizedExpression,
]);

interface Violation {
  readonly fileName: string;
  readonly line: number;
  readonly character: number;
  readonly message: string;
}

interface FunctionShape extends Node {
  readonly name?: Node;
  readonly body?: Node;
}

const api = new API();
try {
  const violations = collectViolations(api.updateSnapshot({ openProjects: [CONFIG_FILE] }));
  report(violations);
} finally {
  api.close();
}

function collectViolations(snapshot: Snapshot): Violation[] {
  const project = projectForConfig(snapshot);
  const violations: Violation[] = [];
  for (const fileName of project.program.getSourceFileNames()) {
    if (!isProjectSource(fileName)) continue;
    const sourceFile = project.program.getSourceFile(fileName);
    if (sourceFile) walk(sourceFile, sourceFile, violations);
  }
  return violations;
}

function projectForConfig(snapshot: Snapshot): Project {
  const project = snapshot.getProjects().find((candidate) => {
    return normalize(candidate.configFileName).endsWith(`/${CONFIG_FILE}`);
  });
  if (project) return project;
  throw new Error(`No TypeScript project loaded from ${CONFIG_FILE}.`);
}

function isProjectSource(fileName: string): boolean {
  const path = normalize(fileName);
  return !path.includes("/node_modules/") && (path.endsWith(".ts") || path.endsWith(".tsx"));
}

function walk(node: Node, sourceFile: SourceFile, violations: Violation[]): void {
  if (node.kind === SyntaxKind.ImportDeclaration) return;
  checkNode(node, sourceFile, violations);
  node.forEachChild((child) => {
    walk(child, sourceFile, violations);
  });
}

function checkNode(node: Node, sourceFile: SourceFile, violations: Violation[]): void {
  if (FUNCTION_KINDS.has(node.kind)) {
    checkFunction(node as FunctionShape, sourceFile, violations);
    return;
  }
  if (node.kind === SyntaxKind.VariableDeclaration) {
    checkVariable(node as VariableDeclaration, sourceFile, violations);
    return;
  }
  if (node.kind === SyntaxKind.Parameter || node.kind === SyntaxKind.BindingElement) {
    checkCamelName(namedNode(node), sourceFile, violations);
    return;
  }
  if (isTypeDeclaration(node.kind)) {
    checkPascalName(namedNode(node), sourceFile, violations);
    return;
  }
  if (isMemberName(node.kind)) checkMemberName(node, sourceFile, violations);
}

function checkFunction(fn: FunctionShape, sourceFile: SourceFile, violations: Violation[]): void {
  if (fn.body) checkFunctionLength(fn, sourceFile, violations);
  const name = identifierText(fn.name);
  if (!name || !fn.name) return;
  const message = functionNameError(name, fn);
  if (message) push(violations, fn.name, sourceFile, message);
}

function checkFunctionLength(node: Node, sourceFile: SourceFile, violations: Violation[]): void {
  const lines = lineCount(node, sourceFile);
  if (lines <= MAX_FUNCTION_LINES) return;
  const name = identifierText((node as FunctionShape).name) ?? "anonymous";
  const message = `Function '${name}' is ${lines} lines; the maximum is ${MAX_FUNCTION_LINES}.`;
  push(violations, node, sourceFile, message);
}

function checkVariable(node: VariableDeclaration, sourceFile: SourceFile, violations: Violation[]): void {
  const name = identifierText(node.name);
  if (!name) return;
  const initializer = node.initializer;
  if (initializer && FUNCTION_KINDS.has(initializer.kind)) {
    const message = functionNameError(name, initializer);
    if (message) push(violations, node.name, sourceFile, message);
    return;
  }
  const message = valueNameError(name, node);
  if (message) push(violations, node.name, sourceFile, message);
}

function checkCamelName(name: Node | undefined, sourceFile: SourceFile, violations: Violation[]): void {
  const text = identifierText(name);
  if (!text || !name || CAMEL_CASE.test(text)) return;
  push(violations, name, sourceFile, `'${text}' must be camelCase.`);
}

function checkPascalName(name: Node | undefined, sourceFile: SourceFile, violations: Violation[]): void {
  const text = identifierText(name);
  if (!text || !name || PASCAL_CASE.test(text)) return;
  push(violations, name, sourceFile, `Type '${text}' must be PascalCase.`);
}

function checkMemberName(node: Node, sourceFile: SourceFile, violations: Violation[]): void {
  const name = namedNode(node);
  const text = identifierText(name);
  if (!text || !name) return;
  if (node.kind === SyntaxKind.EnumMember && !UPPER_SNAKE.test(text)) {
    push(violations, name, sourceFile, `Enum member '${text}' must be UPPER_SNAKE_CASE.`);
    return;
  }
  if (node.kind !== SyntaxKind.EnumMember && !CAMEL_CASE.test(text)) {
    push(violations, name, sourceFile, `'${text}' must be camelCase.`);
  }
}

function functionNameError(name: string, fn: Node): string | undefined {
  if (rendersJsx(fn)) {
    return PASCAL_CASE.test(name) ? undefined : `Component '${name}' must be PascalCase.`;
  }
  if (callsHook(fn)) {
    return HOOK_NAME.test(name) ? undefined : `Hook '${name}' must start with "use", like useSpotlight.`;
  }
  if (CAMEL_CASE.test(name)) return undefined;
  if (PASCAL_CASE.test(name)) return `Function '${name}' must be camelCase. PascalCase is for components.`;
  return `Function '${name}' must be camelCase.`;
}

function valueNameError(name: string, declaration: VariableDeclaration): string | undefined {
  if (isModuleConst(declaration) && isLiteralValue(declaration.initializer)) {
    return UPPER_SNAKE.test(name) ? undefined : `Constant '${name}' must be UPPER_SNAKE_CASE.`;
  }
  if (PASCAL_CASE.test(name)) {
    const usedAsComponent = usedAsJsxTag(enclosingScope(declaration), name);
    return usedAsComponent ? undefined : `'${name}' must be camelCase. PascalCase is for components.`;
  }
  if (isModuleConst(declaration) && UPPER_SNAKE.test(name)) return undefined;
  return CAMEL_CASE.test(name) ? undefined : `'${name}' must be camelCase.`;
}

function rendersJsx(fn: Node): boolean {
  const body = (fn as FunctionShape).body;
  return body ? containsJsx(body) : false;
}

function containsJsx(node: Node): boolean {
  if (JSX_KINDS.has(node.kind)) return true;
  return (
    node.forEachChild((child) => {
      if (NESTED_FUNCTION_KINDS.has(child.kind)) return undefined;
      return containsJsx(child) || undefined;
    }) === true
  );
}

function callsHook(fn: Node): boolean {
  const body = (fn as FunctionShape).body;
  return body ? hookCallIn(body) : false;
}

function hookCallIn(node: Node): boolean {
  if (isHookCall(node)) return true;
  return (
    node.forEachChild((child) => {
      if (FUNCTION_KINDS.has(child.kind)) return undefined;
      return hookCallIn(child) || undefined;
    }) === true
  );
}

function isHookCall(node: Node): boolean {
  if (node.kind !== SyntaxKind.CallExpression) return false;
  const name = calleeName((node as CallExpression).expression);
  return name !== undefined && HOOK_NAME.test(name);
}

function calleeName(node: Node): string | undefined {
  if (node.kind === SyntaxKind.Identifier) return (node as Identifier).text;
  if (node.kind !== SyntaxKind.PropertyAccessExpression) return undefined;
  return identifierText((node as PropertyAccessExpression).name);
}

function isLiteralValue(node: Node | undefined): boolean {
  if (!node) return false;
  const value = unwrap(node);
  if (LITERAL_KINDS.has(value.kind)) return true;
  if (value.kind !== SyntaxKind.PrefixUnaryExpression) return false;
  const operand = (value as Node & { readonly operand?: Node }).operand;
  return operand !== undefined && LITERAL_KINDS.has(operand.kind);
}

function unwrap(node: Node): Node {
  let current = node;
  while (UNWRAP_KINDS.has(current.kind)) {
    const inner = (current as Node & { readonly expression?: Node }).expression;
    if (!inner) return current;
    current = inner;
  }
  return current;
}

function isModuleConst(declaration: VariableDeclaration): boolean {
  const list = declaration.parent;
  if (list?.kind !== SyntaxKind.VariableDeclarationList) return false;
  return (list.flags & NodeFlags.Const) !== 0 && isModuleBinding(declaration);
}

function isModuleBinding(node: Node): boolean {
  let current: Node | undefined = node.parent;
  while (current) {
    if (current.kind === SyntaxKind.SourceFile) return true;
    if (current.kind !== SyntaxKind.VariableDeclarationList && current.kind !== SyntaxKind.VariableStatement) {
      return false;
    }
    current = current.parent;
  }
  return false;
}

function usedAsJsxTag(scope: Node, name: string): boolean {
  if (isJsxTag(scope, name)) return true;
  return (
    scope.forEachChild((child) => {
      return usedAsJsxTag(child, name) || undefined;
    }) === true
  );
}

function isJsxTag(node: Node, name: string): boolean {
  if (node.kind !== SyntaxKind.JsxOpeningElement && node.kind !== SyntaxKind.JsxSelfClosingElement) return false;
  const tagName = (node as Node & { readonly tagName?: Node }).tagName;
  return identifierText(tagName) === name;
}

function enclosingScope(node: Node): Node {
  let current: Node | undefined = node.parent;
  while (current) {
    if (FUNCTION_KINDS.has(current.kind) || current.kind === SyntaxKind.SourceFile) return current;
    current = current.parent;
  }
  return node;
}

function lineCount(node: Node, sourceFile: SourceFile): number {
  const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  const endPosition = Math.max(node.getStart(sourceFile), node.getEnd() - 1);
  const end = sourceFile.getLineAndCharacterOfPosition(endPosition);
  return end.line - start.line + 1;
}

function namedNode(node: Node): Node | undefined {
  return (node as Node & { readonly name?: Node }).name;
}

function identifierText(node: Node | undefined): string | undefined {
  if (node?.kind !== SyntaxKind.Identifier) return undefined;
  return (node as Identifier).text;
}

function isTypeDeclaration(kind: SyntaxKind): boolean {
  return (
    kind === SyntaxKind.InterfaceDeclaration ||
    kind === SyntaxKind.TypeAliasDeclaration ||
    kind === SyntaxKind.ClassDeclaration ||
    kind === SyntaxKind.ClassExpression ||
    kind === SyntaxKind.EnumDeclaration ||
    kind === SyntaxKind.TypeParameter
  );
}

function isMemberName(kind: SyntaxKind): boolean {
  return (
    kind === SyntaxKind.PropertySignature ||
    kind === SyntaxKind.MethodSignature ||
    kind === SyntaxKind.PropertyDeclaration ||
    kind === SyntaxKind.EnumMember
  );
}

function push(violations: Violation[], node: Node, sourceFile: SourceFile, message: string): void {
  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  violations.push({
    fileName: sourceFile.fileName,
    line: position.line + 1,
    character: position.character + 1,
    message,
  });
}

function report(violations: readonly Violation[]): void {
  for (const item of violations) {
    const where = `${item.fileName}(${item.line},${item.character})`;
    console.error(`${where}: error: ${item.message}`);
  }
  if (violations.length > 0) process.exitCode = 1;
}

function normalize(fileName: string): string {
  return fileName.replaceAll("\\", "/");
}
