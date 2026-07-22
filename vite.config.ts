import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind v4 plugin
  ],
  server: {
    port: 3000, // Your frontend will run on port 3000
    proxy: {
      '/api': {
        target: 'https://autofix.pythonanywhere.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})