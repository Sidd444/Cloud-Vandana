import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/services': {
        target: 'https://orgfarm-e6ad7059a5-dev-ed.develop.my.salesforce.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
