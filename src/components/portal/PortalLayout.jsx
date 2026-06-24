import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiHome, HiLogout, HiMenu, HiX } from 'react-icons/hi'
import { useLanguage } from '../../i18n/LanguageContext'
import BrandLogo from '../ui/BrandLogo'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import { VoiceHelpBanner } from '../voice/VoiceInput'
import SpeakAloud from '../voice/SpeakAloud'

export default function PortalLayout({
  variant = 'parent',
  portalLabel,
  userName,
  userMeta,
  navItems,
  activeId,
  onNavigate,
  onLogout,
  pageTitle,
  pageDescription,
  children,
}) {
  const { t } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [activeId])

  useEffect(() => {
    document.body.classList.toggle('portal-nav-open', sidebarOpen)
    return () => document.body.classList.remove('portal-nav-open')
  }, [sidebarOpen])

  return (
    <div className={`portal-shell portal-shell--${variant}`}>
      <button
        type="button"
        className={`portal-shell__backdrop ${sidebarOpen ? 'portal-shell__backdrop--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside className={`portal-sidebar ${sidebarOpen ? 'portal-sidebar--open' : ''}`} data-brand-surface="dark">
        <div className="portal-sidebar__brand">
          <Link to="/" className="portal-sidebar__logo" onClick={() => setSidebarOpen(false)}>
            <BrandLogo onDark />
          </Link>
          <span className="portal-sidebar__label">{portalLabel}</span>
        </div>

        <nav className="portal-sidebar__nav" aria-label="Portal navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activeId === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`portal-sidebar__link ${active ? 'portal-sidebar__link--active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="portal-sidebar__badge">{item.badge}</span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="portal-sidebar__user">
          <div className="portal-sidebar__user-info">
            <strong>{userName}</strong>
            {userMeta && <span>{userMeta}</span>}
          </div>
          <button type="button" className="portal-sidebar__logout" onClick={onLogout}>
            <HiLogout aria-hidden="true" />
            {t('common.signOut')}
          </button>
        </div>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <button
            type="button"
            className="portal-topbar__menu"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            {sidebarOpen ? <HiX /> : <HiMenu />}
          </button>

          <div className="portal-topbar__titles">
            <div className="portal-topbar__title-row">
              <h1>{pageTitle}</h1>
              <SpeakAloud
                text={[pageTitle, pageDescription].filter(Boolean).join('. ')}
                variant="on-light"
              />
            </div>
            {pageDescription && <p>{pageDescription}</p>}
          </div>

          <LanguageSwitcher variant="on-dark" />
          <Link to="/" className="portal-topbar__home">
            <HiHome aria-hidden="true" />
            <span>{t('common.mainSite')}</span>
          </Link>
        </header>

        <div className="portal-content">
          {variant === 'parent' && <VoiceHelpBanner />}
          {children}
        </div>
      </div>
    </div>
  )
}
