import en from './en'
import ur from './ur'
import enExtra from './extra.en'
import urExtra from './extra.ur'
import { toWesternDigits } from '../../utils/localeFormat'
import { localizeLatinTermsForUrdu } from '../../utils/urduLatinTerms'

function finalizeUrduText(text) {
  return localizeLatinTermsForUrdu(toWesternDigits(text))
}

export const languages = {
  en: { code: 'en', label: 'English', nativeLabel: 'English', lang: 'en', dir: 'ltr' },
  ur: { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', lang: 'ur', dir: 'rtl' },
}

function deepMerge(base, extra) {
  const out = { ...base }
  for (const [key, value] of Object.entries(extra)) {
    const current = out[key]
    out[key] =
      value && typeof value === 'object' && !Array.isArray(value) && current && typeof current === 'object' && !Array.isArray(current)
        ? deepMerge(current, value)
        : value
  }
  return out
}

const catalogs = { en: deepMerge(en, enExtra), ur: deepMerge(ur, urExtra) }

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
