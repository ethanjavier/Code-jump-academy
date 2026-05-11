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
  Maximize2,
  Play,
  RotateCcw,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

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
import { LanguageAnalogPalette, LessonInsertPalette } from '../LanguageAnalogPalette'
import { PaletteCodeCanvasHeroBlock } from './PaletteCodeCanvasHero'
import {
  GuidedReorderBandCard,
  GuidedReorderBandStack,
  GuidedReorderFlowSurface,
  highlightGuidedCodeLine,
} from './guidedCodeHighlight'
import { PaletteCodeFlowWinModal } from './PaletteCodeFlowWinModal'
import { distinctShuffle } from './shuffleOrder'
import { ensurePyodideLoaded, runJavaScriptLesson, runPythonLesson } from './runLessonCode'

const REORDER_CHEVRON_BTN =
  'rounded px-1 py-0.5 text-sky-400 hover:bg-sky-400/10 hover:text-sky-100 disabled:opacity-20 disabled:hover:bg-transparent'

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

function normalizePaletteCodeText(s: string): string {
  return s.replace(/\r\n/g, '\n').trim()
}

function paletteCodeKeyboardGuard(e: KeyboardEvent<HTMLTextAreaElement>) {
  const k = e.key
  if (
    k === 'Backspace' ||
    k === 'Delete' ||
    k === 'ArrowLeft' ||
    k === 'ArrowRight' ||
    k === 'ArrowUp' ||
    k === 'ArrowDown' ||
    k === 'Home' ||
    k === 'End'
  ) {
    return
  }
  if (e.ctrlKey && ['a', 'c', 'x'].includes(k.toLowerCase())) {
    return
  }
  if (k.length === 1 || k === 'Enter' || k === 'Tab') {
    e.preventDefault()
  }
}

