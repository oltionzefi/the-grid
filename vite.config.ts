import { rmSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron/simple';
import { configDefaults } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  rmSync('dist', { recursive: true, force: true });

  const isServe = command === 'serve';
  const isBuild = command === 'build';
  const isTest = mode === 'test';
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
      },
    },
    plugins: [
      tailwindcss(),
      react(),
      tsconfigPaths(),
      // In Vitest (jsdom), asset file imports (webp, png, etc.) resolve to "" causing
      // React src="" warnings. Intercept via resolveId/load so jsdom gets a real string.
      {
        name: 'vitest-asset-stub',
        enforce: 'pre' as const,
        resolveId(id: string) {
          if (isTest && /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(id)) {
            return `\0vitest-asset:${id}`;
          }
        },
        load(id: string) {
          if (id.startsWith('\0vitest-asset:')) {
            return `export default "test-asset-stub.png"`;
          }
        },
      },
      electron({
        main: {
          entry: 'electron/main/index.ts',
          onstart(args) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App');
            } else {
              args.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        preload: {
          input: 'electron/preload/index.ts',
          onstart(args) {
            // Hot-reload the renderer when preload rebuilds; on initial
            // startup args.reload() falls through to startup() internally.
            args.reload();
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        // Polyfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration`
        // needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: {},
      }),
    ],
    test: {
      exclude: [...configDefaults.exclude, 'e2e/*', '**/{postcss,tailwind,playwright}.config.*'],
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test-setup.ts'],
      coverage: {
        provider: 'v8',
        exclude: [
          ...configDefaults.coverage?.exclude ?? [],
          'electron/**',
          'src/electron-main.tsx',
          'src/web-main.tsx',
          'src/commands/node.ts',
          'playwright.config.ts',
          'postcss.config.js',
          'vite.config.ts',
          'e2e/**',
          'src/e2e/**',
          '**/*.steps.ts',
          '**/hooks.ts',
          '**/timeout.ts',
          '**/world.ts',
          '**/fileMock.ts',
        ],
      },
    },
    server: {
      watch: {
        ignored: [
          path.resolve(__dirname, 'coverage'),
          path.resolve(__dirname, 'playwright-report'),
          path.resolve(__dirname, 'test-results'),
          path.resolve(__dirname, 'dist-web'),
          path.resolve(__dirname, 'e2e/screenshots'),
          path.resolve(__dirname, 'e2e/reports'),
        ],
      },
      ...(process.env.VSCODE_DEBUG &&
        (() => {
          const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
          return { host: url.hostname, port: +url.port };
        })()),
    },
    clearScreen: false,
  };
});
