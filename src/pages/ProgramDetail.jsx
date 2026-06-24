import { Link, useParams } from 'react-router-dom'
import { HiArrowLeft, HiArrowRight, HiCheck } from 'react-icons/hi'
import IconBadge from '../components/ui/IconBadge'
import Reveal from '../components/ui/Reveal'
import { getProgramIcon } from '../utils/icons'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import SpeakAloud, { SpeakHeading } from '../components/voice/SpeakAloud'

export default function ProgramDetail() {
  const { t } = useLanguage()
  const { programCategories } = useLocalizedContent()
  const { programId } = useParams()
  const program = programCategories.find((p) => p.id === programId)

  if (!program) {
    return (
      <div className="page program-detail">
        <div className="container">
          <h1>{t('pages.programDetail.notFound')}</h1>
          <Link to="/programs" className="btn btn--primary">
            <HiArrowLeft /> {t('pages.programDetail.backToPrograms')}
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
            <HiArrowLeft /> {t('pages.programDetail.backToPrograms')}
          </Link>
          <Reveal variant="scale" delay={50}>
            <IconBadge icon={Icon} size="xl" variant="light" />
          </Reveal>
          <Reveal delay={100}>
            <div className="program-detail__title-row">
              <h1>{program.title}</h1>
              <SpeakAloud
                text={[program.title, program.summary, program.ages, program.duration].filter(Boolean).join('. ')}
                variant="on-light"
                size="md"
              />
            </div>
            <p className="program-detail__summary">{program.summary}</p>
          </Reveal>
          <Reveal className="program-detail__meta" delay={180}>
            <span><strong>{t('pages.programDetail.ages')}:</strong> {program.ages}</span>
            <span><strong>{t('pages.programDetail.duration')}:</strong> {program.duration}</span>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container program-detail__content">
          <Reveal className="program-detail__main" variant="left">
            <SpeakHeading as="h2" body={program.description}>
              {t('pages.programDetail.aboutTitle')}
            </SpeakHeading>
            <p>{program.description}</p>

            <SpeakHeading as="h2" extra={program.features}>
              {t('pages.programDetail.learnTitle')}
            </SpeakHeading>
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
              <SpeakHeading as="h3" body={t('pages.programDetail.enrollText')}>
                {t('pages.programDetail.enrollTitle')}
              </SpeakHeading>
              <p>{t('pages.programDetail.enrollText')}</p>
              <Link to="/signin" className="btn btn--cta btn--block">
                <span>{t('pages.programDetail.getStarted')}</span>
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
