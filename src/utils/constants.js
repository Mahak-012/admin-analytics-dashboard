export const APP_NAME = import.meta.env.VITE_APP_NAME || 'NovaAdmin'

export const CURRENT_USER = {
  name: 'Mehak',
  role: 'Administrator',
}

export const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports']

export const PAYMENT_METHODS = ['Card', 'Cash on delivery', 'Wallet']

export const ORDER_STATUSES = ['completed', 'processing', 'pending', 'cancelled']

export const CATEGORY_SHORT = {
  'Home & Living': 'Home',
}

export const CATEGORY_COLORS = {
  Electronics: '#6366f1',
  Fashion: '#f59e0b',
  'Home & Living': '#10b981',
  Beauty: '#ec4899',
  Sports: '#0ea5e9',
}

export const STATUS_COLORS = {
  completed: '#10b981',
  processing: '#6366f1',
  pending: '#f59e0b',
  cancelled: '#ef4444',
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #a855f7)',
  'linear-gradient(135deg, #f59e0b, #f97316)',
  'linear-gradient(135deg, #10b981, #14b8a6)',
  'linear-gradient(135deg, #ec4899, #f43f5e)',
  'linear-gradient(135deg, #0ea5e9, #6366f1)',
  'linear-gradient(135deg, #8b5cf6, #d946ef)',
]

export function avatarGradient(email) {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = (hash * 31 + email.charCodeAt(i)) >>> 0
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length]
}
