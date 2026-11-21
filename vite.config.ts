import { createHash } from "node:crypto";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const DEV_SERVER_PORT = 3001;
const BUILD_DIR = "build";
const INDEX_FILE = "index.html";
const NOT_FOUND_FILE = "404.html";
const NO_JEKYLL_FILE = ".nojekyll";
const JSON_LD_SCRIPT = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
// React sets CSS variables through style attributes.
const STYLE_SRC = "'self' 'unsafe-inline'";

export default defineConfig({
  plugins: [react(), { name: "github-pages", apply: "build", closeBundle: publishForGitHubPages }],
  server: {
    port: DEV_SERVER_PORT,
    strictPort: true,
    warmup: { clientFiles: ["./src/index.tsx", "./src/App.tsx"] },
  },
  preview: { port: DEV_SERVER_PORT, strictPort: true },
  base: "/",
  build: {
    outDir: BUILD_DIR,
    emptyOutDir: true,
    target: "baseline-widely-available",
    minify: "oxc",
    cssMinify: "lightningcss",
    cssCodeSplit: false,
    sourcemap: false,
    modulePreload: { polyfill: false },
  },
});

function publishForGitHubPages(): void {
  const buildDir = resolve(process.cwd(), BUILD_DIR);
  const indexHtml = resolve(buildDir, INDEX_FILE);
  if (!existsSync(indexHtml)) return;
  const secured = withContentSecurityPolicy(readFileSync(indexHtml, "utf8"));
  writeFileSync(indexHtml, secured);
  copyFileSync(indexHtml, resolve(buildDir, NOT_FOUND_FILE));
  writeFileSync(resolve(buildDir, NO_JEKYLL_FILE), "");
}

function withContentSecurityPolicy(html: string): string {
  if (html.includes("Content-Security-Policy")) return html;
  const meta = `<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy(html)}" />`;
  const charset = `<meta charset="utf-8" />`;
  return html.replace(charset, `${charset}\n    ${meta}`);
}

function contentSecurityPolicy(html: string): string {
  const scriptSrc = ["'self'", ...scriptHashes(html)].join(" ");
  return `default-src 'self'; base-uri 'self'; object-src 'none'; style-src ${STYLE_SRC}; script-src ${scriptSrc}`;
}

function scriptHashes(html: string): string[] {
  const hashes: string[] = [];
  for (const match of html.matchAll(JSON_LD_SCRIPT)) {
    const body = match[1];
    if (body) hashes.push(`'sha256-${sha256(body)}'`);
  }
  return hashes;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("base64");
}
