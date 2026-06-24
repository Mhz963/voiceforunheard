import { HiGlobe } from 'react-icons/hi'
import { useLanguage } from '../../i18n/LanguageContext'
import { languages } from '../../i18n/translations'
import './LanguageSwitcher.css'

export default function LanguageSwitcher({ className = '', variant = 'default' }) {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className={`lang-switch ${variant === 'on-dark' ? 'lang-switch--on-dark' : ''} ${className}`.trim()}>
      <HiGlobe className="lang-switch__icon" aria-hidden="true" />
      <label className="lang-switch__label visually-hidden" htmlFor="lang-select">
        {t('lang.label')}
      </label>
      <select
        id="lang-select"
        className="lang-switch__select"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        aria-label={t('lang.label')}
      >
        {Object.values(languages).map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  )
}
