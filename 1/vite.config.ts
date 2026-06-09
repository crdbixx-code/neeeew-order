import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Removed vite-plugin-enter-dev — it strips the body <script> tag and
// only works inside the Enter platform sandbox, causing blank page everywhere else.
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
  build: {
    outDir: "dist",
  },
});
