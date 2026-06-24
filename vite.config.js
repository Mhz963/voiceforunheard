import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import urduTtsPlugin from './server/urduTtsPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    urduTtsPlugin(),
    {
      name: 'fix-production-html',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          let result = html
            .replace(/ crossorigin href="\/assets\//g, ' href="/assets/')
            .replace(/ crossorigin src="\/assets\//g, ' src="/assets/')

          const bundleCss = result.match(/<link rel="stylesheet" href="\/assets\/[^"]+\.css">/)
          const bundleJs = result.match(/<script type="module" src="\/assets\/[^"]+\.js"><\/script>/)

          if (bundleCss && bundleJs) {
            result = result.replace(bundleCss[0], '').replace(bundleJs[0], '')
            result = result.replace(
              '</title>',
              `</title>\n    ${bundleCss[0]}\n    ${bundleJs[0]}`,
            )
          }

          return result
        },
      },
    },
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/app-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})
