import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "client/src": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    alias: {
      "client/src": path.resolve(__dirname, "./src"),
      // Match what Summery.jsx resolves for its relative imports:
      // '../../../../../service/GlobalApi' from forms/ → <client>/service/GlobalApi
      "service/GlobalApi": path.resolve(__dirname, "./service/GlobalApi"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
      useFsEvents: false
    }
  },
  build: {
    outDir: "dist", // ✅ Output folder for Render publish
    chunkSizeWarningLimit: 1000, // Increase limit to avoid warning
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString()
          }
        },
      },
    },
  },
})
