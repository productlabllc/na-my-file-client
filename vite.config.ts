import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['./src/assets/**/**/*.md'],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@namyfile/api-client'],
  },
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
});

const otherConfig = `/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['./src/assets/**/**/*.md'],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTest.ts'],
    include: ['./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    target: 'es2020'
  }
});
`;