import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const DEV_SERVER_PORT = 3001;
const BUILD_DIR = "build";
const INDEX_FILE = "index.html";
const NOT_FOUND_FILE = "404.html";

export default defineConfig({
  plugins: [react(), { name: "copy-index-to-404", closeBundle: copyIndexToNotFound }],
  server: { port: DEV_SERVER_PORT },
  base: "/",
  build: {
    outDir: BUILD_DIR,
    target: "es2022",
    reportCompressedSize: false,
  },
});

function copyIndexToNotFound(): void {
  const buildDir = resolve(process.cwd(), BUILD_DIR);
  const indexHtml = resolve(buildDir, INDEX_FILE);
  const notFoundHtml = resolve(buildDir, NOT_FOUND_FILE);
  if (existsSync(indexHtml)) copyFileSync(indexHtml, notFoundHtml);
}
