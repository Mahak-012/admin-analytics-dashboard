import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page notfound">
      <div>
        <p className="notfound-code">404</p>
        <h2>Page not found</h2>
        <p>The page you are looking for does not exist or was moved.</p>
        <Link className="btn btn-primary" to="/">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
