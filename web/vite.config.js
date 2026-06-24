import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Eastbound frontend. Served at the domain root in production by the Express
// server (which also hosts /api). In dev, `npm run dev` runs Vite on 5173 and
// proxies /api to the local backend on 8080.
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:8080", changeOrigin: true }
    }
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    // keep asset names hashed (default) — the service worker caches at runtime
    chunkSizeWarningLimit: 900
  }
});
