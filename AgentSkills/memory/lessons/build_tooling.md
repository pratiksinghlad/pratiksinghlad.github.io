# Build tooling

## TypeScript 7 is the linter

`npm run lint` is `tsc --noEmit`. Do not add ESLint or `typescript-eslint`. TypeScript 7 has no compiler API, so those packages cannot parse it. Depend on the `typescript` package at version 7 directly.

## Function length is not a tsconfig option

`tsconfig.json` cannot limit function length or naming. `npm run lint` runs `tsc --noEmit`, then `node scripts/lint.ts`. That script opens the same `tsconfig.json` through `typescript/unstable/sync`. It fails when a function or method is longer than 40 lines, or when a name breaks the React convention: PascalCase components, `use` hooks, camelCase bindings, and `UPPER_SNAKE_CASE` module constants. Do not add ESLint for this. Node runs the `.ts` file directly.

## Stay on npm in GitHub Actions

GitHub-hosted runners already have Node and npm. `actions/setup-node` with `cache: npm` makes `npm ci` fast for this small lockfile. Bun is not on the runner, so every job would download it first. That setup costs more than Bun saves when installing about 30 packages, and the Vite build time does not change. Do not add Bun unless dependency installation itself dominates the workflow.

## Import Lucide icons by file

`import { Mail } from "lucide-react"` makes Vite transform the whole icon barrel, about 2,000 modules. Import each icon from `lucide-react/icons/<name>`. The package marks the barrel as side-effect free, but the barrel still pulls `import * as index` before tree-shaking.

## Vite 8 build target

Set `build.target` to `baseline-widely-available` and `build.cssMinify` to `"lightningcss"`. Those are the Vite 8 defaults. `es2022` and `cssMinify: true` fight that setup. Leave `build.cssTarget` unset so CSS minification follows the same target.

## Dialog light dismiss

Size a modal `<dialog>` to its content. `closedby="any"` only dismisses a click that lands outside the dialog's border box. A viewport-sized dialog has no outside. Dim the page with `dialog::backdrop`, and keep `overscroll-behavior: contain` on `dialog:modal` and the backdrop.

## Deleting old files

Delete unused files one path at a time. A single recursive force-delete across several directories is blocked.
