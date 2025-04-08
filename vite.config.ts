import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { defineConfig } from 'vite'
// @ts-ignore
import eslintPlugin from 'vite-plugin-eslint'
import solidPlugin from 'vite-plugin-solid'
import { CustomPagesPlugin } from './vite.custom-pages-plugin'

export default defineConfig({
  plugins: [CustomPagesPlugin, eslintPlugin(), solidPlugin(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
