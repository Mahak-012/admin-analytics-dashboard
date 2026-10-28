import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import Sparkline from '../charts/Sparkline'

export default function KpiCard({ label, value, delta, icon: Icon, tint, spark }) {
  const up = delta >= 0
  const sparkColor = up ? 'var(--success)' : 'var(--danger)'

  return (
    <article className="card kpi">
      <div className="kpi-top">
        <div>
          <p className="kpi-label">{label}</p>
          <p className="kpi-value">{value}</p>
        </div>
        <span className={`kpi-icon tint-${tint}`} aria-hidden="true">
          <Icon size={20} />
        </span>
      </div>
      <div className="kpi-meta">
        <span className={`delta ${up ? 'delta-up' : 'delta-down'}`}>
          {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(delta).toFixed(1)}%
        </span>
        <span className="kpi-hint">vs previous 30 days</span>
      </div>
      {spark && (
        <div className="kpi-spark" aria-hidden="true">
          <Sparkline data={spark} color={sparkColor} />
        </div>
      )}
    </article>
  )
}
