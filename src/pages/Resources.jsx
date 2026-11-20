import { Link } from 'react-router-dom'
import { HiArrowRight, HiClock } from 'react-icons/hi'
import SectionHeader from '../components/ui/SectionHeader'
import Reveal from '../components/ui/Reveal'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { SpeakHeading } from '../components/voice/SpeakAloud'

// The whole card is clickable through the stretched link; the read-aloud
// button sits above it, so no interactive element is nested in another.
function ResourceCard({ item, t }) {
  const isInternal = item.url.startsWith('/')
  const label = (
    <>
      {isInternal ? t('resourcesPage.toolsReady') : t('resourcesPage.visitLink')} <HiArrowRight aria-hidden="true" />
      <span className="visually-hidden">: {item.name}</span>
    </>
  )

  return (
    <article className="resource-card resource-card--stretched interactive-card card-shine">
      <SpeakHeading as="h3" body={item.description}>{item.name}</SpeakHeading>
      <p>{item.description}</p>
      {isInternal ? (
        <Link to={item.url} className="resource-card__link resource-card__stretch">
          {label}
        </Link>
      ) : (
        <a href={item.url} className="resource-card__link resource-card__stretch" target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      )}
    </article>
  )
}

export default function Resources() {
  const { t } = useLanguage()
  const { resources } = useLocalizedContent()
  const roadmap = t('resourcesPage.roadmap')

  return (
    <div className="page resources-page">
      <section className="page-hero page-hero--resources">
        <div className="container">
          <SectionHeader
            badge={t('pages.resources.badge')}
            title={t('pages.resources.title')}
            subtitle={t('pages.resources.subtitle')}
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          {resources.map((group) => (
            <div key={group.category} className="resource-group">
              <Reveal>
                <SpeakHeading as="h2" headingClassName="resource-group__title">
                  {group.category}
                </SpeakHeading>
              </Reveal>
              <Reveal className="resource-grid stagger">
                {group.items.map((item) => (
                  <ResourceCard key={item.name} item={item} t={t} />
                ))}
              </Reveal>
            </div>
          ))}

          <div className="resource-group">
            <Reveal>
              <SpeakHeading as="h2" headingClassName="resource-group__title" extra={roadmap}>
                {t('resourcesPage.roadmapTitle')}
              </SpeakHeading>
              <p className="roadmap__subtitle">{t('resourcesPage.roadmapSubtitle')}</p>
              <ul className="roadmap-list">
                {roadmap.map((item) => (
                  <li key={item}>
                    <HiClock aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  )
}
