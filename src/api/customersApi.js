import { request } from './client'
import { getOrders } from './db'

export function fetchCustomers() {
  return request(() => {
    const map = new Map()

    for (const o of getOrders()) {
      const key = o.customer.email.toLowerCase()
      if (!map.has(key)) {
        map.set(key, { name: o.customer.name, email: o.customer.email, orders: 0, spent: 0, lastOrder: '' })
      }
      const c = map.get(key)
      c.orders += 1
      if (o.status !== 'cancelled') c.spent += o.amount
      if (o.date > c.lastOrder) c.lastOrder = o.date
    }

    return [...map.values()].sort((a, b) => b.spent - a.spent)
  })
}
