import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    Pages({
      extensions: ['tsx'],
      exclude: ['**/components/*', '**/utils/*', '**/api/*'],
      routeStyle: 'next',
    }),
    solidPlugin(),
    tailwindcss(),
  ],
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
