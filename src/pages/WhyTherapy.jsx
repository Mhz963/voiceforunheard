import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi'
import SectionHeader from '../components/ui/SectionHeader'
import IconBadge from '../components/ui/IconBadge'
import Reveal from '../components/ui/Reveal'
import { FaChartLine } from '../utils/icons'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedContent } from '../i18n/useLocalizedContent'
import { SpeakHeading } from '../components/voice/SpeakAloud'

export default function WhyTherapy() {
  const { t } = useLanguage()
  const { whySpeechTherapy, systemAdvantages } = useLocalizedContent()

  return (
    <div className="page why-page">
      <section className="page-hero page-hero--therapy">
        <div className="container">
          <SectionHeader
            badge={t('pages.whyTherapy.badge')}
            title={t('pages.whyTherapy.title')}
            subtitle={whySpeechTherapy.introduction}
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            badge={t('pages.whyTherapy.badge')}
            title={t('pages.whyTherapy.title')}
          />
          <Reveal className="reasons-list stagger">
            {whySpeechTherapy.reasons.map((reason, index) => (
              <article key={reason.title} className="reason-card interactive-card card-shine">
                <span className="reason-card__number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <SpeakHeading as="h3" body={`${reason.content}. ${t('whyTherapyPage.evidenceLabel')} ${reason.evidence}`}>
                    {reason.title}
                  </SpeakHeading>
                  <p>{reason.content}</p>
                  <cite>{t('whyTherapyPage.evidenceLabel')} {reason.evidence}</cite>
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
                <SpeakHeading as="h3" body={whySpeechTherapy.marketGrowth}>
                  {t('whyTherapyPage.marketTitle')}
                </SpeakHeading>
                <p>{whySpeechTherapy.marketGrowth}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            badge={t('home.advantagesBadge')}
            title={t('home.advantagesTitle')}
            subtitle={t('home.advantagesSubtitle')}
          />
          <Reveal className="solution-grid stagger">
            {systemAdvantages.map((item) => (
              <article key={item.title} className="solution-card interactive-card card-shine">
                <SpeakHeading as="h3" body={item.description}>{item.title}</SpeakHeading>
                <p>{item.description}</p>
              </article>
            ))}
          </Reveal>
          <Reveal className="section-cta" delay={150}>
            <Link to="/programs" className="btn btn--primary">
              {t('common.explorePrograms')} <HiArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
