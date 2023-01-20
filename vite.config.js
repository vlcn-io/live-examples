// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2020",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
      },
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
});
