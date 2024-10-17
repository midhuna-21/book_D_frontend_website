import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port:5173,
    proxy: {
    //   '/api': {
    //   target:'https://www.bookd.store',
    //   changeOrigin:true
    //   }
    // },
      '/api': {
      target:'http://localhost:8000',
      changeOrigin:true
      }
    },
    watch: {
      usePolling:true
    }
  }
})