function initialReorderPerm(lang: LearningLanguageId, lesson: GuidedLesson | undefined): number[] {
  if (!lesson) return []
  const ex = lesson.exercise
  if (ex.type === 'orderLines') {
    const n = ex.lines.length
    return distinctShuffle(n, `${lang}-${lesson.id}-order`, ex.correctOrder)
  }
  if (ex.type === 'assembleLine') {
    const n = ex.tokens.length
    return distinctShuffle(n, `${lang}-${lesson.id}-assemble`, ex.correctOrder)
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
        const line = p.snippet ?? p.label
        return (
          <div
            key={p.id}
            className={`flex min-h-[2.25rem] flex-1 items-center px-3 text-xs font-mono font-medium tracking-normal text-white shadow-inner ${STRIPE_SWATCH_BG[p.swatch]}`}
          >
            <span className="truncate">{localized(line, locale)}</span>
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

/** Starter split into lines — advanced run uses Parsons reorder on these rows. */
function runCodeStarterLines(lesson: GuidedLesson | undefined, loc: 'en' | 'es'): string[] {
  if (!lesson || lesson.exercise.type !== 'runCode') return []
  return localized(lesson.exercise.starter, loc).replace(/\r\n/g, '\n').split('\n')
}

function initialRunParsonsOrder(
  lang: LearningLanguageId,
  lesson: GuidedLesson | undefined,
  locale: 'en' | 'es',
): number[] {
  const lines = runCodeStarterLines(lesson, locale)
  const n = lines.length
  if (n <= 1) return n === 1 ? [0] : []
  const identity = Array.from({ length: n }, (_, i) => i)
  return distinctShuffle(n, `${lang}-${lesson!.id}-run-parsons`, identity)
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
  lang: LearningLanguageId
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
  /** Insert palette snippet into the code editor or scratch pad (center column). */
  onInsertPaletteSnippet?: (text: string) => void
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
        <div className="mt-2 space-y-2">
          <p className="text-sm leading-relaxed text-slate-300">{t('guided.expectFragmentsExplainer')}</p>
          <ul className="list-inside list-disc text-sm text-slate-300">
            <li>{t('guided.runHintEditor')}</li>
            <li className="mt-1">
              {t('guided.expectedFragments')}{' '}
              <span className="font-mono text-emerald-200/95">{expectParts.join(' · ')}</span>
            </li>
          </ul>
        </div>
      ) : exercise.type === 'orderLines' ? (
        <div className="mt-2 space-y-2">
          <p className="text-sm leading-relaxed text-slate-300">{t('guided.goalOrderLinesExplainer')}</p>
          <p className="text-sm text-slate-300">{t('guided.orderHint')}</p>
        </div>
      ) : exercise.type === 'assembleLine' ? (
        <div className="mt-2 space-y-2">
          <p className="text-sm leading-relaxed text-slate-300">{t('guided.goalAssembleExplainer')}</p>
          <p className="text-sm text-slate-300">{t('guided.assembleLineGoal')}</p>
        </div>
      ) : exercise.type === 'paletteCode' ? (
        <div className="mt-2 space-y-3">
          <p className="text-sm leading-relaxed text-slate-300">{t('guided.paletteSnippetsExplainer')}</p>
          <p className="text-sm font-semibold text-slate-200">{localized(exercise.goalSummary, locale)}</p>
          <ul className="space-y-2">
            {exercise.palette.map((p) => (
              <li key={p.id} className="rounded-lg border border-white/10 bg-slate-950/50 p-2.5">
                <pre className="whitespace-pre-wrap font-mono text-[12px] leading-snug text-emerald-100/95">
                  {localized(p.insertText, locale) === '\n'
                    ? p.hint
                      ? localized(p.hint, locale)
                      : '↵'
                    : localized(p.insertText, locale)}
                </pre>
                {p.hint && localized(p.insertText, locale) !== '\n' ? (
                  <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-slate-400">
                    {localized(p.hint, locale)}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : exercise.type === 'stripeChallenge' ? (
        <div className="mt-2 space-y-3">
          <p className="text-sm leading-relaxed text-slate-300">{t('guided.goalStripeExplainer')}</p>
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
                    <pre className="whitespace-pre-wrap font-mono text-[13px] font-semibold leading-snug text-emerald-100/95">
                      {localized(piece.snippet ?? piece.label, locale)}
                    </pre>
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
        <div className="mt-2 space-y-2">
          <p className="text-sm leading-relaxed text-slate-300">{t('guided.goalPickOneExplainer')}</p>
          <p className="text-sm text-slate-300">{t('guided.goalPickOne')}</p>
        </div>
      )}
    </div>
  )
}

function GuidedLessonToolsCard({
  lang,
  lesson,
  exercise,
  expectParts,
  canvasRows,
  won,
  hasNextLesson,
  onNextLesson,
  onBack,
  beginnerShell = false,
  onInsertPaletteSnippet,
}: GuidedToolsCardProps) {
  const { t, locale } = useI18n()
  /** Advanced: language palette only inserts into scratch/run editor — hide for runCode (Parsons lines). */
  const analogPaletteDisabled =
    won || (!beginnerShell && exercise.type !== 'paletteCode')

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
          <BlockPaletteSlot>
            {exercise.type === 'paletteCode' ? (
              <LessonInsertPalette
                entries={exercise.palette}
                onInsertSnippet={onInsertPaletteSnippet}
                disabled={won}
              />
            ) : (
              <LanguageAnalogPalette
                lang={lang}
                onInsertSnippet={onInsertPaletteSnippet}
                disabled={analogPaletteDisabled}
              />
            )}
          </BlockPaletteSlot>
          <div className="mt-5 border-t border-white/10 pt-4">
            <BlockPaletteSlot>
              <GuidedLessonGoalPanel exercise={exercise} expectParts={expectParts} locale={locale} />
            </BlockPaletteSlot>
          </div>
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
        <BlockPaletteSlot>
          {exercise.type === 'paletteCode' ? (
            <LessonInsertPalette
              entries={exercise.palette}
              onInsertSnippet={onInsertPaletteSnippet}
              disabled={won}
            />
          ) : (
            <LanguageAnalogPalette
              lang={lang}
              onInsertSnippet={onInsertPaletteSnippet}
              disabled={analogPaletteDisabled}
            />
          )}
        </BlockPaletteSlot>

        {canvasRows.length > 0 ? (
          <div className="rounded-xl border border-violet-500/25 bg-slate-950/45 p-3 ring-1 ring-violet-500/15">
            <GuidedCanvasLienzo rows={canvasRows} />
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

  const runStarterLineArray = useMemo(
    () => runCodeStarterLines(lesson ?? undefined, locale),
    [lesson, locale],
  )

  const [orderLines, setOrderLines] = useState(() => initialReorderPerm(lang, lesson))
  const [orderHint, setOrderHint] = useState(false)
  const [pickChoice, setPickChoice] = useState<number | null>(null)
  const [pickHint, setPickHint] = useState(false)

  const [codeDraft, setCodeDraft] = useState(() => initialCodeDraft(lesson, locale))
  const [scratchDraft, setScratchDraft] = useState('')
  const [paletteCodeDraft, setPaletteCodeDraft] = useState('')
  const [paletteHint, setPaletteHint] = useState(false)
  const [paletteVisualModalOpen, setPaletteVisualModalOpen] = useState(false)
  const paletteModalOpenedForWinRef = useRef(false)
  const [runOutput, setRunOutput] = useState('')
  const [runError, setRunError] = useState<string | undefined>(undefined)
  const [runHint, setRunHint] = useState(false)
  const [pyLoading, setPyLoading] = useState(false)
  /** Advanced runCode: permutation indices — row order is {@link runStarterLineArray}[i] for each slot. */
  const [runParsonsOrder, setRunParsonsOrder] = useState<number[]>([])

  const [won, setWon] = useState(false)
  const completionSent = useRef(false)
  const codeTextareaRef = useRef<HTMLTextAreaElement>(null)
  const scratchTextareaRef = useRef<HTMLTextAreaElement>(null)
  const paletteCodeTextareaRef = useRef<HTMLTextAreaElement>(null)

  const completeLesson = useCallback(() => {
    if (completionSent.current) return
    completionSent.current = true
    onLessonComplete()
  }, [onLessonComplete])

  const handleClearExercise = useCallback(() => {
    if (!lesson) return
    if (lesson.exercise.type === 'runCode') {
      setRunOutput('')
      setRunError(undefined)
      setRunHint(false)
      if (practiceMode === 'beginner') {
        setCodeDraft(initialCodeDraft(lesson, locale))
      } else {
        const ord = initialRunParsonsOrder(lang, lesson, locale)
        const lines = runCodeStarterLines(lesson, locale)
        setRunParsonsOrder(ord)
        setCodeDraft(
          lines.length > 0 && ord.length === lines.length ? ord.map((i) => lines[i]!).join('\n') : '',
        )
      }
    } else if (lesson.exercise.type === 'paletteCode') {
      setPaletteCodeDraft('')
      setPaletteHint(false)
    } else if (
      lesson.exercise.type === 'orderLines' ||
      lesson.exercise.type === 'stripeChallenge' ||
      lesson.exercise.type === 'assembleLine'
    ) {
      setOrderLines(initialReorderPerm(lang, lesson))
      setOrderHint(false)
      setScratchDraft('')
    } else if (lesson.exercise.type === 'pickOne') {
      setPickChoice(null)
      setPickHint(false)
      setScratchDraft('')
    }
  }, [lesson, locale, lang, practiceMode])

  const handleRestartPaletteFromWinModal = useCallback(() => {
    setPaletteVisualModalOpen(false)
    paletteModalOpenedForWinRef.current = false
    setPaletteCodeDraft('')
    setPaletteHint(false)
    setWon(false)
    completionSent.current = false
  }, [])

  const handleResetOutputOnly = useCallback(() => {
    setRunOutput('')
    setRunError(undefined)
    setRunHint(false)
  }, [])

  const insertIntoCode = useCallback(
    (snippet: string) => {
      if (won || !lesson || lesson.exercise.type !== 'runCode') return
      if (practiceMode !== 'beginner') return
      setCodeDraft((prev) => {
        const el = codeTextareaRef.current
        const typingHere = Boolean(el && document.activeElement === el)
        let s: number
        let e: number
        if (typingHere && el) {
          s = el.selectionStart
          e = el.selectionEnd
        } else {
          s = e = prev.length
        }
        s = Math.min(Math.max(0, s), prev.length)
        e = Math.min(Math.max(0, e), prev.length)
        const next = prev.slice(0, s) + snippet + prev.slice(e)
        requestAnimationFrame(() => {
          const node = codeTextareaRef.current
          if (!node) return
          const pos = s + snippet.length
          node.focus()
          node.setSelectionRange(pos, pos)
        })
        return next
      })
    },
    [won, lesson, practiceMode],
  )

  const insertIntoPaletteCode = useCallback(
    (snippet: string) => {
      if (won || !lesson || lesson.exercise.type !== 'paletteCode') return
      setPaletteHint(false)
      setPaletteCodeDraft((prev) => {
        const el = paletteCodeTextareaRef.current
        const typingHere = Boolean(el && document.activeElement === el)
        let s: number
        let e: number
        if (typingHere && el) {
          s = el.selectionStart
          e = el.selectionEnd
        } else {
          s = e = prev.length
        }
        s = Math.min(Math.max(0, s), prev.length)
        e = Math.min(Math.max(0, e), prev.length)
        const next = prev.slice(0, s) + snippet + prev.slice(e)
        requestAnimationFrame(() => {
          const node = paletteCodeTextareaRef.current
          if (!node) return
          const pos = s + snippet.length
          node.focus()
          node.setSelectionRange(pos, pos)
        })
        return next
      })
    },
    [won, lesson],
  )

  const insertIntoScratch = useCallback(
    (snippet: string) => {
      if (won || !lesson || lesson.exercise.type === 'runCode' || lesson.exercise.type === 'paletteCode')
        return
      setScratchDraft((prev) => {
        const el = scratchTextareaRef.current
        const typingHere = Boolean(el && document.activeElement === el)
        let s: number
        let e: number
        if (typingHere && el) {
          s = el.selectionStart
          e = el.selectionEnd
        } else {
          s = e = prev.length
        }
        s = Math.min(Math.max(0, s), prev.length)
        e = Math.min(Math.max(0, e), prev.length)
        const next = prev.slice(0, s) + snippet + prev.slice(e)
        requestAnimationFrame(() => {
          const node = scratchTextareaRef.current
          if (!node) return
          const pos = s + snippet.length
          node.focus()
          node.setSelectionRange(pos, pos)
        })
        return next
      })
    },
    [won, lesson],
  )

  useEffect(() => {
    paletteModalOpenedForWinRef.current = false
    setPaletteVisualModalOpen(false)
  }, [lesson?.id])

  useEffect(() => {
    if (!won) {
      paletteModalOpenedForWinRef.current = false
    }
  }, [won])

  useEffect(() => {
    if (
      won &&
      lesson &&
      lesson.exercise.type === 'paletteCode' &&
      lesson.exercise.resultPreview?.length &&
      !paletteModalOpenedForWinRef.current
    ) {
      paletteModalOpenedForWinRef.current = true
      setPaletteVisualModalOpen(true)
    }
  }, [won, lesson])

  const handlePaletteInsert = useCallback(
    (text: string) => {
      if (won || !lesson) return
      if (lesson.exercise.type === 'runCode') insertIntoCode(text)
      else if (lesson.exercise.type === 'paletteCode') insertIntoPaletteCode(text)
      else insertIntoScratch(text)
    },
    [won, lesson, insertIntoCode, insertIntoPaletteCode, insertIntoScratch],
  )

  const moveRunParsonsLine = useCallback(
    (displayIdx: number, dir: -1 | 1) => {
      if (won || !lesson || lesson.exercise.type !== 'runCode' || practiceMode === 'beginner') return
      setRunParsonsOrder((prev) => {
        const next = [...prev]
        const j = displayIdx + dir
        if (j < 0 || j >= next.length) return prev
        ;[next[displayIdx], next[j]] = [next[j]!, next[displayIdx]!]
        return next
      })
    },
    [won, lesson, practiceMode],
  )

  useEffect(() => {
    if (!lesson || lesson.exercise.type !== 'runCode') {
      setRunParsonsOrder([])
      return
    }
    if (practiceMode === 'beginner') return
    setRunParsonsOrder(initialRunParsonsOrder(lang, lesson, locale))
  }, [lesson?.id, locale, lang, practiceMode])

  useEffect(() => {
    if (!lesson || lesson.exercise.type !== 'runCode' || practiceMode === 'beginner') return
    const n = runStarterLineArray.length
    if (n === 0) {
      setCodeDraft('')
      return
    }
    if (runParsonsOrder.length !== n) return
    const text = runParsonsOrder.map((i) => runStarterLineArray[i]!).join('\n')
    setCodeDraft(text)
  }, [lesson?.id, practiceMode, runParsonsOrder, runStarterLineArray])

  const handleCheckOrder = useCallback(() => {
    if (
      !lesson ||
      (lesson.exercise.type !== 'orderLines' &&
        lesson.exercise.type !== 'stripeChallenge' &&
        lesson.exercise.type !== 'assembleLine')
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

  const handleCheckPaletteCode = useCallback(() => {
    if (!lesson || lesson.exercise.type !== 'paletteCode') return
    const want = normalizePaletteCodeText(localized(lesson.exercise.correctText, locale))
    const got = normalizePaletteCodeText(paletteCodeDraft)
    if (got === want) {
      setWon(true)
      celebrateWin()
      completeLesson()
    } else {
      setPaletteHint(true)
    }
  }, [lesson, locale, paletteCodeDraft, completeLesson])

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

  const assembledLinePreview = useMemo(() => {
    if (!lesson || lesson.exercise.type !== 'assembleLine') return ''
    const ex = lesson.exercise
    return orderLines.map((ti) => localized(ex.tokens[ti]!, locale)).join('')
  }, [lesson, orderLines, locale])

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
  const isPaletteCode = exercise.type === 'paletteCode'
  const isReorderExercise =
    exercise.type === 'orderLines' ||
    exercise.type === 'stripeChallenge' ||
    exercise.type === 'assembleLine'
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
              <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-white/10 bg-slate-950/50 p-3 text-[12px] text-slate-200">
                {exercise.type === 'paletteCode' && exercise.resultPreview?.length ? (
                  <div className="flex min-h-[120px] flex-col items-center justify-center font-sans">
                    {won && exercise.canvasHero ? (
                      <PaletteCodeCanvasHeroBlock
                        hero={exercise.canvasHero}
                        firstLineLit
                        won
                      />
                    ) : won ? (
                      <p className="max-w-sm text-center font-display text-base font-semibold text-emerald-300">
                        {t('guided.nice')}
                      </p>
                    ) : (
                      <p className="max-w-sm text-center text-sm leading-relaxed text-slate-400">
                        {t('guided.paletteCodeCanvasAwait')}
                      </p>
                    )}
                  </div>
                ) : exercise.type === 'paletteCode' ? (
                  <p className="text-sm leading-relaxed text-slate-500">{t('guided.paletteCodePreviewHint')}</p>
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
                  <div className="flex min-h-0 flex-col gap-3 font-sans">
                    {exercise.type === 'runCode' && (runOutput || runError) ? (
                      <div className="shrink-0 rounded-lg border border-white/10 bg-slate-950/90 p-2 font-mono">
                        {runError ? <p className="text-rose-300">{runError}</p> : null}
                        {runOutput ? <pre className="whitespace-pre-wrap">{runOutput}</pre> : null}
                      </div>
                    ) : null}
                    {canvasLienzoRows.length > 0 ? (
                      <div className="min-h-0 min-w-0 flex-1">
                        <GuidedCanvasLienzo rows={canvasLienzoRows} />
                      </div>
                    ) : exercise.type === 'runCode' ? (
                      <p className="text-sm leading-relaxed text-slate-500">{t('guided.previewPlaceholder')}</p>
                    ) : (
                      <p className="text-sm leading-relaxed text-slate-500">{t('guided.previewExerciseHint')}</p>
                    )}
                  </div>
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
                {exercise.type === 'paletteCode' && exercise.resultPreview?.length ? (
                  <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-block">
                    <Button
                      className="h-10 rounded-xl border border-violet-500/35 bg-violet-950/40 font-display font-semibold text-violet-100 shadow-none hover:!border-violet-400/55 hover:!bg-violet-900/55 hover:!text-white"
                      icon={<Maximize2 className="size-4 text-violet-300" strokeWidth={iconStroke.medium} aria-hidden />}
                      onClick={() => setPaletteVisualModalOpen(true)}
                    >
                      {t('guided.paletteCodeOpenModal')}
                    </Button>
                  </motion.span>
                ) : null}
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
            {isBeginnerLayout && exercise.type === 'paletteCode' && paletteHint ? (
              <p className="mb-3 shrink-0 rounded-xl border border-amber-500/35 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
                {localized(exercise.wrongHint, locale)}
              </p>
            ) : null}

            <div
              className={`mb-3 shrink-0 rounded-lg px-3 py-2 text-xs ${
                isBeginnerLayout
                  ? 'border border-slate-600/80 bg-slate-950/60 text-slate-300'
                  : 'border border-white/10 bg-[#0f172a] text-slate-300 ring-1 ring-white/[0.06]'
              }`}
            >
              <span className="font-semibold text-indigo-300">{t('workspace.destination')}</span>{' '}
              <span className="text-slate-200">
                {isPaletteCode ? t('workspace.paletteOnlyEditor') : t('workspace.mainProgram')}
              </span>
            </div>

            <div className="code-workspace-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 [scrollbar-gutter:stable]">
              {exercise.type === 'runCode' ? (
                isBeginnerLayout ? (
                  <textarea
                    ref={codeTextareaRef}
                    className="min-h-[200px] w-full resize-y rounded-xl border border-white/15 bg-slate-950/90 px-3 py-2 font-mono text-[13px] leading-relaxed text-emerald-100/95 outline-none ring-0 focus:border-indigo-400/60"
                    value={codeDraft}
                    onChange={(e) => setCodeDraft(e.target.value)}
                    disabled={won || pyLoading}
                    spellCheck={false}
                  />
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs leading-snug text-slate-500">{t('guided.runCodeParsonsWorkspaceHint')}</p>
                    <GuidedReorderFlowSurface>
                      <GuidedReorderBandStack>
                        {runParsonsOrder.map((lineIdx, displayIdx) => {
                          const lineText = runStarterLineArray[lineIdx] ?? ''
                          return (
                            <GuidedReorderBandCard key={`${lesson.id}-run-line-${displayIdx}-${lineIdx}`}>
                              <div className="flex shrink-0 flex-col justify-center gap-0.5">
                                <button
                                  type="button"
                                  className={REORDER_CHEVRON_BTN}
                                  disabled={won || pyLoading || displayIdx === 0}
                                  onClick={() => moveRunParsonsLine(displayIdx, -1)}
                                  aria-label={t('guided.moveUp')}
                                >
                                  <ChevronUp className="size-4" strokeWidth={iconStroke.medium} />
                                </button>
                                <button
                                  type="button"
                                  className={REORDER_CHEVRON_BTN}
                                  disabled={
                                    won || pyLoading || displayIdx >= runParsonsOrder.length - 1
                                  }
                                  onClick={() => moveRunParsonsLine(displayIdx, 1)}
                                  aria-label={t('guided.moveDown')}
                                >
                                  <ChevronDown className="size-4" strokeWidth={iconStroke.medium} />
                                </button>
                              </div>
                              <div className="min-w-0 flex-1 leading-snug">
                                {highlightGuidedCodeLine(lineText, `run-parsons-${displayIdx}`, lang)}
                              </div>
                            </GuidedReorderBandCard>
                          )
                        })}
                      </GuidedReorderBandStack>
                    </GuidedReorderFlowSurface>
                  </div>
                )
              ) : null}

              {exercise.type === 'paletteCode' ? (
                isBeginnerLayout ? (
                  <textarea
                    ref={paletteCodeTextareaRef}
                    className="min-h-[200px] w-full resize-y rounded-xl border border-white/15 bg-slate-950/90 px-3 py-2 font-mono text-[13px] leading-relaxed text-emerald-100/95 outline-none ring-0 focus:border-indigo-400/60"
                    value={paletteCodeDraft}
                    onChange={(e) => setPaletteCodeDraft(e.target.value)}
                    onKeyDown={paletteCodeKeyboardGuard}
                    onPaste={(e) => e.preventDefault()}
                    disabled={won}
                    spellCheck={false}
                    aria-label={t('guided.paletteCodeEditorAria')}
                  />
                ) : (
                  <GuidedReorderFlowSurface>
                    <GuidedReorderBandStack>
                      <GuidedReorderBandCard className="min-h-[min(280px,45vh)] items-stretch py-3">
                        <textarea
                          ref={paletteCodeTextareaRef}
                          className="min-h-[min(240px,40vh)] w-full flex-1 resize-y border-0 bg-transparent font-[family-name:var(--font-code)] text-[13px] leading-relaxed text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:outline-none"
                          value={paletteCodeDraft}
                          onChange={(e) => setPaletteCodeDraft(e.target.value)}
                          onKeyDown={paletteCodeKeyboardGuard}
                          onPaste={(e) => e.preventDefault()}
                          disabled={won}
                          spellCheck={false}
                          aria-label={t('guided.paletteCodeEditorAria')}
                        />
                      </GuidedReorderBandCard>
                    </GuidedReorderBandStack>
                  </GuidedReorderFlowSurface>
                )
              ) : null}

              {exercise.type === 'orderLines' ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">{t('guided.orderHint')}</p>
                  <GuidedReorderFlowSurface>
                    <ul className="divide-y divide-white/[0.07] font-[family-name:var(--font-code)] text-[13px] leading-snug">
                      {orderLines.map((lineIdx, displayIdx) => (
                        <li
                          key={`${lesson.id}-line-${displayIdx}-${lineIdx}`}
                          className="flex items-center gap-3 px-3 py-2.5 first:pt-3 last:pb-3"
                        >
                          <div className="flex shrink-0 flex-col justify-center gap-0.5">
                            <button
                              type="button"
                              className={REORDER_CHEVRON_BTN}
                              disabled={won || displayIdx === 0}
                              onClick={() => moveLine(displayIdx, -1)}
                              aria-label={t('guided.moveUp')}
                            >
                              <ChevronUp className="size-4" strokeWidth={iconStroke.medium} />
                            </button>
                            <button
                              type="button"
                              className={REORDER_CHEVRON_BTN}
                              disabled={won || displayIdx >= orderLines.length - 1}
                              onClick={() => moveLine(displayIdx, 1)}
                              aria-label={t('guided.moveDown')}
                            >
                              <ChevronDown className="size-4" strokeWidth={iconStroke.medium} />
                            </button>
                          </div>
                          <div className="min-w-0 flex-1">
                            {highlightGuidedCodeLine(localized(exercise.lines[lineIdx]!, locale), `ol-${displayIdx}`, lang)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </GuidedReorderFlowSurface>
                  {orderHint && exercise.type === 'orderLines' ? (
                    <p className="text-sm text-amber-200">{t('guided.tryReorder')}</p>
                  ) : null}
                </div>
              ) : null}

              {exercise.type === 'assembleLine' ? (
                <div className="space-y-3">
                  <p className="text-xs leading-snug text-slate-500">{t('guided.assembleLineWorkspaceHint')}</p>
                  <GuidedReorderFlowSurface>
                    <div className="border-b border-white/[0.07] px-3 py-2.5">
                      <p className="font-display text-[10px] font-bold uppercase tracking-wide text-sky-400/90">
                        {t('guided.assembledLinePreview')}
                      </p>
                      <div className="mt-1 max-h-[min(28vh,12rem)] overflow-auto whitespace-pre-wrap break-all font-[family-name:var(--font-code)] text-[12px] leading-relaxed">
                        {assembledLinePreview
                          ? highlightGuidedCodeLine(assembledLinePreview, 'asm-prev', lang)
                          : '…'}
                      </div>
                    </div>
                    <ul className="divide-y divide-white/[0.07] font-[family-name:var(--font-code)] text-[13px] leading-snug">
                      {orderLines.map((tokIdx, displayIdx) => (
                        <li
                          key={`${lesson.id}-tok-${displayIdx}-${tokIdx}`}
                          className="flex items-center gap-3 px-3 py-2.5 first:pt-3 last:pb-3"
                        >
                          <div className="flex shrink-0 flex-col justify-center gap-0.5">
                            <button
                              type="button"
                              className={REORDER_CHEVRON_BTN}
                              disabled={won || displayIdx === 0}
                              onClick={() => moveLine(displayIdx, -1)}
                              aria-label={t('guided.moveUp')}
                            >
                              <ChevronUp className="size-4" strokeWidth={iconStroke.medium} />
                            </button>
                            <button
                              type="button"
                              className={REORDER_CHEVRON_BTN}
                              disabled={won || displayIdx >= orderLines.length - 1}
                              onClick={() => moveLine(displayIdx, 1)}
                              aria-label={t('guided.moveDown')}
                            >
                              <ChevronDown className="size-4" strokeWidth={iconStroke.medium} />
                            </button>
                          </div>
                          <div className="min-w-0 flex-1 break-all">
                            {highlightGuidedCodeLine(localized(exercise.tokens[tokIdx]!, locale), `tok-${displayIdx}`, lang)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </GuidedReorderFlowSurface>
                  {orderHint ? (
                    <p className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
                      {localized(exercise.wrongHint, locale)}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {exercise.type === 'stripeChallenge' ? (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-slate-400">{localized(exercise.flagTitle, locale)}</p>
                  <p className="text-xs text-slate-500">{t('guided.stripeReorderHint')}</p>
                  <GuidedReorderFlowSurface>
                    <ul className="divide-y divide-white/[0.07]">
                      {orderLines.map((pieceIdx, displayIdx) => {
                        const piece = exercise.pieces[pieceIdx]!
                        const line = localized(piece.snippet ?? piece.label, locale)
                        return (
                          <li
                            key={`${lesson.id}-stripe-${displayIdx}-${pieceIdx}`}
                            className="flex items-center gap-3 px-3 py-2.5 first:pt-3 last:pb-3"
                          >
                            <div className="flex shrink-0 flex-col justify-center gap-0.5">
                              <button
                                type="button"
                                className={REORDER_CHEVRON_BTN}
                                disabled={won || displayIdx === 0}
                                onClick={() => moveLine(displayIdx, -1)}
                                aria-label={t('guided.moveStripeUp')}
                              >
                                <ChevronUp className="size-4" strokeWidth={iconStroke.medium} />
                              </button>
                              <button
                                type="button"
                                className={REORDER_CHEVRON_BTN}
                                disabled={won || displayIdx >= orderLines.length - 1}
                                onClick={() => moveLine(displayIdx, 1)}
                                aria-label={t('guided.moveStripeDown')}
                              >
                                <ChevronDown className="size-4" strokeWidth={iconStroke.medium} />
                              </button>
                            </div>
                            <span
                              className={`h-7 w-1 shrink-0 rounded-full opacity-90 shadow-inner ${STRIPE_SWATCH_BG[piece.swatch]}`}
                              aria-hidden
                            />
                            <div className="min-w-0 flex-1 whitespace-pre-wrap font-[family-name:var(--font-code)] text-[12px] leading-snug">
                              {highlightGuidedCodeLine(line, `stripe-${displayIdx}`, lang)}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </GuidedReorderFlowSurface>
                  {orderHint ? (
                    <p className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
                      {localized(exercise.wrongHint, locale)}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {exercise.type === 'pickOne' ? (
                isBeginnerLayout ? (
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
                ) : (
                  <GuidedReorderFlowSurface>
                    <div className="space-y-4 px-4 py-4">
                      <div className="whitespace-pre-wrap font-[family-name:var(--font-code)] text-[13px] leading-relaxed text-slate-100">
                        {localized(exercise.prompt, locale)}
                      </div>
                      <Radio.Group
                        className="flex w-full flex-col gap-2 text-slate-200 [&_.ant-radio-inner]:!border-slate-500 [&_.ant-radio-checked_.ant-radio-inner]:!border-sky-400 [&_.ant-radio-inner::after]:!bg-sky-400"
                        value={pickChoice}
                        onChange={(e) => {
                          setPickChoice(e.target.value)
                          setPickHint(false)
                        }}
                        disabled={won}
                      >
                        {exercise.options.map((opt, i) => (
                          <Radio key={`pick-${i}`} value={i} className="!items-start !py-1.5 !text-slate-200">
                            <span className="whitespace-normal font-[family-name:var(--font-code)] text-[13px]">
                              {localized(opt, locale)}
                            </span>
                          </Radio>
                        ))}
                      </Radio.Group>
                      {pickHint ? (
                        <p className="rounded-lg border border-amber-500/30 bg-amber-950/40 px-3 py-2 text-sm text-amber-100">
                          {localized(exercise.wrongHint, locale)}
                        </p>
                      ) : null}
                    </div>
                  </GuidedReorderFlowSurface>
                )
              ) : null}

              {isBeginnerLayout && exercise.type !== 'runCode' && exercise.type !== 'paletteCode' ? (
                <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  <p className="font-display text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    {t('guided.scratchTitle')}
                  </p>
                  <p className="text-xs leading-snug text-slate-500">{t('guided.scratchHint')}</p>
                  <textarea
                    ref={scratchTextareaRef}
                    className="min-h-[120px] w-full resize-y rounded-xl border border-white/15 bg-slate-950/90 px-3 py-2 font-mono text-[13px] leading-relaxed text-emerald-100/95 outline-none ring-0 focus:border-indigo-400/60"
                    value={scratchDraft}
                    onChange={(e) => setScratchDraft(e.target.value)}
                    disabled={won}
                    spellCheck={false}
                    aria-label={t('guided.scratchTitle')}
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-3 shrink-0 flex flex-col gap-2 border-t border-white/10 pt-3">
              {exercise.type === 'runCode' && runHint && !isBeginnerLayout ? (
                <p className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-3 py-2 text-sm text-amber-100">
                  {localized(exercise.wrongHint, locale)}
                </p>
              ) : null}
              {exercise.type === 'paletteCode' && paletteHint && !isBeginnerLayout ? (
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
              {exercise.type === 'paletteCode' && !won ? (
                <Button
                  type="primary"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 font-display font-bold"
                  onClick={handleCheckPaletteCode}
                >
                  {t('guided.checkPaletteCode')}
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
            lang={lang}
            lesson={lesson}
            exercise={exercise}
            expectParts={expectParts}
            canvasRows={canvasLienzoRows}
            won={won}
            hasNextLesson={hasNextLesson}
            onNextLesson={onNextLesson}
            onBack={onBack}
            beginnerShell={isBeginnerLayout}
            onInsertPaletteSnippet={handlePaletteInsert}
          />
        </section>
      </main>

      {isPaletteCode && exercise.resultPreview?.length ? (
        <PaletteCodeFlowWinModal
          open={paletteVisualModalOpen}
          onClose={() => setPaletteVisualModalOpen(false)}
          onRestartExercise={handleRestartPaletteFromWinModal}
          draft={paletteCodeDraft}
          correctText={exercise.correctText}
          locale={locale}
          stripes={exercise.resultPreview}
        />
      ) : null}

      <MascotBubble message={t('guided.mascotTip')} mood="neutral" visible={true} />
    </div>
  )
}
