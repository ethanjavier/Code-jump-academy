export type Difficulty = 'Fácil' | 'Normal' | 'Avanzado'

export interface Level {
  id: number
  instruction: string
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

export function difficultyForChapter(chapterIndex: number): Difficulty {
  if (chapterIndex < 7) return 'Fácil'
  if (chapterIndex < 14) return 'Normal'
  return 'Avanzado'
}

export function varNamesForChapter(chapterIndex: number): string[] | undefined {
  if (chapterIndex < 8) return undefined
  if (chapterIndex < 15) return ['n']
  return ['n', 'm']
}
