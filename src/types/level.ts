import { PUZZLES_PER_CHAPTER } from '../campaign/chapterThemes'

export type Difficulty = 'Fácil' | 'Normal' | 'Avanzado'

export interface Level {
  id: number
  /** Puzzle directions (Spanish) */
  instructionEs: string
  /** Puzzle directions (English) */
  instructionEn: string
  targetPattern: string[]
  gridCols: number
  allowedBlocks: string[]
  difficulty: Difficulty
  varNames?: string[]
}

export interface CampaignChapter {
  index: number
  title: string
  puzzles: Level[]
}

/** Difficulty badge from overall puzzle progress (not only chapter index). */
export function difficultyForChapter(chapterIndex: number, puzzleIndex: number = 0): Difficulty {
  const g = chapterIndex * PUZZLES_PER_CHAPTER + puzzleIndex
  if (g < 28) return 'Fácil'
  if (g < 80) return 'Normal'
  return 'Avanzado'
}

/**
 * Nombres de variable disponibles por etapa (etiquetas para guardar un valor).
 * El valor sigue siendo un número para Repetir; los nombres rotan por puzzle para variedad pedagógica.
 */
export function varNamesForChapter(
  chapterIndex: number,
  puzzleIndex: number,
): string[] | undefined {
  /* Capítulos 0–6: sin variables; desde “Variables con nombre” en la campaña temática */
  if (chapterIndex < 7) return undefined

  const rot = puzzleIndex % 6
  const oneName = pickRot(
    ['pasos', 'vueltas', 'tramo', 'serie', 'ronda', 'bloque'],
    rot,
  )
  const twoNames = pickRot(
    [
      ['pasos', 'vueltas'],
      ['tramo', 'serie'],
      ['ancho', 'filas'],
      ['bloque', 'veces'],
      ['n', 'm'],
      ['pasos', 'tramo'],
    ] as const,
    rot,
  )
  const threeNames = pickRot(
    [
      ['pasos', 'vueltas', 'tramo'],
      ['serie', 'ronda', 'bloque'],
      ['ancho', 'filas', 'capa'],
      ['n', 'm', 'pasos'],
      ['tramo', 'serie', 'vueltas'],
      ['bloque', 'veces', 'ronda'],
    ] as const,
    rot,
  )

  if (chapterIndex < 9) return [oneName]
  if (chapterIndex < 11) return [...twoNames]
  return [...threeNames]
}

function pickRot<T>(arr: readonly T[], i: number): T {
  return arr[((i % arr.length) + arr.length) % arr.length]
}
