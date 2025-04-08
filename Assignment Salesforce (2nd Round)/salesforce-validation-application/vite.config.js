import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/services': {
        target: 'https://login.salesforce.com', // Update to match the environment (e.g., sandbox or production)
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/services/, '/services'),
      },
    },
  },
})
