import { COLOR_META } from '../app/constants'
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
  if (pattern.some((c) => c === 'skip')) blocks.push('skip')
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

/** Colores de una fila del patrón (solo meta), izquierda → derecha */
function rowColors(pattern: string[], cols: number, rowIdx: number): ColorKey[] {
  const start = rowIdx * cols
  return pattern
    .slice(start, start + cols)
    .filter((c): c is ColorKey => c !== 'skip' && c !== '')
}

function labelsJoined(colors: ColorKey[]): string {
  return colors.map((c) => COLOR_META[c].label).join(' → ')
}

function ejemploCadenaDrawBox(colors: ColorKey[]): string {
  return colors.map((c) => `drawBox("${c}")`).join(' → luego ')
}

/** Recorre el lienzo como el cursor: fila por fila, izquierda a derecha */
function colorsPaintOrder(pattern: string[]): ColorKey[] {
  const out: ColorKey[] = []
  for (let i = 0; i < pattern.length; i += 1) {
    const c = pattern[i]
    if (c !== 'skip' && c !== '') out.push(c as ColorKey)
  }
  return out
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
    const rowSeq = rowColors(targetPattern, cols, 0)
    instruction =
      `Una sola fila: pinta ${cols} celdas de izquierda a derecha en este orden exacto.\n\n` +
      `Orden de colores: ${labelsJoined(rowSeq)}.\n\n` +
      `Ejemplo de bloques: ${ejemploCadenaDrawBox(rowSeq)}.`
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
    const r1c = rowColors(targetPattern, cols, 0)
    const r2c = rowColors(targetPattern, cols, 1)
    instruction =
      `Dos filas. Primero pinta la fila 1 en orden; usa newLine(); luego la fila 2 en orden.\n\n` +
      `Fila 1: ${labelsJoined(r1c)}.\n` +
      `Fila 2: ${labelsJoined(r2c)}.\n\n` +
      `Ejemplo: ${ejemploCadenaDrawBox(r1c)} → newLine() → ${ejemploCadenaDrawBox(r2c)}.`
  } else if (t === 4 || t === 5) {
    const k = Math.min(cols, 3 + (seed % 3))
    const row = Array.from({ length: cols }, (_, i) => (i < k ? c0 : 'skip'))
    targetPattern = padPattern(row, cols, 1)
    const prefixSeq = rowColors(targetPattern, cols, 0)
    instruction =
      `Pinta solo las primeras ${k} celdas de la fila; el resto sin pintar (skip).\n\n` +
      `Orden en esas celdas: ${labelsJoined(prefixSeq)}.\n\n` +
      `Ejemplo: ${ejemploCadenaDrawBox(prefixSeq)} y no pintes las demás.`
  } else if (t === 6 || t === 7) {
    const stripe = Array.from({ length: cols }, (_, i) => pick([c0, c1], seed + i))
    targetPattern = padPattern(stripe, cols, 1)
    const stripeSeq = rowColors(targetPattern, cols, 0)
    instruction =
      `Franja en una fila: sigue el orden exacto del objetivo.\n\n` +
      `Orden celda a celda: ${labelsJoined(stripeSeq)}.\n\n` +
      `Ejemplo: ${ejemploCadenaDrawBox(stripeSeq)}.`
  } else if (t === 8 || t === 9) {
    const inner = Math.min(3, cols)
    const row: string[] = []
    for (let i = 0; i < inner; i += 1) row.push(c1)
    for (let i = inner; i < cols; i += 1) row.push('skip')
    targetPattern = padPattern(row, cols, 1)
    const solidSeq = Array.from({ length: inner }, () => c1) as ColorKey[]
    instruction =
      showRepeat
        ? `Usa Repetir ×${inner} con un solo drawBox("${c1}") para pintar ${inner} celdas seguidas de ${COLOR_META[c1].label}.\n\n` +
          `Ejemplo: bloque Repetir ×${inner} con interior drawBox("${c1}").`
        : `Pinta ${inner} celdas de ${COLOR_META[c1].label} al inicio de la fila.\n\n` +
          `Ejemplo: ${ejemploCadenaDrawBox(solidSeq)}.`
    repeatHint = showRepeat
  } else if (t === 10 || t === 11) {
    const row1 = Array.from({ length: cols }, () => c2)
    targetPattern = padPattern([...row1, ...Array.from({ length: cols }, () => c0)], cols, 2)
    instruction =
      `Primera fila: todas las celdas ${COLOR_META[c2].label}. Segunda fila: todas ${COLOR_META[c0].label}. Entre medias, newLine().\n\n` +
      `Ejemplo: Repetir ×${cols} con drawBox("${c2}") → newLine() → Repetir ×${cols} con drawBox("${c0}").`
  } else if (t === 12 || t === 13) {
    const cells = cols * 2
    const zig: string[] = []
    for (let i = 0; i < cells; i += 1) {
      const row = i < cols ? 0 : 1
      const col = row === 0 ? i : i - cols
      zig.push(col % 2 === 0 ? c0 : c1)
    }
    targetPattern = padPattern(zig, cols, 2)
    const zigSeq = colorsPaintOrder(targetPattern)
    const preview = zigSeq.slice(0, Math.min(8, zigSeq.length))
    instruction =
      `Dos filas en tablero alternado (tipo dama).\n\n` +
      `Orden de pintado (fila 1 izquierda→derecha, luego fila 2): ${labelsJoined(zigSeq)}.\n\n` +
      `Ejemplo (primeras celdas): ${ejemploCadenaDrawBox(preview)}${zigSeq.length > preview.length ? '…' : ''}.`
  } else if (t === 14 || t === 15) {
    const total = cols * 2
    const half = Math.floor(total / 2)
    const arr: string[] = []
    for (let i = 0; i < total; i += 1) arr.push(i < half ? c1 : 'skip')
    targetPattern = padPattern(arr, cols, 2)
    const halfSeq = colorsPaintOrder(targetPattern)
    const halfPrev = halfSeq.slice(0, Math.min(6, halfSeq.length))
    instruction =
      `Solo una zona del lienzo lleva color; el resto es skip.\n\n` +
      `Orden de las celdas a pintar: ${labelsJoined(halfSeq)}.\n\n` +
      `Ejemplo: ${ejemploCadenaDrawBox(halfPrev)}${halfSeq.length > halfPrev.length ? '…' : ''}.`
  } else if (t === 16 || t === 17) {
    const r = Math.min(3, cols - 1)
    const row: string[] = []
    for (let i = 0; i < cols; i += 1) row.push(i < r ? c2 : 'skip')
    targetPattern = padPattern(row, cols, 1)
    const gradSeq = rowColors(targetPattern, cols, 0)
    instruction =
      `Al inicio de la fila, ${r} celdas de ${COLOR_META[c2].label}; el resto sin pintar.\n\n` +
      `Orden: ${labelsJoined(gradSeq)}.\n\n` +
      `Ejemplo: ${ejemploCadenaDrawBox(gradSeq)}.`
  } else if (t === 18) {
    const row = Array.from({ length: cols }, (_, i) => pick(COLORS, seed + i))
    targetPattern = padPattern(row, cols, 1)
    const rainbowSeq = rowColors(targetPattern, cols, 0)
    instruction =
      `Arcoíris: un color distinto por celda en el orden del objetivo.\n\n` +
      `Orden: ${labelsJoined(rainbowSeq)}.\n\n` +
      `Ejemplo: ${ejemploCadenaDrawBox(rainbowSeq)}.`
  } else {
    const grid = Array.from({ length: cols }, (_, r) =>
      Array.from({ length: cols }, (_, co) =>
        (r + co) % 3 === 0 ? c0 : (r + co) % 3 === 1 ? c1 : 'skip',
      ),
    )
    const flat = grid.flat()
    const rows = cols
    targetPattern = padPattern(flat, cols, rows)
    const gridSeq = colorsPaintOrder(targetPattern)
    const gridPrev = gridSeq.slice(0, Math.min(8, gridSeq.length))
    instruction =
      `Varias filas: pinta solo las celdas del objetivo, en orden de lectura (fila por fila, izquierda a derecha).\n\n` +
      `Secuencia de colores: ${labelsJoined(gridSeq)}.\n\n` +
      `Ejemplo (inicio): ${ejemploCadenaDrawBox(gridPrev)}${gridSeq.length > gridPrev.length ? '…' : ''}.`
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

  if (targetPattern.some((c) => c === 'skip')) {
    instruction +=
      '\n\nCeldas rayadas o vacías en la meta: añade skip() en el código para avanzar sin pintar (una vez por celda en blanco).'
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
