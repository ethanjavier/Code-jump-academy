/**
 * SPA query contract (History API, `replaceState`):
 * - `screen=hub` | `learn` | `practice` — top-level app view (see `App.tsx`).
 *
 * **Practice** (`screen=practice`):
 * - `lang` — track id (e.g. `typescript`, `python`; not `blocks`). Must match a language in the user’s hub selection.
 * - `pmode=beginner` | `advanced` — persisted for that track.
 * - `lesson=0` — 0-based guided lesson index (requires `lang`). Opens the lesson runner.
 * - `quiz=0` — 0-based quiz module (requires `lang`). Opens a quiz session.
 * - `overview=1` — practice overview only; skips auto-opening lesson 0 for beginners.
 *
 * Examples:
 * - `?screen=practice&lang=typescript&pmode=beginner&lesson=0`
 * - `?screen=practice&lang=typescript&pmode=advanced&overview=1`
 * - `?screen=learn` — block puzzle campaign (default).
 * - `?screen=learn&lang=javascript&pmode=beginner&lesson=0` — same Learn shell (header, XP bar), main area shows **guided lessons** for that language instead of the block puzzle.
 */

import type { AppScreen, PracticeTrackMode } from './learningPreferences'
import {
  LEARNING_TRACK_ORDER,
  hasLanguagePractice,
  type LearningLanguageId,
} from './learningTracks'

export type PracticeDeepLink = {
  lang?: LearningLanguageId
  pmode?: PracticeTrackMode
  /** 0-based guided lesson index; opens guided runner when set together with lang. */
  lesson?: number
  /** 0-based quiz module index. */
  quiz?: number
  /** When true, practice overview only — no auto-open of first guided lesson. */
  overview?: boolean
}

const SCREEN_KEYS = new Set<AppScreen>(['hub', 'learn', 'practice'])

export function isEligiblePracticeLang(id: string): id is LearningLanguageId {
  return LEARNING_TRACK_ORDER.includes(id as LearningLanguageId) && hasLanguagePractice(id as LearningLanguageId)
}

function parseNonNegInt(raw: string | null): number | undefined {
  if (raw === null || raw === '') return undefined
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 0) return undefined
  return n
}

/** Reads `screen` and optional practice deep-link fields from a query string. */
export function parseAppUrl(search: string): {
  screen: AppScreen | null
  practice: PracticeDeepLink | null
} {
  let screen: AppScreen | null = null
  let params: URLSearchParams
  try {
    params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`)
  } catch {
    return { screen: null, practice: null }
  }

  const rawScreen = params.get('screen')
  if (rawScreen && SCREEN_KEYS.has(rawScreen as AppScreen)) {
    screen = rawScreen as AppScreen
  }

  const langRaw = params.get('lang')
  const lang = langRaw && isEligiblePracticeLang(langRaw) ? langRaw : undefined

  const pmodeRaw = params.get('pmode')
  const pmode =
    pmodeRaw === 'beginner' || pmodeRaw === 'advanced' ? pmodeRaw : undefined

  const lesson = parseNonNegInt(params.get('lesson'))
  const quiz = parseNonNegInt(params.get('quiz'))
  const overview =
    params.get('overview') === '1' ||
    params.get('overview') === 'true' ||
    params.get('view') === 'overview'

  const deep: PracticeDeepLink = {}
  if (lang) deep.lang = lang
  if (pmode) deep.pmode = pmode
  if (lang && lesson !== undefined) deep.lesson = lesson
  if (lang && quiz !== undefined) deep.quiz = quiz
  if (overview) deep.overview = true

  const practice = Object.keys(deep).length > 0 ? deep : null

  return { screen, practice }
}

/** Builds query string (without leading `?`) for history updates. */
export function serializeAppUrl(screen: AppScreen, practice?: PracticeDeepLink | null): string {
  const params = new URLSearchParams()
  params.set('screen', screen)

  if (practice?.lang) params.set('lang', practice.lang)
  if (practice?.pmode) params.set('pmode', practice.pmode)

  if (practice?.lesson !== undefined) params.set('lesson', String(practice.lesson))
  if (practice?.quiz !== undefined) params.set('quiz', String(practice.quiz))
  if (practice?.overview) params.set('overview', '1')

  return params.toString()
}

export function replaceUrlSearch(serializedQuery: string): void {
  const url = new URL(window.location.href)
  url.search = serializedQuery ? `?${serializedQuery}` : ''
  window.history.replaceState(window.history.state, '', url.toString())
}
