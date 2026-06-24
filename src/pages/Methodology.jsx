import SectionHeader from '../components/ui/SectionHeader'
import Reveal from '../components/ui/Reveal'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { SpeakHeading } from '../components/voice/SpeakAloud'

export default function Methodology() {
  const { t } = useLanguage()
  const { methodology } = useLocalizedContent()

  return (
    <div className="page methodology-page">
      <section className="page-hero page-hero--method">
        <div className="container">
          <SectionHeader
            badge={t('pages.methodology.badge')}
            title={t('pages.methodology.title')}
            subtitle={t('pages.methodology.subtitle')}
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader title={t('methodologyPage.pillarsTitle')} />
          <Reveal className="pillars-grid stagger">
            {methodology.pillars.map((pillar, index) => (
              <article key={pillar.title} className="pillar-card interactive-card card-shine">
                <span className="pillar-card__step">{index + 1}</span>
                <SpeakHeading
                  as="h3"
                  body={pillar.description}
                  extra={pillar.steps}
                >
                  {pillar.title}
                </SpeakHeading>
                <p>{pillar.description}</p>
                <ul>
                  {pillar.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeader title={t('methodologyPage.principlesTitle')} />
          <Reveal className="principles-grid stagger">
            {methodology.principles.map((principle) => (
              <div key={principle} className="principle-item interactive-card">
                <span className="principle-item__dot" />
                <SpeakHeading as="p" className="principle-item__content">{principle}</SpeakHeading>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
