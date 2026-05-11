import type { Locale } from '../i18n/messages'

import {
  LEARNING_TRACK_ORDER,
  type LearningLanguageId,
} from './learningTracks'

export type { LearningLanguageId }

const STORAGE_LANGS = 'codejump-learning-languages'
const STORAGE_SCREEN = 'codejump-screen'
const STORAGE_TRACK_PRACTICE_MODE = 'codejump-track-practice-mode'

/** Beginner: UI includes the “canvas” preview column; advanced: wider workspace without it. */
export type PracticeTrackMode = 'beginner' | 'advanced'

const ALLOWED = new Set<LearningLanguageId>(LEARNING_TRACK_ORDER)

export type AppScreen = 'hub' | 'learn' | 'practice'

function sanitizeLanguages(raw: unknown): LearningLanguageId[] {
  if (!Array.isArray(raw) || raw.length === 0) return ['blocks']
  const next = raw.filter((x): x is LearningLanguageId =>
    ALLOWED.has(x as LearningLanguageId),
  )
  if (next.length === 0) return ['blocks']
  /** Single-track selection: keep only the first saved id (migrates older multi-select storage). */
  return [next[0]!]
}

export function loadLearningLanguages(): LearningLanguageId[] {
  try {
    const raw = localStorage.getItem(STORAGE_LANGS)
    if (!raw) return ['blocks']
    return sanitizeLanguages(JSON.parse(raw) as unknown)
  } catch {
    return ['blocks']
  }
}

export function saveLearningLanguages(ids: LearningLanguageId[]): void {
  try {
    localStorage.setItem(STORAGE_LANGS, JSON.stringify(ids))
  } catch {
    /* ignore */
  }
}

export function loadScreen(): AppScreen {
  try {
    const raw = localStorage.getItem(STORAGE_SCREEN)
    if (raw === 'learn' || raw === 'practice') return raw
  } catch {
    /* ignore */
  }
  return 'hub'
}

export function saveScreen(screen: AppScreen): void {
  try {
    localStorage.setItem(STORAGE_SCREEN, screen)
  } catch {
    /* ignore */
  }
}

export function loadTrackPracticeModes(): Partial<Record<LearningLanguageId, PracticeTrackMode>> {
  try {
    const raw = localStorage.getItem(STORAGE_TRACK_PRACTICE_MODE)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const out: Partial<Record<LearningLanguageId, PracticeTrackMode>> = {}
    for (const id of ALLOWED) {
      const v = parsed[id]
      if (v === 'beginner' || v === 'advanced') out[id] = v
    }
    return out
  } catch {
    return {}
  }
}

export function getTrackPracticeMode(lang: LearningLanguageId): PracticeTrackMode {
  return loadTrackPracticeModes()[lang] ?? 'beginner'
}

export function saveTrackPracticeMode(lang: LearningLanguageId, mode: PracticeTrackMode): void {
  try {
    const next = { ...loadTrackPracticeModes(), [lang]: mode }
    localStorage.setItem(STORAGE_TRACK_PRACTICE_MODE, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

/** Chapter title by locale (lesson stories stay Spanish in content until localized). */
export function chapterTitleForLocale(
  titleEs: string,
  titlesEn: readonly string[],
  chapterIndex: number,
  locale: Locale,
): string {
  if (locale === 'es') return titleEs
  return titlesEn[chapterIndex] ?? titleEs
}
