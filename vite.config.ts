import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'
// @ts-ignore
import eslintPlugin from 'vite-plugin-eslint'
import solidPlugin from 'vite-plugin-solid'
import pkg from './package.json'
import { CustomPagesPlugin } from './vite.custom-pages-plugin'

const outDir = 'leafer-component'
const excludeDeps: any = Object.keys(pkg.dependencies)
const entry: Record<string, string> = { index: 'src/leafer-component/index.ts' }
;['box', 'rect'].forEach((s) => {
  entry[`leafer-${s}/index`] = `src/leafer-component/leafer-${s}/index.tsx`
})
export default defineConfig({
  plugins: [
    CustomPagesPlugin,
    eslintPlugin(),
    solidPlugin(),
    tailwindcss(),
    dtsPlugin({
      include: ['src/leafer-component'],
      outDir,
    }),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    target: 'esnext',
    outDir,
    lib: {
      entry,
      formats: ['es'],
      name: 'LeaferComponent',
    },
    rollupOptions: {
      external: excludeDeps,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
