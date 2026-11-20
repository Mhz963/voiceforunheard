import { siteInfo } from '../../data/content'

// `horizontal` uses the icon-beside-wordmark lockup, which stays legible at
// header height; the stacked logo is used everywhere else.
export default function BrandLogo({ className = '', onDark = false, horizontal = false }) {
  return (
    <img
      src={horizontal ? '/logo-horizontal.png' : siteInfo.logo}
      alt={siteInfo.name}
      width={horizontal ? 491 : 619}
      height={horizontal ? 120 : 403}
      className={`brand-logo${horizontal ? ' brand-logo--horizontal' : ''}${onDark ? ' brand-logo--on-dark' : ''}${className ? ` ${className}` : ''}`}
    />
  )
}
