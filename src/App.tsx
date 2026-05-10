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
  Gamepad2,
  Layers,
  Map as MapIcon,
  Play,
  Rocket,
  RotateCcw,
  Sparkles,
  SquareCode,
  Star,
  Trophy,
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
  onLessonWin: (stars: 1 | 2 | 3) => void
}

function PuzzleWorkspace({
  level,
  chapterTitle,
  campaignHasRemainingPuzzle,
  onAdvanceCampaignPuzzle,
  onLessonWin,
}: PuzzleWorkspaceProps) {
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
    const flat = flattenToSteps(workspace)
    if (!flat.ok) {
      playSFX('fail')
      setFlattenError(flat.message)
      setMascot({
        text: 'Tu código tiene un problema: revisa variables y bloques.',
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
              ? '¡Tres estrellas! ¡Primer intento y código compacto!'
              : stars === 2
                ? '¡Dos estrellas! Buen uso de bloques.'
                : '¡Una estrella! Nivel completado.',
          mood: 'happy',
        })
        setResultModal({
          open: true,
          ok: true,
          stars: starsResult,
          title: '¡Desafío superado!',
          detail: (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Tu pintura coincide con el objetivo. Sigue con el siguiente puzzle cuando quieras.
            </p>
          ),
        })
      } else {
        playSFX('fail')
        setShakeGen((n) => n + 1)
        setMascot({
          text: '¡Casi! Prueba otro orden o revisa los saltos de línea.',
          mood: 'neutral',
        })
        setResultModal({
          open: true,
          ok: false,
          stars: 0,
          title: 'Casi lo tienes',
          detail: (
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p>
                Compara tu lienzo con el patrón: cada <span className="font-code text-indigo-200">drawBox</span>{' '}
                pinta y avanza; usa <span className="font-code text-indigo-200">skip()</span> para dejar una celda en
                blanco sin pintar.
              </p>
              <Alert
                type="info"
                showIcon
                message="Consejo"
                description="Ejecuta mentalmente el código fila a fila."
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
    workspace,
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
        next = { id: createId(), kind: 'varDecl', name, initial: 3 }
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

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <main className="grid min-h-0 w-full flex-1 grid-cols-1 gap-5 overflow-hidden px-5 py-4 sm:px-8 lg:grid-cols-3 lg:items-stretch lg:gap-6 lg:py-5 lg:auto-rows-[minmax(0,1fr)]">
        {/* Columna 1: brief + lienzo */}
        <section className="flex min-h-0 flex-col gap-3 lg:min-h-0">
          <div className="shrink-0 rounded-3xl border-2 border-indigo-500/20 bg-gradient-to-br from-slate-900/80 to-indigo-950/50 p-4 shadow-xl shadow-indigo-950/40 ring-1 ring-white/5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display flex items-center gap-2 text-base font-semibold text-white">
                <Sparkles className="size-5 text-amber-300" aria-hidden />
                Instrucciones
              </h2>
              <Tag color="purple">{chapterTitle}</Tag>
            </div>
            <p className="max-h-[min(44vh,22rem)] overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-slate-300">
              {level.instruction}
            </p>
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

          <div className="flex min-h-[220px] flex-1 flex-col rounded-3xl border-2 border-teal-500/15 bg-gradient-to-br from-slate-900/80 via-emerald-950/20 to-slate-900/80 p-4 shadow-xl shadow-black/30 ring-1 ring-emerald-400/15 lg:min-h-0">
            <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-white">Lienzo</h2>
              <CursorBadge
                active={isRunning}
                label={`Fila ${cursor.row + 1}, col ${cursor.col + 1}`}
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
                        ? 'border-slate-700 bg-slate-800/80'
                        : `${COLOR_META[cell as ColorKey].tailwindClass} border-transparent`

                    return (
                      <motion.div
                        key={`${r}-${c}`}
                        layout
                        className={`relative flex size-14 items-center justify-center rounded-2xl border-2 sm:size-16 ${
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
            </motion.div>

            <p className="mt-2 shrink-0 text-center text-[11px] text-slate-500">
              Rayado en la meta = hueco sin pintar. Usa{' '}
              <span className="font-code text-slate-300">skip()</span> para avanzar sin color.
            </p>
          </div>
        </section>

        {/* Columna 2: solo esta columna hace scroll vertical del código */}
        <section className="flex min-h-0 flex-col overflow-hidden max-lg:min-h-[260px] lg:h-full">
          <motion.div
            className="flex min-h-0 h-full max-h-full flex-1 flex-col overflow-hidden rounded-3xl border-2 border-indigo-400/25 bg-gradient-to-br from-slate-900/95 via-indigo-950/40 to-violet-950/30 p-4 shadow-2xl shadow-indigo-950/50 ring-1 ring-indigo-400/20"
            animate={
              isRunning
                ? {
                    boxShadow: [
                      '0 0 0 0 rgba(52,211,153,0)',
                      '0 0 36px 8px rgba(52,211,153,0.35)',
                      '0 0 0 0 rgba(52,211,153,0)',
                    ],
                  }
                : {
                    boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.85)',
                  }
            }
            transition={
              isRunning
                ? { repeat: Infinity, duration: 1.15, ease: 'easeInOut' }
                : { duration: 0.35 }
            }
          >
            <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-white">Tu código</h2>
              <div className="flex flex-wrap gap-2">
                <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }} className="inline-block">
                  <Button
                    className="h-10 rounded-2xl border-amber-500/35 bg-gradient-to-b from-amber-950/50 to-slate-950/90 font-display font-semibold text-amber-100 shadow-md shadow-amber-950/30 hover:!border-amber-400/55 hover:!from-amber-900/60 hover:!text-white"
                    icon={<Eraser className="size-4 text-amber-300" />}
                    onClick={clearCode}
                  >
                    Limpiar
                  </Button>
                </motion.span>
                <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.94 }} className="inline-block">
                  <Button
                    className="h-10 rounded-2xl border-teal-500/35 bg-gradient-to-b from-teal-950/45 to-slate-950/90 font-display font-semibold text-teal-100 shadow-md shadow-teal-950/25 hover:!border-teal-400/50 hover:!from-teal-900/55 hover:!text-white"
                    icon={<RotateCcw className="size-4 text-teal-300" />}
                    onClick={resetCanvas}
                  >
                    Lienzo
                  </Button>
                </motion.span>
                <motion.span
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.94 }}
                  className="inline-block"
                >
                  <Button
                    type="primary"
                    className="relative h-11 overflow-hidden rounded-2xl border-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 px-5 font-display text-base font-bold shadow-lg shadow-emerald-900/45 ring-2 ring-emerald-300/30 hover:!from-emerald-400 hover:!via-green-400 hover:!to-teal-400"
                    icon={<Play className="size-4 fill-current" />}
                    loading={isRunning}
                    onClick={() => void handleRun()}
                  >
                    Ejecutar
                  </Button>
                </motion.span>
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

            <div className="mb-3 shrink-0 rounded-2xl border border-slate-700/80 bg-slate-950/50 px-3 py-2 text-xs text-slate-300">
              <span className="font-semibold text-indigo-200">Destino:</span>{' '}
              {insertTarget === 'root' ? (
                'Programa principal'
              ) : (
                <button
                  type="button"
                  className="font-code text-amber-300 underline-offset-2 hover:underline"
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
          </motion.div>
        </section>

        {/* Columna 3: paleta + contenedores */}
        <section className="flex min-h-[240px] flex-col lg:min-h-0">
          <div className="flex min-h-0 flex-1 flex-col rounded-3xl border-2 border-violet-500/20 bg-gradient-to-br from-slate-900/90 to-violet-950/35 p-4 shadow-xl shadow-violet-950/40 ring-1 ring-violet-400/15">
            <div className="mb-3 shrink-0 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-white">Paleta</h2>
              <span className="text-[11px] text-slate-500">Clic en Repetir para anidar</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
              <BlockPalette allowed={allowedSet} disabled={isRunning} onPick={addBlockFromPalette} />
              <div className="mt-5 border-t border-violet-500/25 pt-4">
                <InstructionVisualExample pattern={level.targetPattern} cols={level.gridCols} />
              </div>
            </div>
            <div className="mt-4 shrink-0 flex flex-wrap gap-2 border-t border-slate-800 pt-3">
              <span className="w-full text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Contenedor activo
              </span>
              <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} className="inline-block">
                <Button
                  size="small"
                  shape="round"
                  type={insertTarget === 'root' ? 'primary' : 'default'}
                  className={
                    insertTarget === 'root'
                      ? '!rounded-full !border-0 !bg-gradient-to-r !from-violet-600 !to-indigo-600 !font-display !font-bold !shadow-md !shadow-violet-900/40'
                      : '!rounded-full !border !border-slate-600 !bg-slate-900/80 !font-display !font-semibold'
                  }
                  onClick={() => setInsertTarget('root')}
                  disabled={isRunning}
                >
                  Raíz
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
                        ? '!rounded-full !border-0 !bg-gradient-to-r !from-fuchsia-600 !to-pink-600 !font-display !font-bold !shadow-md !shadow-fuchsia-900/35'
                        : '!rounded-full !border !border-slate-600 !bg-slate-900/80 !font-display !font-semibold'
                    }
                    onClick={() => setInsertTarget(rep.id)}
                    disabled={isRunning}
                  >
                    Repetir {formatCountLabel(rep.count)}
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
          <div className="flex flex-wrap items-stretch justify-end gap-3 border-t border-white/10 bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-950 px-6 py-4">
            <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} className="inline-block">
              <Button
                className="group h-auto min-h-[3rem] rounded-2xl border-2 border-slate-500/40 bg-gradient-to-b from-slate-800/95 to-slate-950 px-5 py-2.5 font-display font-bold text-slate-100 shadow-[0_6px_0_rgb(15_23_42)] transition-all hover:!border-amber-400/45 hover:!shadow-[0_8px_0_rgb(30_41_59)] active:!translate-y-1 active:!shadow-[0_3px_0_rgb(15_23_42)]"
                onClick={() => setResultModal((m) => ({ ...m, open: false }))}
              >
                <span className="flex flex-col items-start gap-0.5 text-left">
                  <span className="flex items-center gap-2 text-sm">
                    <Gamepad2 className="size-4 text-amber-300 group-hover:text-amber-200" aria-hidden />
                    Seguir practicando
                  </span>
                  <span className="pl-6 text-[10px] font-semibold uppercase tracking-wide text-slate-500 group-hover:text-slate-400">
                    Reintentar este nivel
                  </span>
                </span>
              </Button>
            </motion.span>
            {resultModal.ok && campaignHasRemainingPuzzle ? (
              <motion.span whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }} className="inline-block">
                <Button
                  type="primary"
                  className="group relative h-auto min-h-[3rem] overflow-hidden rounded-2xl border-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 px-6 py-2.5 font-display font-bold shadow-[0_8px_0_rgb(91_33_182)] ring-2 ring-fuchsia-300/35 hover:!from-violet-400 hover:!via-fuchsia-400 hover:!to-orange-300 hover:!shadow-[0_10px_0_rgb(91_33_182)] active:!translate-y-1 active:!shadow-[0_4px_0_rgb(91_33_182)]"
                  onClick={() => {
                    setResultModal((m) => ({ ...m, open: false }))
                    onAdvanceCampaignPuzzle()
                  }}
                >
                  <span className="relative z-10 flex flex-col items-start gap-0.5 text-left text-white drop-shadow-sm">
                    <span className="flex items-center gap-2 text-sm">
                      <Trophy className="size-4 text-amber-200" aria-hidden />
                      Siguiente puzzle
                      <Rocket className="size-4 text-white/90" aria-hidden />
                    </span>
                    <span className="flex items-center gap-1.5 pl-6 text-[10px] font-semibold uppercase tracking-wide text-white/85">
                      <Sparkles className="size-3 text-amber-200" aria-hidden />
                      Nuevo reto + XP
                    </span>
                  </span>
                  <span
                    className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
                    style={{
                      background:
                        'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.06) 8px, rgba(255,255,255,0.06) 16px)',
                    }}
                  />
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
            borderRadius: 28,
            border: '2px solid rgba(167, 139, 250, 0.35)',
            background:
              'linear-gradient(165deg, rgb(30 27 75 / 0.97) 0%, rgb(49 46 129 / 0.94) 42%, rgb(15 23 42 / 0.98) 100%)',
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
          className="relative overflow-hidden px-6 pb-2 pt-7"
        >
          <div
            className="pointer-events-none absolute -right-12 -top-16 size-52 rounded-full bg-fuchsia-500/35 opacity-90 ring-4 ring-fuchsia-400/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-8 -left-16 size-44 rounded-full bg-indigo-400/30 opacity-90 ring-4 ring-indigo-300/15"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-lg ${
                  resultModal.ok
                    ? 'bg-gradient-to-br from-emerald-400/90 to-teal-600/90 shadow-emerald-900/40'
                    : 'bg-gradient-to-br from-amber-400/90 to-orange-600/90 shadow-amber-900/40'
                }`}
              >
                {resultModal.ok ? (
                  <CheckCircle2 className="size-8 text-white drop-shadow" aria-hidden />
                ) : (
                  <XCircle className="size-8 text-white drop-shadow" aria-hidden />
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
                      className={`size-12 drop-shadow-[0_4px_12px_rgba(251,191,36,0.45)] ${
                        i <= resultModal.stars
                          ? 'fill-amber-400 stroke-amber-200 text-amber-300'
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

export default function App() {
  const [chapterIndex, setChapterIndex] = useState(0)
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [gameProgress, setGameProgress] = useState<GameProgress>(() => loadProgress())

  const chapter = CAMPAIGN_CHAPTERS[chapterIndex]!
  const level = chapter.puzzles[puzzleIndex]!

  useEffect(() => {
    saveProgress(gameProgress)
  }, [gameProgress])

  const xpBar = useMemo(() => getXpBar(gameProgress.xp), [gameProgress.xp])

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
          borderRadiusLG: 18,
          fontFamily:
            "'Quicksand', ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        },
      }}
    >
      <div className="font-display flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
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

            <div className="flex min-w-[140px] max-w-[180px] flex-col gap-1 border-l border-slate-700/60 pl-3 sm:max-w-[220px]">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-300/95">
                XP · Nv. {xpBar.level}
              </span>
              <Progress
                percent={xpBar.segmentPercent}
                size="small"
                showInfo={false}
                strokeColor={{ from: '#fbbf24', to: '#f97316' }}
                trailColor="rgba(30,41,59,0.85)"
              />
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
                <motion.span whileTap={{ scale: 0.92 }} className="inline-block">
                  <Button
                    size="small"
                    shape="round"
                    className="border-indigo-500/40 bg-indigo-950/50 font-display font-semibold text-indigo-100 hover:!border-indigo-400/60 hover:!text-white"
                    aria-label="Puzzle anterior"
                    icon={<ChevronLeft className="size-3.5" />}
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
                    label: `Puzzle ${String(i + 1).padStart(2, '0')}`,
                  }))}
                  onChange={(v) => setPuzzleIndex(Number(v))}
                />
                <motion.span whileTap={{ scale: 0.92 }} className="inline-block">
                  <Button
                    size="small"
                    shape="round"
                    className="border-fuchsia-500/40 bg-fuchsia-950/40 font-display font-semibold text-fuchsia-100 hover:!border-fuchsia-400/55 hover:!text-white"
                    aria-label="Siguiente puzzle"
                    icon={<ChevronRight className="size-3.5" />}
                    onClick={() => adjustPuzzle(1)}
                    disabled={puzzleIndex >= chapter.puzzles.length - 1}
                  />
                </motion.span>
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
          onLessonWin={(stars) => {
            setGameProgress((g) => mergeWin(g, lessonKey, stars))
          }}
        />

        <footer className="shrink-0 border-t border-slate-800/80 py-3 text-center text-[11px] text-slate-500 sm:px-8">
          CodeJump Academy · inspirado en Grasshopper · React + Vite + Tailwind + Ant Design
        </footer>
      </div>
    </ConfigProvider>
  )
}
