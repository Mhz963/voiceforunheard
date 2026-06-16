export default function StatCard({ value, label, source, accent }) {
  return (
    <div className={`stat-card interactive-card card-shine ${accent ? 'stat-card--accent' : ''}`}>
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
      {source && <span className="stat-card__source">{source}</span>}
    </div>
  )
}
