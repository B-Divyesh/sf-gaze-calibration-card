import { defineConfig } from "vite";

export default defineConfig({
  root: "src/site",
  publicDir: "../../public",
  base: "/",
  build: {
    outDir: "../../dist/site",
    emptyOutDir: true,
    target: "es2022",
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: "src/site/index.html",
        privacy: "src/site/privacy/index.html",
        terms: "src/site/terms/index.html"
      }
    }
  },
  server: { port: 4173, strictPort: true }
});
