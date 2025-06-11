import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import Sitemap from 'vite-plugin-sitemap';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // plugins: [
  //   react(),
  //   mode === 'development' &&
  //   // Sitemap({ hostname: 'http:////192.168.86.24:8080/' }),
  // ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
