import { colorLabel } from '../app/constants'
import type { Level } from '../types/level'
import {
  difficultyForChapter,
  varNamesForChapter,
} from '../types/level'
import type { ColorKey } from '../engine/blocks'

import {
  CHAPTER_HOOKS_EN,
  CHAPTER_THEMES,
  CHAPTER_TITLES_EN,
  PUZZLES_PER_CHAPTER,
} from './chapterThemes'

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

function labelsJoined(colors: ColorKey[], loc: 'es' | 'en'): string {
  return colors.map((c) => colorLabel(c, loc)).join(' → ')
}

function ejemploCadenaDrawBox(colors: ColorKey[], loc: 'es' | 'en'): string {
  const sep = loc === 'en' ? ' → then ' : ' → luego '
  return colors.map((c) => `drawBox("${c}")`).join(sep)
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

function chapterLessonIntro(chapterIndex: number, puzzleIndex: number, loc: 'es' | 'en'): string {
  const theme = CHAPTER_THEMES[chapterIndex]!
  if (loc === 'es') {
    return (
      `📗 ${theme.title}\n${theme.hook}\n\n` +
      `Actividad ${puzzleIndex + 1} de ${PUZZLES_PER_CHAPTER} en esta lección.\n\n`
    )
  }
  const titleEn = CHAPTER_TITLES_EN[chapterIndex] ?? theme.title
  const hookEn = CHAPTER_HOOKS_EN[chapterIndex] ?? theme.hook
  return (
    `📗 ${titleEn}\n${hookEn}\n\n` +
    `Activity ${puzzleIndex + 1} of ${PUZZLES_PER_CHAPTER} in this lesson.\n\n`
  )
}

function envoltorioInstruccionesBloques(cuerpo: string, loc: 'es' | 'en'): string {
  if (loc === 'es') {
    return (
      '📘 Mira la miniatura del objetivo (panel derecho abajo). Lee cada parte del texto con calma, arma el código por trozos y pulsa Ejecutar para ver cómo el cursor avanza celda a celda.\n\n' +
      cuerpo.trim()
    )
  }
  return (
    '📘 Look at the goal thumbnail (bottom-right panel). Read each part calmly, build the code in chunks, and press Run to watch the cursor move cell by cell.\n\n' +
    cuerpo.trim()
  )
}

function varsConNombreExplicadas(names: string[], loc: 'es' | 'en'): string {
  const lista = names.map((n) => `• «${n}»`).join('\n')
  if (loc === 'es') {
    return (
      `\n\n━━ Completa usando variables con nombre ━━\n` +
      `Puedes usar estos nombres (elige según lo que vaya mejor al puzzle):\n${lista}\n\n` +
      `1) Coloca el bloque Crear variable, elige un nombre de la lista y escribe el valor que necesites (por ejemplo cuántas veces repetir o cuántas celdas seguidas).\n` +
      `2) Dentro de Repetir, cambia de «Número» a «Variable» y selecciona el mismo nombre.\n` +
      `3) Así evitas repetir el mismo número muchas veces: lo guardas una vez y lo reutilizas con un nombre claro.\n`
    )
  }
  return (
    `\n\n━━ Finish using named variables ━━\n` +
    `You can use these names (pick what fits the puzzle best):\n${lista}\n\n` +
    `1) Add the Create variable block, pick a name from the list, and type the value you need (for example how many repeats or how many cells in a row).\n` +
    `2) Inside Repeat, switch from Number to Variable and select the same name.\n` +
    `3) That way you avoid repeating the same number: save it once and reuse it under one clear name.\n`
  )
}

const SKIP_HINT = {
  es: '\n\n✏️ Recuerda: si ves la celda rayada o vacía en la meta, usa skip() una vez por cada celda sin pintar (el cursor avanza sin color).',
  en: '\n\n✏️ Remember: if the goal shows a striped or empty cell, use skip() once per unpainted cell (the cursor moves without color).',
} as const

/** Intrinsic complexity tier for each template branch in this file (0 = gentle → 3 = heavy). */
function templateTier(templateId: number): number {
  if (templateId <= 1 || templateId === 6 || templateId === 7) return 0
  if (templateId <= 9) return 1
  if (templateId <= 17) return 2
  return 3
}

/** When the chapter list has no puzzle hard enough, pull from these pools by tier. */
const FALLBACK_TEMPLATES_BY_TIER: readonly (readonly number[])[] = [
  [0, 1, 6, 7],
  [2, 3, 4, 5, 8, 9],
  [10, 11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21],
]

/** Wider grids later in the campaign (same template feels harder with more cells). */
function gridColsForProgress(globalStep: number): number {
  return Math.min(8, Math.max(3, 3 + Math.floor(globalStep / 14)))
}

/**
 * Prefer harder templates as globalStep increases. Merge chapter picks with tier pools so early
 * chapters still get medium/hard patterns once the campaign tier rises (not only easy ids).
 */
function pickTemplateId(chapterIndex: number, puzzleIndex: number, globalStep: number): number {
  const wantTier = Math.min(3, Math.floor(globalStep / 22))
  const themeTemplates = CHAPTER_THEMES[chapterIndex]!.templates
  const tierPool = FALLBACK_TEMPLATES_BY_TIER[wantTier]
  const merged = [...new Set([...themeTemplates, ...tierPool])]
  const exact = merged.filter((tid) => templateTier(tid) === wantTier)
  const relaxed = exact.length
    ? exact
    : merged.filter((tid) => templateTier(tid) >= wantTier)
  const pool = relaxed.length ? relaxed : [...tierPool]
  const idx =
    (chapterIndex * 17 + puzzleIndex * 23 + globalStep * 5) % pool.length
  return pool[idx]!
}

export function buildLevel(chapterIndex: number, puzzleIndex: number): Level {
  const globalStep = chapterIndex * PUZZLES_PER_CHAPTER + puzzleIndex
  const id = globalStep + 1
  const difficulty = difficultyForChapter(chapterIndex, puzzleIndex)
  const varNames = varNamesForChapter(chapterIndex, puzzleIndex)
  const cols = gridColsForProgress(globalStep)
  const seed = chapterIndex * 47 + puzzleIndex * 19
  const t = pickTemplateId(chapterIndex, puzzleIndex, globalStep)
  const showRepeat = chapterIndex >= 1
  const showVars = Boolean(varNames?.length)

  const c0 = pick(COLORS, seed)
  const c1 = pick(COLORS, seed + 2)
  const c2 = pick(COLORS, seed + 4)

  let instructionEs: string
  let instructionEn: string
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
    instructionEs =
      `Objetivo: una sola fila — ${cols} celdas de izquierda a derecha en este orden.\n\n` +
      `Pasos sugeridos:\n` +
      `1) Compara fila a fila con la miniatura del objetivo.\n` +
      `2) Encadena los bloques drawBox en ese orden de colores.\n` +
      `3) Ejecuta y revisa si el lienzo coincide.\n\n` +
      `Orden de colores: ${labelsJoined(rowSeq, 'es')}.\n\n` +
      `Ejemplo de bloques: ${ejemploCadenaDrawBox(rowSeq, 'es')}.`
    instructionEn =
      `Goal: a single row — ${cols} cells left to right in this order.\n\n` +
      `Suggested steps:\n` +
      `1) Compare row by row with the goal thumbnail.\n` +
      `2) Chain drawBox blocks in that color order.\n` +
      `3) Run and check that the canvas matches.\n\n` +
      `Color order: ${labelsJoined(rowSeq, 'en')}.\n\n` +
      `Example blocks: ${ejemploCadenaDrawBox(rowSeq, 'en')}.`
    if (showRepeat && chapterIndex >= 3) {
      instructionEs += ' Puedes usar Repetir si te ahorra bloques en la fila.'
      instructionEn += ' You can use Repeat if it saves blocks on the row.'
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
    instructionEs =
      `Objetivo: dos filas. Primero la fila superior; después newLine(); luego la segunda fila.\n\n` +
      `Pasos sugeridos:\n` +
      `1) Termina la primera fila en el orden indicado.\n` +
      `2) Inserta newLine() para bajar de fila.\n` +
      `3) Pinta la segunda fila en su orden.\n\n` +
      `Fila 1: ${labelsJoined(r1c, 'es')}.\n` +
      `Fila 2: ${labelsJoined(r2c, 'es')}.\n\n` +
      `Ejemplo: ${ejemploCadenaDrawBox(r1c, 'es')} → newLine() → ${ejemploCadenaDrawBox(r2c, 'es')}.`
    instructionEn =
      `Goal: two rows. First the top row; then newLine(); then the second row.\n\n` +
      `Suggested steps:\n` +
      `1) Finish the first row in the given order.\n` +
      `2) Insert newLine() to move down a row.\n` +
      `3) Paint the second row in its order.\n\n` +
      `Row 1: ${labelsJoined(r1c, 'en')}.\n` +
      `Row 2: ${labelsJoined(r2c, 'en')}.\n\n` +
      `Example: ${ejemploCadenaDrawBox(r1c, 'en')} → newLine() → ${ejemploCadenaDrawBox(r2c, 'en')}.`
  } else if (t === 4 || t === 5) {
    const k = Math.min(cols, 3 + (seed % 3))
    const row = Array.from({ length: cols }, (_, i) => (i < k ? c0 : 'skip'))
    targetPattern = padPattern(row, cols, 1)
    const prefixSeq = rowColors(targetPattern, cols, 0)
    instructionEs =
      `Objetivo: solo las primeras ${k} celdas llevan color; el resto debe quedar sin pintar.\n\n` +
      `Pasos sugeridos:\n` +
      `1) Pinta en orden: ${labelsJoined(prefixSeq, 'es')}.\n` +
      `2) Para cada celda vacía del objetivo, usa skip() una vez (avanzas sin color).\n\n` +
      `Ejemplo: ${ejemploCadenaDrawBox(prefixSeq, 'es')} y luego skip() hasta completar la fila según la meta.`
    instructionEn =
      `Goal: only the first ${k} cells are colored; the rest must stay unpainted.\n\n` +
      `Suggested steps:\n` +
      `1) Paint in order: ${labelsJoined(prefixSeq, 'en')}.\n` +
      `2) For each empty goal cell, use skip() once (you advance without color).\n\n` +
      `Example: ${ejemploCadenaDrawBox(prefixSeq, 'en')} then skip() until the row matches the goal.`
  } else if (t === 6 || t === 7) {
    const stripe = Array.from({ length: cols }, (_, i) => pick([c0, c1], seed + i))
    targetPattern = padPattern(stripe, cols, 1)
    const stripeSeq = rowColors(targetPattern, cols, 0)
    instructionEs =
      `Objetivo: una franja en una fila — sigue el orden exacto celda a celda.\n\n` +
      `Pasos sugeridos:\n` +
      `1) Lee la secuencia de colores de izquierda a derecha.\n` +
      `2) Coloca un drawBox por cada celda que se pinta.\n\n` +
      `Orden: ${labelsJoined(stripeSeq, 'es')}.\n\n` +
      `Ejemplo: ${ejemploCadenaDrawBox(stripeSeq, 'es')}.`
    instructionEn =
      `Goal: one stripe across a row — follow the exact order cell by cell.\n\n` +
      `Suggested steps:\n` +
      `1) Read the color sequence left to right.\n` +
      `2) Place one drawBox for each painted cell.\n\n` +
      `Order: ${labelsJoined(stripeSeq, 'en')}.\n\n` +
      `Example: ${ejemploCadenaDrawBox(stripeSeq, 'en')}.`
  } else if (t === 8 || t === 9) {
    const inner = Math.min(3, cols)
    const row: string[] = []
    for (let i = 0; i < inner; i += 1) row.push(c1)
    for (let i = inner; i < cols; i += 1) row.push('skip')
    targetPattern = padPattern(row, cols, 1)
    const solidSeq = Array.from({ length: inner }, () => c1) as ColorKey[]
    if (showRepeat) {
      instructionEs =
        `Objetivo: ${inner} celdas seguidas del mismo color (${colorLabel(c1, 'es')}).\n\n` +
        `Pasos sugeridos:\n` +
        `1) Usa un bloque Repetir con cuenta ${inner}.\n` +
        `2) Dentro, un solo drawBox("${c1}") para repetir el mismo color.\n\n` +
        `Ejemplo: Repetir ×${inner} → dentro → drawBox("${c1}").`
      instructionEn =
        `Goal: ${inner} cells in a row of the same color (${colorLabel(c1, 'en')}).\n\n` +
        `Suggested steps:\n` +
        `1) Use a Repeat block with count ${inner}.\n` +
        `2) Inside, a single drawBox("${c1}") to repeat the same color.\n\n` +
        `Example: Repeat ×${inner} → inside → drawBox("${c1}").`
    } else {
      instructionEs =
        `Objetivo: ${inner} celdas de ${colorLabel(c1, 'es')} al inicio de la fila.\n\n` +
        `Pasos: encadena ${ejemploCadenaDrawBox(solidSeq, 'es')} o usa Repetir si ya lo tienes disponible.`
      instructionEn =
        `Goal: ${inner} ${colorLabel(c1, 'en')} cells at the start of the row.\n\n` +
        `Steps: chain ${ejemploCadenaDrawBox(solidSeq, 'en')} or use Repeat if it is available.`
    }
    repeatHint = showRepeat
  } else if (t === 10 || t === 11) {
    const row1 = Array.from({ length: cols }, () => c2)
    targetPattern = padPattern([...row1, ...Array.from({ length: cols }, () => c0)], cols, 2)
    instructionEs =
      `Objetivo: dos filas completas de distinto color.\n\n` +
      `Pasos sugeridos:\n` +
      `1) Fila 1: todas las celdas ${colorLabel(c2, 'es')}.\n` +
      `2) newLine() para pasar a la siguiente fila.\n` +
      `3) Fila 2: todas ${colorLabel(c0, 'es')}.\n\n` +
      `Ejemplo compacto: Repetir ×${cols} con drawBox("${c2}") → newLine() → Repetir ×${cols} con drawBox("${c0}").`
    instructionEn =
      `Goal: two full rows in different colors.\n\n` +
      `Suggested steps:\n` +
      `1) Row 1: every cell ${colorLabel(c2, 'en')}.\n` +
      `2) newLine() to go to the next row.\n` +
      `3) Row 2: every cell ${colorLabel(c0, 'en')}.\n\n` +
      `Compact example: Repeat ×${cols} with drawBox("${c2}") → newLine() → Repeat ×${cols} with drawBox("${c0}").`
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
    instructionEs =
      `Objetivo: dos filas en patrón alternado (tipo dama).\n\n` +
      `Pasos sugeridos:\n` +
      `1) Pinta la primera fila en orden izquierda → derecha.\n` +
      `2) newLine().\n` +
      `3) Pinta la segunda fila en orden.\n\n` +
      `Orden total de pintado: ${labelsJoined(zigSeq, 'es')}.\n\n` +
      `Ejemplo (inicio): ${ejemploCadenaDrawBox(preview, 'es')}${zigSeq.length > preview.length ? '…' : ''}.`
    instructionEn =
      `Goal: two rows in a checkerboard-style alternating pattern.\n\n` +
      `Suggested steps:\n` +
      `1) Paint the first row left → right.\n` +
      `2) newLine().\n` +
      `3) Paint the second row in order.\n\n` +
      `Full paint order: ${labelsJoined(zigSeq, 'en')}.\n\n` +
      `Example (start): ${ejemploCadenaDrawBox(preview, 'en')}${zigSeq.length > preview.length ? '…' : ''}.`
  } else if (t === 14 || t === 15) {
    const total = cols * 2
    const half = Math.floor(total / 2)
    const arr: string[] = []
    for (let i = 0; i < total; i += 1) arr.push(i < half ? c1 : 'skip')
    targetPattern = padPattern(arr, cols, 2)
    const halfSeq = colorsPaintOrder(targetPattern)
    const halfPrev = halfSeq.slice(0, Math.min(6, halfSeq.length))
    instructionEs =
      `Objetivo: solo una zona lleva color; el resto son huecos (usa skip donde haga falta).\n\n` +
      `Pasos sugeridos:\n` +
      `1) Identifica qué celdas tienen color en la meta.\n` +
      `2) Pinta en ese orden.\n` +
      `3) Donde la meta está vacía, usa skip().\n\n` +
      `Orden de las celdas con color: ${labelsJoined(halfSeq, 'es')}.\n\n` +
      `Ejemplo: ${ejemploCadenaDrawBox(halfPrev, 'es')}${halfSeq.length > halfPrev.length ? '…' : ''}.`
    instructionEn =
      `Goal: only one area is colored; the rest are gaps (use skip where needed).\n\n` +
      `Suggested steps:\n` +
      `1) Find which cells have color in the goal.\n` +
      `2) Paint in that order.\n` +
      `3) Where the goal is empty, use skip().\n\n` +
      `Order of colored cells: ${labelsJoined(halfSeq, 'en')}.\n\n` +
      `Example: ${ejemploCadenaDrawBox(halfPrev, 'en')}${halfSeq.length > halfPrev.length ? '…' : ''}.`
  } else if (t === 16 || t === 17) {
    const r = Math.min(3, cols - 1)
    const row: string[] = []
    for (let i = 0; i < cols; i += 1) row.push(i < r ? c2 : 'skip')
    targetPattern = padPattern(row, cols, 1)
    const gradSeq = rowColors(targetPattern, cols, 0)
    instructionEs =
      `Objetivo: al inicio de la fila, ${r} celdas de ${colorLabel(c2, 'es')}; después huecos hasta el final.\n\n` +
      `Pasos: pinta en orden ${labelsJoined(gradSeq, 'es')} y usa skip() para el resto de la fila según la meta.\n\n` +
      `Ejemplo: ${ejemploCadenaDrawBox(gradSeq, 'es')}.`
    instructionEn =
      `Goal: at the start of the row, ${r} ${colorLabel(c2, 'en')} cells; then gaps to the end.\n\n` +
      `Steps: paint in order ${labelsJoined(gradSeq, 'en')} and use skip() for the rest of the row to match the goal.\n\n` +
      `Example: ${ejemploCadenaDrawBox(gradSeq, 'en')}.`
  } else if (t === 18) {
    const row = Array.from({ length: cols }, (_, i) => pick(COLORS, seed + i))
    targetPattern = padPattern(row, cols, 1)
    const rainbowSeq = rowColors(targetPattern, cols, 0)
    instructionEs =
      `Objetivo: “arcoíris” — un color distinto por celda en el orden indicado.\n\n` +
      `Pasos sugeridos:\n` +
      `1) Lee la secuencia completa en la miniatura.\n` +
      `2) Coloca un drawBox por cada color, sin saltarte ninguno.\n\n` +
      `Orden: ${labelsJoined(rainbowSeq, 'es')}.\n\n` +
      `Ejemplo: ${ejemploCadenaDrawBox(rainbowSeq, 'es')}.`
    instructionEn =
      `Goal: “rainbow” — a different color per cell in the given order.\n\n` +
      `Suggested steps:\n` +
      `1) Read the full sequence in the thumbnail.\n` +
      `2) Place one drawBox per color — do not skip any.\n\n` +
      `Order: ${labelsJoined(rainbowSeq, 'en')}.\n\n` +
      `Example: ${ejemploCadenaDrawBox(rainbowSeq, 'en')}.`
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
    instructionEs =
      `Objetivo: varias filas — pinta solo donde hay color en la meta, en orden de lectura (fila por fila, izquierda a derecha).\n\n` +
      `Pasos sugeridos:\n` +
      `1) Recorre mentalmente fila 1, luego fila 2, etc.\n` +
      `2) Cada celda con color necesita su drawBox; cada hueco necesita skip().\n\n` +
      `Secuencia de colores a pintar: ${labelsJoined(gridSeq, 'es')}.\n\n` +
      `Ejemplo (inicio): ${ejemploCadenaDrawBox(gridPrev, 'es')}${gridSeq.length > gridPrev.length ? '…' : ''}.`
    instructionEn =
      `Goal: multiple rows — paint only where the goal has color, in reading order (row by row, left to right).\n\n` +
      `Suggested steps:\n` +
      `1) Walk through row 1, then row 2, and so on.\n` +
      `2) Each colored cell needs drawBox; each gap needs skip().\n\n` +
      `Paint sequence: ${labelsJoined(gridSeq, 'en')}.\n\n` +
      `Example (start): ${ejemploCadenaDrawBox(gridPrev, 'en')}${gridSeq.length > gridPrev.length ? '…' : ''}.`
  }

  const useRepeat =
    showRepeat &&
    (repeatHint || chapterIndex >= 5 || globalStep >= 26 || t % 3 === 0)
  const allowedBlocks = allowForPattern(targetPattern, {
    repeat: useRepeat,
    varDecl: showVars,
  }, varNames)

  if (showVars && varNames?.length) {
    instructionEs += varsConNombreExplicadas(varNames, 'es')
    instructionEn += varsConNombreExplicadas(varNames, 'en')
  }

  if (targetPattern.some((c) => c === 'skip')) {
    instructionEs += SKIP_HINT.es
    instructionEn += SKIP_HINT.en
  }

  instructionEs = chapterLessonIntro(chapterIndex, puzzleIndex, 'es') + instructionEs
  instructionEn = chapterLessonIntro(chapterIndex, puzzleIndex, 'en') + instructionEn
  instructionEs = envoltorioInstruccionesBloques(instructionEs, 'es')
  instructionEn = envoltorioInstruccionesBloques(instructionEn, 'en')

  return {
    id,
    instructionEs,
    instructionEn,
    targetPattern,
    gridCols: cols,
    allowedBlocks,
    difficulty,
    varNames,
  }
}

export const CAMPAIGN_CHAPTERS = CHAPTER_THEMES.map((theme, ch) => ({
  index: ch,
  title: theme.title,
  puzzles: Array.from({ length: PUZZLES_PER_CHAPTER }, (_, p) => buildLevel(ch, p)),
}))
