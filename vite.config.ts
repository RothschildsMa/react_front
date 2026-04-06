import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/code': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/mipha': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});