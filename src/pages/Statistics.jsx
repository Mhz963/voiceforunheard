import SectionHeader from '../components/ui/SectionHeader'
import StatCard from '../components/ui/StatCard'
import IconBadge from '../components/ui/IconBadge'
import Reveal from '../components/ui/Reveal'
import { getImpactIcon, FaExclamationTriangle } from '../utils/icons'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { SpeakHeading } from '../components/voice/SpeakAloud'

export default function Statistics() {
  const { t } = useLanguage()
  const { globalStatistics, heroStats } = useLocalizedContent()

  return (
    <div className="page statistics-page">
      <section className="page-hero page-hero--stats">
        <div className="container">
          <SectionHeader
            badge={t('pages.statistics.badge')}
            title={t('pages.statistics.title')}
            subtitle={t('pages.statistics.subtitle')}
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="stats-highlight stagger">
            {heroStats.map((stat) => (
              <StatCard key={stat.label} {...stat} accent />
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeader title={t('statisticsPage.overviewTitle')} />
          <Reveal className="info-grid stagger">
            {globalStatistics.overview.map((item) => (
              <article key={item.title} className="info-card interactive-card card-shine">
                <SpeakHeading as="h3" body={item.content}>{item.title}</SpeakHeading>
                <p>{item.content}</p>
                <cite>{t('statisticsPage.sourceLabel')} {item.source}</cite>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader title={t('statisticsPage.impactsTitle')} />
          <Reveal className="impact-grid stagger">
            {globalStatistics.impacts.map((item) => {
              const Icon = getImpactIcon(item.icon)
              return (
                <article key={item.title} className="impact-card interactive-card card-shine">
                  <IconBadge icon={Icon} size="md" variant="soft" />
                  <SpeakHeading as="h3" body={item.description}>{item.title}</SpeakHeading>
                  <p>{item.description}</p>
                </article>
              )
            })}
          </Reveal>
        </div>
      </section>

      <section className="section section--compact section--dark">
        <div className="container">
          <Reveal>
            <div className="feature-banner feature-banner--dark feature-banner--inline feature-banner--animated">
              <div className="feature-banner__icon">
                <IconBadge icon={FaExclamationTriangle} size="md" variant="light" />
              </div>
              <div className="feature-banner__content">
                <SpeakHeading as="h3" body={t('statisticsPage.urgencyText')} variant="on-light">
                  {t('statisticsPage.urgencyTitle')}
                </SpeakHeading>
                <p>{t('statisticsPage.urgencyText')}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
