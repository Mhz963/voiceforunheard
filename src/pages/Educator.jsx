import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'
import { FaGraduationCap, FaAward, FaHeart } from 'react-icons/fa'
import SectionHeader from '../components/ui/SectionHeader'
import IconBadge from '../components/ui/IconBadge'
import Reveal from '../components/ui/Reveal'
import { getPhilosophyIcon } from '../utils/icons'
import { siteInfo, systemAdvantages } from '../data/content'

const philosophyItems = [
  {
    key: 'classroom',
    title: 'Classroom Tested',
    description:
      'Every activity has been refined through years of teaching hearing impaired learners in educational settings, not just clinical rooms.',
  },
  {
    key: 'family',
    title: 'Family First',
    description:
      'Parents are the most important teachers. VoiceForUnheard equips families with confidence, knowledge, and daily tools to support their child.',
  },
  {
    key: 'inclusive',
    title: 'Inclusive by Design',
    description:
      'Whether your family chooses listening and spoken language, sign language, or a bilingual approach, this system supports your journey without judgment.',
  },
]

export default function Educator() {
  return (
    <div className="page educator-page">
      <section className="page-hero page-hero--educator">
        <div className="container educator-hero">
          <Reveal variant="scale" className="educator-hero__visual">
            <div className="educator-avatar">
              <FaGraduationCap />
            </div>
          </Reveal>
          <div className="educator-hero__text">
            <SectionHeader
              badge="Meet Your Guide"
              title="A Speech Education Teacher Who Understands"
              light
            />
            <Reveal delay={100}>
              <p className="educator-bio">{siteInfo.educator.bio}</p>
            </Reveal>
            <Reveal delay={200} className="educator-badges">
              <span><FaAward /> {siteInfo.educator.title}</span>
              <span><FaHeart /> {siteInfo.educator.role}</span>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            badge="Philosophy"
            title="Education Meets Clinical Excellence"
            subtitle="Most speech therapy platforms are built by technologists. VoiceForUnheard is built by someone who has sat across from children, coached parents through tears of diagnosis, and celebrated first words in real classrooms."
          />
          <Reveal className="philosophy-grid stagger">
            {philosophyItems.map((item) => {
              const Icon = getPhilosophyIcon(item.key)
              return (
                <article key={item.key} className="philosophy-card interactive-card card-shine">
                  <IconBadge icon={Icon} size="md" variant="soft" />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              )
            })}
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeader
            badge="Built Different"
            title="What Makes This System Unique"
          />
          <Reveal className="unique-list stagger">
            {systemAdvantages.slice(0, 4).map((item) => (
              <article key={item.title} className="unique-item interactive-card card-shine">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </Reveal>
          <Reveal className="section-cta" delay={150}>
            <Link to="/contact" className="btn btn--cta">
              <span>Work With Us</span>
              <span className="btn__cta-icon">
                <HiArrowRight />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
