const store = new Map<string, { count: number; resetAt: number }>()

// Cleanup expired entries every 60s
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 60_000).unref?.() // unref to not block process exit

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): { ok: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: maxRequests - 1 }
  }

  entry.count++
  const remaining = maxRequests - entry.count
  return { ok: remaining >= 0, remaining: Math.max(0, remaining) }
}
