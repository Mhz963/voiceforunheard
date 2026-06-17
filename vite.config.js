import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'css-before-js',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          const cssLink = html.match(/<link rel="stylesheet"[^>]*>/)
          const moduleScript = html.match(/<script type="module"[^>]*><\/script>/)
          if (!cssLink || !moduleScript) return html

          const withoutCss = html.replace(cssLink[0], '')
          return withoutCss.replace(
            moduleScript[0],
            `${cssLink[0]}\n    ${moduleScript[0]}`,
          )
        },
      },
    },
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})
