import { motion } from 'framer-motion'
import { Sparkles, Star } from 'lucide-react'
import type { ReactNode } from 'react'

import { iconStroke } from '../icons'

/** Decorative stars + glow behind palette-code result modal content. */
export function PaletteCodeModalBackdrop({ children }: { children: ReactNode }) {
  const sparkles = [
    { top: '6%', left: '8%', delay: 0, dur: 2.2 },
    { top: '14%', left: '88%', delay: 0.3, dur: 2.6 },
    { top: '72%', left: '6%', delay: 0.6, dur: 2.4 },
    { top: '82%', left: '90%', delay: 0.2, dur: 2.8 },
    { top: '42%', left: '4%', delay: 0.5, dur: 2.5 },
    { top: '48%', left: '94%', delay: 0.1, dur: 2.3 },
    { top: '22%', left: '48%', delay: 0.8, dur: 3 },
    { top: '58%', left: '52%', delay: 0.4, dur: 2.7 },
  ]

  const miniStars = [
    { top: '18%', left: '22%', r: 34, delay: 0 },
    { top: '28%', left: '76%', r: -18, delay: 0.4 },
    { top: '65%', left: '18%', r: 12, delay: 0.8 },
    { top: '78%', left: '72%', r: -25, delay: 0.2 },
  ]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-400/30 bg-gradient-to-br from-indigo-950 via-slate-950 to-violet-950/95 p-1 shadow-[0_0_60px_-12px_rgba(139,92,246,0.45)] ring-1 ring-violet-400/20">
      {/* Soft glow orbs */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full bg-violet-500/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-20 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/3 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-teal-500/10 blur-2xl"
        aria-hidden
      />

      {/* Twinkling ✦ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
        {sparkles.map((s, i) => (
          <motion.span
            key={`tw-${i}`}
            className="absolute select-none text-lg text-amber-200/90 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
            style={{ top: s.top, left: s.left }}
            animate={{
              opacity: [0.35, 1, 0.35],
              scale: [0.85, 1.15, 0.85],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: s.dur,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: s.delay,
            }}
          >
            ✦
          </motion.span>
        ))}
        {miniStars.map((s, i) => (
          <motion.span
            key={`st-${i}`}
            className="absolute text-amber-300/80"
            style={{ top: s.top, left: s.left }}
            initial={{ rotate: s.r, opacity: 0.5 }}
            animate={{
              opacity: [0.45, 0.95, 0.45],
              scale: [0.9, 1.05, 0.9],
              rotate: [s.r, s.r + 15, s.r],
            }}
            transition={{
              duration: 2.4 + i * 0.1,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: s.delay,
            }}
          >
            <Star className="size-4 fill-amber-300/50 text-amber-200" strokeWidth={iconStroke.soft} aria-hidden />
          </motion.span>
        ))}
        <motion.div
          className="absolute right-5 top-5 text-violet-300"
          animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="size-9 drop-shadow-[0_0_12px_rgba(167,139,250,0.7)]" strokeWidth={iconStroke.soft} aria-hidden />
        </motion.div>
        <motion.div
          className="absolute bottom-6 left-5 text-amber-300/70"
          animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="size-6" strokeWidth={iconStroke.soft} aria-hidden />
        </motion.div>
      </div>

      {/* Inner card */}
      <div className="relative z-10 rounded-xl border border-white/10 bg-slate-950/75 px-5 py-5 backdrop-blur-sm md:px-6 md:py-6">
        {children}
      </div>
    </div>
  )
}
