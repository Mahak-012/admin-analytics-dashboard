import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { STATUS_COLORS } from '../../utils/constants'

export default function StatusDonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <>
      <div className="donut-wrap">
        <ResponsiveContainer width="100%" height={216}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius="63%"
              outerRadius="88%"
              paddingAngle={4}
              cornerRadius={6}
              stroke="none"
            >
              {data.map(d => (
                <Cell key={d.status} fill={STATUS_COLORS[d.status]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip formatter={v => `${v} orders`} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <strong>{total}</strong>
          <span>total orders</span>
        </div>
      </div>
      <div className="donut-legend">
        {data.map(d => (
          <div key={d.status} className="dl-row">
            <span className="dl-dot" style={{ background: STATUS_COLORS[d.status] }} />
            <span className="dl-name">{d.status}</span>
            <span className="dl-val">{d.count}</span>
            <span className="dl-pct">{total ? Math.round((d.count / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </>
  )
}
