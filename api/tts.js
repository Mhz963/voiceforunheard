import { synthesizeUrduSpeech } from './_lib/synthesizeUrdu.js'

function parseRate(value) {
  const rate = Number(value)
  return Number.isFinite(rate) ? rate : 0.92
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).end('Method not allowed')
    return
  }

  try {
    let text = ''
    let rate = 0.92

    if (req.method === 'POST') {
      const body = req.body ?? {}
      text = (typeof body.text === 'string' ? body.text : '').trim()
      rate = parseRate(body.rate)
    } else {
      text = (typeof req.query.text === 'string' ? req.query.text : '').trim()
      rate = parseRate(req.query.rate)
    }

    if (!text) {
      res.status(400).end('Missing text')
      return
    }

    const audio = await synthesizeUrduSpeech(text, { rate })

    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=604800')
    res.status(200).send(audio)
  } catch (error) {
    console.error('Urdu TTS error:', error)
    res.status(500).end('TTS failed')
  }
}
