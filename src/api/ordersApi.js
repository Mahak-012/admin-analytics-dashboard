import { ApiError, request } from './client'
import { getOrders, saveOrders, nextOrderId } from './db'

export function fetchOrders() {
  return request(() => getOrders())
}

export function createOrder(payload) {
  return request(() => {
    const order = { ...payload, id: nextOrderId() }
    saveOrders([order, ...getOrders()])
    return order
  })
}

export function updateOrder(id, changes) {
  return request(() => {
    const orders = getOrders()
    const idx = orders.findIndex(o => o.id === id)
    if (idx === -1) throw new ApiError(`Order ${id} was not found.`, 404)

    const updated = { ...orders[idx], ...changes, id }
    orders[idx] = updated
    saveOrders(orders)
    return updated
  })
}

export function deleteOrder(id) {
  return request(() => {
    const orders = getOrders()
    if (!orders.some(o => o.id === id)) throw new ApiError(`Order ${id} was not found.`, 404)
    saveOrders(orders.filter(o => o.id !== id))
    return { id }
  })
}
