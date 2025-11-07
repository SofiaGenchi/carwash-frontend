import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para todas las rutas del backend apuntando al Gateway API
      '/api': {
        target: 'https://gateway-api-lztd.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
