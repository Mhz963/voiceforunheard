import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { HiMenu, HiX, HiLogin } from 'react-icons/hi'
import { siteInfo } from '../../data/content'
const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/statistics', label: 'Statistics' },
  { to: '/why-therapy', label: 'Why Therapy' },
  { to: '/programs', label: 'Programs' },
  { to: '/age-groups', label: 'Age Groups' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/educator', label: 'Educator' },
  { to: '/resources', label: 'Resources' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

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
          <img
            src="/vfu.png"
            alt={siteInfo.name}
            className="header__logo-img"
          />
        </Link>

        <div
          className={`header__backdrop ${menuOpen ? 'header__backdrop--visible' : ''}`}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        <nav
          id="main-navigation"
          className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}
          aria-label="Main navigation"
        >
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
                {link.label}
              </NavLink>
            ))}
          </div>
          <Link to="/signin" className="header__cta header__cta--drawer" onClick={() => setMenuOpen(false)}>
            <span>Sign In</span>
            <span className="header__cta-icon">
              <HiLogin aria-hidden="true" />
            </span>
          </Link>
        </nav>

        <div className="header__actions">
          <Link to="/signin" className="header__cta header__cta--bar" onClick={() => setMenuOpen(false)}>
            <span>Sign In</span>
            <span className="header__cta-icon">
              <HiLogin aria-hidden="true" />
            </span>
          </Link>

          <button
            type="button"
            className={`header__toggle ${menuOpen ? 'header__toggle--open' : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            {menuOpen ? <HiX aria-hidden="true" /> : <HiMenu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  )
}
