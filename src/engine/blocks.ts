export type ColorKey =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'purple'

export type CountSource =
  | { type: 'literal'; value: number }
  | { type: 'var'; name: string }

export type DrawBoxBlock = {
  id: string
  kind: 'drawBox'
  color: ColorKey
}

export type NewLineBlock = {
  id: string
  kind: 'newLine'
}

/** Avanza una celda a la derecha sin pintar (hueco / objetivo skip). */
export type SkipBlock = {
  id: string
  kind: 'skip'
}

export type RepeatBlock = {
  id: string
  kind: 'repeat'
  count: CountSource
  children: BlockNode[]
}

export type VarDeclBlock = {
  id: string
  kind: 'varDecl'
  name: string
  initial: number
}

export type BlockNode =
  | DrawBoxBlock
  | NewLineBlock
  | SkipBlock
  | RepeatBlock
  | VarDeclBlock

export type FlatStep =
  | { type: 'drawBox'; color: ColorKey }
  | { type: 'newLine' }
  | { type: 'skip' }

export function clampRepeatCount(n: number): number {
  return Math.max(2, Math.min(12, Math.round(n)))
}
