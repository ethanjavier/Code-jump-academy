import { motion, AnimatePresence } from 'framer-motion'

export type MascotMood = 'happy' | 'sad' | 'neutral'

export function MascotBubble({
  message,
  mood,
  visible,
}: {
  message: string | null
  mood: MascotMood
  visible: boolean
}) {
  const stroke =
    mood === 'happy'
      ? '#34d399'
      : mood === 'sad'
        ? '#f97316'
        : '#818cf8'

  return (
    <div
      className="pointer-events-none fixed bottom-5 left-5 z-[60] flex max-w-[min(92vw,340px)] items-end gap-3 sm:bottom-8 sm:left-8"
      aria-live="polite"
    >
      <motion.div
        className="relative shrink-0 drop-shadow-xl"
        animate={{ y: [0, -4, 0] }}
        transition={{
          repeat: Infinity,
          duration: 3.2,
          ease: 'easeInOut',
        }}
      >
        <svg
          width="72"
          height="84"
          viewBox="0 0 72 84"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="botBody" x1="12" y1="8" x2="56" y2="78" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="botFace" x1="22" y1="28" x2="48" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="1" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
          <rect x="10" y="18" width="52" height="56" rx="16" fill="url(#botBody)" />
          <circle cx="36" cy="14" r="8" fill="#a855f7" />
          <rect x="24" y="32" width="24" height="20" rx="8" fill="url(#botFace)" />
          <circle cx="30" cy="40" r="3" fill="#0f172a" />
          <circle cx="42" cy="40" r="3" fill="#0f172a" />
          <path
            d="M30 48 Q36 52 42 48"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="18" y="68" width="14" height="12" rx="4" fill="#4f46e5" />
          <rect x="40" y="68" width="14" height="12" rx="4" fill="#4f46e5" />
        </svg>
      </motion.div>

      <AnimatePresence>
        {visible && message ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="pointer-events-auto relative rounded-3xl border-2 bg-slate-900/95 px-4 py-3 text-sm leading-snug text-slate-100 shadow-2xl backdrop-blur-md"
            style={{ borderColor: stroke }}
          >
            <span
              className="absolute -left-2 bottom-4 size-3 rotate-45 rounded-sm border-2 border-r-0 border-t-0 bg-slate-900/95"
              style={{ borderLeftColor: stroke, borderBottomColor: stroke }}
              aria-hidden
            />
            <p className="relative font-display font-semibold">{message}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
