import { ServerCrash } from 'lucide-react'
import Button from './Button'

export default function ErrorState({ title = 'Something went wrong', message, onRetry, fullPage = false }) {
  return (
    <div className={`state${fullPage ? ' state-page' : ''}`}>
      <div className="state-icon error">
        <ServerCrash size={26} />
      </div>
      <p className="state-title">{title}</p>
      {message && <p className="state-text">{message}</p>}
      {onRetry && (
        <Button onClick={onRetry} variant="danger">
          Try again
        </Button>
      )}
    </div>
  )
}
