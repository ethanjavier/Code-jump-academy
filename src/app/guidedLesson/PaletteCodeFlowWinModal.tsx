import { Button, Modal } from 'antd'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { useMemo, type CSSProperties, type ReactNode } from 'react'

import type { Localized, PaletteCodeResultStripe } from '../../courses/guidedLessonTypes'
import type { StripeSwatch } from '../../courses/stripeSwatch'
import { useI18n } from '../../i18n/I18nContext'
import { localized } from '../languageQuizzes'
import { iconStroke } from '../icons'

type BandKind = 'output' | 'logic' | 'loop'

const KEYWORDS = new Set([
  'console',
  'log',
  'if',
  'for',
  'let',
  'const',
  'var',
  'function',
  'return',
  'print',
  'SELECT',
  'FROM',
  'WHERE',
  'true',
  'false',
  'null',
  'undefined',
  'async',
  'await',
])

function bandKindForStripe(swatch: StripeSwatch, index: number): BandKind {
  const output: StripeSwatch[] = ['emerald', 'lime', 'teal']
  const logic: StripeSwatch[] = ['amber', 'orange', 'violet', 'rose', 'slate']
  const loop: StripeSwatch[] = ['sky', 'indigo', 'fuchsia']
  if (output.includes(swatch)) return 'output'
  if (logic.includes(swatch)) return 'logic'
  if (loop.includes(swatch)) return 'loop'
  return (['output', 'logic', 'loop'] as const)[index % 3]!
}

function bandSurface(kind: BandKind): { gradient: string; glow: string; hoverGlow: string } {
  switch (kind) {
    case 'output':
      return {
        gradient: 'linear-gradient(135deg, #34d399 0%, #059669 42%, #0f766e 100%)',
        glow: '0 0 22px rgba(16, 185, 129, 0.42), inset 0 2px 6px rgba(0, 0, 0, 0.22)',
        hoverGlow: '0 0 32px rgba(52, 211, 153, 0.55), inset 0 2px 6px rgba(0, 0, 0, 0.22)',
      }
    case 'logic':
      return {
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #ea580c 48%, #9a3412 100%)',
        glow: '0 0 22px rgba(251, 146, 60, 0.45), inset 0 2px 6px rgba(0, 0, 0, 0.22)',
        hoverGlow: '0 0 34px rgba(251, 191, 36, 0.55), inset 0 2px 6px rgba(0, 0, 0, 0.22)',
      }
    case 'loop':
      return {
        gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 45%, #155e75 100%)',
        glow: '0 0 22px rgba(14, 165, 233, 0.45), inset 0 2px 6px rgba(0, 0, 0, 0.22)',
        hoverGlow: '0 0 34px rgba(56, 189, 248, 0.55), inset 0 2px 6px rgba(0, 0, 0, 0.22)',
      }
  }
}

function highlightCodeSegment(segment: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  const wordRe = /\b[a-zA-Z_][a-zA-Z0-9_]*\b|[^\w]+|\d+/g
  let m: RegExpExecArray | null
  let k = 0
  while ((m = wordRe.exec(segment)) !== null) {
    const token = m[0]
    const isWord = /^\w+$/.test(token) && KEYWORDS.has(token)
    if (isWord) {
      out.push(
        <span key={`${keyPrefix}-kw-${k++}`} className="font-semibold text-white">
          {token}
        </span>,
      )
    } else if (/^\d+$/.test(token)) {
      out.push(
        <span key={`${keyPrefix}-num-${k++}`} className="text-violet-100/90">
          {token}
        </span>,
      )
    } else {
      out.push(
        <span key={`${keyPrefix}-def-${k++}`} className="text-white/95">
          {token}
        </span>,
      )
    }
  }
  return out
}

function highlightCodeLine(line: string, rowKey: string): ReactNode {
  const trimmed = line.trim()
  if (!trimmed) {
    return <span className="text-white/45">…</span>
  }
  const nodes: ReactNode[] = []
  const stringRe = /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g
  let last = 0
  let m: RegExpExecArray | null
  let si = 0
  while ((m = stringRe.exec(line)) !== null) {
    const before = line.slice(last, m.index)
    nodes.push(...highlightCodeSegment(before, `${rowKey}-b${si}`))
    nodes.push(
      <span key={`${rowKey}-str-${si}`} className="text-amber-100/95">
        {m[0]}
      </span>,
    )
    si++
    last = m.index + m[0].length
  }
  nodes.push(...highlightCodeSegment(line.slice(last), `${rowKey}-tail${si}`))
  return <>{nodes}</>
}

type Props = {
  open: boolean
  onClose: () => void
  onRestartExercise: () => void
  draft: string
  correctText: Localized
  locale: 'en' | 'es'
  stripes: PaletteCodeResultStripe[]
}

