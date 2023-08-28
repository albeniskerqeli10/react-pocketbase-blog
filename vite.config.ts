import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-eslint-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),

    eslintPlugin({
      cache: false,
      include: ['./src/**/*.js', './src/**/*.jsx'],
      exclude: [],
    }),
  ],

  base: '/',
  server: {
    port: 8000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
});
