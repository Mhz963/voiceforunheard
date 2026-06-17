import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Inject CSS through the JS bundle so styles cannot be blocked by a
    // poisoned browser cache on a separate crossorigin stylesheet request.
    cssInjectedByJsPlugin({
      topExecutionPriority: true,
    }),
    {
      name: 'strip-asset-crossorigin',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          return html
            .replace(
              /(<link rel="stylesheet") crossorigin href="\/assets\//g,
              '$1 href="/assets/',
            )
            .replace(
              /(<script type="module") crossorigin src="\/assets\//g,
              '$1 src="/assets/',
            )
            .replace(
              /(<link rel="modulepreload") crossorigin href="\/assets\//g,
              '$1 href="/assets/',
            )
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
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})
