import type { Level } from '../types/level'
import {
  difficultyForChapter,
  varNamesForChapter,
} from '../types/level'
import type { ColorKey } from '../engine/blocks'

const COLORS: ColorKey[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'purple',
]

function pick<T>(arr: T[], i: number): T {
  return arr[((i % arr.length) + arr.length) % arr.length]
}

function uniqColors(keys: ColorKey[]): ColorKey[] {
  return [...new Set(keys)]
}

function allowForPattern(
  pattern: string[],
  opts: { repeat: boolean; varDecl: boolean },
  names: string[] | undefined,
): string[] {
  const colors = uniqColors(
    pattern.filter((c): c is ColorKey => c !== 'skip' && c !== ''),
  )
  const blocks: string[] = []
  blocks.push('newLine')
  if (opts.repeat) blocks.push('repeat')
  if (opts.varDecl && names?.length) blocks.push('varDecl')
  for (const c of colors) blocks.push(`drawBox:${c}`)
  return blocks
}

function rowsFor(pattern: string[], cols: number): number {
  if (cols <= 0) return 0
  return Math.ceil(pattern.length / cols)
}

/** Patrón vacío rellenado con skip hasta rows*cols */
function padPattern(pattern: string[], cols: number, rows: number): string[] {
  const total = rows * cols
  const next = pattern.slice()
  while (next.length < total) next.push('skip')
  return next.slice(0, total)
}

