import { synthesizeUrduSpeech } from '../server/synthesizeUrdu.js'

export default async function handler(request) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const url = new URL(request.url)
    const text = url.searchParams.get('text')?.trim()
    const rate = Number(url.searchParams.get('rate') || '0.92')

    if (!text) {
      return new Response('Missing text', { status: 400 })
    }

    const audio = await synthesizeUrduSpeech(text, { rate: Number.isFinite(rate) ? rate : 0.92 })

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
