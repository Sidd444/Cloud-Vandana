import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/services': {
        target: 'https://login.salesforce.com', // Default to production
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/services/, '/services'),
      },
    },
  },
})
