import { CATEGORIES, ORDER_STATUSES } from './constants'

const DAY = 86400000
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function monthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function monthlySeries(orders, months = 8) {
  const now = new Date()
  const buckets = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({ key: monthKey(d), label: MONTHS[d.getMonth()], revenue: 0, orders: 0, paid: 0, emails: new Set() })
  }
  const byKey = new Map(buckets.map(b => [b.key, b]))

  for (const o of orders) {
    const b = byKey.get(monthKey(new Date(o.date)))
    if (!b) continue
    b.orders += 1
    if (o.status !== 'cancelled') {
      b.revenue += o.amount
      b.paid += 1
    }
    b.emails.add(o.customer.email)
  }

  return buckets.map(({ key, label, revenue, orders, paid, emails }) => ({
    key,
    label,
    revenue,
    orders,
    actives: emails.size,
    aov: paid ? Math.round(revenue / paid) : 0,
  }))
}

export function kpiSummary(orders) {
  const now = Date.now()
  const inRange = (o, from, to) => {
    const t = new Date(o.date).getTime()
    return t > from && t <= to + DAY
  }

  const cur = orders.filter(o => inRange(o, now - 30 * DAY, now))
  const prev = orders.filter(o => inRange(o, now - 60 * DAY, now - 30 * DAY))

  const paid = list => list.filter(o => o.status !== 'cancelled')
  const sum = list => paid(list).reduce((s, o) => s + o.amount, 0)

  const revenue = sum(cur)
  const prevRevenue = sum(prev)
  const aov = cur.length ? revenue / cur.length : 0
  const prevAov = prev.length ? prevRevenue / prev.length : 0
  const customers = new Set(cur.map(o => o.customer.email)).size
  const prevCustomers = new Set(prev.map(o => o.customer.email)).size

  const delta = (value, base) => (base ? ((value - base) / base) * 100 : value ? 100 : 0)

  return {
    revenue: { value: revenue, delta: delta(revenue, prevRevenue) },
    orders: { value: cur.length, delta: delta(cur.length, prev.length) },
    customers: { value: customers, delta: delta(customers, prevCustomers) },
    aov: { value: aov, delta: delta(aov, prevAov) },
  }
}

export function categoryBreakdown(orders) {
  return CATEGORIES.map(name => {
    const list = orders.filter(o => o.category === name)
    const revenue = list.reduce((s, o) => s + (o.status === 'cancelled' ? 0 : o.amount), 0)
    return { name, orders: list.length, revenue }
  }).sort((a, b) => b.orders - a.orders)
}

export function statusBreakdown(orders) {
  return ORDER_STATUSES.map(status => ({
    status,
    count: orders.filter(o => o.status === status).length,
  }))
}

export function recentOrders(orders, count = 6) {
  return [...orders].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, count)
}
