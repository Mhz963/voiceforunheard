import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa6'
import { useLanguage } from '../../i18n/LanguageContext'
import { useLocalizedContent } from '../../i18n/useLocalizedContent'
import BrandLogo from '../ui/BrandLogo'

export default function Footer() {
  const { t } = useLanguage()
  const { siteInfo } = useLocalizedContent()
  const year = new Date().getFullYear()

  return (
    <footer className="footer" data-brand-surface="dark">
      <div className="footer__grid">
        <div className="footer__brand">
          <div className="footer__logo">
            <BrandLogo className="footer__logo-img" onDark />
          </div>
          <p>{siteInfo.description}</p>
        </div>

        <div className="footer__col">
          <h4>{t('footer.explore')}</h4>
          <Link to="/statistics">{t('footer.globalStatistics')}</Link>
          <Link to="/why-therapy">{t('footer.whySpeechTherapy')}</Link>
          <Link to="/programs">{t('footer.allPrograms')}</Link>
          <Link to="/methodology">{t('footer.ourMethodology')}</Link>
        </div>

        <div className="footer__col">
          <h4>{t('footer.learn')}</h4>
          <Link to="/age-groups">{t('nav.ageGroups')}</Link>
          <Link to="/educator">{t('footer.meetEducator')}</Link>
          <Link to="/resources">{t('nav.resources')}</Link>
          <Link to="/faq">{t('nav.faq')}</Link>
        </div>

        <div className="footer__col">
          <h4>{t('footer.connect')}</h4>
          <Link to="/signin">{t('nav.signIn')}</Link>
          <Link to="/contact">{t('footer.contactUs')}</Link>
          <a href="https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss" target="_blank" rel="noopener noreferrer">
            {t('footer.whoData')}
          </a>
          <a href="https://www.asha.org" target="_blank" rel="noopener noreferrer">
            {t('footer.ashaResources')}
          </a>
        </div>
      </div>

      <div className="footer__bottom">
        <p>
          © {year} {siteInfo.name}. {t('footer.copyright')} <FaHeart className="footer__heart" />
        </p>
        <p className="footer__cite">{t('footer.cite')}</p>
      </div>
    </footer>
  )
}
