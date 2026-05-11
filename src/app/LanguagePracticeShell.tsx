import { Button, Segmented, Tag } from 'antd'
import { motion } from 'framer-motion'
import { Blocks, BookOpenText, Code2, Globe, House, LayoutGrid } from 'lucide-react'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

import { getGuidedCourse, hasGuidedCourse } from '../courses/courseRegistry'
import { useI18n } from '../i18n/I18nContext'
import { GuidedLessonRunner } from './guidedLesson/GuidedLessonRunner'
import { iconStroke } from './icons'
import { LanguageQuizSession } from './LanguageQuizSession'
import { PRACTICE_MODULE_COUNT } from './languageQuizzes'
import {
  getTrackPracticeMode,
  loadLearningLanguages,
  loadTrackPracticeModes,
  saveTrackPracticeMode,
  type PracticeTrackMode,
} from './learningPreferences'
import {
  TRACK_ICONS,
  hasLanguagePractice,
  type LearningLanguageId,
} from './learningTracks'
import { MascotBubble } from './Mascot'

function UiLocaleSwitch({ compact }: { compact?: boolean }) {
  const { t, locale, setLocale } = useI18n()
  const btn =
    compact === true
      ? 'px-2 py-1 text-[10px] sm:px-2.5 sm:text-xs'
      : 'px-2.5 py-1.5 text-xs sm:min-w-[3rem]'
  return (
    <div
      className="flex shrink-0 items-center gap-1 rounded-lg border border-white/20 bg-slate-900/95 p-0.5 shadow-inner ring-1 ring-white/10 sm:gap-1.5"
      role="group"
      aria-label={t('practice.uiLanguageAria')}
    >
      <Globe className="size-3.5 shrink-0 text-indigo-300 max-sm:hidden" aria-hidden />
      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        className={`rounded-md font-display font-semibold transition ${btn} ${
          locale === 'en'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-100 hover:bg-white/10 hover:text-white'
        }`}
      >
        {t('locale.en')}
      </button>
      <button
        type="button"
        onClick={() => setLocale('es')}
        aria-pressed={locale === 'es'}
        className={`rounded-md font-display font-semibold transition ${btn} ${
          locale === 'es'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-100 hover:bg-white/10 hover:text-white'
        }`}
      >
        {t('locale.es')}
      </button>
    </div>
  )
}

/** Same proportions as `PuzzleWorkspace` in App.tsx — beginner mode includes canvas column. */
const PRACTICE_GRID_BEGINNER =
  'grid min-h-0 w-full flex-1 grid-cols-1 gap-4 overflow-hidden px-3 py-3 sm:px-4 sm:py-4 md:gap-5 md:px-5 md:py-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.72fr)_minmax(0,0.88fr)] lg:items-stretch lg:px-6 xl:px-8 lg:auto-rows-[minmax(0,1fr)]'

/** Wider center + palette when no canvas snapshots column. */
const PRACTICE_GRID_ADVANCED =
  'grid min-h-0 w-full flex-1 grid-cols-1 gap-4 overflow-hidden px-3 py-3 sm:px-4 sm:py-4 md:gap-5 md:px-5 md:py-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.82fr)_minmax(0,0.68fr)] lg:items-stretch lg:px-6 xl:px-8 lg:auto-rows-[minmax(0,1fr)]'

type RailProps = {
  langs: LearningLanguageId[]
  modeFor: (lang: LearningLanguageId) => PracticeTrackMode
}

