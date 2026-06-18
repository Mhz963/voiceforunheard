import Reveal from './Reveal'
import BrandLogo from './BrandLogo'

export default function SectionHeader({ badge, title, subtitle, light = false, showLogo = light }) {
  return (
    <Reveal className={`section-header ${light ? 'section-header--light' : ''}`}>
      {showLogo && <BrandLogo className="section-header__logo" />}
      {badge && <span className="section-header__badge">{badge}</span>}
      <h2 className="section-header__title">{title}</h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </Reveal>
  )
}
