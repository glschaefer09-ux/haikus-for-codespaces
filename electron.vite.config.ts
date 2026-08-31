import { resolve } from 'node:path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve(__dirname, 'src/shared'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve(__dirname, 'src/shared'),
      },
    },
    build: {
      rollupOptions: {
        // Electron's sandboxed preload loader (webPreferences.sandbox: true,
        // set in src/main/index.ts) cannot execute ES module syntax — only
        // CommonJS. Without this, electron-vite emits an ESM .mjs preload
        // (following this package's "type": "module") that fails silently
        // at load time with "Cannot use import statement outside a module",
        // so contextBridge never runs and window.crosspcai stays undefined.
        output: {
          format: 'cjs',
          entryFileNames: '[name].js',
        },
      },
    },
  },
  renderer: {
    root: 'src/renderer',
    resolve: {
      alias: {
        '@shared': resolve(__dirname, 'src/shared'),
        '@renderer': resolve(__dirname, 'src/renderer/src'),
      },
    },
    plugins: [react()],
  },
});
