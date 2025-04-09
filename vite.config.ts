import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'
// @ts-ignore
import eslintPlugin from 'vite-plugin-eslint'
import solidPlugin from 'vite-plugin-solid'
import pkg from './package.json'
import { CustomPagesPlugin } from './vite.custom-pages-plugin'

const excludeDeps = Object.keys(pkg.dependencies).filter(
  (dep) => !['solid-js', 'solid-element'].includes(dep),
)
const files = ['box', 'rect'].map((s) => `src/components/leafer-${s}/index.tsx`)

export default defineConfig({
  plugins: [
    CustomPagesPlugin,
    eslintPlugin(),
    solidPlugin(),
    tailwindcss(),
    dtsPlugin({
      include: ['src/components'],
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
      input: files,
      output: {
        entryFileNames: (args) => {
          return args
            .facadeModuleId!.replace(
              '/workspaces/solid-template/src/components/',
              '',
            )
            .replace('tsx', 'js')
        },
        dir: 'leafer-component',
        format: 'es',
        preserveModules: false,
        // preserveModulesRoot,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
