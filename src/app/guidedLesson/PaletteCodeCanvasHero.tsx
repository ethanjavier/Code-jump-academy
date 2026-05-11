import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight } from 'lucide-react'

import type { PaletteCodeCanvasHero as HeroConfig } from '../../courses/guidedLessonTypes'
import { STRIPE_SWATCH_BG } from '../../courses/stripeSwatch'
import { useI18n } from '../../i18n/I18nContext'
import { localized } from '../languageQuizzes'

type Props = {
  hero: HeroConfig
  /** First line of draft matches first line of solution */
  firstLineLit: boolean
  /** Whole exercise solved */
  won: boolean
}

function isLit(hero: HeroConfig, firstLineLit: boolean, won: boolean): boolean {
  const gate = hero.highlightWhenFirstLineMatches === true
  return !gate || firstLineLit || won
}

function wantsHighlight(hero: HeroConfig): boolean {
  return hero.highlightWhenFirstLineMatches === true
}

function HeroFooter({
  lit,
  useHighlight,
  won,
  t,
}: {
  lit: boolean
  useHighlight: boolean
  won: boolean
  t: (key: string) => string
}) {
  const msg = won
    ? t('guided.paletteCodeCanvasHeroCelebrate')
    : useHighlight
      ? lit
        ? t('guided.paletteCodeCanvasHeroLit')
        : t('guided.paletteCodeCanvasHeroDim')
      : t('guided.paletteCodeCanvasHeroTap')
  return (
    <p className="mt-3 max-w-sm text-center text-[11px] leading-snug text-teal-200/80">{msg}</p>
  )
}

const celebrateTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 16,
}

