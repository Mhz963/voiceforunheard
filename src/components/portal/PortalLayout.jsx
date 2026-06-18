import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiHome, HiLogout, HiMenu, HiX } from 'react-icons/hi'
import BrandLogo from '../ui/BrandLogo'
import { VoiceHelpBanner } from '../voice/VoiceInput'

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
            Sign out
          </button>
        </div>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <button
            type="button"
            className="portal-topbar__menu"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {sidebarOpen ? <HiX /> : <HiMenu />}
          </button>

          <div className="portal-topbar__titles">
            <h1>{pageTitle}</h1>
            {pageDescription && <p>{pageDescription}</p>}
          </div>

          <Link to="/" className="portal-topbar__home">
            <HiHome aria-hidden="true" />
            <span>Main site</span>
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
