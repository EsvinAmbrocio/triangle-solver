import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/triangle-solver/' : '/',
  plugins: [vue(), tailwindcss()],
  test: {
    environment: 'node',
  },
})
