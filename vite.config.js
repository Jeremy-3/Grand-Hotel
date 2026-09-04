import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://group-propject-backend.onrender.com', 
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
})
