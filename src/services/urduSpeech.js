import { splitUrduText } from '../../shared/splitUrduText.js'

let activeAudio = null
let activeObjectUrl = null
let speechGeneration = 0

function revokeObjectUrl() {
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl)
    activeObjectUrl = null
  }
}

export function stopUrduSpeech() {
  speechGeneration += 1
  if (activeAudio) {
    activeAudio.pause()
    activeAudio.onended = null
    activeAudio.onerror = null
    activeAudio.src = ''
    activeAudio = null
  }
  revokeObjectUrl()
}

// Give up after 8s so a slow or blocked voice service never leaves the
// button "playing" in silence; the caller then falls back.
async function fetchUrduAudio(chunk, rate) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: chunk, rate }),
      signal: controller.signal,
    })
    const type = response.headers.get('Content-Type') || ''
    if (!response.ok || !type.startsWith('audio/')) throw new Error('Urdu TTS request failed')
    return response.blob()
  } finally {
    clearTimeout(timer)
  }
}

export function speakUrdu(text, { rate = 0.92, onEnd, onError } = {}) {
  stopUrduSpeech()
  const generation = speechGeneration

  const isCurrent = () => generation === speechGeneration

  const chunks = splitUrduText(text)
  let index = 0
  const audio = new Audio()
  activeAudio = audio
  audio.playbackRate = Math.min(Math.max(rate, 0.75), 1.25)

  const fail = () => {
    if (!isCurrent()) return
    stopUrduSpeech()
    onError?.()
  }

  const finish = () => {
    if (!isCurrent()) return
    if (activeAudio === audio) {
      activeAudio = null
    }
    revokeObjectUrl()
    onEnd?.()
  }

  const playNext = async () => {
    if (!isCurrent()) return

    if (index >= chunks.length) {
      finish()
      return
    }

    const chunk = chunks[index]
    index += 1

    try {
      const blob = await fetchUrduAudio(chunk, rate)
      if (!isCurrent()) return

      revokeObjectUrl()
      activeObjectUrl = URL.createObjectURL(blob)
      audio.src = activeObjectUrl

      audio.onended = () => playNext()
      audio.onerror = fail

      await audio.play()
    } catch {
      fail()
    }
  }

  return playNext()
}

export function isUrduSpeechAvailable() {
  return typeof fetch !== 'undefined'
}
