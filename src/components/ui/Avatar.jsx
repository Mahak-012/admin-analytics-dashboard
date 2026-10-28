import { initials } from '../../utils/format'
import { avatarGradient } from '../../utils/constants'

export default function Avatar({ name, email, size = '' }) {
  return (
    <span className={`avatar ${size}`} style={{ background: avatarGradient(email) }} aria-hidden="true">
      {initials(name)}
    </span>
  )
}
