import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

export default function SortTh({ field, sort, onSort, children, className = '' }) {
  const active = sort.field === field
  const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown

  return (
    <th
      className={className}
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <button type="button" className={`th-sort${active ? ' active' : ''}`} onClick={() => onSort(field)}>
        {children}
        <Icon size={12} className="th-icon" />
      </button>
    </th>
  )
}
