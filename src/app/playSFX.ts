/**
 * Hook for short UI sounds (Web Audio or `<audio>` tags).
 * Call sites today: palette add block, Run, level win, flatten/run fail.
 */
export type SFXType = 'add' | 'run' | 'win' | 'fail'

export function playSFX(type: SFXType): void {
  void type
  // Reserved: map type → buffer or clip, guard with prefers-reduced-motion if needed.
}
