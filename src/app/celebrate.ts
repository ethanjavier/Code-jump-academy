import confetti from 'canvas-confetti'

export function celebrateWin(): void {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  confetti({
    particleCount: 110,
    spread: 72,
    origin: { y: 0.62 },
    colors: ['#6366f1', '#a855f7', '#34d399', '#2dd4bf', '#fbbf24', '#f472b6'],
  })
  window.setTimeout(() => {
    void confetti({
      particleCount: 55,
      angle: 60,
      spread: 48,
      origin: { x: 0, y: 0.68 },
      colors: ['#818cf8', '#c084fc'],
    })
    void confetti({
      particleCount: 55,
      angle: 120,
      spread: 48,
      origin: { x: 1, y: 0.68 },
      colors: ['#34d399', '#22d3ee'],
    })
  }, 160)
}
