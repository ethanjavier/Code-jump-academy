/** Hook previsto para efectos de sonido (Web Audio o clips mp3). */
export type SFXType = 'add' | 'run' | 'win' | 'fail'

export function playSFX(type: SFXType): void {
  void type
  /* Reservado: buffers Web Audio o etiquetas <audio>. */
}
