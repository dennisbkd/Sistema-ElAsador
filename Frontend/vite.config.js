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
  }
  // NO definir VITE_API_URL aquí - usar detección automática en networkUtils.js
})
