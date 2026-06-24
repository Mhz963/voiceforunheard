async function handleTtsRequest(req, res) {
  try {
    const { synthesizeUrduSpeech } = await import('./synthesizeUrdu.js')
    const url = new URL(req.url, 'http://localhost')
    const text = url.searchParams.get('text')?.trim()
    const rate = Number(url.searchParams.get('rate') || '0.92')

    if (!text) {
      res.statusCode = 400
      res.end('Missing text')
      return
    }

    const audio = await synthesizeUrduSpeech(text, { rate: Number.isFinite(rate) ? rate : 0.92 })
    res.statusCode = 200
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=604800')
    res.end(audio)
  } catch (error) {
    console.error('Urdu TTS dev error:', error)
    res.statusCode = 500
    res.end('TTS failed')
  }
}

function attachTtsMiddleware(server) {
  server.middlewares.use((req, res, next) => {
    if (!req.url?.startsWith('/api/tts')) {
      next()
      return
    }
    handleTtsRequest(req, res)
  })
}

export default function urduTtsPlugin() {
  return {
    name: 'urdu-tts-api',
    configureServer: attachTtsMiddleware,
    configurePreviewServer: attachTtsMiddleware,
  }
}
