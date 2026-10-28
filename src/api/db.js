import { PAYMENT_METHODS } from '../utils/constants'

const STORAGE_KEY = 'novaadmin.orders.v1'

const CUSTOMERS = [
  ['Ayesha Khan', 'ayesha.khan@gmail.com'],
  ['Hamza Sheikh', 'hamza.sheikh@gmail.com'],
  ['Zara Malik', 'zara.malik@outlook.com'],
  ['Bilal Ahmed', 'bilal.ahmed@gmail.com'],
  ['Fatima Noor', 'fatima.noor@yahoo.com'],
  ['Usman Tariq', 'usman.tariq@gmail.com'],
  ['Mahira Aslam', 'mahira.aslam@outlook.com'],
  ['Daniyal Raza', 'daniyal.raza@gmail.com'],
  ['Sana Iqbal', 'sana.iqbal@yahoo.com'],
  ['Omar Farooq', 'omar.farooq@gmail.com'],
  ['Hira Shahid', 'hira.shahid@outlook.com'],
  ['Ahmed Zafar', 'ahmed.zafar@gmail.com'],
  ['Noor Batool', 'noor.batool@gmail.com'],
  ['Hassan Javed', 'hassan.javed@yahoo.com'],
]

const CATEGORY_WEIGHTS = [
  ['Electronics', 0.24, 8500, 96000],
  ['Fashion', 0.26, 1800, 24000],
  ['Home & Living', 0.2, 2500, 45000],
  ['Beauty', 0.16, 1200, 15000],
  ['Sports', 0.14, 3000, 38000],
]

const STATUS_WEIGHTS = [
  ['completed', 0.54],
  ['processing', 0.18],
  ['pending', 0.15],
  ['cancelled', 0.13],
]

// seeded PRNG so the demo numbers stay consistent between reloads
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function weightedPick(rand, table) {
  const roll = rand()
  let acc = 0
  for (const row of table) {
    acc += row[1]
    if (roll <= acc) return row
  }
  return table[table.length - 1]
}

function generateOrders() {
  const rand = mulberry32(20261)
  const DAY = 86400000
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const orders = []

  for (let i = 0; i < 58; i++) {
    const [name, email] = CUSTOMERS[Math.floor(rand() * CUSTOMERS.length)]
    const cat = weightedPick(rand, CATEGORY_WEIGHTS)
    const status = weightedPick(rand, STATUS_WEIGHTS)[0]
    const amount = Math.round((cat[2] + rand() * (cat[3] - cat[2])) / 50) * 50
    const daysAgo = Math.floor(rand() * rand() * 240)
    const date = new Date(today.getTime() - daysAgo * DAY).toISOString().slice(0, 10)

    orders.push({
      id: '',
      customer: { name, email },
      date,
      category: cat[0],
      items: 1 + Math.floor(rand() * 4),
      amount,
      status,
      payment: PAYMENT_METHODS[Math.floor(rand() * PAYMENT_METHODS.length)],
    })
  }

  orders.sort((a, b) => (a.date < b.date ? -1 : 1))
  orders.forEach((o, i) => {
    o.id = `ORD-${1001 + i}`
  })
  return orders.reverse()
}

let memory = null

function toPublic(o) {
  return { ...o, customer: { ...o.customer } }
}

export function getOrders() {
  if (memory) return memory.map(toPublic)

  const raw = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  })()

  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) {
        memory = parsed
        return memory.map(toPublic)
      }
    } catch {
      /* corrupt storage, reseed below */
    }
  }

  memory = generateOrders()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory))
  } catch {
    /* private browsing, stay in memory */
  }
  return memory.map(toPublic)
}

export function saveOrders(orders) {
  memory = orders
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch {
    /* ignore */
  }
  return orders.map(toPublic)
}

export function nextOrderId() {
  const nums = getOrders().map(o => Number(o.id.split('-')[1]) || 0)
  return `ORD-${Math.max(1000, ...nums) + 1}`
}
