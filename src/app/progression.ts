import { CAMPAIGN_CHAPTERS } from '../campaign/buildCampaign'

export const XP_SEGMENT = 100

export type GameProgress = {
  xp: number
  lessons: Record<string, { stars: 1 | 2 | 3 }>
  /** Posición en la campaña (persistida en localStorage) */
  chapterIndex: number
  puzzleIndex: number
}

const STORAGE_KEY = 'codejump-game-v1'

function normalizeProgress(p: Partial<GameProgress> | null | undefined): GameProgress {
  const xp =
    typeof p?.xp === 'number' && Number.isFinite(p.xp) ? Math.max(0, p.xp) : 0
  const lessons = p?.lessons ?? {}

  const nChapters = CAMPAIGN_CHAPTERS.length
  if (nChapters <= 0) {
    return { xp, lessons, chapterIndex: 0, puzzleIndex: 0 }
  }

  let ch =
    typeof p?.chapterIndex === 'number' && Number.isFinite(p.chapterIndex)
      ? Math.floor(p.chapterIndex)
      : 0
  ch = Math.max(0, Math.min(nChapters - 1, ch))

  const puzzlesInChapter = CAMPAIGN_CHAPTERS[ch]!.puzzles.length
  const maxP = Math.max(0, puzzlesInChapter - 1)

  let pi =
    typeof p?.puzzleIndex === 'number' && Number.isFinite(p.puzzleIndex)
      ? Math.floor(p.puzzleIndex)
      : 0
  pi = Math.max(0, Math.min(maxP, pi))

  return { xp, lessons, chapterIndex: ch, puzzleIndex: pi }
}

export function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return normalizeProgress({ xp: 0, lessons: {} })
    const p = JSON.parse(raw) as Partial<GameProgress>
    if (typeof p.xp !== 'number' || !Number.isFinite(p.xp)) {
      return normalizeProgress({ ...p, xp: 0 })
    }
    return normalizeProgress({ ...p, xp: Math.max(0, p.xp) })
  } catch {
    return normalizeProgress({ xp: 0, lessons: {} })
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
    ...state,
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
