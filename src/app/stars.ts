import type { Level } from '../types/level'

/** Umbral generoso: menos bloques que esto (con éxito) da 2★; con primer intento también, 3★. */
export function starBudgetBlocks(level: Level): number {
  const cells = level.targetPattern.filter((c) => c !== 'skip').length
  return Math.max(cells + 6, Math.ceil(cells * 1.35))
}

export function computeStars(
  ok: boolean,
  runAttemptIndex: number,
  blockCount: number,
  level: Level,
): 0 | 1 | 2 | 3 {
  if (!ok) return 0
  const budget = starBudgetBlocks(level)
  const thrifty = blockCount <= budget
  const firstTry = runAttemptIndex === 1
  if (firstTry && thrifty) return 3
  if (thrifty) return 2
  return 1
}
