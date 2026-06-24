import { splitUrduText } from '../../shared/splitUrduText.js'

let activeAudio = null
let activeObjectUrl = null
let aborted = false

function revokeObjectUrl() {
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl)
    activeObjectUrl = null
  }
}

export function stopUrduSpeech() {
  aborted = true
  if (activeAudio) {
    activeAudio.pause()
    activeAudio.onended = null
    activeAudio.onerror = null
    activeAudio.src = ''
    activeAudio = null
  }
  revokeObjectUrl()
}

async function fetchUrduAudio(chunk, rate) {
  const params = new URLSearchParams({ text: chunk, rate: String(rate) })
  const response = await fetch(`/api/tts?${params.toString()}`)
  if (!response.ok) throw new Error('Urdu TTS request failed')
  return response.blob()
}

export function speakUrdu(text, { rate = 0.92, onEnd, onError } = {}) {
  stopUrduSpeech()
  aborted = false

  const chunks = splitUrduText(text)
  let index = 0
  const audio = new Audio()
  activeAudio = audio
  audio.playbackRate = Math.min(Math.max(rate, 0.75), 1.25)

  const fail = () => {
    stopUrduSpeech()
    onError?.()
  }

  const finish = () => {
    stopUrduSpeech()
    onEnd?.()
  }

  const playNext = async () => {
    if (aborted) return

    if (index >= chunks.length) {
      finish()
      return
    }

    const chunk = chunks[index]
    index += 1

    try {
      const blob = await fetchUrduAudio(chunk, rate)
      if (aborted) return

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
