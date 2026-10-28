import { Eye, Pencil, Trash2 } from 'lucide-react'
import SortTh from '../ui/SortTh'
import Badge from '../ui/Badge'
import Avatar from '../ui/Avatar'
import { money, shortDate } from '../../utils/format'
import { CATEGORY_COLORS } from '../../utils/constants'

export default function OrdersTable({ rows, sort, onSort, onView, onEdit, onDelete, loading }) {
  return (
    <div className="table-scroll">
      <table className="table">
        <thead>
          <tr>
            <th>Order</th>
            <SortTh field="date" sort={sort} onSort={onSort}>
              Date
            </SortTh>
            <SortTh field="customer" sort={sort} onSort={onSort}>
              Customer
            </SortTh>
            <th>Category</th>
            <th className="col-items">Items</th>
            <th className="col-payment">Payment</th>
            <SortTh field="amount" sort={sort} onSort={onSort} className="th-amount">
              Amount
            </SortTh>
            <th>Status</th>
            <th>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 9 }).map((__, j) => (
                    <td key={j}>
                      <span className="skeleton" style={{ width: `${55 + ((i * 17 + j * 29) % 35)}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map(o => (
                <tr key={o.id}>
                  <td className="cell-id">{o.id}</td>
                  <td className="cell-date">{shortDate(o.date)}</td>
                  <td>
                    <div className="row-customer">
                      <Avatar name={o.customer.name} email={o.customer.email} size="avatar-sm" />
                      <div>
                        <div className="rc-name">{o.customer.name}</div>
                        <div className="rc-email">{o.customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="cat-cell">
                      <span className="cat-dot" style={{ background: CATEGORY_COLORS[o.category] }} />
                      {o.category}
                    </span>
                  </td>
                  <td className="col-items">{o.items}</td>
                  <td className="col-payment">{o.payment}</td>
                  <td className="td-amount">{money(o.amount)}</td>
                  <td>
                    <Badge status={o.status} />
                  </td>
                  <td className="td-actions">
                    <button type="button" className="icon-btn" onClick={() => onView(o)} aria-label={`View order ${o.id}`}>
                      <Eye size={15} />
                    </button>
                    <button type="button" className="icon-btn" onClick={() => onEdit(o)} aria-label={`Edit order ${o.id}`}>
                      <Pencil size={15} />
                    </button>
                    <button type="button" className="icon-btn danger" onClick={() => onDelete(o)} aria-label={`Delete order ${o.id}`}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}
