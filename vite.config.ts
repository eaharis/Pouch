import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "node:path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "popup.html"),
        reader: path.resolve(__dirname, "reader.html"),
        background: path.resolve(__dirname, "src/background/index.ts")
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === "background" ? "background/index.js" : "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (asset) =>
          asset.name?.endsWith(".css") ? "assets/[name][extname]" : "assets/[name][extname]"
      }
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "manifest.json", dest: "." },
        { src: "icons", dest: "." }
      ]
    })
  ]
});
