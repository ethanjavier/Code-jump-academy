import { Alert, Button, Radio, Select, Tag } from 'antd'
import { motion } from 'framer-motion'
import {
  Blocks,
  BookOpenText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Code2,
  Eraser,
  LayoutGrid,
  Play,
  RotateCcw,
} from 'lucide-react'
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'

import { CONCEPT_EXPLANATIONS } from '../../courses/conceptExplanations'
import { resolveCanvasLienzo } from '../../courses/guidedCanvasResolve'
import { getGuidedCourse } from '../../courses/courseRegistry'
import type {
  GuidedCanvasRow,
  GuidedExercise,
  GuidedLesson,
  Localized,
  StripePiece,
} from '../../courses/guidedLessonTypes'
import { STRIPE_SWATCH_BG } from '../../courses/stripeSwatch'
import { celebrateWin } from '../celebrate'
import { iconStroke } from '../icons'
import type { LearningLanguageId } from '../learningTracks'
import { MascotBubble } from '../Mascot'
import { useI18n } from '../../i18n/I18nContext'
import { localized } from '../languageQuizzes'
import type { PracticeTrackMode } from '../learningPreferences'
import { GuidedCanvasLienzo } from '../GuidedCanvasLienzo'
import { distinctShuffle } from './shuffleOrder'
import { ensurePyodideLoaded, runJavaScriptLesson, runPythonLesson } from './runLessonCode'

type Props = {
  lang: LearningLanguageId
  lessonIndex: number
  onBack: () => void
  onLessonComplete: () => void
  hasNextLesson?: boolean
  onNextLesson?: () => void
  hasPrevLesson?: boolean
  onPrevLesson?: () => void
  onGoToLesson?: (index: number) => void
  /** `beginner`: three columns including result preview (“canvas”). `advanced`: three columns, no preview — denser tools column. */
  practiceMode?: PracticeTrackMode
}

/** Splits the guided course into a few “chapters” for navigation (no extra course metadata). */
function guidedLessonChapters(
  total: number,
): { id: number; startIdx: number; endIdx: number }[] {
  if (total <= 0) return []
  const count = Math.min(5, Math.max(2, Math.ceil(total / 4)))
  const chunk = Math.ceil(total / count)
  const out: { id: number; startIdx: number; endIdx: number }[] = []
  let start = 0
  let id = 1
  while (start < total) {
    const end = Math.min(total - 1, start + chunk - 1)
    out.push({ id: id++, startIdx: start, endIdx: end })
    start = end + 1
  }
  return out
}

function chapterIdForLesson(
  chapters: { id: number; startIdx: number; endIdx: number }[],
  lessonIndex: number,
): number {
  const c = chapters.find((ch) => lessonIndex >= ch.startIdx && lessonIndex <= ch.endIdx)
  return c?.id ?? chapters[0]?.id ?? 1
}

function InstructionBody({ text }: { text: Localized }) {
  const { locale } = useI18n()
  return (
    <div className="whitespace-pre-wrap text-sm leading-snug text-slate-300">{localized(text, locale)}</div>
  )
}

function includesAll(output: string, parts: string[]): boolean {
  return parts.every((p) => output.includes(p))
}

function initialReorderPerm(lang: LearningLanguageId, lesson: GuidedLesson | undefined): number[] {
  if (!lesson) return []
  const ex = lesson.exercise
  if (ex.type === 'orderLines') {
    const n = ex.lines.length
    return distinctShuffle(n, `${lang}-${lesson.id}-order`, ex.correctOrder)
  }
  if (ex.type === 'stripeChallenge') {
    const n = ex.pieces.length
    return distinctShuffle(n, `${lang}-${lesson.id}-stripe`, ex.correctOrder)
  }
  return []
}

function StripeGoalPreview({
  pieces,
  orderIndices,
  locale,
}: {
  pieces: StripePiece[]
  orderIndices: number[]
  locale: 'en' | 'es'
}) {
  return (
    <div className="flex h-full min-h-[100px] flex-col overflow-hidden rounded-lg border border-white/10">
      {orderIndices.map((idx) => {
        const p = pieces[idx]!
        return (
          <div
            key={p.id}
            className={`flex min-h-[2.25rem] flex-1 items-center px-3 text-xs font-bold tracking-wide text-white shadow-inner ${STRIPE_SWATCH_BG[p.swatch]}`}
          >
            <span className="truncate">{localized(p.label, locale)}</span>
          </div>
        )
      })}
    </div>
  )
}

