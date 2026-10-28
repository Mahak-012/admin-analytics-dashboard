import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { CATEGORY_COLORS, CATEGORY_SHORT } from '../../utils/constants'

export default function CategoryBarChart({ data }) {
  const rows = data.map(d => ({ ...d, short: CATEGORY_SHORT[d.name] || d.name }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="short"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          dy={8}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted)', fontSize: 12 }}
          width={34}
        />
        <Tooltip content={<ChartTooltip formatter={v => `${v} orders`} />} cursor={{ fill: 'var(--surface-2)' }} />
        <Bar name="Orders" dataKey="orders" radius={[7, 7, 0, 0]} maxBarSize={46}>
          {rows.map(row => (
            <Cell key={row.name} fill={CATEGORY_COLORS[row.name]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