function LanguageSideRail({ langs, side, modeFor }: RailProps & { side: 'left' | 'right' }) {
  const { t } = useI18n()
  if (langs.length === 0) return null
  return (
    <aside
      className={`pointer-events-none hidden w-[6.25rem] shrink-0 flex-col justify-center gap-2.5 border-white/[0.06] py-5 sm:w-[6.75rem] sm:gap-3 sm:py-6 md:flex ${
        side === 'left' ? 'border-r bg-gradient-to-r from-slate-950/90 to-transparent pr-1 pl-2' : 'border-l bg-gradient-to-l from-slate-950/90 to-transparent pl-1 pr-2'
      }`}
      aria-hidden
    >
      {langs.map((lang) => {
        const Icon = TRACK_ICONS[lang]
        const beginner = modeFor(lang) === 'beginner'
        return (
          <div
            key={lang}
            className="rounded-xl border border-white/10 bg-slate-950/95 px-1.5 py-2 shadow-lg shadow-black/50 ring-1 ring-white/10 backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-slate-800/90 sm:size-9">
                <Icon className="size-3.5 text-violet-300 sm:size-4" strokeWidth={iconStroke.medium} aria-hidden />
              </div>
              <span className="line-clamp-3 max-w-full font-display text-[9px] font-semibold leading-snug text-white sm:text-[10px]">
                {t(`hub.track.${lang}.title`)}
              </span>
              <span
                className={`max-w-full truncate rounded-full px-1.5 py-0.5 font-display text-[8px] font-bold uppercase tracking-wide sm:text-[9px] ${
                  beginner
                    ? 'bg-teal-950/95 text-teal-100 ring-1 ring-teal-500/45'
                    : 'bg-slate-800/95 text-slate-200 ring-1 ring-slate-500/40'
                }`}
              >
                {beginner ? t('practice.modeBeginner') : t('practice.modeAdvanced')}
              </span>
            </div>
          </div>
        )
      })}
    </aside>
  )
}

function PracticeOverviewWithRails({
  langs,
  modeFor,
  gridClassName,
  children,
}: RailProps & { gridClassName: string; children: ReactNode }) {
  const { t } = useI18n()
  const mid = Math.ceil(langs.length / 2)
  const left = langs.slice(0, mid)
  const right = langs.slice(mid)
  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden">
      <LanguageSideRail langs={left} side="left" modeFor={modeFor} />
      <div className="relative z-10 min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-[1] hidden overflow-visible md:block" aria-hidden>
          <div className="absolute left-1 top-3 max-w-[10rem] rounded-xl border border-indigo-500/25 bg-slate-950/85 px-2.5 py-2 text-[10px] leading-snug text-indigo-200/90 shadow-lg shadow-black/40 ring-1 ring-white/10 sm:left-2 sm:top-4 sm:max-w-[11rem] sm:text-[11px]">
            {t('practice.cornerInstructions')}
          </div>
          <div className="absolute right-1 top-3 max-w-[10rem] rounded-xl border border-teal-500/25 bg-slate-950/85 px-2.5 py-2 text-[10px] leading-snug text-teal-200/90 shadow-lg shadow-black/40 ring-1 ring-white/10 sm:right-2 sm:top-4 sm:max-w-[11rem] sm:text-[11px]">
            {t('practice.cornerWorkspace')}
          </div>
          <div className="absolute bottom-4 left-1 max-w-[10rem] rounded-xl border border-violet-500/25 bg-slate-950/85 px-2.5 py-2 text-[10px] leading-snug text-violet-200/90 shadow-lg shadow-black/40 ring-1 ring-white/10 sm:bottom-6 sm:left-3 sm:max-w-[11rem] sm:text-[11px]">
            {t('practice.cornerPalette')}
          </div>
          <div className="absolute bottom-4 right-1 max-w-[10rem] rounded-xl border border-amber-500/25 bg-slate-950/85 px-2.5 py-2 text-[10px] leading-snug text-amber-200/90 shadow-lg shadow-black/40 ring-1 ring-white/10 sm:bottom-6 sm:right-3 sm:max-w-[11rem] sm:text-[11px]">
            {t('practice.cornerTip')}
          </div>
        </div>
        <div className={gridClassName}>{children}</div>
      </div>
      <LanguageSideRail langs={right} side="right" modeFor={modeFor} />
    </div>
  )
}

type QuizSession = {
  lang: LearningLanguageId
  moduleIndex: number
}

