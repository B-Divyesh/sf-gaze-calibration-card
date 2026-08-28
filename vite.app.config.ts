import { defineConfig } from "vite";

export default defineConfig({
  root: "src/app",
  publicDir: "../../public",
  base: "./",
  build: {
    outDir: "../../dist/app",
    emptyOutDir: true,
    target: "es2022",
    cssCodeSplit: false
  },
  server: { port: 1420, strictPort: true }
});
