export default function IconBadge({ icon: Icon, size = 'md', variant = 'default', className = '' }) {
  if (!Icon) return null

  return (
    <span
      className={`icon-badge icon-badge--${size} icon-badge--${variant} ${className}`.trim()}
      aria-hidden="true"
    >
      <Icon />
    </span>
  )
}
