import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import copyAssets from "rollup-plugin-copy-assets";

export default defineConfig({
  plugins: [
    react(),
    copyAssets({
      assets: [
        "./icons",
        "./manifest.json",
        "./service_worker.js",
        "./src/contents/addNewComment.js",
        "./src/contents/displayComments.js",
        "./src/contents/taggedUserAlarm.js",
        "./src/contents/addDisplayComment.js",
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: "index.html",
      },
      output: {
        entryFileNames: `[name].js`,
      },
    },
    outDir: "dist",
  },
  server: {
    cors: true,
  },
});
