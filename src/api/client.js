export class ApiError extends Error {
  constructor(message, status = 500) {
    super(message)
    this.status = status
  }
}

const OFFLINE_KEY = 'novaadmin.offline'
const LATENCY = [350, 850]

export function isOffline() {
  try {
    return localStorage.getItem(OFFLINE_KEY) === 'true'
  } catch {
    return false
  }
}

export function setOfflineMode(value) {
  try {
    localStorage.setItem(OFFLINE_KEY, String(value))
  } catch {
    /* ignore */
  }
}

// fake network layer: random latency plus a kill switch (the API chip in the
// header) so the error states can be demoed without actually breaking anything
export function request(handler) {
  return new Promise((resolve, reject) => {
    const [min, max] = LATENCY
    const delay = min + Math.random() * (max - min)

    setTimeout(() => {
      if (isOffline()) {
        reject(new ApiError('Cannot reach the server. Please check your connection and try again.'))
        return
      }
      try {
        resolve(handler())
      } catch (err) {
        reject(err instanceof ApiError ? err : new ApiError('Something went wrong while processing the request.'))
      }
    }, delay)
  })
}
