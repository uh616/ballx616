import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/ballx616/' : '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});

