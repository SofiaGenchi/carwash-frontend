import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Temporalmente apuntando directamente a los microservicios para debugging
      '/api/users': {
        target: 'https://users-api-jmp5.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/users/, '/api/users'),
      },
      '/api/services': {
        target: 'https://carwash-services.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/services/, '/api/services'),
      },
      '/api/appointments': {
        target: 'https://carwash-appointments.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/appointments/, '/api/appointments'),
      },
      '/api/auth': {
        target: 'https://gateway-api-lztd.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
