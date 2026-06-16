import SectionHeader from '../components/ui/SectionHeader'
import IconBadge from '../components/ui/IconBadge'
import Reveal from '../components/ui/Reveal'
import { getAgeGroupIcon } from '../utils/icons'
import { ageGroups } from '../data/content'
import '../components/ui/IconBadge.css'
import './AgeGroups.css'

export default function AgeGroups() {
  return (
    <div className="page age-page">
      <section className="page-hero page-hero--age">
        <div className="container">
          <SectionHeader
            badge="Developmental Pathways"
            title="Programs Tailored to Every Age"
            subtitle="Language develops differently at every stage. VoiceForUnheard adapts content, goals, and teaching methods to match each learner's developmental window."
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
                        <h3>{group.title}</h3>
                        <span className="age-card__range">{group.range}</span>
                      </div>
                      <p className="age-card__focus">
                        <strong>Focus:</strong> {group.focus}
                      </p>
                      <h4>Key Milestones</h4>
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
