import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { money } from '../../utils/format'

export default function RevenueAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b5ce2" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#5b5ce2" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          dy={8}
        />
        <YAxis
          tickFormatter={v => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          width={44}
        />
        <Tooltip content={<ChartTooltip formatter={money} />} cursor={{ stroke: 'var(--border)', strokeWidth: 1.5 }} />
        <Area
          type="monotone"
          name="Revenue"
          dataKey="revenue"
          stroke="#5b5ce2"
          strokeWidth={2.4}
          fill="url(#revFill)"
          activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--surface)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
