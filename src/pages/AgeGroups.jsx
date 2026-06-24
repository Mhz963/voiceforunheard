import SectionHeader from '../components/ui/SectionHeader'
import IconBadge from '../components/ui/IconBadge'
import Reveal from '../components/ui/Reveal'
import { getAgeGroupIcon } from '../utils/icons'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { SpeakHeading } from '../components/voice/SpeakAloud'

export default function AgeGroups() {
  const { t } = useLanguage()
  const { ageGroups } = useLocalizedContent()

  return (
    <div className="page age-page">
      <section className="page-hero page-hero--age">
        <div className="container">
          <SectionHeader
            badge={t('pages.ageGroups.badge')}
            title={t('pages.ageGroups.title')}
            subtitle={t('pages.ageGroups.subtitle')}
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="age-timeline">
            {ageGroups.map((group, index) => {
              const Icon = getAgeGroupIcon(group.id)
              return (
                <Reveal key={group.id} delay={index * 80}>
                  <article className="age-card">
                    <div className="age-card__marker">
                      <IconBadge icon={Icon} size="md" variant="outline" />
                      {index < ageGroups.length - 1 && <div className="age-card__line" />}
                    </div>
                    <div className="age-card__content interactive-card card-shine">
                      <div className="age-card__header">
                        <SpeakHeading
                          as="h3"
                          body={[group.range, `${t('ageGroupsPage.focus')}: ${group.focus}`, ...group.milestones].join('. ')}
                        >
                          {group.title}
                        </SpeakHeading>
                        <span className="age-card__range">{group.range}</span>
                      </div>
                      <p className="age-card__focus">
                        <strong>{t('ageGroupsPage.focus')}:</strong> {group.focus}
                      </p>
                      <h4>{t('ageGroupsPage.milestones')}</h4>
                      <ul>
                        {group.milestones.map((milestone) => (
                          <li key={milestone}>{milestone}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