function initialCodeDraft(lesson: GuidedLesson | undefined, loc: 'en' | 'es'): string {
  if (!lesson || lesson.exercise.type !== 'runCode') return ''
  return localized(lesson.exercise.starter, loc)
}

function AdvancedLessonNav({
  lessonIndex,
  totalLessons,
  chapters,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onGoToLesson,
}: {
  lessonIndex: number
  totalLessons: number
  chapters: { id: number; startIdx: number; endIdx: number }[]
  hasPrev: boolean
  hasNext: boolean
  onPrev?: () => void
  onNext?: () => void
  onGoToLesson?: (index: number) => void
}) {
  const { t } = useI18n()
  if (!onGoToLesson || totalLessons <= 0) return null
  const chapterOptions = chapters.map((ch) => ({
    value: ch.id,
    label: `${t('guided.navChapter')} ${ch.id} · ${t('guided.chapterLessonsRange', {
      from: String(ch.startIdx + 1),
      to: String(ch.endIdx + 1),
    })}`,
  }))
  const lessonOptions = Array.from({ length: totalLessons }, (_, i) => ({
    value: i,
    label: `${t('guided.navLesson')} ${i + 1} / ${totalLessons}`,
  }))
  const currentChapterId = chapterIdForLesson(chapters, lessonIndex)
  return (
    <div
      className="mb-3 flex shrink-0 flex-wrap items-center gap-2 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/50 via-slate-900/90 to-slate-950/95 px-3 py-2 shadow-md ring-1 ring-indigo-500/20"
      role="navigation"
      aria-label={t('guided.advancedNavAria')}
    >
      <Button
        type="text"
        size="small"
        disabled={!hasPrev || !onPrev}
        onClick={onPrev}
        className="shrink-0 !text-slate-200 hover:!bg-white/10 hover:!text-white disabled:!opacity-35"
        aria-label={t('guided.prevLesson')}
        icon={<ChevronLeft className="size-4" strokeWidth={iconStroke.medium} aria-hidden />}
      />
      {chapters.length > 1 ? (
        <Select
          size="small"
          variant="borderless"
          className="min-w-0 flex-1 sm:max-w-[min(100%,18rem)] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-white/15 [&_.ant-select-selector]:!bg-slate-950/80"
          popupMatchSelectWidth={false}
          options={chapterOptions}
          value={currentChapterId}
          onChange={(v) => {
            const ch = chapters.find((c) => c.id === v)
            if (ch) onGoToLesson(ch.startIdx)
          }}
          aria-label={t('guided.navChapter')}
        />
      ) : null}
      <Select
        size="small"
        variant="borderless"
        className="min-w-[9.5rem] flex-1 sm:min-w-[11rem] [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-white/15 [&_.ant-select-selector]:!bg-slate-950/80"
        options={lessonOptions}
        value={lessonIndex}
        onChange={(v) => onGoToLesson(Number(v))}
        aria-label={t('guided.navLesson')}
      />
      <Button
        type="text"
        size="small"
        disabled={!hasNext || !onNext}
        onClick={onNext}
        className="shrink-0 !text-slate-200 hover:!bg-white/10 hover:!text-white disabled:!opacity-35"
        aria-label={t('guided.nextLesson')}
        icon={<ChevronRight className="size-4" strokeWidth={iconStroke.medium} aria-hidden />}
      />
    </div>
  )
}

type GuidedToolsCardProps = {
  lesson: GuidedLesson
  exercise: GuidedExercise
  expectParts: string[]
  canvasRows: GuidedCanvasRow[]
  won: boolean
  hasNextLesson?: boolean
  onNextLesson?: () => void
  onBack: () => void
  /** Same shell as `PuzzleWorkspace` col 3: Paleta scroll → border-t → objetivo / referencia → footer. */
  beginnerShell?: boolean
}

