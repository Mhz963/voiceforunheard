import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'
import { useLanguage } from '../i18n/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  return (
    <div className="page not-found-page">
      <section className="section not-found">
        <div className="container not-found__inner">
          <span className="not-found__code" aria-hidden="true">{t('notFound.badge')}</span>
          <h1>{t('notFound.title')}</h1>
          <p>{t('notFound.text')}</p>
          <div className="not-found__actions">
            <Link to="/" className="btn btn--primary">
              {t('notFound.home')} <HiArrowRight aria-hidden="true" />
            </Link>
            <Link to="/programs" className="btn btn--outline">
              {t('notFound.programs')}
            </Link>
            <Link to="/contact" className="btn btn--outline">
              {t('notFound.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
