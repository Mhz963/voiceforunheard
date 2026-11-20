/* global process */
import { loadEnv } from 'vite'
import { handleContact } from '../api/_lib/contact.js'

// Serves POST /api/contact during `npm run dev` / `npm run preview`
// (on Vercel the api/contact.js function handles it).
export default function contactPlugin() {
  const attach = (server) => {
    server.middlewares.use('/api/contact', (req, res) => {
      handleContact(req, res).catch((error) => {
        console.error('Contact dev error:', error)
        res.statusCode = 500
        res.end()
      })
    })
  }
  return {
    name: 'contact-api',
    config(_, { mode }) {
      Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
    },
    configureServer: attach,
    configurePreviewServer: attach,
  }
}
