import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'scripts/speech-texts.json'

// Dev-server only: POST /__speech-texts with {texts: [{lang, text}]} merges the
// texts into scripts/speech-texts.json, the input for
// scripts/generate_voice_clips.py.
export default function speechCollectPlugin() {
  return {
    name: 'speech-collect',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__speech-texts', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        let body = ''
        req.on('data', (c) => (body += c))
        req.on('end', () => {
          let existing = { en: [], ur: [] }
          try {
            existing = JSON.parse(readFileSync(FILE, 'utf8'))
          } catch {
            /* first run */
          }
          const sets = { en: new Set(existing.en), ur: new Set(existing.ur) }
          for (const { lang, text } of JSON.parse(body).texts ?? []) {
            if (sets[lang] && typeof text === 'string' && text.trim()) sets[lang].add(text)
          }
          const out = { en: [...sets.en].sort(), ur: [...sets.ur].sort() }
          writeFileSync(FILE, `${JSON.stringify(out, null, 2)}\n`)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ en: out.en.length, ur: out.ur.length }))
        })
      })
    },
  }
}
