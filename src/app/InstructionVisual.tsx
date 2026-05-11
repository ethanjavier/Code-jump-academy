import { motion } from 'framer-motion'
import { ListOrdered, Target } from 'lucide-react'

import type { ColorKey } from '../engine/blocks'
import { COLOR_META } from './constants'
import { iconStroke } from './icons'
import { useI18n } from '../i18n/I18nContext'

type Props = {
  pattern: string[]
  cols: number
}

/** Mini lienzo + franja de orden de pintado (paleta / ayuda) */
export function InstructionVisualExample({ pattern, cols }: Props) {
  const { t } = useI18n()
  if (cols <= 0) return null
  const rows = Math.ceil(pattern.length / cols)
  const paintOrder = pattern
    .map((c, i) => ({ c, i }))
    .filter((x): x is { c: ColorKey; i: number } => x.c !== 'skip' && x.c !== '')

  return (
    <div className="space-y-3">
      <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-950/50 via-slate-900/90 to-slate-950/95 p-3 shadow-xl shadow-amber-950/20 ring-1 ring-amber-500/20 md:p-4">
        <p className="mb-3 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-amber-100">
          <span className="inline-flex size-7 items-center justify-center rounded-lg border border-amber-400/35 bg-amber-950/60">
            <Target className="size-4 text-amber-300" strokeWidth={iconStroke.soft} aria-hidden />
          </span>
          {t('visual.targetPattern')}
        </p>
        <div className="flex flex-col gap-2">
          {Array.from({ length: rows }, (_, r) => (
            <div key={r} className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-center font-display text-[11px] font-bold tabular-nums text-slate-500">
                F{r + 1}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: cols }, (_, c) => {
                  const idx = r * cols + c
                  const cell = pattern[idx] ?? 'skip'
                  if (cell === 'skip' || cell === '')
                    return (
                      <div
                        key={c}
                        className="size-9 shrink-0 rounded-xl bg-slate-800/35 ring-1 ring-inset ring-white/5 sm:size-10"
                        title={t('visual.unpaintedCell')}
                        aria-hidden
                      />
                    )
                  return (
                    <motion.div
                      key={c}
                      initial={{ scale: 0.82, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.03 * idx, type: 'spring', stiffness: 420, damping: 22 }}
                      className={`flex size-9 items-center justify-center rounded-2xl border border-white/20 shadow-md ring-1 ring-black/25 sm:size-10 ${COLOR_META[cell as ColorKey].tailwindClass}`}
                      title={COLOR_META[cell as ColorKey].label}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {paintOrder.length > 1 ? (
        <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-950/95 p-3 shadow-xl shadow-cyan-950/25 ring-1 ring-cyan-500/20 md:p-4">
          <p className="mb-2 flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-wider text-cyan-100">
            <ListOrdered className="size-3.5 shrink-0 text-cyan-400" strokeWidth={iconStroke.soft} aria-hidden />
            {t('visual.paintOrder')}
          </p>
          <div className="flex flex-wrap items-center gap-x-0.5 gap-y-1">
            {paintOrder.map(({ c }, n) => (
              <span key={`paint-step-${n}`} className="flex items-center">
                {n > 0 ? (
                  <span className="mx-0.5 font-display text-xs font-bold text-slate-500">→</span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-800/90 px-2 py-1 shadow-md ring-1 ring-white/5">
                  <span
                    className={`size-4 shrink-0 rounded-md ring-1 ring-black/40 ${COLOR_META[c].dotClass}`}
                    title={COLOR_META[c].label}
                  />
                  <span className="font-display text-[11px] font-bold tabular-nums text-slate-200">
                    {n + 1}
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
