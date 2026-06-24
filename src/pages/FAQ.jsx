import SectionHeader from '../components/ui/SectionHeader'
import Accordion from '../components/ui/Accordion'
import Reveal from '../components/ui/Reveal'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'

export default function FAQ() {
  const { t } = useLanguage()
  const { faqItems } = useLocalizedContent()

  return (
    <div className="page faq-page">
      <section className="page-hero page-hero--faq">
        <div className="container">
          <SectionHeader
            badge={t('pages.faq.badge')}
            title={t('pages.faq.title')}
            subtitle={t('pages.faq.subtitle')}
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <Reveal>
            <Accordion items={faqItems} />
          </Reveal>
        </div>
      </section>
    </div>
  )
}
