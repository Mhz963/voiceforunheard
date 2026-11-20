import { Communicate, EdgeTTS } from 'edge-tts-universal'
import { MAX_URDU_CHUNK_LENGTH, splitUrduText } from './splitUrduText.js'

export const URDU_VOICE = 'ur-IN-GulNeural'
export const MAX_CHUNK_LENGTH = MAX_URDU_CHUNK_LENGTH

export { splitUrduText }

function rateToEdgePercent(rate = 0.92) {
  const percent = Math.round((rate - 1) * 100)
  const clamped = Math.max(-40, Math.min(40, percent))
  return `${clamped >= 0 ? '+' : ''}${clamped}%`
}

async function synthesizeWithStream(text, rate) {
  const communicate = new Communicate(text, {
    voice: URDU_VOICE,
    rate: rateToEdgePercent(rate),
  })

  const buffers = []
  for await (const chunk of communicate.stream()) {
    if (chunk.type === 'audio' && chunk.data) {
      buffers.push(chunk.data)
    }
  }

  if (!buffers.length) {
    throw new Error('No audio received')
  }

  return Buffer.concat(buffers)
}

async function synthesizeWithSimpleApi(text, rate) {
  const tts = new EdgeTTS(text, URDU_VOICE, {
    rate: rateToEdgePercent(rate),
  })
  const result = await tts.synthesize()
  return Buffer.from(await result.audio.arrayBuffer())
}

export async function synthesizeUrduSpeech(text, { rate = 0.92 } = {}) {
  const trimmed = text.trim()
  if (!trimmed) {
    throw new Error('Empty text')
  }
  if (trimmed.length > MAX_CHUNK_LENGTH) {
    throw new Error('Text too long')
  }

  try {
    return await synthesizeWithStream(trimmed, rate)
  } catch (streamError) {
    console.warn('Urdu TTS stream failed, retrying simple API:', streamError.message)
    return synthesizeWithSimpleApi(trimmed, rate)
  }
}
