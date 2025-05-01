/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import dts from "vite-plugin-dts";
import { fileURLToPath } from "url";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
      },
    }),
    dts(),
  ],
  build: {
    lib: {
      entry: {
        vue: path.resolve(__dirname, 'src/vue/index.ts'),
        svelte: path.resolve(__dirname, 'src/svelte/index.ts'),
        react: path.resolve(__dirname, 'src/react/index.ts'),
        index: path.resolve(__dirname, "src/index.ts")
      },
      name: "FluidDnd",
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'mjs' : 'cjs';
        return `${entryName}/index.${ext}`;
      }
    },
    rollupOptions: {
      external: ["vue", 'svelte', 'react', 'react-dom'],
      output: {
        globals: {
          vue: "Vue",
          svelte: 'svelte',
          react: 'react'
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
    exclude: ["node_modules", "my-test-examples", "docs/node_modules"],
  },
});
