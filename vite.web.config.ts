/**
 * Web-only Vite config used for E2E Cucumber tests.
 * Does NOT include vite-plugin-electron (no Electron process, no rmSync).
 * Builds to dist-web/ which vite preview can serve cleanly.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: { '@': path.join(__dirname, 'src') },
  },
  plugins: [tailwindcss(), react(), tsconfigPaths()],
  build: {
    outDir: 'dist-web',
    emptyOutDir: true,
  },
  // Stub out vite-env electron globals so the renderer doesn't crash
  define: {
    'window.__ELECTRON__': 'undefined',
  },
});
