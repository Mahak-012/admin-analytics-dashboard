import { Loader2 } from 'lucide-react'

export default function Button({ variant = 'primary', icon: Icon, loading, children, className = '', ...rest }) {
  return (
    <button className={`btn btn-${variant} ${className}`} disabled={loading || rest.disabled} {...rest}>
      {loading ? <Loader2 size={16} className="spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  )
}
