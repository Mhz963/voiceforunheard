import Reveal from './Reveal'
import BrandLogo from './BrandLogo'
import SpeakAloud from '../voice/SpeakAloud'

export default function SectionHeader({ badge, title, subtitle, light = false, showLogo = light }) {
  const speakText = [badge, title, subtitle].filter(Boolean).join('. ')

  return (
    <Reveal className={`section-header ${light ? 'section-header--light' : ''}`}>
      {showLogo && <BrandLogo className="section-header__logo" />}
      {badge && <span className="section-header__badge">{badge}</span>}
      <div className="section-header__title-row">
        <h2 className="section-header__title">{title}</h2>
        <SpeakAloud text={speakText} variant={light ? 'on-light' : 'default'} size="md" />
      </div>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </Reveal>
  )
}
