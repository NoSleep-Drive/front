import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { API_BASE_URL } from '../config/env';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    tsconfigPaths(), // alias 적용 플러그인
  ],

  server: {
    proxy: {
      '/api': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