export function PaletteCodeCanvasHeroBlock({ hero, firstLineLit, won }: Props) {
  const { locale, t } = useI18n()
  const lit = isLit(hero, firstLineLit, won)
  const useHighlight = wantsHighlight(hero)

  const shell = (children: ReactNode, opts?: { wide?: boolean }) => (
    <motion.div
      layout
      className={`relative mb-4 flex min-h-[7rem] select-none flex-col items-center justify-center rounded-3xl border border-teal-400/30 bg-gradient-to-br from-teal-950/85 via-slate-950/95 to-indigo-950/85 px-4 py-7 shadow-[0_20px_50px_-12px_rgba(15,118,110,0.35)] ring-1 ring-teal-400/20 ${opts?.wide ? 'max-w-lg' : ''}`}
      initial={won ? { opacity: 0, scale: 0.82, y: 12 } : { opacity: lit ? 1 : 0.38, scale: lit ? 1 : 0.97 }}
      animate={
        won
          ? { opacity: 1, scale: [0.82, 1.1, 1], y: 0 }
          : { opacity: lit ? 1 : 0.38, scale: lit ? 1 : 0.97, y: 0 }
      }
      transition={won ? { duration: 0.55, times: [0, 0.55, 1], ease: ['easeOut', 'easeOut', 'easeOut'] } : { duration: 0.35 }}
    >
      {won ? (
        <motion.div
          className="pointer-events-none absolute -inset-1 rounded-[1.35rem] bg-gradient-to-tr from-teal-400/20 via-fuchsia-500/15 to-violet-500/25 blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0.65] }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          aria-hidden
        />
      ) : null}
      <div className="relative z-10 flex w-full flex-col items-center">{children}</div>
      <HeroFooter lit={lit} useHighlight={useHighlight} won={won} t={t} />
    </motion.div>
  )

  if (hero.mode === 'greeting') {
    const text = localized(hero.headline, locale)
    return shell(
      <motion.button
        type="button"
        initial={won ? { scale: 0.75, opacity: 0 } : false}
        animate={
          won
            ? { scale: [0.75, 1.14, 1.02, 1], opacity: 1 }
            : { scale: 1, opacity: 1 }
        }
        transition={won ? { duration: 0.65, times: [0, 0.45, 0.78, 1], ease: ['easeOut', 'easeOut', 'easeOut', 'easeOut'] } : undefined}
        whileHover={{ scale: won ? 1.08 : 1.06, rotate: won ? [0, -2, 2, 0] : 0 }}
        whileTap={{ scale: 0.94 }}
        className="group relative max-w-full cursor-pointer rounded-[2rem] border border-white/20 bg-gradient-to-b from-white/[0.12] to-teal-500/[0.08] px-8 py-5 text-center shadow-[0_12px_40px_-8px_rgba(45,212,191,0.45)] outline-none ring-2 ring-teal-400/25 ring-offset-2 ring-offset-slate-950 backdrop-blur-sm transition-shadow hover:shadow-[0_16px_48px_-6px_rgba(167,139,250,0.4)] hover:ring-fuchsia-400/35"
        aria-label={t('guided.paletteCodeCanvasHeroAria')}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-amber-200/10 via-transparent to-violet-400/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
        <span
          className="relative block bg-gradient-to-br from-amber-100 via-teal-100 to-violet-200 bg-clip-text font-display text-[clamp(2.5rem,9vw,4.5rem)] font-black leading-none tracking-tight text-transparent drop-shadow-[0_4px_28px_rgba(45,212,191,0.45)]"
        >
          {text}
        </span>
        {won ? (
          <motion.span
            className="absolute -right-2 -top-3 text-3xl"
            initial={{ scale: 0, rotate: -50 }}
            animate={{ scale: 1, rotate: [12, -8, 12] }}
            transition={{ ...celebrateTransition, delay: 0.35 }}
            aria-hidden
          >
            ✨
          </motion.span>
        ) : null}
      </motion.button>,
    )
  }

  if (hero.mode === 'typeRibbon') {
    const text = localized(hero.headline, locale)
    return shell(
      <motion.button
        type="button"
        initial={won ? { scale: 0.8, opacity: 0, y: 8 } : false}
        animate={won ? { scale: [0.8, 1.12, 1], opacity: 1, y: 0 } : { scale: 1, opacity: 1, y: 0 }}
        transition={won ? { duration: 0.55, times: [0, 0.5, 1] } : undefined}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative max-w-full cursor-pointer rounded-2xl border border-violet-400/40 bg-gradient-to-br from-violet-600/30 to-indigo-900/50 px-7 py-4 shadow-lg shadow-violet-950/40 outline-none ring-1 ring-violet-300/25 ring-offset-2 ring-offset-slate-950 focus-visible:ring-2 focus-visible:ring-violet-400"
        aria-label={t('guided.paletteCodeCanvasHeroAria')}
      >
        <span className="block bg-gradient-to-r from-violet-100 via-fuchsia-100 to-indigo-100 bg-clip-text font-mono text-[clamp(1.85rem,6.5vw,3.2rem)] font-bold leading-none tracking-tight text-transparent drop-shadow-[0_2px_24px_rgba(167,139,250,0.5)]">
          {text}
        </span>
        {won ? (
          <motion.span
            className="absolute -right-2 -top-2 text-2xl"
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ ...celebrateTransition, delay: 0.25 }}
            aria-hidden
          >
            ✨
          </motion.span>
        ) : null}
      </motion.button>,
    )
  }

  if (hero.mode === 'sqlRiver') {
    const layers = [
      { label: 'SELECT', swatch: 'sky' as const },
      { label: 'FROM', swatch: 'indigo' as const },
      { label: 'WHERE', swatch: 'rose' as const },
    ]
    return shell(
      <div
        className="flex w-full max-w-xs flex-col items-stretch"
        role="img"
        aria-label={t('guided.paletteCodeHeroSqlAria')}
      >
        {layers.map((layer, i) => (
          <div key={layer.label} className="flex flex-col items-stretch">
            <motion.button
              type="button"
              initial={won ? { opacity: 0, x: -16 } : false}
              animate={won ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
              transition={won ? { ...celebrateTransition, delay: 0.08 * i } : undefined}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full rounded-xl border border-white/25 px-3 py-2.5 text-left shadow-lg ${STRIPE_SWATCH_BG[layer.swatch]} transition-shadow`}
              aria-hidden
            >
              <span className="font-mono text-[13px] font-bold tracking-wide text-white drop-shadow-sm">
                {layer.label}
              </span>
            </motion.button>
            {i < layers.length - 1 ? (
              <div className="flex justify-center py-1">
                <ChevronDown className="size-4 text-teal-300/85" strokeWidth={2.5} aria-hidden />
              </div>
            ) : null}
          </div>
        ))}
      </div>,
    )
  }

  if (hero.mode === 'htmlLayers') {
    const mid = localized(hero.headline, locale)
    return shell(
      <div
        className="flex w-full max-w-sm flex-col gap-2"
        role="img"
        aria-label={t('guided.paletteCodeHeroHtmlAria')}
      >
        <motion.div
          initial={won ? { opacity: 0, y: -10 } : false}
          animate={won ? { opacity: 1, y: 0 } : {}}
          transition={won ? { ...celebrateTransition, delay: 0 } : undefined}
          whileHover={{ y: -2 }}
          className={`rounded-xl border-2 border-dashed border-slate-400/70 ${STRIPE_SWATCH_BG.slate} px-3 py-2 shadow-inner`}
        >
          <span className="font-mono text-[11px] font-semibold text-white">&lt;div&gt;</span>
        </motion.div>
        <motion.div
          initial={won ? { opacity: 0, scale: 0.85 } : false}
          animate={won ? { opacity: 1, scale: [0.85, 1.08, 1] } : {}}
          transition={won ? { delay: 0.12, ...celebrateTransition } : undefined}
          whileHover={{ scale: 1.03 }}
          className={`rounded-xl ${STRIPE_SWATCH_BG.amber} px-3 py-3 text-center shadow-lg shadow-amber-950/30`}
        >
          <span className="font-display text-xl font-bold text-white drop-shadow-sm">{mid}</span>
        </motion.div>
        <motion.div
          initial={won ? { opacity: 0, y: 10 } : false}
          animate={won ? { opacity: 1, y: 0 } : {}}
          transition={won ? { ...celebrateTransition, delay: 0.22 } : undefined}
          whileHover={{ y: 2 }}
          className={`rounded-xl ${STRIPE_SWATCH_BG.fuchsia} px-3 py-2 shadow-inner`}
        >
          <span className="font-mono text-[11px] font-semibold text-white">color: red;</span>
        </motion.div>
      </div>,
    )
  }

  // pipeline — barra en gradiente (sin “semáforo” verde/ámbar/azul)
  const text = localized(hero.headline, locale)
  return shell(
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <motion.button
        type="button"
        initial={won ? { scale: 0.78, opacity: 0 } : false}
        animate={won ? { scale: [0.78, 1.12, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={won ? { duration: 0.55, times: [0, 0.55, 1] } : undefined}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative cursor-pointer rounded-2xl px-3 py-2 text-center outline-none ring-offset-2 ring-offset-slate-950 focus-visible:ring-2 focus-visible:ring-teal-400"
        aria-label={t('guided.paletteCodeCanvasHeroAria')}
      >
        <span className="block bg-gradient-to-br from-cyan-100 via-teal-100 to-emerald-200 bg-clip-text font-display text-[clamp(2.1rem,7.5vw,3.75rem)] font-black leading-none tracking-tight text-transparent drop-shadow-[0_4px_28px_rgba(45,212,191,0.4)]">
          {text}
        </span>
        {won ? (
          <motion.span
            className="absolute -right-1 -top-2 text-2xl"
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ ...celebrateTransition, delay: 0.28 }}
            aria-hidden
          >
            ✨
          </motion.span>
        ) : null}
      </motion.button>
      <motion.div
        className="flex items-center gap-2"
        initial={won ? { opacity: 0, scaleX: 0.3 } : false}
        animate={won ? { opacity: 1, scaleX: 1 } : { opacity: 1, scaleX: 1 }}
        transition={won ? { delay: 0.2, duration: 0.45 } : undefined}
        aria-hidden
      >
        <ChevronRight className="size-4 shrink-0 text-teal-300/70" strokeWidth={2.5} />
        <motion.div
          className="h-2 w-36 max-w-[70vw] rounded-full bg-gradient-to-r from-teal-400 via-violet-400 to-fuchsia-400 shadow-[0_0_22px_rgba(99,102,241,0.45)]"
          animate={
            won
              ? { scaleX: [1, 1.04, 1], opacity: [0.88, 1, 0.88] }
              : { scaleX: [1, 1.02, 1], opacity: [0.9, 1, 0.9] }
          }
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <ChevronRight className="size-4 shrink-0 text-fuchsia-300/70" strokeWidth={2.5} />
      </motion.div>
    </div>,
    { wide: true },
  )
}
