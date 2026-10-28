import { useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { CATEGORIES, ORDER_STATUSES, PAYMENT_METHODS } from '../../utils/constants'
import { todayStr } from '../../utils/format'

const EMPTY = {
  name: '',
  email: '',
  category: CATEGORIES[0],
  items: 1,
  amount: '',
  status: 'pending',
  payment: PAYMENT_METHODS[0],
  date: todayStr(),
}

export default function OrderFormModal({ open, order, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setErrors({})
    setSaving(false)
    setForm(
      order
        ? {
            name: order.customer.name,
            email: order.customer.email,
            category: order.category,
            items: order.items,
            amount: order.amount,
            status: order.status,
            payment: order.payment,
            date: order.date,
          }
        : EMPTY,
    )
  }, [open, order])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Customer name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email address'
    if (!form.amount || Number(form.amount) <= 0) next.amount = 'Amount must be greater than 0'
    if (Number(form.items) < 1) next.items = 'At least 1 item'
    if (!form.date) next.date = 'Pick a date'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async e => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({
        customer: { name: form.name.trim(), email: form.email.trim().toLowerCase() },
        category: form.category,
        items: Number(form.items),
        amount: Number(form.amount),
        status: form.status,
        payment: form.payment,
        date: form.date,
      })
    } finally {
      setSaving(false)
    }
  }

  const field = (key, label, node, full = false) => (
    <div className={`form-field${full ? ' full' : ''}`}>
      <label htmlFor={`of-${key}`}>{label}</label>
      {node}
      {errors[key] && <span className="field-error">{errors[key]}</span>}
    </div>
  )

  const invalid = key => (errors[key] ? ' invalid' : '')

  return (
    <Modal open={open} title={order ? 'Edit order' : 'New order'} onClose={onClose} width={580}>
      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          {field(
            'name',
            'Customer name',
            <input
              id="of-name"
              className={`input${invalid('name')}`}
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Ayesha Khan"
              autoFocus
            />,
          )}
          {field(
            'email',
            'Email',
            <input
              id="of-email"
              type="email"
              className={`input${invalid('email')}`}
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="customer@mail.com"
            />,
          )}
          {field(
            'category',
            'Category',
            <select id="of-category" className="select" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>,
          )}
          {field(
            'payment',
            'Payment method',
            <select id="of-payment" className="select" value={form.payment} onChange={e => set('payment', e.target.value)}>
              {PAYMENT_METHODS.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>,
          )}
          {field(
            'items',
            'Items',
            <input
              id="of-items"
              type="number"
              min="1"
              className={`input${invalid('items')}`}
              value={form.items}
              onChange={e => set('items', e.target.value)}
            />,
          )}
          {field(
            'amount',
            'Amount (Rs)',
            <input
              id="of-amount"
              type="number"
              min="0"
              step="any"
              className={`input${invalid('amount')}`}
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0"
            />,
          )}
          {field(
            'status',
            'Status',
            <select id="of-status" className="select" value={form.status} onChange={e => set('status', e.target.value)}>
              {ORDER_STATUSES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>,
          )}
          {field(
            'date',
            'Order date',
            <input
              id="of-date"
              type="date"
              className={`input${invalid('date')}`}
              value={form.date}
              onChange={e => set('date', e.target.value)}
            />,
          )}
        </div>

        <div className="modal-foot" style={{ borderTop: 'none', padding: '20px 0 0' }}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {order ? 'Save changes' : 'Create order'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
