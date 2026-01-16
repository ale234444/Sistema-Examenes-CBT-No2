import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // 🔥 Permite conexiones desde la red (celular, otras PCs)
    port: 5173    // 🔥 Puerto del frontend
  }

  
})
