import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'
import { FaAward, FaHeart } from 'react-icons/fa'
import SectionHeader from '../components/ui/SectionHeader'
import IconBadge from '../components/ui/IconBadge'
import Reveal from '../components/ui/Reveal'
import { getPhilosophyIcon } from '../utils/icons'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { SpeakHeading } from '../components/voice/SpeakAloud'

const PHILOSOPHY_KEYS = [
  { key: 'classroom', titleKey: 'educator.classroomTested', descKey: 'educator.classroomDesc' },
  { key: 'family', titleKey: 'educator.familyFirst', descKey: 'educator.familyDesc' },
  { key: 'inclusive', titleKey: 'educator.inclusive', descKey: 'educator.inclusiveDesc' },
]

export default function Educator() {
  const { t } = useLanguage()
  const { siteInfo, systemAdvantages } = useLocalizedContent()

  return (
    <div className="page educator-page">
      <section className="page-hero page-hero--educator">
        <div className="container">
          <SectionHeader
            badge={t('pages.educator.badge')}
            title={t('pages.educator.title')}
            subtitle={siteInfo.educator.bio}
            light
          />
          <Reveal delay={100} className="educator-badges">
            <span><FaAward /> {siteInfo.educator.title}</span>
            <span><FaHeart /> {siteInfo.educator.role}</span>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            badge={t('educator.philosophyBadge')}
            title={t('educator.philosophyTitle')}
            subtitle={t('educator.philosophySubtitle')}
          />
          <Reveal className="philosophy-grid stagger">
            {PHILOSOPHY_KEYS.map((item) => {
              const Icon = getPhilosophyIcon(item.key)
              return (
                <article key={item.key} className="philosophy-card interactive-card card-shine">
                  <IconBadge icon={Icon} size="md" variant="soft" />
                  <SpeakHeading as="h3" body={t(item.descKey)}>{t(item.titleKey)}</SpeakHeading>
                  <p>{t(item.descKey)}</p>
                </article>
              )
            })}
          </Reveal>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeader
            badge={t('educator.uniqueBadge')}
            title={t('educator.uniqueTitle')}
          />
          <Reveal className="unique-list stagger">
            {systemAdvantages.slice(0, 4).map((item) => (
              <article key={item.title} className="unique-item interactive-card card-shine">
                <SpeakHeading as="h3" body={item.description}>{item.title}</SpeakHeading>
                <p>{item.description}</p>
              </article>
            ))}
          </Reveal>
          <Reveal className="section-cta" delay={150}>
            <Link to="/signin" className="btn btn--cta">
              <span>{t('common.workWithUs')}</span>
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
