import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'
import IconBadge from './IconBadge'
import { getProgramIcon } from '../../utils/icons'
import { useLanguage } from '../../i18n/LanguageContext'
import SpeakAloud from '../voice/SpeakAloud'

export default function ProgramCard({ program }) {
  const { t } = useLanguage()
  const Icon = getProgramIcon(program.id)
  const speakText = [program.title, program.summary, program.ages, program.duration].filter(Boolean).join('. ')

  return (
    <article className="program-card interactive-card card-shine">
      <IconBadge icon={Icon} size="md" variant="soft" className="program-card__icon" />
      <div className="program-card__title-row">
        <h3 className="program-card__title">{program.title}</h3>
        <SpeakAloud text={speakText} />
      </div>
      <p className="program-card__summary">{program.summary}</p>
      <div className="program-card__meta">
        <span>{program.ages}</span>
        <span>{program.duration}</span>
      </div>
      <Link to={`/programs/${program.id}`} className="program-card__link">
        {t('programCard.learnMore')} <HiArrowRight className="program-card__arrow" />
      </Link>
    </article>
  )
}