export function PaletteCodeFlowWinModal({
  open,
  onClose,
  onRestartExercise,
  draft,
  correctText,
  locale,
  stripes,
}: Props) {
  const { t } = useI18n()
  const reduceMotion = useReducedMotion()

  const correctLines = useMemo(
    () =>
      localized(correctText, locale)
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((l) => l.trim()),
    [correctText, locale],
  )

  const draftLines = useMemo(() => draft.replace(/\r\n/g, '\n').split('\n'), [draft])

  const stagger = reduceMotion ? 0 : 0.15
  const bandSpring = reduceMotion
    ? { duration: 0.2 }
    : { type: 'spring' as const, stiffness: 300, damping: 22 }

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: reduceMotion ? 0 : 0.08 },
    },
  }

  const bandVariants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -28 },
    show: {
      opacity: 1,
      y: 0,
      transition: bandSpring,
    },
  }

  const modalBodyStyle: CSSProperties = {
    background: '#0f172a',
    padding: 32,
    borderRadius: 24,
  }

  const headerStyle: CSSProperties = {
    background: '#0f172a',
    borderBottom: 'none',
    padding: '24px 32px 8px',
    borderRadius: '24px 24px 0 0',
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      destroyOnClose
      closable={false}
      styles={{
        root: {
          padding: 0,
          borderRadius: 24,
          overflow: 'hidden',
          background: '#0f172a',
        },
        header: headerStyle,
        body: modalBodyStyle,
        mask: { backdropFilter: 'blur(6px)' },
      }}
      title={
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Sparkles
              className="size-7 shrink-0 text-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.65)]"
              strokeWidth={iconStroke.soft}
              aria-hidden
            />
            <span className="font-display text-lg font-bold tracking-tight text-amber-100 md:text-xl">
              {t('guided.paletteCodeModalTitle')}
            </span>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg px-2 py-1 text-sm text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-200"
            onClick={onClose}
            aria-label={t('guided.paletteCodeModalClose')}
          >
            ✕
          </button>
        </div>
      }
    >
      <div className="relative -m-8 overflow-hidden rounded-b-3xl p-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-3xl" aria-hidden>
          <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-indigo-600/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-violet-600/12 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col gap-5">
        <p className="text-[15px] leading-relaxed text-slate-200/95" style={{ fontFamily: 'system-ui, sans-serif' }}>
          {t('guided.paletteCodeModalBody')}
        </p>

        <motion.div
          className="flex flex-col gap-3"
          variants={containerVariants}
          initial="hidden"
          animate={open ? 'show' : 'hidden'}
        >
          {stripes.map((row, i) => {
            const expected = correctLines[i] ?? ''
            const userRaw = draftLines[i] ?? ''
            const user = userRaw.trim()
            const match = expected !== '' && user === expected.trim()
            const kind = bandKindForStripe(row.swatch, i)
            const surface = bandSurface(kind)
            const checkDelay = reduceMotion ? 0 : i * stagger + 0.32

            return (
              <motion.div
                key={`${row.swatch}-${i}`}
                variants={bandVariants}
                className="relative overflow-hidden rounded-2xl border border-white/15"
                style={{
                  background: surface.gradient,
                  boxShadow: surface.glow,
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        scale: 1.02,
                        boxShadow: surface.hoverGlow,
                        transition: { type: 'spring', stiffness: 400, damping: 24 },
                      }
                }
              >
                <div className="flex min-h-[3rem] items-stretch gap-2 px-3 py-2.5 md:px-4">
                  <div
                    className="min-w-0 flex-1 font-[family-name:var(--font-code)] text-[13px] leading-snug md:text-[14px]"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}
                  >
                    {highlightCodeLine(userRaw || '', `row-${i}`)}
                  </div>
                  <div className="flex shrink-0 flex-col items-end justify-center gap-1 pl-1">
                    <span
                      className="max-w-[9rem] text-right font-display text-[10px] font-bold uppercase leading-tight tracking-wide text-white/90"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                    >
                      {localized(row.caption, locale)}
                    </span>
                    {match ? (
                      <motion.span
                        className="inline-flex text-white drop-shadow-md"
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : {
                                type: 'spring',
                                stiffness: 520,
                                damping: 18,
                                delay: checkDelay,
                              }
                        }
                        aria-hidden
                      >
                        <Check className="size-5" strokeWidth={iconStroke.medium} />
                      </motion.span>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <Button
            size="large"
            className="order-2 h-12 rounded-2xl border-white/20 bg-transparent font-display font-semibold text-slate-200 hover:border-violet-400/50 hover:bg-white/5 hover:text-white sm:order-1 sm:mr-auto"
            onClick={onRestartExercise}
          >
            {t('guided.paletteCodeModalRestart')}
          </Button>
          <motion.div
            className="order-1 sm:order-2"
            whileHover={reduceMotion ? undefined : { scale: 1.05 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            <Button
              type="primary"
              size="large"
              className="h-12 min-w-[140px] rounded-2xl border-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 px-8 font-display font-bold text-white shadow-lg shadow-indigo-950/50 ring-1 ring-white/20 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600"
              onClick={onClose}
            >
              {t('guided.paletteCodeModalClose')}
            </Button>
          </motion.div>
        </div>
        </div>
      </div>
    </Modal>
  )
}