export function buildLevel(chapterIndex: number, puzzleIndex: number): Level {
  const id = chapterIndex * 20 + puzzleIndex + 1
  const difficulty = difficultyForChapter(chapterIndex)
  const varNames = varNamesForChapter(chapterIndex)
  const cols = 3 + ((chapterIndex + puzzleIndex) % 3)
  const seed = chapterIndex * 47 + puzzleIndex * 19
  const t = seed % 22
  const showRepeat = chapterIndex >= 1
  const showVars = Boolean(varNames?.length)

  const c0 = pick(COLORS, seed)
  const c1 = pick(COLORS, seed + 2)
  const c2 = pick(COLORS, seed + 4)

  let instruction: string
  let targetPattern: string[]
  let repeatHint = false

  if (t === 0 || t === 1) {
    const colors = [c0, c1, c2].slice(0, Math.min(3, cols))
    targetPattern = []
    for (let c = 0; c < cols; c += 1) {
      targetPattern.push(colors[c % colors.length])
    }
    const rows = rowsFor(targetPattern, cols)
    targetPattern = padPattern(targetPattern, cols, rows)
    instruction =
      `Fila 1: pinta ${cols} celdas en orden usando los colores del objetivo.`
    if (showRepeat && chapterIndex >= 3) {
      instruction +=
        ' Puedes usar Repetir si te ahorra bloques en la fila.'
      repeatHint = true
    }
  } else if (t === 2 || t === 3) {
    const row1 = Array.from({ length: cols }, (_, i) =>
      pick([c0, c1], seed + i),
    )
    const row2 = Array.from({ length: cols }, (_, i) =>
      pick([c2, c0], seed + 5 + i),
    )
    targetPattern = padPattern([...row1, ...row2], cols, 2)
    instruction =
      'Dos filas: completa la primera y luego newLine(); después la segunda fila.'
  } else if (t === 4 || t === 5) {
    const k = Math.min(cols, 3 + (seed % 3))
    const row = Array.from({ length: cols }, (_, i) => (i < k ? c0 : 'skip'))
    targetPattern = padPattern(row, cols, 1)
    instruction =
      `Pinta solo las primeras ${k} celdas de la fila; el resto queda libre (skip).`
  } else if (t === 6 || t === 7) {
    const stripe = Array.from({ length: cols }, (_, i) => pick([c0, c1], seed + i))
    targetPattern = padPattern(stripe, cols, 1)
    instruction =
      'Crea un patrón de franja alternando colores a lo largo de la fila.'
  } else if (t === 8 || t === 9) {
    const inner = Math.min(3, cols)
    const row: string[] = []
    for (let i = 0; i < inner; i += 1) row.push(c1)
    for (let i = inner; i < cols; i += 1) row.push('skip')
    targetPattern = padPattern(row, cols, 1)
    instruction =
      showRepeat
        ? `Usa Repetir ×${inner} con un solo drawBox("${c1}") para pintar ${inner} celdas seguidas.`
        : `Pinta ${inner} celdas de ${c1} al inicio de la fila.`
    repeatHint = showRepeat
  } else if (t === 10 || t === 11) {
    const row1 = Array.from({ length: cols }, () => c2)
    targetPattern = padPattern([...row1, ...Array.from({ length: cols }, () => c0)], cols, 2)
    instruction =
      'Primera fila un color sólido; newLine(); segunda fila otro color sólido.'
  } else if (t === 12 || t === 13) {
    const cells = cols * 2
    const zig: string[] = []
    for (let i = 0; i < cells; i += 1) {
      const row = i < cols ? 0 : 1
      const col = row === 0 ? i : i - cols
      zig.push(col % 2 === 0 ? c0 : c1)
    }
    targetPattern = padPattern(zig, cols, 2)
    instruction =
      'Dos filas con un tablero alternado (tipo dama) en las celdas objetivo.'
  } else if (t === 14 || t === 15) {
    const total = cols * 2
    const half = Math.floor(total / 2)
    const arr: string[] = []
    for (let i = 0; i < total; i += 1) arr.push(i < half ? c1 : 'skip')
    targetPattern = padPattern(arr, cols, 2)
    instruction =
      'Solo la mitad izquierda-derecha superior del lienzo debe pintarse; el resto es skip.'
  } else if (t === 16 || t === 17) {
    const r = Math.min(3, cols - 1)
    const row: string[] = []
    for (let i = 0; i < cols; i += 1) row.push(i < r ? c2 : 'skip')
    targetPattern = padPattern(row, cols, 1)
    instruction = `Simula un degradado corto: ${r} celdas de ${c2} al comienzo.`
  } else if (t === 18) {
    const row = Array.from({ length: cols }, (_, i) => pick(COLORS, seed + i))
    targetPattern = padPattern(row, cols, 1)
    instruction =
      'Arcoíris compacto: avanza por la fila cambiando de color en cada celda.'
  } else {
    const grid = Array.from({ length: cols }, (_, r) =>
      Array.from({ length: cols }, (_, co) =>
        (r + co) % 3 === 0 ? c0 : (r + co) % 3 === 1 ? c1 : 'skip',
      ),
    )
    const flat = grid.flat()
    const rows = cols
    targetPattern = padPattern(flat, cols, rows)
    instruction =
      cols >= 4
        ? 'Patrón en cuadrícula: sigue las marcas objetivo en varias filas.'
        : 'Varias filas con huecos: pinta solo donde hay meta.'
  }

  const useRepeat = showRepeat && (repeatHint || chapterIndex >= 5 || t % 3 === 0)
  const allowedBlocks = allowForPattern(targetPattern, {
    repeat: useRepeat,
    varDecl: showVars,
  }, varNames)

  if (showVars) {
    const vn = varNames?.join(', ') ?? ''
    instruction +=
      ` Variables: declara con el bloque Crear (${vn}) y usa el nombre en Repetir cuando el número de repeticiones deba coincidir con tu variable.`
  }

  return {
    id,
    instruction,
    targetPattern,
    gridCols: cols,
    allowedBlocks,
    difficulty,
    varNames,
  }
}

export const CAMPAIGN_CHAPTERS = Array.from({ length: 20 }, (_, ch) => ({
  index: ch,
  title: `Capítulo ${ch + 1}`,
  puzzles: Array.from({ length: 20 }, (_, p) => buildLevel(ch, p)),
}))
