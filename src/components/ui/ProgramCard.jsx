import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'
import IconBadge from './IconBadge'
import { getProgramIcon } from '../../utils/icons'
import './IconBadge.css'

export default function ProgramCard({ program }) {
  const Icon = getProgramIcon(program.id)

  return (
    <article className="program-card interactive-card card-shine">
      <IconBadge icon={Icon} size="md" variant="soft" className="program-card__icon" />
      <h3 className="program-card__title">{program.title}</h3>
      <p className="program-card__summary">{program.summary}</p>
      <div className="program-card__meta">
        <span>{program.ages}</span>
        <span>{program.duration}</span>
      </div>
      <Link to={`/programs/${program.id}`} className="program-card__link">
        Learn more <HiArrowRight className="program-card__arrow" />
      </Link>
    </article>
  )
}
