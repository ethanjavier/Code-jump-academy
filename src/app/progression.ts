export const XP_SEGMENT = 100

export type GameProgress = {
  xp: number
  lessons: Record<string, { stars: 1 | 2 | 3 }>
}

const STORAGE_KEY = 'codejump-game-v1'

export function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { xp: 0, lessons: {} }
    const p = JSON.parse(raw) as GameProgress
    if (typeof p.xp !== 'number' || !Number.isFinite(p.xp)) {
      return { xp: 0, lessons: {} }
    }
    return { xp: Math.max(0, p.xp), lessons: p.lessons ?? {} }
  } catch {
    return { xp: 0, lessons: {} }
  }
}

export function saveProgress(state: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore quota */
  }
}

export function mergeWin(
  state: GameProgress,
  lessonKey: string,
  stars: 1 | 2 | 3,
): GameProgress {
  const xpAdd = 15 + stars * 12
  const prev = state.lessons[lessonKey]?.stars ?? 0
  const best = Math.max(prev, stars) as 1 | 2 | 3
  return {
    xp: state.xp + xpAdd,
    lessons: { ...state.lessons, [lessonKey]: { stars: best } },
  }
}

export function getXpBar(xp: number): {
  level: number
  segmentPercent: number
} {
  const inSegment = xp % XP_SEGMENT
  return {
    level: Math.floor(xp / XP_SEGMENT) + 1,
    segmentPercent: Math.round((inSegment / XP_SEGMENT) * 100),
  }
}
