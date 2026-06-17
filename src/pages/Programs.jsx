import SectionHeader from '../components/ui/SectionHeader'
import ProgramCard from '../components/ui/ProgramCard'
import Reveal from '../components/ui/Reveal'
import { programCategories } from '../data/content'
export default function Programs() {
  return (
    <div className="page programs-page">
      <section className="page-hero page-hero--programs">
        <div className="container">
          <SectionHeader
            badge="12 Specialized Tracks"
            title="Complete Program Categories"
            subtitle="Every communication pathway, every developmental stage, every learning need. VoiceForUnheard offers the most comprehensive speech education system for hearing impaired learners available today."
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