/** Wraps palette-style content — mirrors spacing around draggable blocks in `PuzzleWorkspace`. */
function BlockPaletteSlot({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-violet-500/25 bg-slate-950/45 p-3 ring-1 ring-violet-500/15">{children}</div>
}

function GuidedLessonGoalPanel({
  exercise,
  expectParts,
  locale,
}: {
  exercise: GuidedExercise
  expectParts: string[]
  locale: 'en' | 'es'
}) {
  const { t } = useI18n()
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
      <p className="font-display text-[11px] font-bold uppercase tracking-wide text-slate-500">{t('guided.goalHeading')}</p>
      {exercise.type === 'runCode' ? (
        <ul className="mt-2 list-inside list-disc text-sm text-slate-300">
          <li>{t('guided.runHintEditor')}</li>
          <li className="mt-1">
            {t('guided.expectedFragments')}{' '}
            <span className="font-mono text-emerald-200/95">{expectParts.join(' · ')}</span>
          </li>
        </ul>
      ) : exercise.type === 'orderLines' ? (
        <p className="mt-2 text-sm text-slate-300">{t('guided.orderHint')}</p>
      ) : exercise.type === 'stripeChallenge' ? (
        <div className="mt-2 space-y-3">
          <p className="text-sm font-semibold text-slate-200">{localized(exercise.flagTitle, locale)}</p>
          <ul className="space-y-2">
            {exercise.pieces.map((piece) => (
              <li key={piece.id} className="rounded-lg border border-white/10 bg-slate-950/50 p-2.5">
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 h-7 w-1.5 shrink-0 rounded-full shadow-inner ${STRIPE_SWATCH_BG[piece.swatch]}`}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-white">{localized(piece.label, locale)}</p>
                    <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-slate-400">
                      {localized(piece.roleExplanation, locale)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-2 text-sm text-slate-300">{t('guided.goalPickOne')}</p>
      )}
    </div>
  )
}

function GuidedLessonToolsCard({
  lesson,
  exercise,
  expectParts,
  canvasRows,
  won,
  hasNextLesson,
  onNextLesson,
  onBack,
  beginnerShell = false,
}: GuidedToolsCardProps) {
  const { t, locale } = useI18n()

  const conceptAlert =
    lesson.introducesConcept ? (
      <Alert
        type="info"
        showIcon
        className="border-sky-500/35 bg-sky-950/35 text-sky-50 [&_.ant-alert-message]:font-display [&_.ant-alert-message]:font-semibold [&_.ant-alert-message]:text-sky-100"
        message={t('guided.newIdea')}
        description={
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
            {locale === 'es'
              ? CONCEPT_EXPLANATIONS[lesson.introducesConcept].es
              : CONCEPT_EXPLANATIONS[lesson.introducesConcept].en}
          </p>
        }
      />
    ) : null

  const pythonNote =
    exercise.type === 'runCode' && exercise.runtime === 'python' ? (
      <p className="text-xs text-slate-500">{t('guided.pythonFirstLoad')}</p>
    ) : null

  const footerNav = (
    <div className="mt-4 shrink-0 flex flex-wrap gap-2 border-t border-white/10 pt-3">
      {won && hasNextLesson && onNextLesson ? (
        <Button type="primary" onClick={onNextLesson}>
          {t('guided.nextLesson')}
        </Button>
      ) : null}
      <Button onClick={onBack}>{t('practice.backToOverview')}</Button>
    </div>
  )

  if (beginnerShell) {
    return (
      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-violet-500/25 bg-slate-900/70 p-4 shadow-xl shadow-violet-950/35 ring-1 ring-violet-500/15 backdrop-blur-sm md:p-5">
        <div className="mb-3 shrink-0 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
            <Blocks className="size-5 shrink-0 text-violet-400" strokeWidth={iconStroke.soft} aria-hidden />
            {t('workspace.palette')}
          </h2>
          <span className="text-[11px] text-slate-400">{t('workspace.paletteHint')}</span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
          {canvasRows.length > 0 ? (
            <>
              <BlockPaletteSlot>
                <GuidedCanvasLienzo rows={canvasRows} tone="violet" />
              </BlockPaletteSlot>
              <div className="mt-5 border-t border-white/10 pt-4">
                <GuidedLessonGoalPanel exercise={exercise} expectParts={expectParts} locale={locale} />
              </div>
            </>
          ) : (
            <GuidedLessonGoalPanel exercise={exercise} expectParts={expectParts} locale={locale} />
          )}
          {conceptAlert ? <div className="mt-4">{conceptAlert}</div> : null}
          {pythonNote ? <div className="mt-4">{pythonNote}</div> : null}
        </div>

        {footerNav}
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-violet-500/25 bg-slate-900/70 p-4 shadow-xl shadow-violet-950/35 ring-1 ring-violet-500/15 backdrop-blur-sm md:p-5">
      <div className="mb-3 shrink-0 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
          <Blocks className="size-5 shrink-0 text-violet-400" strokeWidth={iconStroke.soft} aria-hidden />
          {t('guided.lessonTools')}
        </h2>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden pr-1">
        {canvasRows.length > 0 ? (
          <div className="rounded-xl border border-violet-500/25 bg-slate-950/45 p-3 ring-1 ring-violet-500/15">
            <GuidedCanvasLienzo rows={canvasRows} tone="violet" />
          </div>
        ) : null}

        <GuidedLessonGoalPanel exercise={exercise} expectParts={expectParts} locale={locale} />

        {conceptAlert}

        {pythonNote}
      </div>

      {footerNav}
    </div>
  )
}

export function GuidedLessonRunner({
  lang,
  lessonIndex,
  onBack,
  onLessonComplete,
  hasNextLesson,
  onNextLesson,
  hasPrevLesson,
  onPrevLesson,
  onGoToLesson,
  practiceMode = 'beginner',
}: Props) {
  const { t, locale } = useI18n()
  const course = getGuidedCourse(lang)
  const lesson = course?.lessons[lessonIndex]
  const total = course?.lessons.length ?? 0
  const chapters = useMemo(() => guidedLessonChapters(total), [total])
  const canvasLienzoRows = useMemo(
    () => (lesson ? resolveCanvasLienzo(lesson) : []),
    [lesson],
  )

  const [orderLines, setOrderLines] = useState(() => initialReorderPerm(lang, lesson))
  const [orderHint, setOrderHint] = useState(false)
  const [pickChoice, setPickChoice] = useState<number | null>(null)
  const [pickHint, setPickHint] = useState(false)

  const [codeDraft, setCodeDraft] = useState(() => initialCodeDraft(lesson, locale))
  const [runOutput, setRunOutput] = useState('')
  const [runError, setRunError] = useState<string | undefined>(undefined)
  const [runHint, setRunHint] = useState(false)
  const [pyLoading, setPyLoading] = useState(false)

  const [won, setWon] = useState(false)
  const completionSent = useRef(false)

  const completeLesson = useCallback(() => {
    if (completionSent.current) return
    completionSent.current = true
    onLessonComplete()
  }, [onLessonComplete])

  const handleClearExercise = useCallback(() => {
    if (!lesson) return
    if (lesson.exercise.type === 'runCode') {
      setCodeDraft(initialCodeDraft(lesson, locale))
      setRunOutput('')
      setRunError(undefined)
      setRunHint(false)
    } else if (lesson.exercise.type === 'orderLines' || lesson.exercise.type === 'stripeChallenge') {
      setOrderLines(initialReorderPerm(lang, lesson))
      setOrderHint(false)
    } else if (lesson.exercise.type === 'pickOne') {
      setPickChoice(null)
      setPickHint(false)
    }
  }, [lesson, locale, lang])

  const handleResetOutputOnly = useCallback(() => {
    setRunOutput('')
    setRunError(undefined)
    setRunHint(false)
  }, [])

  const handleCheckOrder = useCallback(() => {
    if (
      !lesson ||
      (lesson.exercise.type !== 'orderLines' && lesson.exercise.type !== 'stripeChallenge')
    )
      return
    const ok = JSON.stringify(orderLines) === JSON.stringify(lesson.exercise.correctOrder)
    if (ok) {
      setWon(true)
      celebrateWin()
      completeLesson()
    } else {
      setOrderHint(true)
    }
  }, [lesson, orderLines, completeLesson])

  const handleCheckPick = useCallback(() => {
    if (!lesson || lesson.exercise.type !== 'pickOne' || pickChoice === null) return
    if (pickChoice === lesson.exercise.correctIndex) {
      setWon(true)
      celebrateWin()
      completeLesson()
    } else {
      setPickHint(true)
    }
  }, [lesson, pickChoice, completeLesson])

  const handleRunCode = useCallback(async () => {
    if (!lesson || lesson.exercise.type !== 'runCode') return
    setRunHint(false)
    const rt = lesson.exercise.runtime
    if (rt === 'javascript') {
      const r = runJavaScriptLesson(codeDraft)
      setRunOutput(r.output)
      setRunError(r.error)
      return
    }
    setPyLoading(true)
    try {
      await ensurePyodideLoaded()
      const r = await runPythonLesson(codeDraft)
      setRunOutput(r.output)
      setRunError(r.error)
    } finally {
      setPyLoading(false)
    }
  }, [lesson, codeDraft])

  const handleCheckRun = useCallback(() => {
    if (!lesson || lesson.exercise.type !== 'runCode') return
    const need = locale === 'es' ? lesson.exercise.expectOutputIncludes.es : lesson.exercise.expectOutputIncludes.en
    const combined = `${runOutput}\n${runError ?? ''}`
    if (includesAll(combined, need)) {
      setWon(true)
      celebrateWin()
      completeLesson()
    } else {
      setRunHint(true)
    }
  }, [lesson, locale, runOutput, runError, completeLesson])

  const moveLine = useCallback(
    (displayIdx: number, dir: -1 | 1) => {
      if (won) return
      setOrderHint(false)
      setOrderLines((prev) => {
        const next = [...prev]
        const j = displayIdx + dir
        if (j < 0 || j >= next.length) return prev
        ;[next[displayIdx], next[j]] = [next[j]!, next[displayIdx]!]
        return next
      })
    },
    [won],
  )

  if (!lesson || !course) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-center text-slate-400">
        {t('guided.missingLesson')}
      </div>
    )
  }

  const exercise = lesson.exercise

  const isRunCode = exercise.type === 'runCode'
  const isReorderExercise = exercise.type === 'orderLines' || exercise.type === 'stripeChallenge'
  const isBeginnerLayout = practiceMode === 'beginner'
  const expectParts =
    exercise.type === 'runCode'
      ? locale === 'es'
        ? exercise.expectOutputIncludes.es
        : exercise.expectOutputIncludes.en
      : []

  const mainGridClass =
    practiceMode === 'advanced'
      ? 'grid min-h-0 w-full flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-[minmax(260px,0.34fr)_minmax(0,1fr)_minmax(260px,0.32fr)] lg:items-stretch lg:gap-4 lg:auto-rows-[minmax(0,1fr)]'
      : 'grid min-h-0 w-full flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.72fr)_minmax(0,0.88fr)] lg:items-stretch lg:gap-5 lg:auto-rows-[minmax(0,1fr)]'

  const effectiveHasPrev = hasPrevLesson ?? lessonIndex > 0
  const showAdvancedNav = practiceMode === 'advanced' && total > 0 && typeof onGoToLesson === 'function'

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-0 pb-1 pt-0 sm:px-1">
      {showAdvancedNav ? (
        <AdvancedLessonNav
          lessonIndex={lessonIndex}
          totalLessons={total}
          chapters={chapters}
          hasPrev={effectiveHasPrev}
          hasNext={Boolean(hasNextLesson)}
          onPrev={onPrevLesson}
          onNext={onNextLesson}
          onGoToLesson={onGoToLesson}
        />
      ) : null}
      <main className={mainGridClass}>
        {/* Column 1: instructions + optional result preview (“lienzo”) */}
        <section className="flex min-h-0 min-w-0 flex-col gap-4 lg:min-h-0">
          <div className="shrink-0 rounded-2xl border border-indigo-500/25 bg-slate-900/70 p-4 shadow-xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm md:p-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
                <BookOpenText
                  className="size-5 shrink-0 text-amber-400"
                  strokeWidth={iconStroke.soft}
                  aria-hidden
                />
                {t('workspace.instructions')}
              </h2>
              <Tag color="purple">
                {t('guided.lessonMeta', {
                  current: String(lessonIndex + 1),
                  total: String(total),
                })}
              </Tag>
            </div>
            <p className="font-display text-lg font-bold text-white">{localized(lesson.title, locale)}</p>
            <div
              className={`mt-3 overflow-y-auto ${practiceMode === 'advanced' ? 'max-h-[min(38vh,17rem)] lg:max-h-none lg:flex-1 lg:min-h-0' : 'max-h-[min(42vh,22rem)]'}`}
            >
              <InstructionBody text={lesson.instruction} />
            </div>
          </div>

          {isBeginnerLayout ? (
            <div className="flex min-h-[220px] min-w-0 flex-1 flex-col rounded-2xl border border-teal-500/20 bg-slate-900/60 p-4 shadow-xl shadow-black/25 ring-1 ring-teal-500/15 backdrop-blur-sm md:p-5 lg:min-h-0">
              <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
                <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
                  <LayoutGrid
                    className="size-5 shrink-0 text-teal-400"
                    strokeWidth={iconStroke.soft}
                    aria-hidden
                  />
                  {t('workspace.canvas')}
                </h2>
              </div>
              <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-white/10 bg-slate-950/50 p-3 font-mono text-[12px] text-slate-200">
                {isRunCode && (runOutput || runError) ? (
                  <>
                    {runError ? <p className="text-rose-300">{runError}</p> : null}
                    {runOutput ? <pre className="whitespace-pre-wrap">{runOutput}</pre> : null}
                  </>
                ) : isRunCode ? (
                  <p className="text-sm leading-relaxed text-slate-500">{t('guided.previewPlaceholder')}</p>
                ) : exercise.type === 'stripeChallenge' ? (
                  <div className="font-sans">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-teal-300/95">
                      {localized(exercise.flagTitle, locale)}
                    </p>
                    <StripeGoalPreview
                      pieces={exercise.pieces}
                      orderIndices={exercise.correctOrder}
                      locale={locale}
                    />
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{t('guided.stripeGoalCaption')}</p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-slate-500">{t('guided.previewExerciseHint')}</p>
                )}
              </div>
            </div>
          ) : null}
        </section>

        {/* Column 2 (+ stacked tools when advanced): your code — beginner mirrors `PuzzleWorkspace` toolbar → alert → destino → scroll */}
        <section
          className={`flex min-h-0 min-w-0 flex-col overflow-hidden lg:h-full ${
            isBeginnerLayout ? 'max-lg:min-h-[220px]' : 'max-lg:min-h-[240px]'
          }`}
        >
          <motion.div
            className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-slate-900/75 p-3 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-500/20 backdrop-blur-sm md:p-4 ${
              pyLoading ? 'border-emerald-400/50 ring-emerald-400/25' : 'border-indigo-500/25'
            } h-full max-h-full`}
          >
            <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
              <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
                <Code2
                  className="size-5 shrink-0 text-indigo-400"
                  strokeWidth={iconStroke.soft}
                  aria-hidden
                />
                {t('workspace.yourCode')}
              </h2>
              <div className="flex flex-wrap gap-2">
                <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-block">
                  <Button
                    className="h-10 rounded-xl border border-amber-500/35 bg-amber-950/40 font-display font-semibold text-amber-100 shadow-none hover:!border-amber-400/55 hover:!bg-amber-900/55 hover:!text-white"
                    icon={<Eraser className="size-4 text-amber-400" strokeWidth={iconStroke.medium} aria-hidden />}
                    onClick={handleClearExercise}
                    disabled={won}
                  >
                    {isBeginnerLayout ? t('workspace.clear') : t('guided.resetExercise')}
                  </Button>
                </motion.span>
                {isRunCode ? (
                  <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-block">
                    <Button
                      className="h-10 rounded-xl border border-teal-500/35 bg-teal-950/35 font-display font-semibold text-teal-100 shadow-none hover:!border-teal-400/50 hover:!bg-teal-900/45 hover:!text-white"
                      icon={
                        <RotateCcw className="size-4 text-teal-400" strokeWidth={iconStroke.medium} aria-hidden />
                      }
                      onClick={handleResetOutputOnly}
                      disabled={won}
                    >
                      {isBeginnerLayout ? t('workspace.resetCanvas') : t('guided.resetOutput')}
                    </Button>
                  </motion.span>
                ) : null}
                {isRunCode ? (
                  <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-block">
                    <Button
                      type="primary"
                      className="relative h-11 overflow-hidden rounded-xl border-0 bg-gradient-to-r from-emerald-600 to-teal-600 px-5 font-display text-base font-bold shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/25 hover:!from-emerald-500 hover:!to-teal-500"
                      icon={<Play className="size-4 fill-current" strokeWidth={iconStroke.medium} aria-hidden />}
                      loading={pyLoading}
                      disabled={won}
                      onClick={() => void handleRunCode()}
                    >
                      {t('workspace.run')}
                    </Button>
                  </motion.span>
                ) : null}
              </div>
            </div>

            {isBeginnerLayout && exercise.type === 'runCode' && runHint ? (
              <p className="mb-3 shrink-0 rounded-xl border border-amber-500/35 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
                {localized(exercise.wrongHint, locale)}
              </p>
            ) : null}

            <div className="mb-3 shrink-0 rounded-lg border border-slate-600/80 bg-slate-950/60 px-3 py-2 text-xs text-slate-300">
              <span className="font-semibold text-indigo-300">{t('workspace.destination')}</span>{' '}
              <span className="text-slate-200">{t('workspace.mainProgram')}</span>
            </div>

            <div className="code-workspace-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 [scrollbar-gutter:stable]">
              {exercise.type === 'runCode' ? (
                <textarea
                  className="min-h-[200px] w-full resize-y rounded-xl border border-white/15 bg-slate-950/90 px-3 py-2 font-mono text-[13px] leading-relaxed text-emerald-100/95 outline-none ring-0 focus:border-indigo-400/60"
                  value={codeDraft}
                  onChange={(e) => setCodeDraft(e.target.value)}
                  disabled={won || pyLoading}
                  spellCheck={false}
                />
              ) : null}

              {exercise.type === 'orderLines' ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">{t('guided.orderHint')}</p>
                  <ul className="space-y-2">
                    {orderLines.map((lineIdx, displayIdx) => (
                      <li
                        key={`${lesson.id}-line-${displayIdx}-${lineIdx}`}
                        className="flex items-stretch gap-2 rounded-xl border border-white/10 bg-slate-950/80 pr-2 font-mono text-[13px] text-emerald-100/95"
                      >
                        <div className="flex shrink-0 flex-col justify-center border-r border-white/10 py-1">
                          <button
                            type="button"
                            className="rounded-l-lg px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                            disabled={won || displayIdx === 0}
                            onClick={() => moveLine(displayIdx, -1)}
                            aria-label={t('guided.moveUp')}
                          >
                            <ChevronUp className="size-4" strokeWidth={iconStroke.medium} />
                          </button>
                          <button
                            type="button"
                            className="rounded-l-lg px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                            disabled={won || displayIdx >= orderLines.length - 1}
                            onClick={() => moveLine(displayIdx, 1)}
                            aria-label={t('guided.moveDown')}
                          >
                            <ChevronDown className="size-4" strokeWidth={iconStroke.medium} />
                          </button>
                        </div>
                        <div className="flex min-w-0 flex-1 items-center py-3">
                          {localized(exercise.lines[lineIdx]!, locale)}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {orderHint ? <p className="text-sm text-amber-200">{t('guided.tryReorder')}</p> : null}
                </div>
              ) : null}

              {exercise.type === 'stripeChallenge' ? (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-slate-400">{localized(exercise.flagTitle, locale)}</p>
                  <p className="text-xs text-slate-500">{t('guided.stripeReorderHint')}</p>
                  <ul className="space-y-2">
                    {orderLines.map((pieceIdx, displayIdx) => {
                      const piece = exercise.pieces[pieceIdx]!
                      return (
                        <li
                          key={`${lesson.id}-stripe-${displayIdx}-${pieceIdx}`}
                          className="flex items-stretch gap-2 rounded-xl border border-white/10 bg-slate-950/80 pr-2"
                        >
                          <div className="flex shrink-0 flex-col justify-center border-r border-white/10 py-1">
                            <button
                              type="button"
                              className="rounded-l-lg px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                              disabled={won || displayIdx === 0}
                              onClick={() => moveLine(displayIdx, -1)}
                              aria-label={t('guided.moveStripeUp')}
                            >
                              <ChevronUp className="size-4" strokeWidth={iconStroke.medium} />
                            </button>
                            <button
                              type="button"
                              className="rounded-l-lg px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                              disabled={won || displayIdx >= orderLines.length - 1}
                              onClick={() => moveLine(displayIdx, 1)}
                              aria-label={t('guided.moveStripeDown')}
                            >
                              <ChevronDown className="size-4" strokeWidth={iconStroke.medium} />
                            </button>
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-2 pl-1">
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className={`h-9 w-1.5 shrink-0 rounded-full shadow-inner ${STRIPE_SWATCH_BG[piece.swatch]}`}
                                aria-hidden
                              />
                              <span className="font-display text-sm font-semibold text-slate-100">
                                {localized(piece.label, locale)}
                              </span>
                            </div>
                            {piece.snippet ? (
                              <pre className="whitespace-pre-wrap pl-3.5 font-mono text-[11px] leading-snug text-emerald-200/85">
                                {localized(piece.snippet, locale)}
                              </pre>
                            ) : null}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                  {orderHint ? (
                    <p className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
                      {localized(exercise.wrongHint, locale)}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {exercise.type === 'pickOne' ? (
                <div className="space-y-4">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-100">
                    {localized(exercise.prompt, locale)}
                  </div>
                  <Radio.Group
                    className="flex w-full flex-col gap-2"
                    value={pickChoice}
                    onChange={(e) => {
                      setPickChoice(e.target.value)
                      setPickHint(false)
                    }}
                    disabled={won}
                  >
                    {exercise.options.map((opt, i) => (
                      <Radio key={`pick-${i}`} value={i} className="!items-start !py-1 text-slate-200">
                        <span className="whitespace-normal">{localized(opt, locale)}</span>
                      </Radio>
                    ))}
                  </Radio.Group>
                  {pickHint ? (
                    <p className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
                      {localized(exercise.wrongHint, locale)}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="mt-3 shrink-0 flex flex-col gap-2 border-t border-white/10 pt-3">
              {exercise.type === 'runCode' && runHint && !isBeginnerLayout ? (
                <p className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
                  {localized(exercise.wrongHint, locale)}
                </p>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
              {exercise.type === 'runCode' && !won ? (
                <Button type="primary" onClick={handleCheckRun} disabled={pyLoading}>
                  {t('guided.checkOutput')}
                </Button>
              ) : null}
              {isReorderExercise && !won ? (
                <Button
                  type="primary"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 font-display font-bold"
                  onClick={handleCheckOrder}
                >
                  {t('guided.checkOrder')}
                </Button>
              ) : null}
              {exercise.type === 'pickOne' && !won ? (
                <Button
                  type="primary"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 font-display font-bold"
                  disabled={pickChoice === null}
                  onClick={handleCheckPick}
                >
                  {t('guided.checkAnswer')}
                </Button>
              ) : null}
              {won ? <p className="font-display font-semibold text-emerald-300">{t('guided.nice')}</p> : null}
              {won ? (
                <span className="text-sm text-slate-500">{t('guided.lessonDone')}</span>
              ) : null}
              </div>
            </div>
          </motion.div>
        </section>

        <section
          className={`flex min-w-0 flex-col lg:min-h-0 ${
            isBeginnerLayout ? 'min-h-[240px]' : 'min-h-[200px]'
          }`}
        >
          <GuidedLessonToolsCard
            lesson={lesson}
            exercise={exercise}
            expectParts={expectParts}
            canvasRows={canvasLienzoRows}
            won={won}
            hasNextLesson={hasNextLesson}
            onNextLesson={onNextLesson}
            onBack={onBack}
            beginnerShell={isBeginnerLayout}
          />
        </section>
      </main>

      <MascotBubble message={t('guided.mascotTip')} mood="neutral" visible={true} />
    </div>
  )
}
