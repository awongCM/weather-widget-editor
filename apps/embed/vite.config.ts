import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/widget.ts',
      name: 'WeatherWidget',
      formats: ['iife'],
      fileName: () => 'widget.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: 'widget.css',
      },
    },
  },
});
