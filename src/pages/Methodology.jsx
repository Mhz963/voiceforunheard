import SectionHeader from '../components/ui/SectionHeader'
import Reveal from '../components/ui/Reveal'
import { methodology } from '../data/content'

export default function Methodology() {
  return (
    <div className="page methodology-page">
      <section className="page-hero page-hero--method">
        <div className="container">
          <SectionHeader
            badge="Our Framework"
            title="The VoiceForUnheard Methodology"
            subtitle="A proven five pillar approach that transforms assessment data into measurable communication growth."
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="pillars-grid stagger">
            {methodology.pillars.map((pillar, index) => (
              <article key={pillar.title} className="pillar-card interactive-card card-shine">
                <span className="pillar-card__step">{index + 1}</span>
                <h3>{pillar.title}</h3>
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
          <SectionHeader
            badge="Core Beliefs"
            title="Principles That Guide Everything We Do"
          />
          <Reveal className="principles-grid stagger">
            {methodology.principles.map((principle) => (
              <div key={principle} className="principle-item interactive-card">
                <span className="principle-item__dot" />
                <p>{principle}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
