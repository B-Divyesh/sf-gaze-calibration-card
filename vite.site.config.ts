import { defineConfig } from "vite";
import { execSync } from "node:child_process";

const buildId = process.env.GITHUB_SHA?.slice(0, 12) ?? execSync("git rev-parse --short=12 HEAD", { encoding: "utf8" }).trim();

export default defineConfig({
  root: "src/site",
  publicDir: "../../public",
  base: "/",
  define: { __BUILD_ID__: JSON.stringify(buildId) },
  build: {
    outDir: "../../dist/site",
    emptyOutDir: true,
    target: "es2022",
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: "src/site/index.html",
        demo: "src/site/demo/index.html",
        privacy: "src/site/privacy/index.html",
        terms: "src/site/terms/index.html",
        notFound: "src/site/404.html"
      }
    }
  },
  server: { port: 4173, strictPort: true }
});
