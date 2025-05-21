import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite"; // ✅ new Tailwind plugin for v4+

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    tailwindcss(), // ✅ Tailwind plugin integrated
  ],
  server: {
    proxy: {
      "/me": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
