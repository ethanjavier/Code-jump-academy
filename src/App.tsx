import { Alert, Button, Modal, Progress, Select, Tag } from 'antd'
import { motion } from 'framer-motion'
import {
  Blocks,
  BookOpenText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Code2,
  Eraser,
  Gamepad2,
  LayoutGrid,
  Library,
  ListOrdered,
  Play,
  Rocket,
  RotateCcw,
  Sparkles,
  SquareCode,
  Star,
  Trophy,
  XCircle,
  House,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { getGuidedCourse, hasGuidedCourse } from './courses/courseRegistry'
import { GuidedLessonRunner } from './app/guidedLesson/GuidedLessonRunner'
import { CAMPAIGN_CHAPTERS } from './campaign/buildCampaign'
import { CHAPTER_TITLES_EN } from './campaign/chapterThemes'
import {
  DEFAULT_VAR_DECL_INITIAL,
  type RepeatBlock,
  type ColorKey,
  type BlockNode,
  type CountSource,
} from './engine/blocks'
import type { Level } from './types/level'
import { STEP_DELAY_MS, COLOR_META } from './app/constants'
import { iconStroke } from './app/icons'
import { InstructionVisualExample } from './app/InstructionVisual'
import {
  BlockListView,
  BlockPalette,
  CursorBadge,
  EmptyWorkspaceHint,
  formatCountLabel,
} from './app/BlocksUI'
import { celebrateWin } from './app/celebrate'
import { MascotBubble } from './app/Mascot'
import {
  loadProgress,
  mergeWin,
  saveProgress,
  getXpBar,
  type GameProgress,
} from './app/progression'
import { playSFX } from './app/playSFX'
import { computeStars } from './app/stars'
import { flattenToSteps } from './engine/flatten'
import {
  appendBlock,
  cloneGrid,
  createId,
  emptyGrid,
  gridToFlatPattern,
  patternsMatch,
  parseRows,
  removeBlockById,
  updateRepeatCountSource,
  updateVarDecl,
} from './app/helpers'
import { runStepsOnGrid } from './app/interpreter'
import { LanguageQuizModal } from './app/LanguageQuizModal'
import { LearnPracticeModeToggle } from './app/LearnPracticeModeToggle'
import { LanguagePracticeShell } from './app/LanguagePracticeShell'
import { LearningHub } from './app/LearningHub'
import {
  parseAppUrl,
  replaceUrlSearch,
  serializeAppUrl,
  type PracticeDeepLink,
} from './app/appUrl'
import {
  chapterTitleForLocale,
  getTrackPracticeMode,
  loadLearningLanguages,
  loadScreen,
  saveScreen,
  saveTrackPracticeMode,
  type AppScreen,
  type PracticeTrackMode,
} from './app/learningPreferences'
import { hasLanguagePractice, primaryCodeFocus, type LearningLanguageId } from './app/learningTracks'
import { useI18n } from './i18n/I18nContext'

function collectRepeatsFromNode(n: BlockNode): RepeatBlock[] {
  if (n.kind !== 'repeat') return []
  return [n, ...n.children.flatMap(collectRepeatsFromNode)]
}

function countBlocks(nodes: BlockNode[]): number {
  let total = 0
  for (const node of nodes) {
    total += 1
    if (node.kind === 'repeat') {
      total += countBlocks(node.children)
    }
  }
  return total
}

type PuzzleWorkspaceProps = {
  level: Level
  chapterTitle: string
  lessonSignature: string
  focusLanguages: LearningLanguageId[]
  campaignHasRemainingPuzzle: boolean
  onAdvanceCampaignPuzzle: () => void
  onLessonWin: (stars: 1 | 2 | 3) => void
}

function PuzzleWorkspace({
  level,
  chapterTitle,
  lessonSignature,
  focusLanguages,
  campaignHasRemainingPuzzle,
  onAdvanceCampaignPuzzle,
  onLessonWin,
}: PuzzleWorkspaceProps) {
  const { t, locale } = useI18n()
  const abortRef = useRef<AbortController | null>(null)
  const codeScrollRef = useRef<HTMLDivElement>(null)
  const prevBlockCountRef = useRef(0)
  const runAttemptsRef = useRef(0)
  const [shakeGen, setShakeGen] = useState(0)
  const [mascot, setMascot] = useState<{
    text: string | null
    mood: 'happy' | 'sad' | 'neutral'
  }>({ text: null, mood: 'neutral' })

  const varNameOptions = useMemo(() => level.varNames ?? [], [level.varNames])

  const rows = useMemo(() => parseRows(level), [level])
  const cols = level.gridCols

  const allowedSet = useMemo(
    () => new Set(level.allowedBlocks),
    [level.allowedBlocks],
  )

  const [workspace, setWorkspace] = useState<BlockNode[]>([])
  const [insertTarget, setInsertTarget] = useState<'root' | string>('root')
  const [grid, setGrid] = useState<(ColorKey | '')[][]>(() =>
    emptyGrid(parseRows(level), level.gridCols),
  )
  const [cursor, setCursor] = useState({ row: 0, col: 0 })
  const [isRunning, setIsRunning] = useState(false)
  const [flattenError, setFlattenError] = useState<string | null>(null)
  const [resultModal, setResultModal] = useState<{
    open: boolean
    ok: boolean
    title: string
    detail: ReactNode
    stars: 0 | 1 | 2 | 3
  }>({ open: false, ok: false, title: '', detail: null, stars: 0 })

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const clearGridState = useCallback(() => {
    setGrid(emptyGrid(rows, cols))
    setCursor({ row: 0, col: 0 })
  }, [rows, cols])

  const resetCanvas = useCallback(() => {
    handleStop()
    setIsRunning(false)
    clearGridState()
  }, [clearGridState, handleStop])

  const clearCode = useCallback(() => {
    handleStop()
    setIsRunning(false)
    clearGridState()
    setWorkspace([])
    setInsertTarget('root')
    setFlattenError(null)
    runAttemptsRef.current = 0
  }, [clearGridState, handleStop])

  const handleRun = useCallback(async () => {
    playSFX('run')
    handleStop()
    const flat = flattenToSteps(workspace, { implicitVarNames: varNameOptions })
    if (flat.ok === false) {
      playSFX('fail')
      setFlattenError(flat.message)
      setMascot({
        text: t('mascot.flattenError'),
        mood: 'sad',
      })
      return
    }

    runAttemptsRef.current += 1
    const attempt = runAttemptsRef.current

    const controller = new AbortController()
    abortRef.current = controller
    setFlattenError(null)
    setIsRunning(true)
    clearGridState()

    try {
      const finalGrid = await runStepsOnGrid(
        flat.steps,
        rows,
        cols,
        (g, cur) => {
          setGrid(cloneGrid(g))
          setCursor(cur)
        },
        STEP_DELAY_MS,
        controller.signal,
      )

      if (controller.signal.aborted) return

      const merged = gridToFlatPattern(finalGrid, cols)
      const ok = patternsMatch(merged, level.targetPattern)
      const blocksUsed = countBlocks(workspace)
      const starsResult = computeStars(ok, attempt, blocksUsed, level)

      if (ok) {
        const stars = starsResult as 1 | 2 | 3
        celebrateWin()
        playSFX('win')
        onLessonWin(stars)
        setMascot({
          text:
            stars === 3
              ? t('mascot.win3')
              : stars === 2
                ? t('mascot.win2')
                : t('mascot.win1'),
          mood: 'happy',
        })
        setResultModal({
          open: true,
          ok: true,
          stars: starsResult,
          title: t('modal.winTitle'),
          detail: (
            <p className="text-sm text-slate-300">
              {t('modal.winBody')}
            </p>
          ),
        })
      } else {
        playSFX('fail')
        setShakeGen((n) => n + 1)
        setMascot({
          text: t('mascot.fail'),
          mood: 'neutral',
        })
        setResultModal({
          open: true,
          ok: false,
          stars: 0,
          title: t('modal.almostTitle'),
          detail: (
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                {t('modal.failLead', {
                  drawBox: 'drawBox()',
                  skip: 'skip()',
                })}
              </p>
              <Alert
                type="info"
                showIcon
                message={t('modal.tipTitle')}
                description={t('modal.tipBody')}
              />
            </div>
          ),
        })
      }
    } finally {
      setIsRunning(false)
    }
  }, [
    clearGridState,
    handleStop,
    level,
    onLessonWin,
    rows,
    cols,
    varNameOptions,
    workspace,
    t,
  ])

  const addBlockFromPalette = useCallback(
    (blockId: string) => {
      let next: BlockNode
      if (blockId === 'newLine') {
        next = { id: createId(), kind: 'newLine' }
      } else if (blockId === 'skip') {
        next = { id: createId(), kind: 'skip' }
      } else if (blockId === 'repeat') {
        next = {
          id: createId(),
          kind: 'repeat',
          count: { type: 'literal', value: 3 },
          children: [],
        }
      } else if (blockId === 'varDecl') {
        const name = varNameOptions[0] ?? 'n'
        next = { id: createId(), kind: 'varDecl', name, initial: DEFAULT_VAR_DECL_INITIAL }
      } else if (blockId.startsWith('drawBox:')) {
        const color = blockId.split(':')[1] as ColorKey
        next = { id: createId(), kind: 'drawBox', color }
      } else {
        return
      }

      playSFX('add')
      setWorkspace((prev) => appendBlock(prev, insertTarget, next))
      setFlattenError(null)
    },
    [insertTarget, varNameOptions],
  )

  const removeBlock = useCallback((id: string) => {
    setWorkspace((prev) => removeBlockById(prev, id))
    setInsertTarget((cur) => (cur === id ? 'root' : cur))
  }, [])

  const changeRepeatCountSource = useCallback((id: string, cs: CountSource) => {
    setWorkspace((prev) => updateRepeatCountSource(prev, id, cs))
  }, [])

  const patchVarDecl = useCallback((id: string, patch: Partial<{ name: string; initial: number }>) => {
    setWorkspace((prev) => updateVarDecl(prev, id, patch))
    setFlattenError(null)
  }, [])

  const repeatTargets = useMemo(
    () => workspace.flatMap((n) => collectRepeatsFromNode(n)),
    [workspace],
  )

  const blockCount = useMemo(() => countBlocks(workspace), [workspace])

  useEffect(() => {
    if (blockCount > prevBlockCountRef.current) {
      const el = codeScrollRef.current
      if (el) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
          })
        })
      }
    }
    prevBlockCountRef.current = blockCount
  }, [blockCount])

  useEffect(() => {
    const primary = primaryCodeFocus(focusLanguages)
    const tipKey = primary ? `mascot.tip.${primary}` : 'mascot.tip.default'
    setMascot({ text: t(tipKey), mood: 'neutral' })
  }, [lessonSignature, focusLanguages, t])

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <main className="grid min-h-0 w-full flex-1 grid-cols-1 gap-4 overflow-hidden px-4 py-4 md:gap-5 md:px-5 md:py-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.72fr)_minmax(0,0.88fr)] lg:items-stretch lg:px-8 lg:auto-rows-[minmax(0,1fr)]">
        {/* Columna 1: brief + lienzo */}
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
              <Tag color="purple">{chapterTitle}</Tag>
            </div>
            <p className="max-h-[min(52vh,26rem)] overflow-y-auto whitespace-pre-line text-sm leading-snug text-slate-300">
              {locale === 'en' ? level.instructionEn : level.instructionEs}
            </p>
          </div>

          <div className="flex min-h-[220px] flex-1 flex-col rounded-2xl border border-teal-500/20 bg-slate-900/60 p-4 shadow-xl shadow-black/25 ring-1 ring-teal-500/15 backdrop-blur-sm md:p-5 lg:min-h-0">
            <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
              <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
                <LayoutGrid
                  className="size-5 shrink-0 text-teal-400"
                  strokeWidth={iconStroke.soft}
                  aria-hidden
                />
                {t('workspace.canvas')}
              </h2>
              <CursorBadge
                active={isRunning}
                label={t('workspace.rowCol', {
                  row: cursor.row + 1,
                  col: cursor.col + 1,
                })}
              />
            </div>

            <motion.div
              key={shakeGen}
              initial={{ x: 0 }}
              animate={{ x: shakeGen > 0 ? [0, -14, 14, -10, 10, -6, 6, 0] : 0 }}
              transition={{ duration: 0.48, ease: 'easeOut' }}
              className="min-h-0 flex-1 overflow-auto"
            >
              <div
                className="mx-auto grid w-fit place-content-start gap-2 py-1"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                }}
              >
                {grid.map((row, r) =>
                  row.map((cell, c) => {
                    const idx = r * cols + c
                    const target = level.targetPattern[idx] ?? 'skip'
                    const isCursor = cursor.row === r && cursor.col === c
                    const bgClass =
                      cell === ''
                        ? 'border-slate-600 bg-slate-800/90'
                        : `${COLOR_META[cell as ColorKey].tailwindClass} border-transparent`

                    return (
                      <motion.div
                        key={`${r}-${c}`}
                        layout
                        className={`relative flex size-14 items-center justify-center rounded-xl border-2 sm:size-16 ${
                          isCursor && isRunning
                            ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950'
                            : ''
                        } ${bgClass}`}
                        animate={{
                          scale: isCursor && isRunning ? 1.05 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                      >
                        <span className="sr-only">
                          Celda {idx + 1}, objetivo {target}
                        </span>
                        {target !== 'skip' && (
                          <span
                            className="pointer-events-none absolute right-1 top-1 size-2 rounded-full bg-white/25 ring-1 ring-white/30"
                            title="Meta"
                          />
                        )}
                      </motion.div>
                    )
                  }),
                )}
              </div>
            </motion.div>

            <p className="mt-2 shrink-0 text-center text-[11px] text-slate-400 leading-snug">
              {t('workspace.canvasHint', { skip: t('workspace.skipToken') })}
            </p>
          </div>
        </section>

        {/* Columna 2: código (franja más estrecha → más sitio para el lienzo) */}
        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden max-lg:min-h-[220px] lg:h-full">
          <motion.div
            className={`flex min-h-0 h-full max-h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-slate-900/75 p-3 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-500/20 backdrop-blur-sm md:p-4 lg:p-4 ${
              isRunning ? 'border-emerald-400/60 ring-emerald-400/35' : 'border-indigo-500/25'
            }`}
            animate={
              isRunning
                ? {
                    boxShadow: [
                      '0 20px 40px -12px rgb(0 0 0 / 0.45)',
                      '0 0 0 3px rgb(52 211 153 / 0.28)',
                      '0 20px 40px -12px rgb(0 0 0 / 0.45)',
                    ],
                  }
                : { boxShadow: '0 20px 40px -12px rgb(0 0 0 / 0.45)' }
            }
            transition={
              isRunning
                ? { repeat: Infinity, duration: 1.15, ease: 'easeInOut' }
                : { duration: 0.35 }
            }
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
                    icon={
                      <Eraser className="size-4 text-amber-400" strokeWidth={iconStroke.medium} aria-hidden />
                    }
                    onClick={clearCode}
                  >
                    {t('workspace.clear')}
                  </Button>
                </motion.span>
                <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-block">
                  <Button
                    className="h-10 rounded-xl border border-teal-500/35 bg-teal-950/35 font-display font-semibold text-teal-100 shadow-none hover:!border-teal-400/50 hover:!bg-teal-900/45 hover:!text-white"
                    icon={
                      <RotateCcw className="size-4 text-teal-400" strokeWidth={iconStroke.medium} aria-hidden />
                    }
                    onClick={resetCanvas}
                  >
                    {t('workspace.resetCanvas')}
                  </Button>
                </motion.span>
                <motion.span
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block"
                >
                  <Button
                    type="primary"
                    className="relative h-11 overflow-hidden rounded-xl border-0 bg-gradient-to-r from-emerald-600 to-teal-600 px-5 font-display text-base font-bold shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/25 hover:!from-emerald-500 hover:!to-teal-500"
                    icon={<Play className="size-4 fill-current" strokeWidth={iconStroke.medium} aria-hidden />}
                    loading={isRunning}
                    onClick={() => void handleRun()}
                  >
                    {t('workspace.run')}
                  </Button>
                </motion.span>
              </div>
            </div>

            {flattenError ? (
              <Alert
                className="mb-3 shrink-0"
                type="warning"
                showIcon
                message={t('workspace.programProblem')}
                description={flattenError}
                closable
                onClose={() => setFlattenError(null)}
              />
            ) : null}

            <div className="mb-3 shrink-0 rounded-lg border border-slate-600/80 bg-slate-950/60 px-3 py-2 text-xs text-slate-300">
              <span className="font-semibold text-indigo-300">{t('workspace.destination')}</span>{' '}
              {insertTarget === 'root' ? (
                t('workspace.mainProgram')
              ) : (
                <button
                  type="button"
                  className="font-code text-amber-400 underline-offset-2 hover:text-amber-300 hover:underline"
                  onClick={() => setInsertTarget('root')}
                >
                  {t('workspace.insideRepeat')}
                </button>
              )}
            </div>

            <div
              ref={codeScrollRef}
              className="code-workspace-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 [scrollbar-gutter:stable]"
            >
              {workspace.length === 0 ? (
                <EmptyWorkspaceHint />
              ) : (
                <BlockListView
                  nodes={workspace}
                  depth={0}
                  onRemove={removeBlock}
                  onChangeRepeatCountSource={(id, source) => changeRepeatCountSource(id, source)}
                  onUpdateVarDecl={patchVarDecl}
                  activeInsertId={insertTarget}
                  onSelectRepeat={setInsertTarget}
                  varNameOptions={varNameOptions}
                />
              )}
            </div>
          </motion.div>
        </section>

        {/* Columna 3: paleta + contenedores */}
        <section className="flex min-h-[240px] min-w-0 flex-col lg:min-h-0">
          <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-violet-500/25 bg-slate-900/70 p-4 shadow-xl shadow-violet-950/35 ring-1 ring-violet-500/15 backdrop-blur-sm md:p-5">
            <div className="mb-3 shrink-0 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
                <Blocks
                  className="size-5 shrink-0 text-violet-400"
                  strokeWidth={iconStroke.soft}
                  aria-hidden
                />
                {t('workspace.palette')}
              </h2>
              <span className="text-[11px] text-slate-400">{t('workspace.paletteHint')}</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
              <BlockPalette allowed={allowedSet} disabled={isRunning} onPick={addBlockFromPalette} />
              <div className="mt-5 border-t border-white/10 pt-4">
                <InstructionVisualExample pattern={level.targetPattern} cols={level.gridCols} />
              </div>
            </div>
            <div className="mt-4 shrink-0 flex flex-wrap gap-2 border-t border-white/10 pt-3">
              <span className="w-full text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {t('workspace.activeContainer')}
              </span>
              <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} className="inline-block">
                <Button
                  size="small"
                  shape="round"
                  type={insertTarget === 'root' ? 'primary' : 'default'}
                  className={
                    insertTarget === 'root'
                      ? '!rounded-full !border !border-indigo-500 !bg-indigo-600 !font-display !font-bold !text-white !shadow-none hover:!border-indigo-400 hover:!bg-indigo-500'
                      : '!rounded-full !border !border-slate-600 !bg-slate-800/90 !font-display !font-semibold !text-slate-200 hover:!border-slate-500 hover:!bg-slate-700'
                  }
                  onClick={() => setInsertTarget('root')}
                  disabled={isRunning}
                >
                  {t('workspace.root')}
                </Button>
              </motion.span>
              {repeatTargets.map((rep) => (
                <motion.span
                  key={rep.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-block"
                >
                  <Button
                    size="small"
                    shape="round"
                    type={insertTarget === rep.id ? 'primary' : 'default'}
                    className={
                      insertTarget === rep.id
                        ? '!rounded-full !border !border-fuchsia-500 !bg-fuchsia-600 !font-display !font-bold !text-white !shadow-none hover:!border-fuchsia-400 hover:!bg-fuchsia-500'
                        : '!rounded-full !border !border-slate-600 !bg-slate-800/90 !font-display !font-semibold !text-slate-200 hover:!border-slate-500 hover:!bg-slate-700'
                    }
                    onClick={() => setInsertTarget(rep.id)}
                    disabled={isRunning}
                  >
                    {t('workspace.repeatWith', {
                      label: formatCountLabel(rep.count),
                    })}
                  </Button>
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <MascotBubble
        visible={Boolean(mascot.text)}
        mood={mascot.mood}
        message={mascot.text}
      />

      <Modal
        open={resultModal.open}
        onCancel={() => setResultModal((m) => ({ ...m, open: false }))}
        footer={
          <div className="flex flex-wrap items-center justify-center gap-3 border-t border-white/10 bg-slate-950/95 px-5 py-4 sm:justify-end md:px-6">
            <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-flex max-w-full min-w-0">
              <Button
                className="group inline-flex !h-auto min-h-0 max-w-full items-center whitespace-normal rounded-xl border border-slate-600 bg-slate-900 px-5 py-3 font-display font-bold text-slate-100 shadow-lg hover:!border-amber-500/50 hover:!bg-slate-800"
                onClick={() => setResultModal((m) => ({ ...m, open: false }))}
              >
                <span className="flex w-full min-w-0 items-start gap-3 text-left">
                  <Gamepad2
                    className="mt-0.5 size-4 shrink-0 text-amber-400 group-hover:text-amber-300"
                    strokeWidth={iconStroke.medium}
                    aria-hidden
                  />
                  <span className="flex min-w-0 flex-col gap-1.5">
                    <span className="text-sm leading-snug">{t('modal.keepPracticing')}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 group-hover:text-slate-400">
                      {t('modal.retryLevel')}
                    </span>
                  </span>
                </span>
              </Button>
            </motion.span>
            {resultModal.ok && campaignHasRemainingPuzzle ? (
              <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-flex max-w-full min-w-0">
                <Button
                  type="primary"
                  className="group inline-flex !h-auto min-h-0 max-w-full items-center whitespace-normal rounded-xl border-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-display font-bold text-white shadow-lg ring-1 ring-white/10 hover:!from-violet-500 hover:!to-fuchsia-500"
                  onClick={() => {
                    setResultModal((m) => ({ ...m, open: false }))
                    onAdvanceCampaignPuzzle()
                  }}
                >
                  <span className="flex w-full min-w-0 flex-col gap-1.5 text-left text-white">
                    <span className="flex min-w-0 items-center gap-3">
                      <Trophy className="size-4 shrink-0 text-amber-200" strokeWidth={iconStroke.medium} aria-hidden />
                      <span className="min-w-0 flex-1 text-sm leading-tight">{t('modal.nextPuzzle')}</span>
                      <Rocket className="size-4 shrink-0 text-white/90" strokeWidth={iconStroke.medium} aria-hidden />
                    </span>
                    <span className="flex min-w-0 items-center gap-2">
                      <Sparkles className="size-3.5 shrink-0 text-amber-200" strokeWidth={iconStroke.soft} aria-hidden />
                      <span className="min-w-0 text-[10px] font-semibold uppercase tracking-wide text-white/85">
                        {t('modal.newChallengeXp')}
                      </span>
                    </span>
                  </span>
                </Button>
              </motion.span>
            ) : null}
          </div>
        }
        centered
        closable={false}
        styles={{
          body: {
            padding: 0,
            overflow: 'hidden',
            borderRadius: 16,
            border: '1px solid rgb(71 85 105 / 0.55)',
            background:
              'linear-gradient(165deg, rgb(15 23 42 / 0.98) 0%, rgb(30 27 75 / 0.95) 45%, rgb(15 23 42 / 0.99) 100%)',
            boxShadow:
              '0 25px 50px -12px rgb(0 0 0 / 0.55), 0 0 0 1px rgb(255 255 255 / 0.06) inset',
          },
          mask: { backgroundColor: 'rgba(2, 6, 23, 0.72)' },
          footer: { margin: 0, padding: 0, border: 'none', background: 'transparent' },
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="relative overflow-hidden px-5 pb-2 pt-6 md:px-6"
        >
          <div className="relative flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ring-black/5 ${
                  resultModal.ok ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              >
                {resultModal.ok ? (
                  <CheckCircle2
                    className="size-8 text-white drop-shadow"
                    strokeWidth={iconStroke.strong}
                    aria-hidden
                  />
                ) : (
                  <XCircle
                    className="size-8 text-white drop-shadow"
                    strokeWidth={iconStroke.strong}
                    aria-hidden
                  />
                )}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="font-display text-xl font-bold tracking-tight text-transparent [background-clip:text] bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-indigo-200">
                  {resultModal.title}
                </p>
              </div>
            </div>
            {resultModal.ok && resultModal.stars > 0 ? (
              <div className="flex items-center justify-center gap-3 py-2" aria-label="Estrellas conseguidas">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.06 * i, type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    <Star
                      className={`size-12 ${
                        i <= resultModal.stars
                          ? 'fill-amber-400 stroke-amber-300 text-amber-500'
                          : 'fill-none stroke-slate-600 text-slate-600'
                      }`}
                      strokeWidth={i <= resultModal.stars ? 0 : 1.5}
                    />
                  </motion.div>
                ))}
              </div>
            ) : null}
            <div className="text-sm leading-relaxed text-slate-300">{resultModal.detail}</div>
          </div>
        </motion.div>
      </Modal>
    </div>
  )
}

/** Guided language lessons embedded in the Learn (blocks) shell when URL has e.g. lang + lesson + pmode. */
type LearnGuidedEmbed = {
  lang: LearningLanguageId
  lessonIndex: number
  practiceMode: PracticeTrackMode
}

function parseLearnGuidedEmbed(search: string): LearnGuidedEmbed | null {
  const { screen, practice } = parseAppUrl(search)
  if (screen !== 'learn' || !practice?.lang) return null
  const langs = loadLearningLanguages().filter((id): id is LearningLanguageId => hasLanguagePractice(id))
  if (!langs.includes(practice.lang)) return null
  if (!hasGuidedCourse(practice.lang)) return null
  if (practice.overview) return null
  if (practice.quiz !== undefined) return null

  const openGuided = practice.lesson !== undefined || practice.pmode !== undefined
  if (!openGuided) return null

  if (practice.pmode) {
    saveTrackPracticeMode(practice.lang, practice.pmode)
  }
  const course = getGuidedCourse(practice.lang)
  if (!course?.lessons.length) return null
  const max = course.lessons.length - 1
  const lessonIndex = Math.min(max, Math.max(0, practice.lesson ?? 0))
  const practiceMode: PracticeTrackMode = practice.pmode ?? getTrackPracticeMode(practice.lang)
  return { lang: practice.lang, lessonIndex, practiceMode }
}

function LearnShell({
  onHome,
  onPractice,
}: {
  onHome: () => void
  onPractice: (deep?: PracticeDeepLink | null) => void
}) {
  const { t, locale, setLocale } = useI18n()
  const [learningLanguages] = useState<LearningLanguageId[]>(() => loadLearningLanguages())
  const [quizOpen, setQuizOpen] = useState(false)
  const [guidedEmbed, setGuidedEmbed] = useState<LearnGuidedEmbed | null>(() =>
    typeof window !== 'undefined' ? parseLearnGuidedEmbed(window.location.search) : null,
  )

  useEffect(() => {
    const onPop = () => setGuidedEmbed(parseLearnGuidedEmbed(window.location.search))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (guidedEmbed) {
      replaceUrlSearch(
        serializeAppUrl('learn', {
          lang: guidedEmbed.lang,
          pmode: guidedEmbed.practiceMode,
          lesson: guidedEmbed.lessonIndex,
        }),
      )
      return
    }
    const { practice } = parseAppUrl(window.location.search)
    if (
      practice &&
      (practice.lang ||
        practice.lesson !== undefined ||
        practice.pmode ||
        practice.quiz !== undefined ||
        practice.overview)
    ) {
      replaceUrlSearch(serializeAppUrl('learn'))
    }
  }, [guidedEmbed])

  const showLanguagePractice = useMemo(
    () => learningLanguages.some((id) => id !== 'blocks'),
    [learningLanguages],
  )
  const [progress, setProgress] = useState<GameProgress>(() => loadProgress())

  const chapterIndex = progress.chapterIndex
  const puzzleIndex = progress.puzzleIndex

  const chapter = CAMPAIGN_CHAPTERS[chapterIndex]!
  const level = chapter.puzzles[puzzleIndex]!

  const chapterDisplayTitle = useMemo(
    () => chapterTitleForLocale(chapter.title, CHAPTER_TITLES_EN, chapterIndex, locale),
    [chapter.title, chapterIndex, locale],
  )

  const difficultyLabel = useMemo(() => {
    const map = {
      Fácil: 'easy',
      Normal: 'normal',
      Avanzado: 'hard',
    } as const
    const key = map[level.difficulty as keyof typeof map]
    return t(`difficulty.${key}`)
  }, [level.difficulty, t])

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const xpBar = useMemo(() => getXpBar(progress.xp), [progress.xp])

  const campaignHasRemainingPuzzle =
    puzzleIndex < chapter.puzzles.length - 1 ||
    chapterIndex < CAMPAIGN_CHAPTERS.length - 1

  const progressPercent = useMemo(() => {
    const total = chapter.puzzles.length
    if (total <= 0) return 0
    return Math.round(((puzzleIndex + 1) / total) * 100)
  }, [chapter.puzzles.length, puzzleIndex])

  const goNextCampaignPuzzle = useCallback(() => {
    setProgress((p) => {
      const ch = CAMPAIGN_CHAPTERS[p.chapterIndex]!
      if (p.puzzleIndex < ch.puzzles.length - 1) {
        return { ...p, puzzleIndex: p.puzzleIndex + 1 }
      }
      if (p.chapterIndex < CAMPAIGN_CHAPTERS.length - 1) {
        return { ...p, chapterIndex: p.chapterIndex + 1, puzzleIndex: 0 }
      }
      return p
    })
  }, [])

  const setChapterSafe = useCallback((next: number) => {
    const chapterIdx = Math.max(0, Math.min(CAMPAIGN_CHAPTERS.length - 1, next))
    setProgress((p) => ({ ...p, chapterIndex: chapterIdx, puzzleIndex: 0 }))
  }, [])

  const adjustPuzzle = useCallback((delta: number) => {
    setProgress((p) => {
      const ch = CAMPAIGN_CHAPTERS[p.chapterIndex]!
      const maxIndex = ch.puzzles.length - 1
      const next = p.puzzleIndex + delta
      return {
        ...p,
        puzzleIndex: Math.max(0, Math.min(maxIndex, next)),
      }
    })
  }, [])

  const lessonKey = `${chapterIndex}:${puzzleIndex}`

  const guidedCourseLen = useMemo(
    () => (guidedEmbed ? getGuidedCourse(guidedEmbed.lang)?.lessons.length ?? 0 : 0),
    [guidedEmbed],
  )

  return (
      <div className="font-display relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-slate-950 text-slate-100">
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-indigo-950/90 via-slate-950 to-[#0b1020]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_110%_70%_at_50%_-5%,rgba(99,102,241,0.28),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 z-0 h-1/2 w-1/2 bg-[radial-gradient(circle_at_80%_100%,rgba(168,85,247,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-white/10 bg-slate-950/75 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6 md:py-3.5">
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="text"
                className="font-display font-semibold text-slate-300 hover:!bg-white/10 hover:!text-white"
                icon={<House className="size-4" strokeWidth={iconStroke.medium} aria-hidden />}
                onClick={onHome}
              >
                {t('nav.home')}
              </Button>
            </div>
            <div className="flex shrink-0 items-center border-l border-white/10 pl-3">
              <LearnPracticeModeToggle
                value="learn"
                onLearn={() => {}}
                onPractice={() =>
                  onPractice(
                    guidedEmbed
                      ? {
                          lang: guidedEmbed.lang,
                          pmode: guidedEmbed.practiceMode,
                          lesson: guidedEmbed.lessonIndex,
                        }
                      : undefined,
                  )
                }
                practiceDisabled={!showLanguagePractice}
              />
            </div>
            <div className="flex min-w-0 shrink-0 items-center gap-2 border-l border-white/10 pl-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-indigo-400/30 bg-gradient-to-br from-indigo-600 to-violet-700 shadow-lg shadow-indigo-950/50 ring-1 ring-white/15">
                <SquareCode
                  className="size-[22px] text-white"
                  strokeWidth={iconStroke.strong}
                  aria-hidden
                />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-[10px] uppercase tracking-wide text-indigo-300/95">
                  {t('header.tagline')}
                </p>
                <h1 className="truncate text-sm font-semibold text-white sm:text-base">
                  {guidedEmbed ? t(`hub.track.${guidedEmbed.lang}.title`) : t('header.title')}
                </h1>
              </div>
            </div>

            <div className="flex min-w-[140px] max-w-[180px] flex-col gap-1 border-l border-white/10 pl-3 sm:max-w-[220px]">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-300/95">
                {t('header.xp', { level: xpBar.level })}
              </span>
              <Progress
                percent={xpBar.segmentPercent}
                size="small"
                showInfo={false}
                strokeColor={{ from: '#fbbf24', to: '#f97316' }}
                trailColor="rgba(51,65,85,0.85)"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-1.5 sm:gap-x-4">
              {!guidedEmbed ? (
                <>
                  <div className="flex max-w-full items-center gap-1.5">
                    <Library className="size-3.5 shrink-0 text-indigo-400" strokeWidth={iconStroke.medium} aria-hidden />
                    <span className="hidden text-[11px] text-slate-400 sm:inline">{t('header.chapter')}</span>
                    <Select
                      size="small"
                      className="min-w-[160px] max-w-[min(100vw-12rem,280px)] sm:min-w-[200px]"
                      value={chapterIndex}
                      options={CAMPAIGN_CHAPTERS.map((c) => ({
                        value: c.index,
                        label: `${chapterTitleForLocale(c.title, CHAPTER_TITLES_EN, c.index, locale)} · ${c.puzzles.length}`,
                      }))}
                      onChange={(v) => {
                        const next = typeof v === 'number' ? v : Number(v)
                        setChapterSafe(next)
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1 border-l border-white/10 pl-3">
                    <motion.span whileTap={{ scale: 0.92 }} className="inline-block">
                      <Button
                        size="small"
                        shape="round"
                        className="border-indigo-500/45 bg-indigo-950/55 font-display font-semibold text-indigo-100 hover:!border-indigo-400/70 hover:!bg-indigo-900/60 hover:!text-white"
                        aria-label={t('header.prevPuzzle')}
                        icon={<ChevronLeft className="size-3.5" strokeWidth={iconStroke.medium} aria-hidden />}
                        onClick={() => adjustPuzzle(-1)}
                        disabled={puzzleIndex <= 0}
                      />
                    </motion.span>
                    <Select<number>
                      size="small"
                      className="w-[118px] sm:w-[132px]"
                      value={puzzleIndex}
                      popupMatchSelectWidth={false}
                      options={chapter.puzzles.map((_, i: number) => ({
                        value: i,
                        label: t('header.puzzleOption', {
                          num: String(i + 1).padStart(2, '0'),
                        }),
                      }))}
                      onChange={(v) => setProgress((p) => ({ ...p, puzzleIndex: Number(v) }))}
                    />
                    <motion.span whileTap={{ scale: 0.92 }} className="inline-block">
                      <Button
                        size="small"
                        shape="round"
                        className="border-fuchsia-500/45 bg-fuchsia-950/45 font-display font-semibold text-fuchsia-100 hover:!border-fuchsia-400/70 hover:!bg-fuchsia-900/55 hover:!text-white"
                        aria-label={t('header.nextPuzzle')}
                        icon={<ChevronRight className="size-3.5" strokeWidth={iconStroke.medium} aria-hidden />}
                        onClick={() => adjustPuzzle(1)}
                        disabled={puzzleIndex >= chapter.puzzles.length - 1}
                      />
                    </motion.span>
                  </div>

                  <div className="flex min-w-[140px] max-w-[200px] flex-1 items-center gap-2 border-l border-white/10 pl-3 sm:min-w-[160px] sm:max-w-none sm:flex-none">
                    <ListOrdered className="size-3.5 shrink-0 text-slate-500" strokeWidth={iconStroke.medium} aria-hidden />
                    <div className="min-w-0 flex-1 pt-0.5">
                      <Progress
                        percent={progressPercent}
                        size="small"
                        showInfo={false}
                        strokeColor="#818cf8"
                      />
                    </div>
                    <span className="shrink-0 tabular-nums text-[11px] text-slate-400">
                      {puzzleIndex + 1}/{chapter.puzzles.length}
                    </span>
                    <Tag className="m-0 shrink-0 border border-slate-600/70 px-1.5 py-0 text-[10px] leading-tight text-slate-200">
                      {difficultyLabel}
                    </Tag>
                  </div>
                </>
              ) : (
                <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2 border-l border-white/10 pl-3">
                  <span className="font-display text-sm font-semibold text-slate-200">
                    {t('guided.lessonMeta', {
                      current: String(guidedEmbed.lessonIndex + 1),
                      total: String(guidedCourseLen),
                    })}
                  </span>
                  <Tag
                    color={guidedEmbed.practiceMode === 'beginner' ? 'cyan' : 'default'}
                    className="m-0 font-display text-[11px] font-semibold"
                  >
                    {guidedEmbed.practiceMode === 'beginner'
                      ? t('practice.modeBeginner')
                      : t('practice.modeAdvanced')}
                  </Tag>
                </div>
              )}

              <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-2 border-t border-white/5 pt-2 sm:w-auto sm:border-t-0 sm:pt-0 lg:border-l lg:border-white/10 lg:pl-3">
                <Button
                  type="text"
                  size="small"
                  className="font-display text-[11px] font-semibold text-indigo-200 hover:!bg-white/10 hover:!text-white"
                  icon={<ClipboardCheck className="size-3.5" strokeWidth={iconStroke.medium} aria-hidden />}
                  onClick={() => setQuizOpen(true)}
                >
                  {t('header.trackQuiz')}
                </Button>
                <span className="text-[10px] uppercase tracking-wide text-slate-500">UI</span>
                <div className="flex rounded-lg border border-white/10 bg-slate-900/90 p-0.5">
                  <button
                    type="button"
                    onClick={() => setLocale('en')}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                      locale === 'en'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('locale.en')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale('es')}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                      locale === 'es'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('locale.es')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {guidedEmbed ? (
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-2 py-2 sm:px-3 md:px-5 lg:px-6">
            <GuidedLessonRunner
              key={`learn-guided-${guidedEmbed.lang}-${guidedEmbed.lessonIndex}-${locale}-${guidedEmbed.practiceMode}`}
              lang={guidedEmbed.lang}
              lessonIndex={guidedEmbed.lessonIndex}
              practiceMode={guidedEmbed.practiceMode}
              onBack={() => setGuidedEmbed(null)}
              onLessonComplete={() => {}}
              hasNextLesson={guidedEmbed.lessonIndex + 1 < guidedCourseLen}
              hasPrevLesson={guidedEmbed.lessonIndex > 0}
              onPrevLesson={() =>
                setGuidedEmbed((s) =>
                  s && s.lessonIndex > 0 ? { ...s, lessonIndex: s.lessonIndex - 1 } : s,
                )
              }
              onNextLesson={() =>
                setGuidedEmbed((s) =>
                  s && guidedCourseLen > 0 && s.lessonIndex + 1 < guidedCourseLen
                    ? { ...s, lessonIndex: s.lessonIndex + 1 }
                    : s,
                )
              }
              onGoToLesson={(index) =>
                setGuidedEmbed((s) => {
                  if (!s) return s
                  if (index < 0 || index >= guidedCourseLen) return s
                  return { ...s, lessonIndex: index }
                })
              }
            />
          </div>
        ) : (
          <PuzzleWorkspace
            key={lessonKey}
            level={level}
            chapterTitle={chapterDisplayTitle}
            lessonSignature={lessonKey}
            focusLanguages={learningLanguages}
            campaignHasRemainingPuzzle={campaignHasRemainingPuzzle}
            onAdvanceCampaignPuzzle={goNextCampaignPuzzle}
            onLessonWin={(stars) => {
              setProgress((g) => mergeWin(g, lessonKey, stars))
            }}
          />
        )}

        <footer className="shrink-0 border-t border-white/10 bg-slate-950/80 px-4 py-4 text-center text-[11px] text-slate-500 backdrop-blur-sm md:px-8">
          {t('footer.line')}
        </footer>

        <LanguageQuizModal
          open={quizOpen}
          onClose={() => setQuizOpen(false)}
          candidateIds={learningLanguages}
        />
        </div>
      </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>(() => {
    if (typeof window !== 'undefined') {
      const { screen: fromUrl } = parseAppUrl(window.location.search)
      if (fromUrl) {
        saveScreen(fromUrl)
        return fromUrl
      }
    }
    return loadScreen()
  })

  useEffect(() => {
    const onPop = () => {
      const { screen: next } = parseAppUrl(window.location.search)
      if (next) {
        saveScreen(next)
        setScreen(next)
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const goLearn = useCallback(() => {
    saveScreen('learn')
    setScreen('learn')
    replaceUrlSearch(serializeAppUrl('learn'))
  }, [])

  const goPractice = useCallback((deep?: PracticeDeepLink | null) => {
    saveScreen('practice')
    setScreen('practice')
    replaceUrlSearch(serializeAppUrl('practice', deep ?? undefined))
  }, [])

  const goHub = useCallback(() => {
    saveScreen('hub')
    setScreen('hub')
    replaceUrlSearch(serializeAppUrl('hub'))
  }, [])

  if (screen === 'practice') {
    return <LanguagePracticeShell onHome={goHub} onLearn={goLearn} />
  }

  if (screen === 'hub') {
    return (
      <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
        <LearningHub onContinueBlocks={goLearn} onContinuePractice={goPractice} />
      </div>
    )
  }

  return <LearnShell onHome={goHub} onPractice={goPractice} />
}
