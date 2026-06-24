function parseRate(value) {
  const rate = Number(value)
  return Number.isFinite(rate) ? rate : 0.92
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function parseTtsInput(req) {
  if (req.method === 'POST') {
    const raw = await readRequestBody(req)
    const body = raw ? JSON.parse(raw) : {}
    return {
      text: body.text?.trim() ?? '',
      rate: parseRate(body.rate),
    }
  }

  const url = new URL(req.url, 'http://localhost')
  return {
    text: url.searchParams.get('text')?.trim() ?? '',
    rate: parseRate(url.searchParams.get('rate')),
  }
}

async function handleTtsRequest(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.statusCode = 405
    res.end('Method not allowed')
    return
  }

  try {
    const { synthesizeUrduSpeech } = await import('../api/_lib/synthesizeUrdu.js')
    const { text, rate } = await parseTtsInput(req)

    if (!text) {
      res.statusCode = 400
      res.end('Missing text')
      return
    }

    const audio = await synthesizeUrduSpeech(text, { rate })
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
