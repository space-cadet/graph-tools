import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GraphUI',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'd3',
        'd3-selection',
        'd3-force',
        'd3-drag',
        'd3-transition',
        'd3-ease',
        'sigma',
        'graphology',
        'graphology-layout',
        'graphology-layout-force',
        'graphology-layout-forceatlas2',
        'graphology-layout-noverlap',
        '@space-cadet/graph-core'
      ]
    }
  },
  resolve: {
    alias: {
      '@space-cadet/graph-core': resolve(__dirname, '../graph-core/src/index.ts')
    }
  }
});
