import SectionHeader from '../components/ui/SectionHeader'
import StatCard from '../components/ui/StatCard'
import IconBadge from '../components/ui/IconBadge'
import Reveal from '../components/ui/Reveal'
import { getImpactIcon, FaExclamationTriangle } from '../utils/icons'
import { globalStatistics, heroStats } from '../data/content'
import '../components/ui/IconBadge.css'
import './Statistics.css'

export default function Statistics() {
  return (
    <div className="page statistics-page">
      <section className="page-hero page-hero--stats">
        <div className="container">
          <SectionHeader
            badge="Research & Data"
            title="Hearing Impairment: Global Statistics"
            subtitle="Understanding the scale of hearing loss worldwide is the first step toward meaningful change. Data from the World Health Organization, Global Burden of Disease Study, and peer reviewed research."
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="stats-highlight stagger">
            {heroStats.map((stat) => (
              <StatCard key={stat.label} {...stat} accent />
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeader
            badge="Detailed Analysis"
            title="The State of Hearing Loss Worldwide"
          />
          <Reveal className="info-grid stagger">
            {globalStatistics.overview.map((item) => (
              <article key={item.title} className="info-card interactive-card card-shine">
                <h3>{item.title}</h3>
                <p>{item.content}</p>
                <cite>Source: {item.source}</cite>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            badge="Human Impact"
            title="How Hearing Loss Affects Lives"
            subtitle="Beyond numbers, hearing impairment creates cascading effects across communication, cognition, education, and wellbeing."
          />
          <Reveal className="impact-grid stagger">
            {globalStatistics.impacts.map((item) => {
              const Icon = getImpactIcon(item.icon)
              return (
                <article key={item.title} className="impact-card interactive-card card-shine">
                  <IconBadge icon={Icon} size="md" variant="soft" />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              )
            })}
          </Reveal>
        </div>
      </section>

      <section className="section section--compact section--dark">
        <div className="container">
          <Reveal>
            <div className="feature-banner feature-banner--dark feature-banner--inline feature-banner--animated">
              <div className="feature-banner__icon">
                <IconBadge icon={FaExclamationTriangle} size="md" variant="light" />
              </div>
              <div className="feature-banner__content">
                <h3>The Urgency of Action</h3>
                <p>
                  With 430 million people currently affected and projections reaching 711 million
                  by 2050, the global community must invest in prevention, early detection, and
                  comprehensive rehabilitation. Speech and language therapy is a core component
                  of WHO recommended hearing rehabilitation services. VoiceForUnheard exists to make
                  that rehabilitation accessible, structured, and effective for every family.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
