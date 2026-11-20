import clips from '../data/voiceClips.json'

// Pre-recorded read-aloud audio, generated with the same Microsoft neural
// voices as the intro videos (English: en-GB-SoniaNeural, Urdu:
// ur-IN-GulNeural) by scripts/generate_voice_clips.py. Each clip is stored at
// /tts/<lang>/<key>.mp3, where <key> is derived from the exact spoken text.
//
// IMPORTANT: normalizeSpeechText and clipKey must stay identical to
// scripts/generate_voice_clips.py, or recordings will not be found.

const available = {
  en: new Set(clips.en ?? []),
  ur: new Set(clips.ur ?? []),
}

export function normalizeSpeechText(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim()
}

// FNV-1a (32-bit) over the UTF-8 bytes, plus the byte length.
export function clipKey(lang, text) {
  const bytes = new TextEncoder().encode(`${lang}|${normalizeSpeechText(text)}`)
  let hash = 0x811c9dc5
  for (const byte of bytes) {
    hash ^= byte
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return `${hash.toString(16).padStart(8, '0')}${bytes.length.toString(16)}`
}

export function clipUrl(lang, text) {
  const key = clipKey(lang, text)
  return available[lang]?.has(key) ? `/tts/${lang}/${key}.mp3` : null
}
