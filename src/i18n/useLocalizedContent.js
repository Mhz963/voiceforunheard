import { useMemo } from 'react'
import { useLanguage } from './LanguageContext'
import * as enContent from '../data/content'
import * as urContent from './translations/urContent'
import { deepWesternDigits } from '../utils/localeFormat'
import { deepLocalizeLatinTermsForUrdu } from '../utils/urduLatinTerms'

function pickContent(mod) {
  return Object.fromEntries(Object.entries(mod).map(([key, value]) => [key, value]))
}

function prepareUrduContent(mod) {
  return deepLocalizeLatinTermsForUrdu(deepWesternDigits(pickContent(mod)))
}

export function useLocalizedContent() {
  const { locale } = useLanguage()
  return useMemo(() => {
    if (locale === 'ur') return prepareUrduContent(urContent)
    return enContent
  }, [locale])
}
