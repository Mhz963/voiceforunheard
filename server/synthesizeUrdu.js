import { EdgeTTS } from 'edge-tts-universal'
import { MAX_URDU_CHUNK_LENGTH, splitUrduText } from '../shared/splitUrduText.js'

export const URDU_VOICE = 'ur-PK-UzmaNeural'
export const MAX_CHUNK_LENGTH = MAX_URDU_CHUNK_LENGTH

export { splitUrduText }

function rateToEdgePercent(rate = 0.92) {
  const percent = Math.round((rate - 1) * 100)
  const clamped = Math.max(-40, Math.min(40, percent))
  return `${clamped >= 0 ? '+' : ''}${clamped}%`
}

export async function synthesizeUrduSpeech(text, { rate = 0.92 } = {}) {
  const trimmed = text.trim()
  if (!trimmed) {
    throw new Error('Empty text')
  }
  if (trimmed.length > MAX_CHUNK_LENGTH) {
    throw new Error('Text too long')
  }

  const tts = new EdgeTTS(trimmed, URDU_VOICE, {
    rate: rateToEdgePercent(rate),
  })
  const result = await tts.synthesize()
  return Buffer.from(await result.audio.arrayBuffer())
}
