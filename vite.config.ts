import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'
// @ts-ignore
import eslintPlugin from 'vite-plugin-eslint'
import solidPlugin from 'vite-plugin-solid'
import { CustomPagesPlugin } from './vite.custom-pages-plugin'

export default defineConfig({
  plugins: [
    CustomPagesPlugin,
    eslintPlugin(),
    dtsPlugin({ include: ['src/components/'] }),
    solidPlugin(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/components/leafer-rect/index.tsx'),
      },
      output: {
        entryFileNames: '[name].js',
        dir: resolve(__dirname, '_components'),
        format: 'es',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
