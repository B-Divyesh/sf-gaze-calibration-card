import { defineConfig } from "vite";
import { execSync } from "node:child_process";

const buildId = process.env.GITHUB_SHA?.slice(0, 12) ?? execSync("git rev-parse --short=12 HEAD", { encoding: "utf8" }).trim();

export default defineConfig({
  root: "src/app",
  publicDir: "../../public",
  base: "./",
  define: { __BUILD_ID__: JSON.stringify(buildId) },
  build: {
    outDir: "../../dist/app",
    emptyOutDir: true,
    target: "es2022",
    cssCodeSplit: false
  },
  server: { port: 1420, strictPort: true }
});
