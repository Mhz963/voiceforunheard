import { Link } from 'react-router-dom'
import { HiArrowRight, HiExternalLink } from 'react-icons/hi'
import { FaAward, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaMicroscope } from 'react-icons/fa'
import SectionHeader from '../components/ui/SectionHeader'
import IconBadge from '../components/ui/IconBadge'
import Reveal from '../components/ui/Reveal'
import { getPhilosophyIcon } from '../utils/icons'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { SpeakHeading } from '../components/voice/SpeakAloud'
import { EDUCATOR_PORTFOLIO_URL } from '../config/site'

const EDUCATOR_PORTFOLIO_HOST = new URL(EDUCATOR_PORTFOLIO_URL).host

const PHILOSOPHY_KEYS = [
  { key: 'classroom', titleKey: 'educator.classroomTested', descKey: 'educator.classroomDesc' },
  { key: 'family', titleKey: 'educator.familyFirst', descKey: 'educator.familyDesc' },
  { key: 'inclusive', titleKey: 'educator.inclusive', descKey: 'educator.inclusiveDesc' },
]

function CredentialList({ icon: Icon, badge, title, items }) {
  return (
    <Reveal className="credential-group">
      <span className="section-header__badge">{badge}</span>
      <h2 className="credential-group__title">
        <Icon aria-hidden="true" /> {title}
      </h2>
      <ul className="credential-list">
        {items.map((item) => (
          <li key={item.title} className="credential-item">
            <strong>{item.title}</strong>
            <span>
              {item.place} · {item.period}
            </span>
            {item.note && <p>{item.note}</p>}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

export default function Educator() {
  const { t } = useLanguage()
  const { siteInfo } = useLocalizedContent()
  const { educator } = siteInfo

  return (
    <div className="page educator-page">
      <section className="page-hero page-hero--educator">
        <div className="container educator-hero">
          <Reveal className="educator-hero__photo-wrap" variant="scale">
            <img
              className="educator-hero__photo"
              src={educator.photo}
              alt={t('educator.photoAlt')}
              width="320"
              height="400"
            />
          </Reveal>
          <div className="educator-hero__text">
            <SectionHeader
              badge={t('pages.educator.badge')}
              title={educator.name}
              subtitle={educator.bio}
              light
              showLogo={false}
            />
            <Reveal delay={100} className="educator-badges">
              <span><FaAward aria-hidden="true" /> {educator.title}</span>
              <span><FaAward aria-hidden="true" /> {educator.role}</span>
              <span><FaMapMarkerAlt aria-hidden="true" /> {educator.location}</span>
            </Reveal>
            <Reveal delay={150} className="educator-hero__portfolio">
              <a href={EDUCATOR_PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="btn btn--cta">
                <span>{t('educator.portfolioHeroCta')}</span>
                <span className="btn__cta-icon"><HiExternalLink aria-hidden="true" /></span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container credentials-grid">
          <CredentialList
            icon={FaGraduationCap}
            badge={t('educator.credentialsBadge')}
            title={t('educator.credentialsTitle')}
            items={educator.education}
          />
          <CredentialList
            icon={FaBriefcase}
            badge={t('educator.experienceBadge')}
            title={t('educator.experienceTitle')}
            items={educator.experience}
          />
          <CredentialList
            icon={FaMicroscope}
            badge={t('educator.researchBadge')}
            title={t('educator.researchTitle')}
            items={educator.research}
          />
        </div>
        <div className="container">
          <Reveal className="portfolio-banner">
            <img
              className="portfolio-banner__photo"
              src={educator.photo}
              alt=""
              width="96"
              height="96"
              loading="lazy"
            />
            <div className="portfolio-banner__body">
              <span className="portfolio-banner__badge">{t('educator.portfolioBadge')}</span>
              <h2 className="portfolio-banner__title">{t('educator.portfolioTitle')}</h2>
              <p className="portfolio-banner__text">{t('educator.portfolioText')}</p>
              <span className="portfolio-banner__url" dir="ltr">{EDUCATOR_PORTFOLIO_HOST}</span>
            </div>
            <a
              href={EDUCATOR_PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--cta portfolio-banner__cta"
            >
              <span>{t('educator.portfolioCta')}</span>
              <span className="btn__cta-icon"><HiExternalLink aria-hidden="true" /></span>
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeader
            badge={t('educator.philosophyBadge')}
            title={t('educator.philosophyTitle')}
            subtitle={t('educator.philosophySubtitle')}
          />
          <Reveal className="philosophy-grid stagger">
            {PHILOSOPHY_KEYS.map((item) => {
              const Icon = getPhilosophyIcon(item.key)
              return (
                <article key={item.key} className="philosophy-card interactive-card card-shine">
                  <IconBadge icon={Icon} size="md" variant="soft" />
                  <SpeakHeading as="h3" body={t(item.descKey)}>{t(item.titleKey)}</SpeakHeading>
                  <p>{t(item.descKey)}</p>
                </article>
              )
            })}
          </Reveal>
          <Reveal className="section-cta" delay={150}>
            <Link to="/consultation" className="btn btn--cta">
              <span>{t('common.workWithUs')}</span>
              <span className="btn__cta-icon">
                <HiArrowRight />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
