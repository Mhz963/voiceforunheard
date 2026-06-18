import { HiMicrophone, HiStop, HiVolumeUp } from 'react-icons/hi'
import useSpeechRecognition, { isSpeechSynthesisSupported, speakText } from '../../hooks/useSpeechRecognition'

export function VoiceMicButton({ onTranscript, className = '', size = 'md' }) {
  const { supported, listening, interim, error, toggle, stop } = useSpeechRecognition()

  if (!supported) return null

  function handleClick() {
    toggle((text) => onTranscript(text))
  }

  return (
    <span className={`voice-mic-wrap ${className}`.trim()}>
      <button
        type="button"
        className={`voice-mic voice-mic--${size} ${listening ? 'voice-mic--active' : ''}`}
        onClick={handleClick}
        aria-pressed={listening}
        aria-label={listening ? 'Stop voice input' : 'Speak instead of typing'}
        title={listening ? 'Stop listening' : 'Tap to speak'}
      >
        {listening ? <HiStop aria-hidden="true" /> : <HiMicrophone aria-hidden="true" />}
        <span className="voice-mic__text">{listening ? 'Listening…' : 'Speak'}</span>
      </button>
      {listening && interim && (
        <span className="voice-mic__interim" aria-live="polite">
          {interim}
        </span>
      )}
      {listening && (
        <button type="button" className="voice-mic__done" onClick={stop}>
          Done
        </button>
      )}
      {error && <span className="voice-mic__error" role="alert">{error}</span>}
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

export function SpeakButton({ text, label = 'Listen' }) {
  if (!text?.trim()) return null

  return (
    <button
      type="button"
      className="voice-speak"
      onClick={() => {
        if (isSpeechSynthesisSupported()) speakText(text)
      }}
      aria-label={`Read aloud: ${text.slice(0, 60)}`}
    >
      <HiVolumeUp aria-hidden="true" />
      {label}
    </button>
  )
}

export function VoiceHelpBanner() {
  return (
    <div className="voice-help-banner" role="note">
      <HiMicrophone aria-hidden="true" />
      <div>
        <strong>Can&apos;t type?</strong>
        <span>Tap <em>Speak</em> next to any field and say your message out loud. We&apos;ll fill it in for you.</span>
      </div>
    </div>
  )
}
