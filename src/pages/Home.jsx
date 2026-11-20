import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'
import { FaLayerGroup, FaCheckCircle } from 'react-icons/fa'
import SectionHeader from '../components/ui/SectionHeader'
import StatCard from '../components/ui/StatCard'
import ProgramCard from '../components/ui/ProgramCard'
import IconBadge from '../components/ui/IconBadge'
import Reveal from '../components/ui/Reveal'
import { getAdvantageIcon } from '../utils/icons'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import SpeakAloud, { SpeakHeading } from '../components/voice/SpeakAloud'

export default function Home() {
  const { t } = useLanguage()
  const { siteInfo, heroStats, systemAdvantages, programCategories } = useLocalizedContent()
  const trustPoints = t('home.trustPoints')
  const featuredPrograms = programCategories.slice(0, 6)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__content">
          <span className="hero__badge animate-hero-badge">{t('home.heroBadge')}</span>
          <div className="hero__title-row animate-hero-title">
            <h1 className="hero__title">
              {t('home.heroTitle')}
              <span className="hero__highlight">{t('home.heroHighlight')}</span>
            </h1>
            <SpeakAloud
              text={[t('home.heroBadge'), t('home.heroTitle'), t('home.heroHighlight'), siteInfo.description].join('. ')}
              variant="on-light"
              size="md"
            />
          </div>
          <p className="hero__subtitle animate-hero-subtitle">{siteInfo.description}</p>
          <div className="hero__actions animate-hero-actions">
            <Link to="/programs" className="btn btn--primary">
              {t('common.explorePrograms')} <HiArrowRight />
            </Link>
            <Link to="/statistics" className="btn btn--outline">
              {t('common.viewStatistics')}
            </Link>
          </div>
        </div>
        <div className="hero__visual animate-hero-visual">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__card interactive-card card-shine">
            <IconBadge icon={FaLayerGroup} size="lg" variant="accent" />
            <div className="hero-card__title-row">
              <strong>{t('home.heroCardTitle')}</strong>
              <SpeakAloud text={[t('home.heroCardTitle'), t('home.heroCardDesc')].join('. ')} />
            </div>
            <p>{t('home.heroCardDesc')}</p>
          </div>
        </div>
      </section>

      <section className="home-stats">
        <div className="container">
          <SectionHeader
            badge={t('home.statsBadge')}
            title={t('home.statsTitle')}
            subtitle={t('home.statsSubtitle')}
          />
          <Reveal className="home-stats__grid stagger">
            {heroStats.map((stat) => (
              <StatCard key={stat.label} {...stat} accent />
            ))}
          </Reveal>
        </div>
      </section>

      <section className="home-advantages">
        <div className="container">
          <SectionHeader
            badge={t('home.advantagesBadge')}
            title={t('home.advantagesTitle')}
            subtitle={t('home.advantagesSubtitle')}
          />
          <Reveal className="advantages-grid stagger">
            {systemAdvantages.map((item) => {
              const Icon = getAdvantageIcon(item.icon)
              return (
                <article key={item.title} className="advantage-card interactive-card card-shine">
                  <IconBadge icon={Icon} size="sm" />
                  <SpeakHeading as="h3" body={item.description}>{item.title}</SpeakHeading>
                  <p>{item.description}</p>
                </article>
              )
            })}
          </Reveal>
        </div>
      </section>

      <section className="home-programs">
        <div className="container">
          <SectionHeader
            badge={t('home.programsBadge')}
            title={t('home.programsTitle')}
            subtitle={t('home.programsSubtitle')}
          />
          <Reveal className="programs-grid stagger">
            {featuredPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </Reveal>
          <Reveal className="home-programs__cta" delay={200}>
            <Link to="/programs" className="btn btn--primary">
              {t('common.viewAllPrograms')} <HiArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section section--compact">
        <div className="container">
          <Reveal>
            <div className="feature-banner feature-banner--gradient feature-banner--animated">
              <div className="feature-banner__content">
                <SpeakHeading as="h2" body={t('home.ctaText')} variant="on-light" align="center">
                  {t('home.ctaTitle')}
                </SpeakHeading>
                <p>{t('home.ctaText')}</p>
              </div>
              <div className="feature-banner__actions">
                <Link to="/consultation" className="btn btn--cta">
                  <span>{t('common.startJourney')}</span>
                  <span className="btn__cta-icon">
                    <HiArrowRight />
                  </span>
                </Link>
                <Link to="/educator" className="btn btn--ghost">
                  {t('common.meetEducator')}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight-top home-trust" aria-labelledby="home-trust-title">
        <div className="container">
          <Reveal className="trust-strip">
            <img
              className="trust-strip__photo"
              src={siteInfo.educator.photo}
              alt={t('educator.photoAlt')}
              width="160"
              height="200"
              loading="lazy"
            />
            <div className="trust-strip__body">
              <span className="section-header__badge">{t('home.trustBadge')}</span>
              <SpeakHeading as="h2" id="home-trust-title" body={[t('home.trustRole'), ...trustPoints].join('. ')}>
                {t('home.trustName')}
              </SpeakHeading>
              <p className="trust-strip__role">{t('home.trustRole')}</p>
              <ul className="trust-strip__list">
                {trustPoints.map((point) => (
                  <li key={point}>
                    <FaCheckCircle aria-hidden="true" /> {point}
                  </li>
                ))}
              </ul>
              <Link to="/educator" className="btn btn--outline">
                {t('home.trustLink')} <HiArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--compact home-practice">
        <div className="container">
          <Reveal className="practice-cta">
            <div>
              <SpeakHeading as="h2" body={t('home.practiceText')}>{t('home.practiceTitle')}</SpeakHeading>
              <p>{t('home.practiceText')}</p>
            </div>
            <Link to="/practice" className="btn btn--primary">
              {t('common.tryPractice')} <HiArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
