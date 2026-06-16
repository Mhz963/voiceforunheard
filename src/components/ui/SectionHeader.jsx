import Reveal from './Reveal'

export default function SectionHeader({ badge, title, subtitle, light = false }) {
  return (
    <Reveal className={`section-header ${light ? 'section-header--light' : ''}`}>
      {badge && <span className="section-header__badge">{badge}</span>}
      <h2 className="section-header__title">{title}</h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </Reveal>
  )
}
