import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import fict from '@fictjs/vite-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const benchmarkRoot = path.resolve(__dirname, '../../..')

export default defineConfig({
  root: benchmarkRoot,
  plugins: [fict({ fineGrainedDom: false })],
  optimizeDeps: {
    entries: ['frameworks/keyed/fict/index.html'],
    include: ['fict', '@fictjs/runtime'],
    force: true,
  },
  server: {
    fs: {
      strict: false,
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.js'),
      output: {
        entryFileNames: 'main.js',
      },
    },
  },
})
