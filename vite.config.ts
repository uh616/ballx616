import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/ballx616/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});

