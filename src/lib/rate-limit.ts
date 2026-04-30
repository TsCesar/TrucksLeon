const map = new Map<string, { count: number; resetAt: number }>()

const MAX = 5          // requests per window
const WINDOW_MS = 60_000 // 1 minute

export function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = map.get(ip)

  if (!entry || now > entry.resetAt) {
    map.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX - 1 }
  }

  if (entry.count >= MAX) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: MAX - entry.count }
}
