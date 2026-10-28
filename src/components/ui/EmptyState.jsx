import { Inbox } from 'lucide-react'
import Button from './Button'

export default function EmptyState({ title = 'Nothing here', message, actionLabel, onAction, icon: Icon = Inbox }) {
  return (
    <div className="state">
      <div className="state-icon empty">
        <Icon size={26} />
      </div>
      <p className="state-title">{title}</p>
      {message && <p className="state-text">{message}</p>}
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
