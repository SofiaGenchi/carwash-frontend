import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para todas las rutas del backend
      '^/(users|auth|appointments|services|permissions)': 'http://localhost:5000',
    },
  },
});
