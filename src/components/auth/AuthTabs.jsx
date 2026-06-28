import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'

export default function AuthTabs() {
  const { t } = useLanguage()

  return (
    <div className="auth-tabs" role="tablist" aria-label={t('auth.tabsLabel')}>
      <NavLink
        to="/signin"
        className={({ isActive }) => `auth-tabs__tab ${isActive ? 'auth-tabs__tab--active' : ''}`}
        role="tab"
      >
        {t('nav.signIn')}
      </NavLink>
      <NavLink
        to="/signup"
        className={({ isActive }) => `auth-tabs__tab ${isActive ? 'auth-tabs__tab--active' : ''}`}
        role="tab"
      >
        {t('nav.signUp')}
      </NavLink>
    </div>
  )
}
