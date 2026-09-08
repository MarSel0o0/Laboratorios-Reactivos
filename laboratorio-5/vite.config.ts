import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/threads': 'http://localhost:3001',
      '/api/posts': 'http://localhost:3001',
    },
  },
})
