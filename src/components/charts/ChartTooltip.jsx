export default function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="chart-tip">
      <p className="chart-tip-label">{label}</p>
      {payload.map(point => (
        <p key={point.dataKey} className="chart-tip-row">
          <span className="dot" style={{ background: point.color || point.payload?.fill }} />
          <span>{point.name}</span>
          <strong>{formatter ? formatter(point.value) : point.value}</strong>
        </p>
      ))}
    </div>
  )
}
