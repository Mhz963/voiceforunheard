import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useLanguage } from '../../i18n/LanguageContext'

export default function Layout() {
  const { t } = useLanguage()
  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">
        {t('nav.skipToContent')}
      </a>
      <Header />
      <main id="main-content" className="layout__main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
