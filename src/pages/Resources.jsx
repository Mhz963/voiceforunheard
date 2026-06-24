import { HiArrowRight } from 'react-icons/hi'
import SectionHeader from '../components/ui/SectionHeader'
import Reveal from '../components/ui/Reveal'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { SpeakHeading } from '../components/voice/SpeakAloud'

export default function Resources() {
  const { t } = useLanguage()
  const { resources } = useLocalizedContent()

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
                  <a
                    key={item.name}
                    href={item.url}
                    className="resource-card interactive-card card-shine"
                    target={item.url.startsWith('http') ? '_blank' : undefined}
                    rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <SpeakHeading as="h3" body={item.description}>{item.name}</SpeakHeading>
                    <p>{item.description}</p>
                    <span className="resource-card__link">
                      {item.url === '#' ? item.comingSoon ?? t('resourcesPage.comingSoon') : (
                        <>{t('resourcesPage.visitLink')} <HiArrowRight /></>
                      )}
                    </span>
                  </a>
                ))}
              </Reveal>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
