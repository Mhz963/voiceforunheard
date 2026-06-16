import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'
import SectionHeader from '../components/ui/SectionHeader'
import IconBadge from '../components/ui/IconBadge'
import Reveal from '../components/ui/Reveal'
import { FaChartLine } from '../utils/icons'
import { whySpeechTherapy, systemAdvantages } from '../data/content'
import '../components/ui/IconBadge.css'
import './WhyTherapy.css'

export default function WhyTherapy() {
  return (
    <div className="page why-page">
      <section className="page-hero page-hero--therapy">
        <div className="container">
          <SectionHeader
            badge="The Science of Communication"
            title="Why Speech Therapy Matters for Hearing Impaired Learners"
            subtitle={whySpeechTherapy.introduction}
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            badge="Evidence Based"
            title="Six Reasons Speech Therapy Is Essential"
          />
          <Reveal className="reasons-list stagger">
            {whySpeechTherapy.reasons.map((reason, index) => (
              <article key={reason.title} className="reason-card interactive-card card-shine">
                <span className="reason-card__number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.content}</p>
                  <cite>Evidence: {reason.evidence}</cite>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--compact section--alt">
        <div className="container">
          <Reveal>
            <div className="feature-banner feature-banner--subtle feature-banner--inline feature-banner--animated">
              <div className="feature-banner__icon">
                <IconBadge icon={FaChartLine} size="lg" variant="light" />
              </div>
              <div className="feature-banner__content">
                <h3>Growing Global Demand</h3>
                <p>{whySpeechTherapy.marketGrowth}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            badge="Our Solution"
            title="How VoiceForUnheard Delivers What Traditional Therapy Cannot"
            subtitle="A complete ecosystem designed by an educator who bridges clinical practice and classroom reality."
          />
          <Reveal className="solution-grid stagger">
            {systemAdvantages.map((item) => (
              <article key={item.title} className="solution-card interactive-card card-shine">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </Reveal>
          <Reveal className="section-cta" delay={150}>
            <Link to="/programs" className="btn btn--primary">
              Explore Our Programs <HiArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
