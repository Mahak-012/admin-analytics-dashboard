export default function Badge({ status }) {
  return <span className={`badge badge-${String(status).toLowerCase()}`}>{status}</span>
}