type GuidedSession = {
  lang: LearningLanguageId
  lessonIndex: number
}

/** Skip the practice overview and open the first guided lesson for the selected track (beginner mode only). */
function tryInitialGuidedSession(): GuidedSession | null {
  const langs = loadLearningLanguages().filter((id): id is LearningLanguageId => hasLanguagePractice(id))
  if (langs.length === 0) return null
  const lang = langs[0]!
  if (getTrackPracticeMode(lang) !== 'beginner') return null
  if (!hasGuidedCourse(lang)) return null
  const course = getGuidedCourse(lang)
  if (!course?.lessons.length) return null
  return { lang, lessonIndex: 0 }
}

export function LanguagePracticeShell({ onHome }: { onHome: () => void }) {
  const { t, locale } = useI18n()
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null)
  const [guidedSession, setGuidedSession] = useState<GuidedSession | null>(tryInitialGuidedSession)
  const [trackModes, setTrackModes] = useState<Partial<Record<LearningLanguageId, PracticeTrackMode>>>(() =>
    loadTrackPracticeModes(),
  )

  const modeFor = (lang: LearningLanguageId) => trackModes[lang] ?? 'beginner'

  const practiceLangs = loadLearningLanguages().filter((id): id is LearningLanguageId =>
    hasLanguagePractice(id),
  )

  const showPracticeCanvas = practiceLangs.some((l) => modeFor(l) === 'beginner')
  const practiceGridClass = showPracticeCanvas ? PRACTICE_GRID_BEGINNER : PRACTICE_GRID_ADVANCED

  const setTrackMode = (lang: LearningLanguageId, mode: PracticeTrackMode) => {
    saveTrackPracticeMode(lang, mode)
    setTrackModes((prev) => ({ ...prev, [lang]: mode }))
  }

  const moduleIndices = useMemo(
    () => Array.from({ length: PRACTICE_MODULE_COUNT }, (_, i) => i),
    [],
  )

  const shellChrome = (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-950/85 via-slate-950 to-[#0b1020]"
        aria-hidden
      />
    </>
  )

  if (guidedSession) {
    const course = getGuidedCourse(guidedSession.lang)
    const lessonsLen = course?.lessons.length ?? 0
    const gMode = modeFor(guidedSession.lang)
    return (
      <div className="relative flex min-h-[100dvh] flex-1 flex-col overflow-hidden bg-slate-950 text-slate-100">
        {shellChrome}
        <header className="relative z-10 flex shrink-0 flex-wrap items-center gap-3 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <Button
            type="text"
            className="font-display font-semibold text-slate-300 hover:!bg-white/10 hover:!text-white"
            icon={<House className="size-4" strokeWidth={iconStroke.medium} aria-hidden />}
            onClick={onHome}
          >
            {t('nav.home')}
          </Button>
          <Button type="link" className="font-display text-slate-400 hover:!text-white" onClick={() => setGuidedSession(null)}>
            {t('practice.backToOverview')}
          </Button>
          <span className="font-display text-sm font-semibold text-white">
            {t(`hub.track.${guidedSession.lang}.title`)} ·{' '}
            {t('guided.lessonMeta', {
              current: String(guidedSession.lessonIndex + 1),
              total: String(lessonsLen),
            })}
          </span>
          <Tag color={gMode === 'beginner' ? 'cyan' : 'default'} className="m-0 font-display text-[11px] font-semibold">
            {gMode === 'beginner' ? t('practice.modeBeginner') : t('practice.modeAdvanced')}
          </Tag>
          <div className="ml-auto flex shrink-0">
            <UiLocaleSwitch />
          </div>
        </header>
        <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden px-2 py-3 sm:px-4 md:px-6 lg:px-8">
          <GuidedLessonRunner
            key={`${guidedSession.lang}-${guidedSession.lessonIndex}-${locale}-${modeFor(guidedSession.lang)}`}
            lang={guidedSession.lang}
            lessonIndex={guidedSession.lessonIndex}
            practiceMode={modeFor(guidedSession.lang)}
            onBack={() => setGuidedSession(null)}
            onLessonComplete={() => {}}
            hasNextLesson={guidedSession.lessonIndex + 1 < lessonsLen}
            hasPrevLesson={guidedSession.lessonIndex > 0}
            onPrevLesson={() =>
              setGuidedSession((s) =>
                s && s.lessonIndex > 0 ? { ...s, lessonIndex: s.lessonIndex - 1 } : s,
              )
            }
            onNextLesson={() =>
              setGuidedSession((s) =>
                s && s.lessonIndex + 1 < lessonsLen ? { ...s, lessonIndex: s.lessonIndex + 1 } : s,
              )
            }
            onGoToLesson={(index) =>
              setGuidedSession((s) => {
                if (!s) return s
                const len = getGuidedCourse(s.lang)?.lessons.length ?? 0
                if (index < 0 || index >= len) return s
                return { ...s, lessonIndex: index }
              })
            }
          />
        </main>
      </div>
    )
  }

  if (quizSession) {
    const quizShowCanvas = modeFor(quizSession.lang) === 'beginner'
    const quizGridClass = quizShowCanvas ? PRACTICE_GRID_BEGINNER : PRACTICE_GRID_ADVANCED
    const qMode = modeFor(quizSession.lang)
    return (
      <div className="relative flex min-h-[100dvh] flex-1 flex-col overflow-hidden bg-slate-950 text-slate-100">
        {shellChrome}
        <header className="relative z-10 flex shrink-0 flex-wrap items-center gap-3 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <Button
            type="text"
            className="font-display font-semibold text-slate-300 hover:!bg-white/10 hover:!text-white"
            icon={<House className="size-4" strokeWidth={iconStroke.medium} aria-hidden />}
            onClick={onHome}
          >
            {t('nav.home')}
          </Button>
          <Button type="link" className="font-display text-slate-400 hover:!text-white" onClick={() => setQuizSession(null)}>
            {t('practice.backToOverview')}
          </Button>
          <span className="font-display text-sm font-semibold text-white">
            {t(`hub.track.${quizSession.lang}.title`)} · {t('practice.moduleLabel', { num: String(quizSession.moduleIndex + 1) })}
          </span>
          <Tag color={qMode === 'beginner' ? 'cyan' : 'default'} className="m-0 font-display text-[11px] font-semibold">
            {qMode === 'beginner' ? t('practice.modeBeginner') : t('practice.modeAdvanced')}
          </Tag>
          <div className="ml-auto flex shrink-0">
            <UiLocaleSwitch />
          </div>
        </header>
        <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className={quizGridClass}>
            {/* Column 1: instructions + optional canvas hint */}
            <section className="flex min-h-0 min-w-0 flex-col gap-4 lg:min-h-0">
              <div className="shrink-0 rounded-2xl border border-indigo-500/25 bg-slate-900/70 p-4 shadow-xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm md:p-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
                    <BookOpenText className="size-5 shrink-0 text-amber-400" strokeWidth={iconStroke.soft} aria-hidden />
                    {t('workspace.instructions')}
                  </h2>
                  <Tag color="purple">{t(`hub.track.${quizSession.lang}.title`)}</Tag>
                </div>
                <p className="max-h-[min(40vh,18rem)] overflow-y-auto text-sm leading-snug text-slate-300">
                  {t('practice.quizInstructionsPanel')}
                </p>
              </div>
              {quizShowCanvas ? (
                <div className="flex min-h-[180px] min-w-0 flex-1 flex-col rounded-2xl border border-teal-500/20 bg-slate-900/60 p-4 shadow-xl shadow-black/25 ring-1 ring-teal-500/15 backdrop-blur-sm md:p-5 lg:min-h-0">
                  <div className="mb-3 flex shrink-0 items-center gap-2">
                    <LayoutGrid className="size-5 shrink-0 text-teal-400" strokeWidth={iconStroke.soft} aria-hidden />
                    <h2 className="font-display text-base font-semibold text-white">{t('workspace.canvas')}</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">{t('practice.quizCanvasHint')}</p>
                </div>
              ) : null}
            </section>

            {/* Column 2: quiz workspace */}
            <section className="flex min-h-0 min-w-0 flex-col overflow-hidden max-lg:min-h-[260px] lg:h-full">
              <motion.div className="flex min-h-0 h-full max-h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-indigo-500/25 bg-slate-900/75 p-3 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-500/20 backdrop-blur-sm md:p-4">
                <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
                    <Code2 className="size-5 shrink-0 text-indigo-400" strokeWidth={iconStroke.soft} aria-hidden />
                    {t('workspace.yourCode')}
                  </h2>
                </div>
                <div className="code-workspace-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 [scrollbar-gutter:stable]">
                  <LanguageQuizSession
                    lang={quizSession.lang}
                    moduleIndex={quizSession.moduleIndex}
                    onBack={() => setQuizSession(null)}
                  />
                </div>
              </motion.div>
            </section>

            {/* Column 3: palette / goals */}
            <section className="flex min-h-[200px] min-w-0 flex-col lg:min-h-0">
              <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-violet-500/25 bg-slate-900/70 p-4 shadow-xl shadow-violet-950/35 ring-1 ring-violet-500/15 backdrop-blur-sm md:p-5">
                <div className="mb-3 shrink-0 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
                    <Blocks className="size-5 shrink-0 text-violet-400" strokeWidth={iconStroke.soft} aria-hidden />
                    {t('workspace.palette')}
                  </h2>
                </div>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden pr-1 text-sm leading-relaxed text-slate-300">
                  <p>{t('practice.quizPaletteExplainer')}</p>
                  <p className="rounded-xl border border-white/10 bg-slate-950/40 p-3 text-xs text-slate-400">
                    {t('practice.modulesIntro')}
                  </p>
                </div>
              </div>
            </section>
          </div>
          <MascotBubble message={t('practice.quizMascotTip')} mood="neutral" visible />
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-1 flex-col overflow-hidden bg-slate-950 text-slate-100">
      {shellChrome}
      <header className="relative z-10 flex shrink-0 flex-wrap items-center gap-3 border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-md sm:px-8">
        <Button
          type="text"
          className="font-display font-semibold text-slate-300 hover:!bg-white/10 hover:!text-white"
          icon={<House className="size-4" strokeWidth={iconStroke.medium} aria-hidden />}
          onClick={onHome}
        >
          {t('nav.home')}
        </Button>
        {practiceLangs.length > 0 ? (
          <div className="ml-auto flex shrink-0">
            <UiLocaleSwitch />
          </div>
        ) : null}
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
        {practiceLangs.length === 0 ? (
          <div className="mx-auto max-w-lg flex-1 px-4 py-10">
            <p className="rounded-2xl border border-amber-500/30 bg-amber-950/25 px-4 py-3 text-sm text-amber-100">
              {t('practice.pickLanguagesOnHub')}
            </p>
          </div>
        ) : (
          <PracticeOverviewWithRails langs={practiceLangs} modeFor={modeFor} gridClassName={practiceGridClass}>
            {/* Column 1 — Instructions + optional canvas snapshot */}
            <section className="flex min-h-0 min-w-0 flex-col gap-4 lg:min-h-0">
              <div className="shrink-0 rounded-2xl border border-indigo-500/25 bg-slate-900/70 p-4 shadow-xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm md:p-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
                    <BookOpenText className="size-5 shrink-0 text-amber-400" strokeWidth={iconStroke.soft} aria-hidden />
                    {t('workspace.instructions')}
                  </h2>
                  <Tag color="purple">{t('practice.title')}</Tag>
                </div>
                <h1 className="font-display text-xl font-bold text-white">{t('practice.title')}</h1>
                <p className="mt-3 max-h-[min(36vh,14rem)] overflow-y-auto text-sm leading-snug text-slate-300">
                  {t('practice.subtitle')}
                </p>
              </div>

              {showPracticeCanvas ? (
                <div className="flex min-h-[200px] min-w-0 flex-1 flex-col rounded-2xl border border-teal-500/20 bg-slate-900/60 p-4 shadow-xl shadow-black/25 ring-1 ring-teal-500/15 backdrop-blur-sm md:p-5 lg:min-h-0">
                  <div className="mb-3 flex shrink-0 items-center gap-2">
                    <LayoutGrid className="size-5 shrink-0 text-teal-400" strokeWidth={iconStroke.soft} aria-hidden />
                    <h2 className="font-display text-base font-semibold text-white">{t('workspace.canvas')}</h2>
                  </div>
                  <p className="mb-4 text-sm text-slate-400">{t('practice.overviewCanvasHint')}</p>
                  <div className="flex min-h-0 flex-1 flex-wrap content-start gap-3 overflow-y-auto">
                    {practiceLangs.map((lang) => {
                      const Icon = TRACK_ICONS[lang]
                      const gc = getGuidedCourse(lang)
                      const gCount = gc?.lessons.length ?? 0
                      return (
                        <div
                          key={`snap-${lang}`}
                          className="flex w-[calc(50%-0.375rem)] min-w-[8.5rem] flex-col gap-1.5 rounded-xl border border-white/10 bg-slate-950/50 p-3 sm:w-[calc(33.333%-0.5rem)]"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-800/90">
                              <Icon className="size-4 text-violet-300" strokeWidth={iconStroke.medium} aria-hidden />
                            </div>
                            <span className="font-display text-sm font-semibold text-white">{t(`hub.track.${lang}.title`)}</span>
                          </div>
                          <p className="text-[11px] leading-snug text-slate-500">
                            {t('practice.trackCounts', {
                              lessons: String(gCount),
                              quizzes: String(PRACTICE_MODULE_COUNT),
                            })}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </section>

            {/* Column 2 — same actions per language (guided + quizzes) */}
            <section className="flex min-h-0 min-w-0 flex-col overflow-hidden max-lg:min-h-[320px] lg:h-full">
              <motion.div className="flex min-h-0 h-full max-h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-indigo-500/25 bg-slate-900/75 p-3 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-500/20 backdrop-blur-sm md:p-4">
                <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
                    <Code2 className="size-5 shrink-0 text-indigo-400" strokeWidth={iconStroke.soft} aria-hidden />
                    {t('workspace.yourCode')}
                  </h2>
                </div>
                <div className="code-workspace-scroll min-h-0 flex-1 space-y-6 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 [scrollbar-gutter:stable]">
                  {practiceLangs.map((lang) => {
                    const Icon = TRACK_ICONS[lang]
                    const guidedCourse = getGuidedCourse(lang)
                    const guidedCount = guidedCourse?.lessons.length ?? 0
                    return (
                      <div
                        key={lang}
                        className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 ring-1 ring-white/5"
                      >
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                          <div className="flex min-w-0 flex-wrap items-center gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-800/90">
                              <Icon className="size-5 text-violet-300" strokeWidth={iconStroke.medium} aria-hidden />
                            </div>
                            <h2 className="font-display text-lg font-semibold text-white">{t(`hub.track.${lang}.title`)}</h2>
                          </div>
                          <UiLocaleSwitch compact />
                        </div>

                        <div className="mb-4 rounded-xl border border-white/10 bg-slate-950/55 p-3">
                          <p className="mb-2 font-display text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            {t('practice.modeBeginner')} / {t('practice.modeAdvanced')}
                          </p>
                          <Segmented
                            size="small"
                            className="w-full max-w-md bg-slate-900/90 font-display [&_.ant-segmented-item-selected]:!bg-indigo-600 [&_.ant-segmented-item-selected]:!text-white"
                            options={[
                              { label: t('practice.modeBeginner'), value: 'beginner' },
                              { label: t('practice.modeAdvanced'), value: 'advanced' },
                            ]}
                            value={modeFor(lang)}
                            onChange={(v) => setTrackMode(lang, v as PracticeTrackMode)}
                          />
                          <p className="mt-2 text-[11px] leading-snug text-slate-500">
                            {modeFor(lang) === 'beginner' ? t('practice.modeBeginnerHint') : t('practice.modeAdvancedHint')}
                          </p>
                        </div>

                        <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-950/20 p-4">
                          <p className="font-display text-xs font-bold uppercase tracking-wide text-amber-200/95">
                            {t('guided.courseSection')}
                          </p>
                          <p className="mt-2 text-sm text-slate-400">{t('guided.courseBlurb')}</p>
                          {hasGuidedCourse(lang) && guidedCount > 0 ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {Array.from({ length: guidedCount }, (_, i) => (
                                <Button
                                  key={`${lang}-guided-${i}`}
                                  type="primary"
                                  className="rounded-xl border-0 bg-gradient-to-r from-amber-600 to-orange-600 font-display font-semibold text-white shadow-md hover:!from-amber-500 hover:!to-orange-500"
                                  onClick={() => setGuidedSession({ lang, lessonIndex: i })}
                                >
                                  {t('guided.lessonButton', { num: String(i + 1) })}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-3 text-sm text-slate-500">{t('guided.moreCoursesSoon')}</p>
                          )}
                        </div>

                        <div>
                          <p className="mb-2 font-display text-xs font-bold uppercase tracking-wide text-violet-300/90">
                            {t('header.trackQuiz')}
                          </p>
                          <p className="mb-4 text-sm text-slate-400">{t('practice.modulesIntro')}</p>
                          <div className="flex flex-wrap gap-2">
                            {moduleIndices.map((m) => (
                              <Button
                                key={`${lang}-m${m}`}
                                type="primary"
                                ghost
                                className="rounded-xl border-violet-500/45 font-display font-semibold text-violet-100 hover:!border-violet-400 hover:!text-white"
                                onClick={() => setQuizSession({ lang, moduleIndex: m })}
                              >
                                {t('practice.moduleButton', { num: String(m + 1) })}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </section>

            {/* Column 3 — palette / legend */}
            <section className="flex min-h-[220px] min-w-0 flex-col lg:min-h-0">
              <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-violet-500/25 bg-slate-900/70 p-4 shadow-xl shadow-violet-950/35 ring-1 ring-violet-500/15 backdrop-blur-sm md:p-5">
                <div className="mb-3 shrink-0 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
                    <Blocks className="size-5 shrink-0 text-violet-400" strokeWidth={iconStroke.soft} aria-hidden />
                    {t('workspace.palette')}
                  </h2>
                  <span className="text-[11px] text-slate-400">{t('practice.paletteHintShort')}</span>
                </div>
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden pr-1 text-sm leading-relaxed text-slate-300">
                  <div className="rounded-xl border border-amber-500/25 bg-amber-950/25 p-3">
                    <p className="font-display text-[11px] font-bold uppercase tracking-wide text-amber-200/95">
                      {t('guided.courseSection')}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">{t('practice.paletteGuidedExplainer')}</p>
                  </div>
                  <div className="rounded-xl border border-violet-500/25 bg-violet-950/20 p-3">
                    <p className="font-display text-[11px] font-bold uppercase tracking-wide text-violet-200/95">
                      {t('header.trackQuiz')}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">{t('practice.paletteQuizExplainer')}</p>
                  </div>
                  <p className="text-xs text-slate-500">{t('practice.paletteFooter')}</p>
                </div>
              </div>
            </section>
          </PracticeOverviewWithRails>
        )}

        {practiceLangs.length > 0 ? (
          <MascotBubble message={t('practice.mascotTip')} mood="neutral" visible />
        ) : null}
      </main>
    </div>
  )
}
