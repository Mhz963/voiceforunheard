import { HiMicrophone, HiStop, HiVolumeUp } from 'react-icons/hi'
import { useLanguage } from '../../i18n/LanguageContext'
import useSpeechRecognition, { isSpeakSupported, speakText } from '../../hooks/useSpeechRecognition'

function speechLang(locale) {
  return locale === 'ur' ? 'ur-PK' : 'en-US'
}

export function VoiceMicButton({ onTranscript, className = '', size = 'md' }) {
  const { t, locale } = useLanguage()
  const { supported, listening, interim, error, toggle, stop } = useSpeechRecognition({
    lang: speechLang(locale),
  })

  if (!supported) return null

  function handleClick() {
    toggle((text) => onTranscript(text))
  }

  const errorMessage = error ? t(`voice.${error}`) : null

  return (
    <span className={`voice-mic-wrap ${className}`.trim()}>
      <button
        type="button"
        className={`voice-mic voice-mic--${size} ${listening ? 'voice-mic--active' : ''}`}
        onClick={handleClick}
        aria-pressed={listening}
        aria-label={listening ? t('voice.stopListening') : t('voice.speakInstead')}
        title={listening ? t('voice.stopListen') : t('voice.tapSpeakShort')}
      >
        {listening ? <HiStop aria-hidden="true" /> : <HiMicrophone aria-hidden="true" />}
        <span className="voice-mic__text">{listening ? t('common.listening') : t('voice.speakLabel')}</span>
      </button>
      {listening && interim && (
        <span className="voice-mic__interim" aria-live="polite">
          {interim}
        </span>
      )}
      {listening && (
        <button type="button" className="voice-mic__done" onClick={stop}>
          {t('common.done')}
        </button>
      )}
      {errorMessage && <span className="voice-mic__error" role="alert">{errorMessage}</span>}
    </span>
  )
}

export function VoiceLabel({ children, onTranscript }) {
  return (
    <span className="voice-label">
      <span className="voice-label__text">{children}</span>
      <VoiceMicButton onTranscript={onTranscript} size="sm" />
    </span>
  )
}

export function SpeakButton({ text, label }) {
  const { t, locale } = useLanguage()
  const displayLabel = label ?? t('common.listen')

  if (!text?.trim()) return null

  return (
    <button
      type="button"
      className="voice-speak"
      onClick={() => {
        if (isSpeakSupported(locale)) {
          speakText(text, { lang: speechLang(locale), rate: locale === 'ur' ? 0.88 : 0.95 }).catch(() => {})
        }
      }}
      aria-label={`Read aloud: ${text.slice(0, 60)}`}
    >
      <HiVolumeUp aria-hidden="true" />
      {displayLabel}
    </button>
  )
}

export function VoiceHelpBanner() {
  const { t } = useLanguage()

  return (
    <div className="voice-help-banner" role="note">
      <HiMicrophone aria-hidden="true" />
      <div>
        <strong>{t('voice.cantType')}</strong>
        <span>{t('voice.tapSpeak')}</span>
      </div>
    </div>
  )
}
