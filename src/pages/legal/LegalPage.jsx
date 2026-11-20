import SectionHeader from '../../components/ui/SectionHeader'
import { SpeakHeading } from '../../components/voice/SpeakAloud'
import { useLanguage } from '../../i18n/LanguageContext'
import { CONTACT_EMAIL } from '../../config/site'

function fill(text) {
  return text.replaceAll('{{email}}', CONTACT_EMAIL)
}

export default function LegalPage({ docKey }) {
  const { t } = useLanguage()
  const doc = t(`legal.${docKey}`)

  return (
    <div className="page legal-page">
      <section className="page-hero page-hero--resources">
        <div className="container">
          <SectionHeader badge={doc.badge} title={doc.title} subtitle={doc.subtitle} light />
        </div>
      </section>
      <section className="section">
        <div className="container legal-body">
          <p className="legal-updated">{t('legal.updated')}</p>
          {doc.sections.map((section) => (
            <section key={section.title} className="legal-section">
              <SpeakHeading as="h2" body={section.body.map(fill).join(' ')}>
                {section.title}
              </SpeakHeading>
              {section.body.map((para) => (
                <p key={para}>{fill(para)}</p>
              ))}
            </section>
          ))}
          <p className="legal-note">{t('legal.reviewNote')}</p>
        </div>
      </section>
    </div>
  )
}
