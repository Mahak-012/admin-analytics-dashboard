import { Search } from 'lucide-react'
import { CATEGORIES, ORDER_STATUSES } from '../../utils/constants'

export default function OrdersToolbar({
  query,
  onQuery,
  status,
  onStatus,
  category,
  onCategory,
  from,
  onFrom,
  to,
  onTo,
  onReset,
}) {
  const hasFilters = query || status !== 'all' || category !== 'all' || from || to

  return (
    <div className="toolbar">
      <div className="search-box">
        <Search size={16} />
        <input
          className="input"
          type="search"
          placeholder="Search by order ID, customer or category…"
          value={query}
          onChange={e => onQuery(e.target.value)}
          aria-label="Search orders"
        />
      </div>

      <select className="select" value={status} onChange={e => onStatus(e.target.value)} aria-label="Filter by status">
        <option value="all">All statuses</option>
        {ORDER_STATUSES.map(s => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select className="select" value={category} onChange={e => onCategory(e.target.value)} aria-label="Filter by category">
        <option value="all">All categories</option>
        {CATEGORIES.map(c => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <input className="input input-date" type="date" value={from} onChange={e => onFrom(e.target.value)} aria-label="From date" />
      <input className="input input-date" type="date" value={to} onChange={e => onTo(e.target.value)} aria-label="To date" />

      {hasFilters && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>
          Reset
        </button>
      )}
    </div>
  )
}
