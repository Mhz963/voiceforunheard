import { useCallback, useEffect, useRef, useState } from 'react'
import { isUrduSpeechAvailable, speakUrdu, stopUrduSpeech } from '../services/urduSpeech.js'

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export function isSpeechRecognitionSupported() {
  return !!getSpeechRecognition()
}

export function appendSpeechText(current, text) {
  const next = text.trim()
  if (!next) return current
  if (!current?.trim()) return next
  return `${current.trimEnd()} ${next}`
}

export function speechLangForLocale(locale) {
  return locale === 'ur' ? 'ur-PK' : 'en-US'
}

let voicesWarmPromise = null

function getSpeechVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  return window.speechSynthesis.getVoices()
}

/** Browsers often return an empty voice list until voiceschanged fires. */
export function preloadSpeechVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve([])
  }

  const existing = getSpeechVoices()
  if (existing.length > 0) return Promise.resolve(existing)

  if (voicesWarmPromise) return voicesWarmPromise

  voicesWarmPromise = new Promise((resolve) => {
    const synth = window.speechSynthesis
    let settled = false

    const finish = () => {
      if (settled) return
      const voices = getSpeechVoices()
      if (voices.length > 0) {
        settled = true
        synth.removeEventListener('voiceschanged', finish)
        resolve(voices)
      }
    }

    synth.addEventListener('voiceschanged', finish)
    finish()

    window.setTimeout(finish, 120)
    window.setTimeout(finish, 400)
    window.setTimeout(() => {
      if (!settled) {
        settled = true
        synth.removeEventListener('voiceschanged', finish)
        resolve(getSpeechVoices())
      }
    }, 1500)
  }).finally(() => {
    voicesWarmPromise = null
  })

  return voicesWarmPromise
}

function rankSpeechVoice(voice, preferredLang) {
  const lang = preferredLang.toLowerCase()
  const prefix = lang.split('-')[0]
  const voiceLang = voice.lang.toLowerCase()

  if (voiceLang === lang) return 1000
  if (voiceLang.startsWith(`${prefix}-`)) return 900
  if (voiceLang.startsWith(prefix)) return 700
  if (prefix === 'en' && voiceLang.startsWith('en')) return 600
  return voice.default ? 100 : 0
}

export function pickSpeechVoice(preferredLang) {
  const voices = getSpeechVoices()
  if (!voices.length) return null

  let best = null
  let bestRank = -1

  for (const voice of voices) {
    const score = rankSpeechVoice(voice, preferredLang)
    if (score > bestRank) {
      bestRank = score
      best = voice
    }
  }

  if (bestRank > 0) return best
  return voices.find((voice) => voice.default) ?? voices[0]
}

function speakWithSynthesis(trimmed, { lang, rate, onEnd, onError }) {
  const utterance = new SpeechSynthesisUtterance(trimmed)
  const voice = pickSpeechVoice(lang)

  utterance.lang = lang
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  }

  utterance.rate = rate

  let settled = false
  const finish = (handler) => {
    if (settled) return
    settled = true
    handler?.()
  }

  utterance.onend = () => finish(onEnd)
  utterance.onerror = () => finish(onError)

  window.speechSynthesis.speak(utterance)
  return utterance
}

export function speakText(text, { lang = 'en-US', rate = 0.95, onEnd, onError } = {}) {
  if (!text?.trim()) return Promise.resolve(null)

  const trimmed = text.trim()
  const isUrdu = lang.toLowerCase().startsWith('ur')

  if (isUrdu) {
    stopSpeech()
    return Promise.resolve(speakUrdu(trimmed, { rate, onEnd, onError }))
  }

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve(null)
  }

  return preloadSpeechVoices().then(() => {
    window.speechSynthesis.cancel()
    stopUrduSpeech()

    const start = () => speakWithSynthesis(trimmed, { lang, rate, onEnd, onError })

    if (typeof requestAnimationFrame === 'function') {
      return new Promise((resolve) => {
        requestAnimationFrame(() => resolve(start()))
      })
    }

    return start()
  })
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
  stopUrduSpeech()
}

export default function useSpeechRecognition({ lang = 'en-US', continuous = true } = {}) {
  const recognitionRef = useRef(null)
  const onResultRef = useRef(null)
  const [supported] = useState(() => isSpeechRecognitionSupported())
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const SpeechRecognitionCtor = getSpeechRecognition()
    if (!SpeechRecognitionCtor) return undefined

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = lang
    recognition.continuous = continuous
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      let interimText = ''
      let finalText = ''

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) finalText += transcript
        else interimText += transcript
      }

      setInterim(interimText)
      if (finalText.trim() && onResultRef.current) {
        onResultRef.current(finalText.trim())
      }
    }

    recognition.onerror = (event) => {
      if (event.error === 'aborted') return
      setError(event.error === 'not-allowed' ? 'micDenied' : 'voiceFailed')
      setListening(false)
      setInterim('')
    }

    recognition.onend = () => {
      setListening(false)
      setInterim('')
    }

    recognitionRef.current = recognition

    return () => {
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      try {
        recognition.stop()
      } catch {
        /* ignore */
      }
    }
  }, [lang, continuous])

  const stop = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) return
    try {
      recognition.stop()
    } catch {
      /* ignore */
    }
    setListening(false)
    setInterim('')
  }, [])

  const start = useCallback((onResult) => {
    const recognition = recognitionRef.current
    if (!recognition) {
      setError('notSupported')
      return
    }

    onResultRef.current = onResult
    setError(null)
    setInterim('')

    try {
      recognition.start()
      setListening(true)
    } catch {
      try {
        recognition.stop()
        recognition.start()
        setListening(true)
      } catch {
        setError('couldNotStart')
        setListening(false)
      }
    }
  }, [])

  const toggle = useCallback(
    (onResult) => {
      if (listening) stop()
      else start(onResult)
    },
    [listening, start, stop],
  )

  return {
    supported,
    listening,
    interim,
    error,
    start,
    stop,
    toggle,
  }
}

export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function isSpeakSupported(locale) {
  if (locale === 'ur') return isUrduSpeechAvailable()
  return isSpeechSynthesisSupported()
}
