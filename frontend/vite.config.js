import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Read the backend port from PORT environment variable, fallback to 8000
const backendPort = process.env.PORT || '8000';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': `http://127.0.0.1:${backendPort}`
    }
  }
})
