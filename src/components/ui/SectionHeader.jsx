import Reveal from './Reveal'
import BrandLogo from './BrandLogo'
import SpeakAloud from '../voice/SpeakAloud'

// Page heroes (light) carry the page's single <h1>; other sections use <h2>.
export default function SectionHeader({ badge, title, subtitle, light = false, showLogo = light, as }) {
  const Heading = as ?? (light ? 'h1' : 'h2')
  const speakText = [badge, title, subtitle].filter(Boolean).join('. ')

  return (
    <Reveal className={`section-header ${light ? 'section-header--light' : ''}`}>
      {showLogo && <BrandLogo className="section-header__logo" />}
      {badge && <span className="section-header__badge">{badge}</span>}
      <div className="section-header__title-row">
        <Heading className="section-header__title">{title}</Heading>
        <SpeakAloud text={speakText} variant={light ? 'on-light' : 'default'} size="md" />
      </div>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </Reveal>
  )
}
