import { ChevronRight, Flag } from 'lucide-react'

import type { ColorKey } from '../engine/blocks'
import type {
  GuidedCanvasGoalPreview,
  GuidedCanvasPiece,
  GuidedCanvasRow,
} from '../courses/guidedLessonTypes'
import { STRIPE_SWATCH_BG } from '../courses/stripeSwatch'
import { COLOR_META } from './constants'
import { iconStroke } from './icons'
import { useI18n } from '../i18n/I18nContext'
import { localized } from './languageQuizzes'

function GoalPreview({ preview }: { preview: GuidedCanvasGoalPreview }) {
  if (preview.type === 'stripes') {
    return (
      <div
        className="flex h-10 w-full max-w-md overflow-hidden rounded-lg border border-white/15 shadow-inner ring-1 ring-black/30"
        aria-hidden
      >
        {preview.colors.map((c, i) => (
          <div
            key={`stripe-${i}`}
            className={`min-h-0 min-w-0 flex-1 ${COLOR_META[c].tailwindClass}`}
          />
        ))}
      </div>
    )
  }
  return (
    <div className="flex max-w-md flex-wrap gap-1.5" aria-hidden>
      {preview.items.map((cell, i) =>
        cell === 'skip' ? (
          <div
            key={`cell-${i}`}
            className="flex size-9 items-center justify-center rounded-lg border border-dashed border-slate-500 bg-slate-800/90 sm:size-10"
          >
            <span className="font-display text-[10px] font-semibold text-slate-500">—</span>
          </div>
        ) : (
          <div
            key={`cell-${i}`}
            className={`size-9 rounded-lg border border-white/15 shadow-md ring-1 ring-black/30 sm:size-10 ${COLOR_META[cell].tailwindClass}`}
          />
        ),
      )}
    </div>
  )
}

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
  const { locale, t } = useI18n()

  switch (piece.kind) {
    case 'realGoal':
      return (
        <div className="w-full rounded-2xl border border-amber-500/35 bg-gradient-to-br from-amber-950/50 via-slate-900/80 to-slate-950/90 p-3 shadow-lg ring-1 ring-amber-500/20 md:p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-lg border border-amber-400/40 bg-amber-950/60">
              <Flag className="size-4 text-amber-300" strokeWidth={iconStroke.soft} aria-hidden />
            </span>
            <span className="font-display text-[10px] font-bold uppercase tracking-wider text-amber-200/95">
              {t('guided.canvasRealGoal')}
            </span>
          </div>
          <p className="font-display text-sm font-bold leading-snug text-white">{localized(piece.headline, locale)}</p>
          {piece.detail ? (
            <p className="mt-1.5 text-[12px] leading-relaxed text-slate-400">{localized(piece.detail, locale)}</p>
          ) : null}
          {piece.preview ? (
            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="mb-2 font-display text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {t('guided.canvasGoalPreview')}
              </p>
              <GoalPreview preview={piece.preview} />
            </div>
          ) : null}
        </div>
      )
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
            <div className="min-w-0 flex-1">
              <span className="font-display text-sm font-semibold text-slate-100">{localized(piece.label, locale)}</span>
              {piece.snippet ? (
                <pre className="mt-1.5 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-indigo-200/95">
                  {localized(piece.snippet, locale)}
                </pre>
              ) : null}
            </div>
          </div>
        </div>
      )
    default:
      return null
  }
}

type Props = {
  rows: GuidedCanvasRow[]
  /** Teal = panel vista previa; violet = panel herramientas (misma pieza, otro acento). */
  tone?: 'teal' | 'violet'
}

/** Bloques estilo CodeJump (drawBox, variables, Repetir…) — referencia junto al código o en herramientas. */
export function GuidedCanvasLienzo({ rows, tone = 'teal' }: Props) {
  const { t } = useI18n()
  if (!rows.length) return null

  const titleTone =
    tone === 'violet'
      ? 'text-violet-200/95'
      : 'text-teal-200/95'

  return (
    <div className="space-y-3">
      <p className={`font-display text-[11px] font-bold uppercase tracking-wider ${titleTone}`}>
        {t('guided.canvasBlocksAnalog')}
      </p>
      <div className="space-y-3">
        {rows.map((row, ri) => (
          <div
            key={`canvas-row-${ri}`}
            className={`flex flex-wrap items-center gap-2 ${row.some((p) => p.kind === 'caption' || p.kind === 'ifSplit' || p.kind === 'realGoal' || p.kind === 'stripePaletteChip') ? 'w-full' : ''}`}
          >
            {row.map((piece, pi) => (
              <CanvasPiece key={`piece-${ri}-${pi}`} piece={piece} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
