import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'
import { FaLayerGroup, FaQuoteLeft } from 'react-icons/fa'
import SectionHeader from '../components/ui/SectionHeader'
import StatCard from '../components/ui/StatCard'
import ProgramCard from '../components/ui/ProgramCard'
import IconBadge from '../components/ui/IconBadge'
import Reveal from '../components/ui/Reveal'
import { getAdvantageIcon } from '../utils/icons'
import {
  siteInfo,
  heroStats,
  systemAdvantages,
  programCategories,
  testimonials,
} from '../data/content'

export default function Home() {
  const featuredPrograms = programCategories.slice(0, 6)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__content">
          <span className="hero__badge animate-hero-badge">Speech Education for Hearing Impaired Learners</span>
          <h1 className="hero__title animate-hero-title">
            Empowering Every Voice Through
            <span className="hero__highlight"> Evidence Based Speech Education</span>
          </h1>
          <p className="hero__subtitle animate-hero-subtitle">{siteInfo.description}</p>
          <div className="hero__actions animate-hero-actions">
            <Link to="/programs" className="btn btn--primary">
              Explore Programs <HiArrowRight />
            </Link>
            <Link to="/statistics" className="btn btn--outline">
              View Global Statistics
            </Link>
          </div>
        </div>
        <div className="hero__visual animate-hero-visual">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__card interactive-card card-shine">
            <IconBadge icon={FaLayerGroup} size="lg" variant="accent" />
            <strong>12 Specialized Programs</strong>
            <p>Complete coverage for every age and communication need</p>
          </div>
        </div>
      </section>

      <section className="home-stats">
        <div className="container">
          <SectionHeader
            badge="The Global Challenge"
            title="Why the World Needs Better Speech Education"
            subtitle="Hearing loss affects hundreds of millions. Unaddressed, it costs lives, livelihoods, and one trillion dollars annually."
          />
          <Reveal className="home-stats__grid stagger">
            {heroStats.map((stat) => (
              <StatCard key={stat.label} {...stat} accent />
            ))}
          </Reveal>
        </div>
      </section>

      <section className="home-advantages">
        <div className="container">
          <SectionHeader
            badge="The VoiceForUnheard Difference"
            title="Why VoiceForUnheard Is the Best Solution"
            subtitle="Designed by a Speech Education Teacher who understands what families and classrooms truly need."
          />
          <Reveal className="advantages-grid stagger">
            {systemAdvantages.map((item) => {
              const Icon = getAdvantageIcon(item.icon)
              return (
                <article key={item.title} className="advantage-card interactive-card card-shine">
                  <IconBadge icon={Icon} size="sm" />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              )
            })}
          </Reveal>
        </div>
      </section>

      <section className="home-programs">
        <div className="container">
          <SectionHeader
            badge="Complete Coverage"
            title="Every Category. Every Age. Every Path."
            subtitle="From early intervention to adult rehabilitation, auditory verbal to sign language support."
          />
          <Reveal className="programs-grid stagger">
            {featuredPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </Reveal>
          <Reveal className="home-programs__cta" delay={200}>
            <Link to="/programs" className="btn btn--primary">
              View All 12 Programs <HiArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section section--compact">
        <div className="container">
          <Reveal>
            <div className="feature-banner feature-banner--gradient feature-banner--animated">
              <div className="feature-banner__content">
                <h2>Ready to Bridge the Gap Between Hearing and Understanding?</h2>
                <p>
                  Join families and educators who trust VoiceForUnheard for comprehensive,
                  compassionate, and effective speech education.
                </p>
              </div>
              <div className="feature-banner__actions">
                <Link to="/contact" className="btn btn--cta">
                  <span>Start Your Journey</span>
                  <span className="btn__cta-icon">
                    <HiArrowRight />
                  </span>
                </Link>
                <Link to="/educator" className="btn btn--ghost">
                  Meet the Educator
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight-top home-testimonials">
        <div className="container">
          <SectionHeader
            badge="Community Voices"
            title="What Families and Educators Say"
          />
          <Reveal className="testimonials-grid stagger">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="testimonial-card interactive-card card-shine">
                <FaQuoteLeft className="testimonial-card__icon" aria-hidden="true" />
                <p>&ldquo;{item.text}&rdquo;</p>
                <footer>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </footer>
              </blockquote>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
