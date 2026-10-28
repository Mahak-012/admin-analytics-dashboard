import { useCallback, useEffect, useState } from 'react'
import { fetchCustomers } from '../api/customersApi'

export default function useCustomers() {
  const [customers, setCustomers] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      setCustomers(await fetchCustomers())
      setStatus('ready')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { customers, status, error, reload: load }
}
