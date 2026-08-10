import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: __dirname,
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'demo.ts'),
      name: 'GraphToolsDemo',
      formats: ['iife'],
      fileName: 'demo'
    }
  },
  resolve: {
    alias: {
      '@space-cadet/graph-core': resolve(__dirname, '../packages/graph-core/dist/index.mjs'),
      '@space-cadet/graph-ui': resolve(__dirname, '../packages/graph-ui/dist/index.mjs')
    }
  }
});
