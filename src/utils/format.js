const pkr = new Intl.NumberFormat('en-PK')
const compactFmt = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })

export function money(value) {
  return `Rs ${pkr.format(Math.round(value))}`
}

export function moneyCompact(value) {
  if (Math.abs(value) >= 1000) return `Rs ${compactFmt.format(value)}`
  return money(value)
}

export function compact(value) {
  return compactFmt.format(value)
}

export function shortDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}
