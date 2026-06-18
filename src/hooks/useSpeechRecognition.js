import { useCallback, useEffect, useRef, useState } from 'react'

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
      setError(event.error === 'not-allowed' ? 'Microphone access was denied.' : 'Voice input failed. Please try again.')
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
      setError('Voice input is not supported in this browser.')
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
        setError('Could not start voice input. Please try again.')
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

export function speakText(text, { lang = 'en-US', rate = 0.95 } = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text?.trim()) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text.trim())
  utterance.lang = lang
  utterance.rate = rate
  window.speechSynthesis.speak(utterance)
}

export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}
