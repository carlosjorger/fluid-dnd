/// <reference types="vitest" />
import { defineConfig } from "vite";
import * as path from "path";
import dts from "vite-plugin-dts";
import { fileURLToPath } from "url";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts(),
  ],
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        vue: path.resolve(__dirname, 'src/vue/index.ts'),
        svelte: path.resolve(__dirname, 'src/svelte/index.ts'),
        react: path.resolve(__dirname, 'src/react/index.ts')
      },
      name: "Fluid-DnD",
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'mjs' : 'cjs';
        if (entryName === 'index') {
          return `index.${ext}`;
        }
        return `${entryName}/index.${ext}`;
      }
    },
    rollupOptions: {
      external: ["vue", 'svelte', 'react', 'react-dom'],
      output: {
        globals: {
          vue: "Vue",
          svelte: 'svelte',
          react: 'react',
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom", // or 'node'
    exclude: ["node_modules", "docs/node_modules", "public", "tests-frameworks"],
  },
});
