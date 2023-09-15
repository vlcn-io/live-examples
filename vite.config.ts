import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        todomvc: resolve(__dirname, "todomvc.html"),
        todomvcp2p: resolve(__dirname, "todomvc-p2p.html"),
      },
    },
  },
  optimizeDeps: {
    exclude: ["@vite/client", "@vite/env", "@vlcn.io/crsqlite-wasm"],
    esbuildOptions: {
      target: "esnext",
    },
  },
  plugins: [react()],
  server: {
    fs: {
      strict: false,
    },
  },
});
