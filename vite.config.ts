import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'
// @ts-ignore
import eslintPlugin from 'vite-plugin-eslint'
import solidPlugin from 'vite-plugin-solid'
import pkg from './package.json'
import { CustomPagesPlugin } from './vite.custom-pages-plugin'

const excludeDeps = Object.keys(pkg.dependencies)
const files = ['box', 'rect'].map(
  (s) => `src/leafer-component/leafer-${s}/index.tsx`,
)
files.push(`src/leafer-component/index.ts`)
export default defineConfig({
  plugins: [
    CustomPagesPlugin,
    eslintPlugin(),
    solidPlugin(),
    tailwindcss(),
    dtsPlugin({
      include: ['src/leafer-component'],
      outDir: 'leafer-component',
    }),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    target: 'esnext',
    lib: {
      entry: files,
      name: 'LeaferComponent',
      fileName: 'leafer-component',
    },
    rollupOptions: {
      external: excludeDeps,
      output: {
        // entryFileNames: 'index.js',
        dir: 'leafer-component',
        format: 'es',
        preserveModules: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
