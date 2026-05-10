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
            <p className="text-sm text-slate-600">
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
            <div className="space-y-2 text-sm text-slate-600">
              <p>
                Compara tu lienzo con el patrón: cada <span className="font-code text-indigo-700">drawBox</span>{' '}
                pinta y avanza; usa <span className="font-code text-indigo-700">skip()</span> para dejar una celda en
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
      <main className="grid min-h-0 w-full flex-1 grid-cols-1 gap-4 overflow-hidden px-4 py-4 md:gap-5 md:px-5 md:py-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.72fr)_minmax(0,0.88fr)] lg:items-stretch lg:px-8 lg:auto-rows-[minmax(0,1fr)]">
        {/* Columna 1: brief + lienzo */}
        <section className="flex min-h-0 min-w-0 flex-col gap-4 lg:min-h-0">
          <div className="shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100 md:p-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display flex items-center gap-2 text-base font-semibold text-slate-900">
                <Sparkles className="size-5 text-amber-600" aria-hidden />
                Instrucciones
              </h2>
              <Tag color="purple">{chapterTitle}</Tag>
            </div>
            <p className="max-h-[min(52vh,26rem)] overflow-y-auto whitespace-pre-line text-sm leading-snug text-slate-700">
              {level.instruction}
            </p>
          </div>

          <div className="flex min-h-[220px] flex-1 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm ring-1 ring-slate-100 md:p-5 lg:min-h-0">
            <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-slate-900">Lienzo</h2>
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
                        ? 'border-slate-300 bg-slate-100'
                        : `${COLOR_META[cell as ColorKey].tailwindClass} border-transparent`

                    return (
                      <motion.div
                        key={`${r}-${c}`}
                        layout
                        className={`relative flex size-14 items-center justify-center rounded-xl border-2 sm:size-16 ${
                          isCursor && isRunning
                            ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-white'
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

            <p className="mt-2 shrink-0 text-center text-[11px] text-slate-600 leading-snug">
              Rayado en la meta = hueco sin pintar. Usa{' '}
              <span className="font-code text-slate-700">skip()</span> para avanzar sin color.
            </p>
          </div>
        </section>

        {/* Columna 2: código (franja más estrecha → más sitio para el lienzo) */}
        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden max-lg:min-h-[220px] lg:h-full">
          <motion.div
            className={`flex min-h-0 h-full max-h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-white p-3 shadow-sm ring-1 ring-slate-100 md:p-4 lg:p-4 ${
              isRunning ? 'border-emerald-300 ring-emerald-200/80' : 'border-slate-200'
            }`}
            animate={
              isRunning
                ? { boxShadow: ['0 1px 2px rgb(0 0 0 / 0.05)', '0 0 0 3px rgb(52 211 153 / 0.2)', '0 1px 2px rgb(0 0 0 / 0.05)'] }
                : { boxShadow: '0 1px 2px rgb(0 0 0 / 0.05)' }
            }
            transition={
              isRunning
                ? { repeat: Infinity, duration: 1.15, ease: 'easeInOut' }
                : { duration: 0.35 }
            }
          >
            <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-slate-900">Tu código</h2>
              <div className="flex flex-wrap gap-2">
                <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-block">
                  <Button
                    className="h-10 rounded-xl border border-amber-200 bg-amber-50 font-display font-semibold text-amber-900 shadow-none hover:!border-amber-300 hover:!bg-amber-100 hover:!text-amber-950"
                    icon={<Eraser className="size-4 text-amber-700" />}
                    onClick={clearCode}
                  >
                    Limpiar
                  </Button>
                </motion.span>
                <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-block">
                  <Button
                    className="h-10 rounded-xl border border-teal-200 bg-teal-50 font-display font-semibold text-teal-900 shadow-none hover:!border-teal-300 hover:!bg-teal-100 hover:!text-teal-950"
                    icon={<RotateCcw className="size-4 text-teal-700" />}
                    onClick={resetCanvas}
                  >
                    Lienzo
                  </Button>
                </motion.span>
                <motion.span
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block"
                >
                  <Button
                    type="primary"
                    className="relative h-11 overflow-hidden rounded-xl border-0 bg-emerald-600 px-5 font-display text-base font-bold shadow-sm ring-1 ring-emerald-700/15 hover:!bg-emerald-500"
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

            <div className="mb-3 shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              <span className="font-semibold text-indigo-700">Destino:</span>{' '}
              {insertTarget === 'root' ? (
                'Programa principal'
              ) : (
                <button
                  type="button"
                  className="font-code text-amber-700 underline-offset-2 hover:underline"
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
        <section className="flex min-h-[240px] min-w-0 flex-col lg:min-h-0">
          <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100 md:p-5">
            <div className="mb-3 shrink-0 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold text-slate-900">Paleta</h2>
              <span className="text-[11px] text-slate-500">Clic en Repetir para anidar</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
              <BlockPalette allowed={allowedSet} disabled={isRunning} onPick={addBlockFromPalette} />
              <div className="mt-5 border-t border-slate-200 pt-4">
                <InstructionVisualExample pattern={level.targetPattern} cols={level.gridCols} />
              </div>
            </div>
            <div className="mt-4 shrink-0 flex flex-wrap gap-2 border-t border-slate-200 pt-3">
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
                      ? '!rounded-full !border !border-indigo-600 !bg-indigo-600 !font-display !font-bold !text-white !shadow-none hover:!border-indigo-500 hover:!bg-indigo-500'
                      : '!rounded-full !border !border-slate-300 !bg-slate-50 !font-display !font-semibold !text-slate-700 hover:!border-slate-400 hover:!bg-slate-100'
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
                        ? '!rounded-full !border !border-fuchsia-600 !bg-fuchsia-600 !font-display !font-bold !text-white !shadow-none hover:!border-fuchsia-500 hover:!bg-fuchsia-500'
                        : '!rounded-full !border !border-slate-300 !bg-slate-50 !font-display !font-semibold !text-slate-700 hover:!border-slate-400 hover:!bg-slate-100'
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
          <div className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:justify-end md:px-6">
            <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-flex max-w-full min-w-0">
              <Button
                className="group inline-flex !h-auto min-h-0 max-w-full items-center whitespace-normal rounded-xl border border-slate-300 bg-white px-5 py-3 font-display font-bold text-slate-800 shadow-sm hover:!border-amber-300 hover:!bg-amber-50"
                onClick={() => setResultModal((m) => ({ ...m, open: false }))}
              >
                <span className="flex w-full min-w-0 items-start gap-3 text-left">
                  <Gamepad2
                    className="mt-0.5 size-4 shrink-0 text-amber-600 group-hover:text-amber-700"
                    aria-hidden
                  />
                  <span className="flex min-w-0 flex-col gap-1.5">
                    <span className="text-sm leading-snug">Seguir practicando</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 group-hover:text-slate-600">
                      Reintentar este nivel
                    </span>
                  </span>
                </span>
              </Button>
            </motion.span>
            {resultModal.ok && campaignHasRemainingPuzzle ? (
              <motion.span whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="inline-flex max-w-full min-w-0">
                <Button
                  type="primary"
                  className="group inline-flex !h-auto min-h-0 max-w-full items-center whitespace-normal rounded-xl border-0 bg-violet-600 px-6 py-3 font-display font-bold text-white shadow-sm ring-1 ring-violet-900/10 hover:!bg-violet-500"
                  onClick={() => {
                    setResultModal((m) => ({ ...m, open: false }))
                    onAdvanceCampaignPuzzle()
                  }}
                >
                  <span className="flex w-full min-w-0 flex-col gap-1.5 text-left text-white">
                    <span className="flex min-w-0 items-center gap-3">
                      <Trophy className="size-4 shrink-0 text-amber-200" aria-hidden />
                      <span className="min-w-0 flex-1 text-sm leading-tight">Siguiente puzzle</span>
                      <Rocket className="size-4 shrink-0 text-white/90" aria-hidden />
                    </span>
                    <span className="flex min-w-0 items-center gap-2">
                      <Sparkles className="size-3 shrink-0 text-amber-200" aria-hidden />
                      <span className="min-w-0 text-[10px] font-semibold uppercase tracking-wide text-white/85">
                        Nuevo reto + XP
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
            border: '1px solid rgb(226 232 240)',
            background: 'rgb(255 255 255)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
          },
          mask: { backgroundColor: 'rgba(15, 23, 42, 0.35)' },
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
                  <CheckCircle2 className="size-8 text-white drop-shadow" aria-hidden />
                ) : (
                  <XCircle className="size-8 text-white drop-shadow" aria-hidden />
                )}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="font-display text-xl font-bold tracking-tight text-slate-900">
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
                          : 'fill-none stroke-slate-300 text-slate-300'
                      }`}
                      strokeWidth={i <= resultModal.stars ? 0 : 1.5}
                    />
                  </motion.div>
                ))}
              </div>
            ) : null}
            <div className="text-sm leading-relaxed text-slate-600">{resultModal.detail}</div>
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
        algorithm: antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          borderRadiusLG: 18,
          fontFamily:
            "'Quicksand', ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        },
      }}
    >
      <div className="font-display flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-slate-50 text-slate-900">
        <header className="shrink-0 border-b border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6 md:py-3.5">
            <div className="flex min-w-0 shrink-0 items-center gap-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-indigo-700/20 bg-indigo-600 shadow-sm ring-1 ring-indigo-500/20">
                <SquareCode className="size-[22px] text-white" aria-hidden />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-[10px] uppercase tracking-wide text-indigo-600">
                  CodeJump Academy
                </p>
                <h1 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                  Aprende código con bloques
                </h1>
              </div>
            </div>

            <div className="flex min-w-[140px] max-w-[180px] flex-col gap-1 border-l border-slate-200 pl-3 sm:max-w-[220px]">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                XP · Nv. {xpBar.level}
              </span>
              <Progress
                percent={xpBar.segmentPercent}
                size="small"
                showInfo={false}
                strokeColor={{ from: '#fbbf24', to: '#f97316' }}
                trailColor="rgba(226,232,240,0.95)"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-1.5 sm:gap-x-4">
              <div className="flex max-w-full items-center gap-1.5">
                <MapIcon className="size-3.5 shrink-0 text-indigo-600" aria-hidden />
                <span className="hidden text-[11px] text-slate-600 sm:inline">Capítulo</span>
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

              <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                <motion.span whileTap={{ scale: 0.92 }} className="inline-block">
                  <Button
                    size="small"
                    shape="round"
                    className="border-indigo-300 bg-indigo-50 font-display font-semibold text-indigo-800 hover:!border-indigo-400 hover:!text-indigo-950"
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
                    className="border-fuchsia-300 bg-fuchsia-50 font-display font-semibold text-fuchsia-800 hover:!border-fuchsia-400 hover:!text-fuchsia-950"
                    aria-label="Siguiente puzzle"
                    icon={<ChevronRight className="size-3.5" />}
                    onClick={() => adjustPuzzle(1)}
                    disabled={puzzleIndex >= chapter.puzzles.length - 1}
                  />
                </motion.span>
              </div>

              <div className="flex min-w-[140px] max-w-[200px] flex-1 items-center gap-2 border-l border-slate-200 pl-3 sm:min-w-[160px] sm:max-w-none sm:flex-none">
                <Layers className="size-3.5 shrink-0 text-slate-500" aria-hidden />
                <div className="min-w-0 flex-1 pt-0.5">
                  <Progress
                    percent={progressPercent}
                    size="small"
                    showInfo={false}
                    strokeColor="#818cf8"
                  />
                </div>
                <span className="shrink-0 tabular-nums text-[11px] text-slate-600">
                  {puzzleIndex + 1}/{chapter.puzzles.length}
                </span>
                <Tag className="m-0 shrink-0 border border-slate-300 px-1.5 py-0 text-[10px] leading-tight">
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

        <footer className="shrink-0 border-t border-slate-200 bg-white px-4 py-4 text-center text-[11px] text-slate-600 md:px-8">
          CodeJump Academy · inspirado en Grasshopper · React + Vite + Tailwind + Ant Design
        </footer>
      </div>
    </ConfigProvider>
  )
}
