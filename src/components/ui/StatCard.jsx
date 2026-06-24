import SpeakAloud from '../voice/SpeakAloud'

export default function StatCard({ value, label, source, accent }) {
  const speakText = [value, label, source].filter(Boolean).join('. ')

  return (
    <div className={`stat-card interactive-card card-shine ${accent ? 'stat-card--accent' : ''}`}>
      <SpeakAloud text={speakText} className="stat-card__speak" variant="subtle" />
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
      {source && <span className="stat-card__source">{source}</span>}
    </div>
  )
}
