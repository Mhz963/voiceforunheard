import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { SITE_URL } from '../config/site'
import { fullTitle, metaForPath, SITE_NAME } from '../seo/routes'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

// Keeps <title>, description, Open Graph and canonical tags in sync with the
// current route and language. The build also writes these into each page's
// static HTML so link previews work without JavaScript.
export default function PageMeta() {
  const { pathname } = useLocation()
  const { locale, t } = useLanguage()
  const { programCategories } = useLocalizedContent()

  useEffect(() => {
    const meta = metaForPath(pathname, locale, programCategories)
    const title = meta ? fullTitle(meta.title, locale) : `${t('notFound.title')} | ${SITE_NAME}`
    const description = meta?.description ?? t('notFound.text')
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:locale', locale === 'ur' ? 'ur_PK' : 'en_GB')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setCanonical(url)
  }, [pathname, locale, programCategories, t])

  return null
}
