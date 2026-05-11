import { Check } from 'lucide-react'
import { useMemo } from 'react'

import type { Localized, PaletteCodeResultStripe } from '../../courses/guidedLessonTypes'
import { STRIPE_SWATCH_BG } from '../../courses/stripeSwatch'
import { localized } from '../languageQuizzes'
import { iconStroke } from '../icons'

type Props = {
  draft: string
  correctText: Localized
  locale: 'en' | 'es'
  stripes: PaletteCodeResultStripe[]
  /** After lesson complete — highlight success */
  won?: boolean
  /** Compact = lienzo; hero = modal */
  variant?: 'compact' | 'hero'
  /**
   * Stripe captions (e.g. “Console out”) — hidden on the canvas (`compact`) by default so the live
   * code carries the meaning; modal (`hero`) still shows them unless overridden.
   */
  showStripeCaptions?: boolean
}

export function PaletteCodeFlowPreview({
  draft,
  correctText,
  locale,
  stripes,
  won = false,
  variant = 'compact',
  showStripeCaptions: showStripeCaptionsProp,
}: Props) {
  const showStripeCaptions = showStripeCaptionsProp ?? variant === 'hero'
  const correctLines = useMemo(
    () =>
      localized(correctText, locale)
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((l) => l.trim()),
    [correctText, locale],
  )

  const draftLines = useMemo(() => draft.replace(/\r\n/g, '\n').split('\n'), [draft])

  const minH = variant === 'hero' ? 'min-h-[240px]' : 'min-h-[100px]'
  const monoSize = variant === 'hero' ? 'text-[12px]' : 'text-[10px]'
  const captionSize = variant === 'hero' ? 'text-[10px]' : 'text-[9px]'
  const checkClass = showStripeCaptions ? 'size-3.5' : 'size-4'

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border border-white/15 shadow-inner ring-1 ring-white/10 ${minH}`}
    >
      {stripes.map((row, i) => {
        const expected = correctLines[i] ?? ''
        const userRaw = draftLines[i] ?? ''
        const user = userRaw.trim()
        const match = expected !== '' && user === expected.trim()
        const bg = STRIPE_SWATCH_BG[row.swatch]
        const showCheck = match
        return (
          <div
            key={`${row.swatch}-${i}`}
            className={`flex min-h-[2.35rem] flex-1 flex-col justify-center border-b border-black/25 px-2.5 py-2 text-white shadow-inner last:border-b-0 ${bg} transition-opacity duration-200 ${
              match ? 'opacity-100 ring-1 ring-inset ring-white/35' : 'opacity-[0.72]'
            } ${won && match ? 'ring-2 ring-emerald-300/85 ring-offset-1 ring-offset-black/20' : ''}`}
          >
            <div
              className={`flex gap-2 ${showStripeCaptions ? 'items-start' : 'items-center justify-between'}`}
            >
              <div className="min-w-0 flex-1">
                <p className={`truncate font-mono ${monoSize} leading-snug text-white ${user ? '' : 'text-white/50'}`}>
                  {user || '…'}
                </p>
              </div>
              {showStripeCaptions ? (
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span
                    className={`max-w-[8rem] text-right font-display ${captionSize} font-bold uppercase leading-tight tracking-wide text-white/85`}
                  >
                    {localized(row.caption, locale)}
                  </span>
                  {showCheck ? (
                    <Check
                      className={`${checkClass} shrink-0 text-emerald-100 drop-shadow-sm`}
                      strokeWidth={iconStroke.medium}
                      aria-hidden
                    />
                  ) : null}
                </div>
              ) : showCheck ? (
                <Check
                  className={`${checkClass} shrink-0 text-emerald-100 drop-shadow-sm`}
                  strokeWidth={iconStroke.medium}
                  aria-hidden
                />
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
