import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getTranslation, languages } from './translations'
import { preloadSpeechVoices } from '../hooks/useSpeechRecognition'

const STORAGE_KEY = 'vfu_locale'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved === 'ur' ? 'ur' : 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    const meta = languages[locale]
    document.documentElement.lang = meta.lang
    document.documentElement.dir = meta.dir
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* ignore */
    }
    preloadSpeechVoices()
  }, [locale])

  useEffect(() => {
    preloadSpeechVoices()
  }, [])

  const setLocale = (next) => {
    setLocaleState(next === 'ur' ? 'ur' : 'en')
  }

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      isRtl: locale === 'ur',
      t: (key, vars) => getTranslation(locale, key, vars),
    }),
    [locale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
