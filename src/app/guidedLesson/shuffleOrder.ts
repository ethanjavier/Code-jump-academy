/** Deterministic shuffle for exercise line order (Fisher–Yates with string seed). */
export function shuffledOrder(n: number, seed: string): number[] {
  const arr = Array.from({ length: n }, (_, i) => i)
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  for (let i = n - 1; i > 0; i -= 1) {
    h = Math.imul(h, 1103515245) + 12345
    const j = h >>> 0
    const k = j % (i + 1)
    ;[arr[i], arr[k]] = [arr[k]!, arr[i]!]
  }
  return arr
}

export function distinctShuffle(n: number, seed: string, avoid: readonly number[]): number[] {
  let s = seed
  let guard = 0
  while (guard < 80) {
    const next = shuffledOrder(n, s)
    if (JSON.stringify(next) !== JSON.stringify(avoid)) return next
    s += `\0${guard}`
    guard += 1
  }
  return shuffledOrder(n, seed + '-fallback')
}
