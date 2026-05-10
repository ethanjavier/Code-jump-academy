import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

import type { ColorKey } from '../engine/blocks'
import { COLOR_META } from './constants'

type Props = {
  pattern: string[]
  cols: number
}

/** Mini lienzo + franja de orden de pintado (paleta / ayuda) */
export function InstructionVisualExample({ pattern, cols }: Props) {
  if (cols <= 0) return null
  const rows = Math.ceil(pattern.length / cols)
  const paintOrder = pattern
    .map((c, i) => ({ c, i }))
    .filter((x): x is { c: ColorKey; i: number } => x.c !== 'skip' && x.c !== '')

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border-2 border-amber-400/30 bg-gradient-to-br from-slate-950/95 via-amber-950/25 to-indigo-950/40 p-3 shadow-lg shadow-amber-950/20 ring-1 ring-amber-300/20">
        <p className="mb-3 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-amber-100">
          <span className="inline-flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/40 to-orange-500/30 ring-1 ring-amber-300/40">
            <Sparkles className="size-4 text-amber-200" aria-hidden />
          </span>
          Patrón objetivo
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
                  const t = pattern[idx] ?? 'skip'
                  if (t === 'skip' || t === '')
                    return (
                      <div
                        key={c}
                        className="flex size-9 items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-900/70 sm:size-10"
                        title="Sin pintar"
                      >
                        <span className="font-display text-[10px] font-semibold text-slate-600">—</span>
                      </div>
                    )
                  return (
                    <motion.div
                      key={c}
                      initial={{ scale: 0.82, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.03 * idx, type: 'spring', stiffness: 420, damping: 22 }}
                      className={`flex size-9 items-center justify-center rounded-xl border-2 border-white/25 shadow-md ring-1 ring-black/20 sm:size-10 ${COLOR_META[t as ColorKey].tailwindClass}`}
                      title={COLOR_META[t as ColorKey].label}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {paintOrder.length > 1 ? (
        <div className="rounded-2xl border-2 border-cyan-400/25 bg-gradient-to-r from-slate-950/90 to-cyan-950/25 p-3 shadow-md shadow-cyan-950/25 ring-1 ring-cyan-400/15">
          <p className="mb-2 font-display text-[11px] font-bold uppercase tracking-wider text-cyan-100">
            Orden al pintar (como el cursor)
          </p>
          <div className="flex flex-wrap items-center gap-x-0.5 gap-y-1">
            {paintOrder.map(({ c }, n) => (
              <span key={`paint-step-${n}`} className="flex items-center">
                {n > 0 ? (
                  <span className="mx-0.5 font-display text-xs font-bold text-slate-600">→</span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/90 px-2 py-1 shadow-sm ring-1 ring-white/5">
                  <span
                    className={`size-4 shrink-0 rounded-md ring-1 ring-black/20 ${COLOR_META[c].dotClass}`}
                    title={COLOR_META[c].label}
                  />
                  <span className="font-display text-[11px] font-bold tabular-nums text-cyan-100">
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
