import { useRef, useState } from 'react'
import { HiPlay } from 'react-icons/hi'
import { useLanguage } from '../i18n/LanguageContext'

const VIDEOS = {
  en: { src: '/videos/voiceforunheard-en.mp4', duration: '1:06' },
  ur: { src: '/videos/voiceforunheard-ur.mp4', duration: '1:17' },
}

// Introduction video in English and Urdu. Nothing is downloaded until the
// visitor presses play (preload="none"), which matters on mobile data.
export default function IntroVideo({ className = '' }) {
  const { t, locale } = useLanguage()
  // Follows the site language until the visitor picks a version themselves.
  const [chosen, setChosen] = useState(null)
  const lang = chosen ?? (locale === 'ur' ? 'ur' : 'en')
  const [started, setStarted] = useState(false)
  const videoRef = useRef(null)
  const video = VIDEOS[lang]

  function choose(next) {
    if (next === lang) return
    setChosen(next)
    setStarted(false)
  }

  function play() {
    setStarted(true)
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}))
  }

  return (
    <figure className={`intro-video ${className}`.trim()}>
      <div className="intro-video__bar">
        <figcaption className="intro-video__title">{t('video.title')}</figcaption>
        <div className="intro-video__langs" role="group" aria-label={t('video.chooseLanguage')}>
          {['en', 'ur'].map((code) => (
            <button
              key={code}
              type="button"
              lang={code}
              className={`intro-video__lang ${lang === code ? 'is-active' : ''}`}
              aria-pressed={lang === code}
              onClick={() => choose(code)}
            >
              {code === 'en' ? 'English' : 'اردو'}
            </button>
          ))}
        </div>
      </div>

      <div className="intro-video__frame">
        <video
          key={video.src}
          ref={videoRef}
          className="intro-video__media"
          src={video.src}
          poster="/videos/poster.jpg"
          preload="none"
          playsInline
          controls={started}
          lang={lang}
          aria-label={t(lang === 'ur' ? 'video.ariaUrdu' : 'video.ariaEnglish')}
          width="1920"
          height="1080"
        />
        {!started && (
          <button type="button" className="intro-video__play" onClick={play}>
            <span className="intro-video__play-icon" aria-hidden="true">
              <HiPlay />
            </span>
            <span className="intro-video__play-text">
              {t('video.play')}
              <small>
                {lang === 'ur' ? 'اردو' : 'English'} · {video.duration}
              </small>
            </span>
          </button>
        )}
      </div>
    </figure>
  )
}
