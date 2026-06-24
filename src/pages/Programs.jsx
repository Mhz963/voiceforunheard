import SectionHeader from '../components/ui/SectionHeader'
import ProgramCard from '../components/ui/ProgramCard'
import Reveal from '../components/ui/Reveal'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'

export default function Programs() {
  const { t } = useLanguage()
  const { programCategories } = useLocalizedContent()

  return (
    <div className="page programs-page">
      <section className="page-hero page-hero--programs">
        <div className="container">
          <SectionHeader
            badge={t('pages.programs.badge')}
            title={t('pages.programs.title')}
            subtitle={t('pages.programs.subtitle')}
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="programs-grid programs-grid--full stagger">
            {programCategories.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
