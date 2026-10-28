import { useId } from 'react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

export default function Sparkline({ data, color = '#5b5ce2' }) {
  const gid = useId().replace(/:/g, '')
  const points = data.map((v, i) => ({ i, v }))

  return (
    <ResponsiveContainer width="100%" height={46}>
      <AreaChart data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${gid})`} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
