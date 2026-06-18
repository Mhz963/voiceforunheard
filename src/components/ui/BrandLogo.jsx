import { siteInfo } from '../../data/content'

export default function BrandLogo({ className = '', onDark = false }) {
  return (
    <img
      src={siteInfo.logo}
      alt={siteInfo.name}
      className={`brand-logo${onDark ? ' brand-logo--on-dark' : ''}${className ? ` ${className}` : ''}`}
    />
  )
}
