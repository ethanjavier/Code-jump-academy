import {
  Alert,
  Button,
  ConfigProvider,
  Modal,
  Progress,
  Select,
  Tag,
  theme as antdTheme,
} from 'antd'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eraser,
  Layers,
  Map as MapIcon,
  Play,
  RotateCcw,
  Sparkles,
  SquareCode,
  XCircle,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { CAMPAIGN_CHAPTERS } from './campaign/buildCampaign'
import type { RepeatBlock } from './engine/blocks'
import type { ColorKey } from './engine/blocks'
import type { BlockNode } from './engine/blocks'
import type { CountSource } from './engine/blocks'
import type { Level } from './types/level'
import { STEP_DELAY_MS, COLOR_META } from './app/constants'
import {
  BlockListView,
  BlockPalette,
  CursorBadge,
  EmptyWorkspaceHint,
  formatCountLabel,
} from './app/BlocksUI'
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
  campaignHasRemainingPuzzle: boolean
  onAdvanceCampaignPuzzle: () => void
}

function PuzzleWorkspace({
  level,
  chapterTitle,
  campaignHasRemainingPuzzle,
  onAdvanceCampaignPuzzle,
}: PuzzleWorkspaceProps) {
  const abortRef = useRef<AbortController | null>(null)
  const codeScrollRef = useRef<HTMLDivElement>(null)
  const prevBlockCountRef = useRef(0)

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
  }>({ open: false, ok: false, title: '', detail: null })

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
  }, [clearGridState, handleStop])

  const handleRun = useCallback(async () => {
    handleStop()
    const flat = flattenToSteps(workspace)
    if (!flat.ok) {
      setFlattenError(flat.message)
      return
    }

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

      setResultModal({
        open: true,
        ok,
        title: ok ? '¡Desafío superado!' : 'Casi lo tienes',
        detail: ok ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Tu pintura coincide con el objetivo. Pasa al siguiente rompecabezas cuando quieras.
          </p>
        ) : (
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>
              Revisa el orden de los bloques y los saltos de línea. Compara tu lienzo con el patrón
              objetivo.
            </p>
            <Alert
              type="info"
              showIcon
              message="Consejo"
              description="Ejecuta mentalmente el código fila a fila: cada drawBox avanza una celda hacia la derecha."
            />
          </div>
        ),
      })
    } finally {
      setIsRunning(false)
    }
  }, [clearGridState, handleStop, level.targetPattern, rows, cols, workspace])

  const addBlockFromPalette = useCallback(
    (blockId: string) => {
      let next: BlockNode
      if (blockId === 'newLine') {
        next = { id: createId(), kind: 'newLine' }
      } else if (blockId === 'repeat') {
        next = {
          id: createId(),
          kind: 'repeat',
          count: { type: 'literal', value: 3 },
          children: [],
        }
      } else if (blockId === 'varDecl') {
        const name = varNameOptions[0] ?? 'n'
        next = { id: createId(), kind: 'varDecl', name, initial: 3 }
      } else if (blockId.startsWith('drawBox:')) {
        const color = blockId.split(':')[1] as ColorKey
        next = { id: createId(), kind: 'drawBox', color }
      } else {
        return
      }

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

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <main className="grid min-h-0 w-full flex-1 grid-cols-1 gap-5 overflow-hidden px-5 py-4 sm:px-8 lg:grid-cols-3 lg:items-stretch lg:gap-6 lg:py-5 lg:auto-rows-[minmax(0,1fr)]">
        {/* Columna 1: brief + lienzo */}
        <section className="flex min-h-0 flex-col gap-3 lg:min-h-0">
          <div className="shrink-0 rounded-2xl border border-slate-800/90 bg-slate-900/40 p-4 shadow-xl shadow-black/30 ring-1 ring-white/5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                <Sparkles className="size-5 text-amber-300" aria-hidden />
                Instrucciones
              </h2>
              <Tag color="purple">{chapterTitle}</Tag>
            </div>
            <p className="line-clamp-6 text-sm leading-relaxed text-slate-300">{level.instruction}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span>
                Columnas:{' '}
                <strong className="text-slate-200">{level.gridCols}</strong>
              </span>
              <span className="text-slate-600">·</span>
              <span>
                Celdas:{' '}
                <strong className="text-slate-200">{level.targetPattern.length}</strong>
              </span>
            </div>
          </div>

          <div className="flex min-h-[220px] flex-1 flex-col rounded-2xl border border-slate-800/90 bg-slate-900/40 p-4 shadow-xl shadow-black/30 ring-1 ring-white/5 lg:min-h-0">
            <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-white">Lienzo</h2>
              <CursorBadge
                active={isRunning}
                label={`Fila ${cursor.row + 1}, col ${cursor.col + 1}`}
              />
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
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
                        ? 'border-slate-700 bg-slate-800/80'
                        : `${COLOR_META[cell as ColorKey].tailwindClass} border-transparent`

                    return (
                      <motion.div
                        key={`${r}-${c}`}
                        layout
                        className={`relative flex size-14 items-center justify-center rounded-xl border-2 sm:size-16 ${
                          isCursor && isRunning
                            ? 'ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-950'
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
            </div>

            <p className="mt-2 shrink-0 text-center text-[11px] text-slate-500">
              El punto clarito marca celdas objetivo (
              <span className="text-slate-300">skip</span> no se comprueba).
            </p>
          </div>
        </section>

        {/* Columna 2: solo esta columna hace scroll vertical del código */}
        <section className="flex min-h-0 flex-col overflow-hidden max-lg:min-h-[260px] lg:h-full">
          <div className="flex min-h-0 h-full max-h-full flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/40 p-4 shadow-xl shadow-black/30 ring-1 ring-white/5">
            <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-white">Tu código</h2>
              <div className="flex flex-wrap gap-2">
                <Button icon={<Eraser className="size-4" />} onClick={clearCode}>
                  Limpiar
                </Button>
                <Button icon={<RotateCcw className="size-4" />} onClick={resetCanvas}>
                  Lienzo
                </Button>
                <Button
                  type="primary"
                  icon={<Play className="size-4" />}
                  loading={isRunning}
                  onClick={() => void handleRun()}
                >
                  Ejecutar
                </Button>
              </div>
            </div>

            {flattenError ? (
              <Alert
                className="mb-3 shrink-0"
                type="warning"
                showIcon
                message="Tu programa tiene un problema"
                description={flattenError}
                closable
                onClose={() => setFlattenError(null)}
              />
            ) : null}

            <div className="mb-3 shrink-0 rounded-xl border border-slate-700/80 bg-slate-950/40 px-3 py-2 text-xs text-slate-300">
              <span className="font-semibold text-indigo-200">Destino:</span>{' '}
              {insertTarget === 'root' ? (
                'Programa principal'
              ) : (
                <button
                  type="button"
                  className="font-mono text-amber-300 underline-offset-2 hover:underline"
                  onClick={() => setInsertTarget('root')}
                >
                  Dentro del Repetir (volver a raíz)
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
          </div>
        </section>

        {/* Columna 3: paleta + contenedores */}
        <section className="flex min-h-[240px] flex-col lg:min-h-0">
          <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-800/90 bg-slate-900/40 p-4 shadow-xl shadow-black/30 ring-1 ring-white/5">
            <div className="mb-3 shrink-0 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-white">Paleta</h2>
              <span className="text-[11px] text-slate-500">Clic en Repetir para anidar</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
              <BlockPalette allowed={allowedSet} disabled={isRunning} onPick={addBlockFromPalette} />
            </div>
            <div className="mt-4 shrink-0 flex flex-wrap gap-2 border-t border-slate-800 pt-3">
              <span className="w-full text-[11px] text-slate-500">Contenedor activo:</span>
              <Button
                size="small"
                type={insertTarget === 'root' ? 'primary' : 'default'}
                onClick={() => setInsertTarget('root')}
                disabled={isRunning}
              >
                Raíz
              </Button>
              {repeatTargets.map((rep) => (
                <Button
                  key={rep.id}
                  size="small"
                  type={insertTarget === rep.id ? 'primary' : 'default'}
                  onClick={() => setInsertTarget(rep.id)}
                  disabled={isRunning}
                >
                  Repetir {formatCountLabel(rep.count)}
                </Button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Modal
        open={resultModal.open}
        onCancel={() => setResultModal((m) => ({ ...m, open: false }))}
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <Button onClick={() => setResultModal((m) => ({ ...m, open: false }))}>
              Seguir practicando
            </Button>
            {resultModal.ok && campaignHasRemainingPuzzle ? (
              <Button
                type="primary"
                icon={<ChevronRight className="size-4" />}
                onClick={() => {
                  setResultModal((m) => ({ ...m, open: false }))
                  onAdvanceCampaignPuzzle()
                }}
              >
                Siguiente puzzle
              </Button>
            ) : null}
          </div>
        }
        centered
      >
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-center gap-3">
            {resultModal.ok ? (
              <CheckCircle2 className="size-9 text-emerald-400" aria-hidden />
            ) : (
              <XCircle className="size-9 text-amber-400" aria-hidden />
            )}
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {resultModal.title}
              </p>
            </div>
          </div>
          {resultModal.detail}
        </div>
      </Modal>
    </div>
  )
}

export default function App() {
  const [chapterIndex, setChapterIndex] = useState(0)
  const [puzzleIndex, setPuzzleIndex] = useState(0)

  const chapter = CAMPAIGN_CHAPTERS[chapterIndex]!
  const level = chapter.puzzles[puzzleIndex]!

  const campaignHasRemainingPuzzle =
    puzzleIndex < chapter.puzzles.length - 1 ||
    chapterIndex < CAMPAIGN_CHAPTERS.length - 1

  const progressPercent = useMemo(() => {
    const total = chapter.puzzles.length
    if (total <= 0) return 0
    return Math.round(((puzzleIndex + 1) / total) * 100)
  }, [chapter.puzzles.length, puzzleIndex])

  const goNextCampaignPuzzle = useCallback(() => {
    if (puzzleIndex < chapter.puzzles.length - 1) {
      setPuzzleIndex((i) => i + 1)
    } else if (chapterIndex < CAMPAIGN_CHAPTERS.length - 1) {
      setChapterIndex((c) => c + 1)
      setPuzzleIndex(0)
    }
  }, [chapter.puzzles.length, chapterIndex, puzzleIndex])

  const setChapterSafe = useCallback((next: number) => {
    setChapterIndex(Math.max(0, Math.min(CAMPAIGN_CHAPTERS.length - 1, next)))
    setPuzzleIndex(0)
  }, [])

  const adjustPuzzle = useCallback(
    (delta: number) => {
      const next = puzzleIndex + delta
      const maxIndex = chapter.puzzles.length - 1
      setPuzzleIndex(Math.max(0, Math.min(maxIndex, next)))
    },
    [chapter.puzzles.length, puzzleIndex],
  )

  const lessonKey = `${chapterIndex}:${puzzleIndex}`

  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.darkAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          borderRadiusLG: 12,
          fontFamily:
            'ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        },
      }}
    >
      <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
        <header className="shrink-0 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 sm:px-6">
            <div className="flex min-w-0 shrink-0 items-center gap-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600/90 shadow-md shadow-indigo-900/30 ring-1 ring-indigo-400/25">
                <SquareCode className="size-[22px] text-white" aria-hidden />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-[10px] uppercase tracking-wide text-indigo-300/90">
                  CodeJump Academy
                </p>
                <h1 className="truncate text-sm font-semibold text-white sm:text-base">
                  Aprende código con bloques
                </h1>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-1.5 sm:gap-x-4">
              <div className="flex max-w-full items-center gap-1.5">
                <MapIcon className="size-3.5 shrink-0 text-indigo-300" aria-hidden />
                <span className="hidden text-[11px] text-slate-500 sm:inline">Capítulo</span>
                <Select
                  size="small"
                  className="min-w-[160px] max-w-[min(100vw-12rem,280px)] sm:min-w-[200px]"
                  value={chapterIndex}
                  options={CAMPAIGN_CHAPTERS.map((c) => ({
                    value: c.index,
                    label: `${c.title} · ${c.puzzles.length}`,
                  }))}
                  onChange={(v) => {
                    const next = typeof v === 'number' ? v : Number(v)
                    setChapterSafe(next)
                  }}
                />
              </div>

              <div className="flex items-center gap-1 border-l border-slate-700/60 pl-3">
                <Button
                  size="small"
                  aria-label="Puzzle anterior"
                  icon={<ChevronLeft className="size-3.5" />}
                  onClick={() => adjustPuzzle(-1)}
                  disabled={puzzleIndex <= 0}
                />
                <Select<number>
                  size="small"
                  className="w-[118px] sm:w-[132px]"
                  value={puzzleIndex}
                  popupMatchSelectWidth={false}
                  options={chapter.puzzles.map((lvl, i: number) => ({
                    value: i,
                    label: `#${i + 1} · Obj. ${lvl.targetPattern.filter((c) => c !== 'skip').length}`,
                  }))}
                  onChange={(v) => setPuzzleIndex(Number(v))}
                />
                <Button
                  size="small"
                  aria-label="Siguiente puzzle"
                  icon={<ChevronRight className="size-3.5" />}
                  onClick={() => adjustPuzzle(1)}
                  disabled={puzzleIndex >= chapter.puzzles.length - 1}
                />
              </div>

              <div className="flex min-w-[140px] max-w-[200px] flex-1 items-center gap-2 border-l border-slate-700/60 pl-3 sm:min-w-[160px] sm:max-w-none sm:flex-none">
                <Layers className="size-3.5 shrink-0 text-slate-500" aria-hidden />
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
                <Tag className="m-0 shrink-0 border border-slate-600/70 px-1.5 py-0 text-[10px] leading-tight">
                  {level.difficulty}
                </Tag>
              </div>
            </div>
          </div>
        </header>

        <PuzzleWorkspace
          key={lessonKey}
          level={level}
          chapterTitle={chapter.title}
          campaignHasRemainingPuzzle={campaignHasRemainingPuzzle}
          onAdvanceCampaignPuzzle={goNextCampaignPuzzle}
        />

        <footer className="shrink-0 border-t border-slate-800/80 py-3 text-center text-[11px] text-slate-500 sm:px-8">
          CodeJump Academy · inspirado en Grasshopper · React + Vite + Tailwind + Ant Design
        </footer>
      </div>
    </ConfigProvider>
  )
}
