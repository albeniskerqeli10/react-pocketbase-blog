import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';

// const ReactCompilerConfig = {
//   /* ... */
// };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // babel: {
      //   plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      // },
    }),

    eslintPlugin({
      cache: false,
      include: ['./src/**/*.js', './src/**/*.jsx'],
      exclude: [],
    }),
  ],

  base: '/',
  server: {
    port: 3000,
  },
});
