import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://gateway-api-lztd.onrender.com', 
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
    },
  },
});
