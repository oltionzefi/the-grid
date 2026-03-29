/**
 * Web-only Vite config.
 *
 * Serves the app in a browser without any Electron process.
 * Entry point: index.web.html → src/web-main.tsx (BrowserRouter, no IPC).
 * Builds to dist-web/ for static hosting (Vercel, Cloudflare Pages, S3+CDN).
 *
 * Dev:   pnpm dev:web    → http://localhost:5173
 * Build: pnpm build:web  → dist-web/
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
    rollupOptions: {
      // Use the web-specific HTML entry so BrowserRouter + no-IPC entry is loaded.
      input: path.resolve(__dirname, 'index.web.html'),
    },
  },
  server: {
    port: 5173,
  },
  // Ensure Electron globals are not defined in the web bundle.
  define: {
    'window.__ELECTRON__': 'undefined',
  },
});
