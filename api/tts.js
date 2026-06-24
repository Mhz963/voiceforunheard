import { synthesizeUrduSpeech } from '../server/synthesizeUrdu.js'

function parseRate(value) {
  const rate = Number(value)
  return Number.isFinite(rate) ? rate : 0.92
}

async function readJsonBody(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

export default async function handler(request) {
  if (request.method !== 'GET' && request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    let text = ''
    let rate = 0.92

    if (request.method === 'POST') {
      const body = await readJsonBody(request)
      text = body?.text?.trim() ?? ''
      rate = parseRate(body?.rate)
    } else {
      const url = new URL(request.url)
      text = url.searchParams.get('text')?.trim() ?? ''
      rate = parseRate(url.searchParams.get('rate'))
    }

    if (!text) {
      return new Response('Missing text', { status: 400 })
    }

    const audio = await synthesizeUrduSpeech(text, { rate })

    return new Response(audio, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=604800',
      },
    })
  } catch (error) {
    console.error('Urdu TTS error:', error)
    return new Response('TTS failed', { status: 500 })
  }
}
