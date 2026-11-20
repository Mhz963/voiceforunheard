import { useCallback, useEffect, useState } from 'react'
import { HiVolumeUp } from 'react-icons/hi'
import { useLanguage } from '../../i18n/LanguageContext'
import {
  isSpeakSupported,
  registerSpeechUIListener,
  speakText,
  speechLangForLocale,
  stopSpeech,
} from '../../hooks/useSpeechRecognition'

let collectQueue = []
let collectTimer = null
function collectSpeechText(locale, text) {
  try {
    if (localStorage.getItem('vfu_collect_speech') !== '1') return
  } catch {
    return
  }
  collectQueue.push({ lang: locale === 'ur' ? 'ur' : 'en', text })
  clearTimeout(collectTimer)
  collectTimer = setTimeout(() => {
    const texts = collectQueue
    collectQueue = []
    fetch('/__speech-texts', { method: 'POST', body: JSON.stringify({ texts }) }).catch(() => {})
  }, 300)
}

function textFromNode(node) {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textFromNode).filter(Boolean).join(' ')
  if (typeof node === 'object' && node.props?.children != null) {
    return textFromNode(node.props.children)
  }
  return ''
}

function speakPartToText(part) {
  if (part == null) return ''
  if (typeof part === 'string' || typeof part === 'number') return String(part).trim()
  return textFromNode(part).trim()
}

function joinSpeakParts(...parts) {
  return parts
    .flatMap((part) => (Array.isArray(part) ? part : [part]))
    .map(speakPartToText)
    .filter(Boolean)
    .join('. ')
}

export default function SpeakAloud({
  text,
  variant = 'default',
  size = 'sm',
  className = '',
  stopPropagation = true,
}) {
  const { t, locale } = useLanguage()
  const [active, setActive] = useState(false)

  const speakContent = joinSpeakParts(text)

  const deactivate = useCallback(() => {
    setActive(false)
  }, [])

  useEffect(() => registerSpeechUIListener(deactivate), [deactivate])

  // Development only: with localStorage.vfu_collect_speech = '1', report every
  // read-aloud text so scripts/generate_voice_clips.py can record it.
  useEffect(() => {
    if (import.meta.env.DEV && speakContent) collectSpeechText(locale, speakContent)
  }, [locale, speakContent])

  if (!speakContent || !isSpeakSupported(locale)) return null

  const handleClick = (event) => {
    if (stopPropagation) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (active) {
      stopSpeech()
      return
    }

    speakText(speakContent, {
      lang: speechLangForLocale(locale),
      rate: locale === 'ur' ? 0.88 : 0.92,
      onEnd: deactivate,
      onError: deactivate,
    })
      .catch(deactivate)
    setActive(true)
  }

  return (
    <button
      type="button"
      className={`speak-aloud speak-aloud--${size} speak-aloud--${variant} ${active ? 'speak-aloud--active' : ''} ${className}`.trim()}
      onClick={handleClick}
      aria-label={active ? t('voice.stopReading') : t('voice.readAloud')}
      aria-pressed={active}
      title={active ? t('voice.stopReading') : t('voice.readAloud')}
    >
      <HiVolumeUp aria-hidden="true" />
    </button>
  )
}

export function SpeakHeading({
  as: Tag = 'h3',
  className = '',
  headingClassName = '',
  children,
  body,
  extra,
  speak,
  variant = 'default',
  align = 'start',
  id,
}) {
  const speakContent = speak ?? joinSpeakParts(children, body, extra)

  return (
    <div className={`speak-heading speak-heading--${align} ${className}`.trim()}>
      <Tag id={id} className={`speak-heading__text ${headingClassName}`.trim()}>{children}</Tag>
      <SpeakAloud text={speakContent} variant={variant} />
    </div>
  )
}
