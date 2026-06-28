import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { HiMenu, HiLogin, HiUserAdd, HiX } from 'react-icons/hi'
import { useLanguage } from '../../i18n/LanguageContext'
import BrandLogo from '../ui/BrandLogo'
import LanguageSwitcher from '../ui/LanguageSwitcher'

const navLinks = [
  { to: '/', labelKey: 'nav.home', end: true },
  { to: '/statistics', labelKey: 'nav.statistics' },
  { to: '/why-therapy', labelKey: 'nav.whyTherapy' },
  { to: '/programs', labelKey: 'nav.programs' },
  { to: '/age-groups', labelKey: 'nav.ageGroups' },
  { to: '/methodology', labelKey: 'nav.methodology' },
  { to: '/educator', labelKey: 'nav.educator' },
  { to: '/resources', labelKey: 'nav.resources' },
  { to: '/faq', labelKey: 'nav.faq' },
  { to: '/contact', labelKey: 'nav.contact' },
]

export default function Header() {
  const { t, locale } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    setMenuOpen(false)
  }, [locale])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen)
    return () => document.body.classList.remove('nav-open')
  }, [menuOpen])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''} ${menuOpen ? 'header--menu-open' : ''}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={() => setMenuOpen(false)}>
          <BrandLogo className="header__logo-img" />
        </Link>

        <div className="header__desktop-actions">
          <LanguageSwitcher />
          <div className="header__auth-actions">
            <Link to="/signin" className="header__cta header__cta--outline header__cta--bar" onClick={() => setMenuOpen(false)}>
              <span>{t('nav.signIn')}</span>
              <span className="header__cta-icon">
                <HiLogin aria-hidden="true" />
              </span>
            </Link>
            <Link to="/signup" className="header__cta header__cta--bar" onClick={() => setMenuOpen(false)}>
              <span>{t('nav.signUp')}</span>
              <span className="header__cta-icon">
                <HiUserAdd aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>

        <button
          type="button"
          className={`header__toggle ${menuOpen ? 'header__toggle--open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          {menuOpen ? <HiX aria-hidden="true" /> : <HiMenu aria-hidden="true" />}
        </button>

        <div
          className={`header__backdrop ${menuOpen ? 'header__backdrop--visible' : ''}`}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        <nav
          id="main-navigation"
          className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}
          aria-label={t('nav.mainNav')}
        >
          <div className="header__nav-scroll">
            <div className="header__nav-links">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `header__link ${isActive ? 'header__link--active' : ''}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </NavLink>
              ))}
            </div>
            <LanguageSwitcher />
          </div>
          <div className="header__drawer-auth">
            <Link to="/signin" className="header__cta header__cta--outline header__cta--drawer" onClick={() => setMenuOpen(false)}>
              <span>{t('nav.signIn')}</span>
              <span className="header__cta-icon">
                <HiLogin aria-hidden="true" />
              </span>
            </Link>
            <Link to="/signup" className="header__cta header__cta--drawer" onClick={() => setMenuOpen(false)}>
              <span>{t('nav.signUp')}</span>
              <span className="header__cta-icon">
                <HiUserAdd aria-hidden="true" />
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
