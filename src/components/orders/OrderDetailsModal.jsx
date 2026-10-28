import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Avatar from '../ui/Avatar'
import { money, shortDate } from '../../utils/format'

export default function OrderDetailsModal({ open, order, onClose, onEdit }) {
  if (!order) return null

  return (
    <Modal
      open={open}
      title={`Order ${order.id}`}
      onClose={onClose}
      width={520}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onEdit(order)}>Edit order</Button>
        </>
      }
    >
      <div className="details-customer">
        <Avatar name={order.customer.name} email={order.customer.email} size="avatar-lg" />
        <div>
          <p>{order.customer.name}</p>
          <span>{order.customer.email}</span>
        </div>
        <span style={{ marginLeft: 'auto' }}>
          <Badge status={order.status} />
        </span>
      </div>

      <div className="details-grid">
        <div>
          <p className="dt">Order date</p>
          <p className="dd">{shortDate(order.date)}</p>
        </div>
        <div>
          <p className="dt">Category</p>
          <p className="dd">{order.category}</p>
        </div>
        <div>
          <p className="dt">Items</p>
          <p className="dd">{order.items}</p>
        </div>
        <div>
          <p className="dt">Payment</p>
          <p className="dd">{order.payment}</p>
        </div>
        <div>
          <p className="dt">Amount</p>
          <p className="dd big">{money(order.amount)}</p>
        </div>
        <div>
          <p className="dt">Order ID</p>
          <p className="dd">{order.id}</p>
        </div>
      </div>
    </Modal>
  )
}
