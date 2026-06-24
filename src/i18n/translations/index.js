import en from './en'
import ur from './ur'
import { toWesternDigits } from '../../utils/localeFormat'
import { localizeLatinTermsForUrdu } from '../../utils/urduLatinTerms'

function finalizeUrduText(text) {
  return localizeLatinTermsForUrdu(toWesternDigits(text))
}

export const languages = {
  en: { code: 'en', label: 'English', nativeLabel: 'English', lang: 'en', dir: 'ltr' },
  ur: { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', lang: 'ur', dir: 'rtl' },
}

const catalogs = { en, ur }

function getByPath(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

function interpolate(text, vars) {
  if (!vars || typeof text !== 'string') return text
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '')
}

export function getTranslation(locale, key, vars) {
  const value = getByPath(catalogs[locale], key) ?? getByPath(catalogs.en, key)
  if (value === undefined) return key
  if (typeof value === 'string') {
    const text = interpolate(value, vars)
    return locale === 'ur' ? finalizeUrduText(text) : text
  }
  return value
}

export function getCatalog(locale) {
  return catalogs[locale] ?? catalogs.en
}
