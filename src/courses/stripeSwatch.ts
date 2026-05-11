/** Safe Tailwind classes for stripe previews (no user-controlled strings). */
export type StripeSwatch =
  | 'emerald'
  | 'amber'
  | 'sky'
  | 'rose'
  | 'violet'
  | 'orange'
  | 'teal'
  | 'indigo'
  | 'fuchsia'
  | 'lime'
  | 'slate'

export const STRIPE_SWATCH_BG: Record<StripeSwatch, string> = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-400',
  sky: 'bg-sky-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  orange: 'bg-orange-500',
  teal: 'bg-teal-500',
  indigo: 'bg-indigo-500',
  fuchsia: 'bg-fuchsia-600',
  lime: 'bg-lime-500',
  slate: 'bg-slate-500',
}
