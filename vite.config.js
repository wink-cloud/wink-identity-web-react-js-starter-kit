import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      // Forward /api/wink to your backend (Next.js starter kit or any compatible server).
      // Set VITE_WINK_BACKEND_URL=/api/wink in .env.local to use this proxy.
      '/api/wink': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
})
