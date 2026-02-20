/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: process.env.ELECTRON_MODE === 'true' ? '0.0.0.0' : 'localhost',
    port: 5173,
    strictPort: true
  },
  // Optimizaciones para compatibilidad con navegadores móviles
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false
  },
  // Asegurar que window esté disponible antes de ejecutar el código
  optimizeDeps: {
    include: ['axios', 'socket.io-client']
  }
})
