// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    postcss: './postcss.config.js',
    port: 3000, // 指定開發伺服器的端口號為 3000
  },
})
