import { ChevronRight } from 'lucide-react'

import type { ColorKey } from '../engine/blocks'
import type { GuidedCanvasPiece, GuidedCanvasRow } from '../courses/guidedLessonTypes'
import { STRIPE_SWATCH_BG } from '../courses/stripeSwatch'
import { COLOR_META } from './constants'
import { iconStroke } from './icons'
import { useI18n } from '../i18n/I18nContext'
import { localized } from './languageQuizzes'

function DrawBoxChip({ color }: { color: ColorKey }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-slate-900/90 px-2 py-1 font-mono text-[11px] font-semibold text-slate-100 shadow-md ring-1 ring-white/10"
      title={COLOR_META[color].label}
    >
      <span
        className={`size-4 shrink-0 rounded-md ring-1 ring-black/40 ${COLOR_META[color].tailwindClass}`}
        aria-hidden
      />
      drawBox(&quot;{color}&quot;)
    </span>
  )
}

function CanvasPiece({ piece }: { piece: GuidedCanvasPiece }) {
  const { locale } = useI18n()

  switch (piece.kind) {
    /** Objetivo “Real canvas goal” retirado de la paleta / mini-lienzo — el panel de meta ya está en instrucciones. */
    case 'realGoal':
      return null
    case 'drawBox':
      return <DrawBoxChip color={piece.color} />
    case 'skip':
      return (
        <span className="inline-flex items-center rounded-lg border border-dashed border-slate-500 bg-slate-900/90 px-2 py-1 font-mono text-[11px] font-semibold text-slate-300 ring-1 ring-white/10">
          skip()
        </span>
      )
    case 'newLine':
      return (
        <span className="inline-flex items-center rounded-lg border border-cyan-500/35 bg-cyan-950/50 px-2 py-1 font-mono text-[11px] font-semibold text-cyan-100 ring-1 ring-cyan-500/20">
          newLine()
        </span>
      )
    case 'varDecl':
      return (
        <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-950/45 px-2 py-1 font-mono text-[11px] font-semibold text-amber-50 ring-1 ring-amber-500/25">
          <span className="text-[10px] font-bold uppercase tracking-wide text-amber-200/90">
            var
          </span>
          {localized(piece.name, locale)} = {piece.value}
        </span>
      )
    case 'repeat':
      return (
        <div className="inline-flex max-w-full flex-col gap-1.5 rounded-xl border border-indigo-400/45 bg-indigo-950/55 px-2.5 py-2 shadow-inner ring-1 ring-indigo-400/25">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] font-semibold text-indigo-100">
            <span className="rounded-md bg-indigo-900/80 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-indigo-200">
              Repetir
            </span>
            <span className="tabular-nums text-indigo-50">{localized(piece.count, locale)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 border-l-2 border-indigo-400/50 pl-2.5">
            {piece.inner.map((p, i) => (
              <CanvasPiece key={`inner-${i}`} piece={p} />
            ))}
          </div>
        </div>
      )
    case 'caption':
      return (
        <p className="w-full text-[12px] leading-snug text-slate-400">{localized(piece.text, locale)}</p>
      )
    case 'terminal':
      return (
        <span className="inline-flex min-w-[7rem] items-center rounded-lg border border-emerald-500/35 bg-slate-950 px-2.5 py-1.5 font-mono text-[11px] text-emerald-200 shadow-inner ring-1 ring-emerald-500/20">
          {localized(piece.line, locale)}
        </span>
      )
    case 'arrowHint':
      return (
        <ChevronRight
          className="size-4 shrink-0 text-slate-500"
          strokeWidth={iconStroke.medium}
          aria-hidden
        />
      )
    case 'ifSplit':
      return (
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-stretch">
          <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-amber-500/35 bg-amber-950/35 px-2.5 py-2 ring-1 ring-amber-500/20">
            <span className="mb-1 font-mono text-[10px] font-bold uppercase text-amber-200">if</span>
            <span className="font-mono text-[11px] text-amber-50">{localized(piece.cond, locale)}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-2 py-1.5 font-mono text-[11px] text-emerald-100 ring-1 ring-emerald-500/15">
              <span className="mr-1 text-[10px] uppercase text-emerald-300">sí</span>
              {localized(piece.thenLine, locale)}
            </div>
            <div className="rounded-lg border border-rose-500/30 bg-rose-950/35 px-2 py-1.5 font-mono text-[11px] text-rose-100 ring-1 ring-rose-500/15">
              <span className="mr-1 text-[10px] uppercase text-rose-300">no</span>
              {localized(piece.elseLine, locale)}
            </div>
          </div>
        </div>
      )
    case 'functionShell':
      return (
        <div className="inline-flex max-w-full flex-col gap-1.5 rounded-xl border border-violet-500/40 bg-violet-950/45 px-2.5 py-2 ring-1 ring-violet-400/25">
          <span className="font-mono text-[11px] font-semibold text-violet-100">
            function {localized(piece.name, locale)} () {'{'}
          </span>
          <div className="flex flex-wrap gap-1.5 border-l-2 border-violet-400/45 pl-2.5">
            {piece.inner.map((p, i) => (
              <CanvasPiece key={`fn-${i}`} piece={p} />
            ))}
          </div>
          <span className="font-mono text-[11px] text-violet-200">{'}'}</span>
        </div>
      )
    case 'arrayCells':
      return (
        <div className="flex flex-wrap items-end gap-2">
          {piece.items.map((cell, i) => (
            <div key={`cell-${i}`} className="flex flex-col items-center gap-0.5">
              <span className="font-mono text-[9px] font-bold tabular-nums text-slate-500">[{i}]</span>
              <span className="min-w-[2rem] rounded-lg border border-slate-600 bg-slate-900/90 px-2 py-1 text-center font-mono text-[11px] font-semibold text-slate-100 ring-1 ring-white/10">
                {localized(cell, locale)}
              </span>
            </div>
          ))}
        </div>
      )
    case 'stripePaletteChip':
      return (
        <div className="flex w-full max-w-full flex-col rounded-2xl border border-slate-600/80 bg-slate-900/90 px-3 py-2.5 text-left shadow-md shadow-black/30 ring-1 ring-white/10">
          <div className="flex items-start gap-2.5">
            <span
              className={`mt-0.5 h-9 w-1.5 shrink-0 rounded-full shadow-inner ${STRIPE_SWATCH_BG[piece.swatch]}`}
              aria-hidden
            />
            <pre className="min-w-0 flex-1 whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-indigo-200/95">
              {localized(piece.snippet ?? piece.label, locale)}
            </pre>
          </div>
        </div>
      )
    default:
      return null
  }
}

type Props = {
  rows: GuidedCanvasRow[]
}

/** Bloques estilo CodeJump (drawBox, variables, Repetir…) — referencia junto al código o en herramientas. */
function rowWithoutRealGoal(row: GuidedCanvasRow): GuidedCanvasRow {
  return row.filter((p) => p.kind !== 'realGoal')
}

export function GuidedCanvasLienzo({ rows }: Props) {
  const visibleRows = rows.map(rowWithoutRealGoal).filter((r) => r.length > 0)
  if (!visibleRows.length) return null

  return (
    <div className="space-y-3">
      {visibleRows.map((row, ri) => (
        <div
          key={`canvas-row-${ri}`}
          className={`flex flex-wrap items-center gap-2 ${row.some((p) => p.kind === 'caption' || p.kind === 'ifSplit' || p.kind === 'stripePaletteChip') ? 'w-full' : ''}`}
        >
          {row.map((piece, pi) => (
            <CanvasPiece key={`piece-${ri}-${pi}`} piece={piece} />
          ))}
        </div>
      ))}
    </div>
  )
}
