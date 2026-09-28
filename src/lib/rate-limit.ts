/**
 * Per-process, best-effort throttle for the contact form.
 *
 * READ THIS BEFORE RELYING ON IT.
 *
 * The counters live in this process's memory. That means:
 *
 *   - On a single long-running Node server (`npm start`, one container, one
 *     PM2 process) it works as intended: five submissions per minute per
 *     client address.
 *   - Behind a load balancer with several instances, each instance counts
 *     separately, so the effective limit is 5 x instances.
 *   - On serverless or per-request isolates the memory is not shared and may
 *     not survive between invocations, so it degrades towards no limit at all.
 *
 * It is therefore a speed bump against a naive script, NOT a distributed rate
 * limiter and not a defence against a determined attacker. The real protection
 * on this endpoint is server-side Zod validation, length caps and the honeypot.
 *
 * Deliberately no Redis/KV: that is infrastructure this project does not
 * otherwise need, and adding a datastore for one form would cost more than it
 * protects. If abuse ever becomes real, the fix is a shared store or a
 * provider-level rule — recorded in docs/production-deployment.md.
 *
 * The client address is used as a key for the length of the request and is
 * never stored, logged or written anywhere.
 */

const hits = new Map<string, { count: number; resetAt: number }>()

const MAX = 5 // submissions per window
const WINDOW_MS = 60_000 // 1 minute

/** Stops the map growing without bound on a long-lived process. */
function evictExpired(now: number) {
  if (hits.size < 1000) return
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) hits.delete(key)
  }
}

export function rateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  evictExpired(now)

  const entry = hits.get(key)

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX - 1 }
  }

  if (entry.count >= MAX) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: MAX - entry.count }
}
