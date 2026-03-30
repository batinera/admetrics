import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          chart: ["chart.js", "vue-chartjs"],
          date: ["date-fns"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["vue", "chart.js", "vue-chartjs", "date-fns"],
  },
});
