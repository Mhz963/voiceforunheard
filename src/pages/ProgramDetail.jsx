import { Link, useParams } from 'react-router-dom'
import { HiArrowLeft, HiArrowRight, HiCheck } from 'react-icons/hi'
import IconBadge from '../components/ui/IconBadge'
import Reveal from '../components/ui/Reveal'
import { getProgramIcon } from '../utils/icons'
import { programCategories } from '../data/content'

export default function ProgramDetail() {
  const { programId } = useParams()
  const program = programCategories.find((p) => p.id === programId)

  if (!program) {
    return (
      <div className="page program-detail">
        <div className="container">
          <h1>Program Not Found</h1>
          <Link to="/programs" className="btn btn--primary">
            <HiArrowLeft /> Back to Programs
          </Link>
        </div>
      </div>
    )
  }

  const Icon = getProgramIcon(program.id)

  return (
    <div className="page program-detail">
      <section className="program-detail__hero">
        <div className="container">
          <Link to="/programs" className="back-link">
            <HiArrowLeft /> All Programs
          </Link>
          <Reveal variant="scale" delay={50}>
            <IconBadge icon={Icon} size="xl" variant="light" />
          </Reveal>
          <Reveal delay={100}>
            <h1>{program.title}</h1>
            <p className="program-detail__summary">{program.summary}</p>
          </Reveal>
          <Reveal className="program-detail__meta" delay={180}>
            <span><strong>Ages:</strong> {program.ages}</span>
            <span><strong>Duration:</strong> {program.duration}</span>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container program-detail__content">
          <Reveal className="program-detail__main" variant="left">
            <h2>About This Program</h2>
            <p>{program.description}</p>

            <h2>What You Will Learn</h2>
            <ul className="feature-list">
              {program.features.map((feature) => (
                <li key={feature}>
                  <HiCheck />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="program-detail__sidebar" variant="right" delay={120}>
            <aside>
            <div className="sidebar-card interactive-card card-shine">
              <h3>Ready to Enroll?</h3>
              <p>Speak with our team to find the right starting point for your learner.</p>
              <Link to="/contact" className="btn btn--cta btn--block">
                <span>Get Started</span>
                <span className="btn__cta-icon">
                  <HiArrowRight />
                </span>
              </Link>
            </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
