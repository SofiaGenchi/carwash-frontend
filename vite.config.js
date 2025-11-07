import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para todas las rutas del backend apuntando al Gateway API
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://gateway-api-lztd.onrender.com'
          : 'http://localhost:3000',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
