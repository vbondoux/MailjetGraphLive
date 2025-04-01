import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  preview: {
    allowedHosts: ['mailjetgraphlive-production.up.railway.app'],
    port: 4173
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
