import { useCallback, useEffect, useState } from 'react'
import { fetchOrders, createOrder, updateOrder, deleteOrder } from '../api/ordersApi'

export default function useOrders() {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      setOrders(await fetchOrders())
      setStatus('ready')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const create = async payload => {
    const order = await createOrder(payload)
    setOrders(prev => [order, ...prev])
    return order
  }

  const update = async (id, changes) => {
    const updated = await updateOrder(id, changes)
    setOrders(prev => prev.map(o => (o.id === id ? updated : o)))
    return updated
  }

  const remove = async id => {
    await deleteOrder(id)
    setOrders(prev => prev.filter(o => o.id !== id))
  }

  return { orders, status, error, reload: load, create, update, remove }
}
