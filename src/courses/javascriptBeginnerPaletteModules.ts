import type {
  GuidedConceptKey,
  GuidedLesson,
  PaletteCodePieceRole,
  PaletteCodeResultStripe,
} from './guidedLessonTypes'
import { blockAnchoredPaletteGoal } from './beginnerPaletteBlockGoals'
import { buildBeginnerBlockBridgeCanvas } from './beginnerBlockBridgeByLanguage'
import { JS_BEGINNER_PALETTE_REQUIRED_CONCEPTS } from './jsBeginnerBlockBridge'
import { paletteIntroLesson } from './stripeIntroLessons'

const L = (es: string, en: string) => ({ es, en })

type PaletteLine = {
  id: string
  snippet: ReturnType<typeof L>
  explain: ReturnType<typeof L>
  role: PaletteCodePieceRole
}

/** One focal word per lesson (canvas hero + mensaje variable). */
const HERO_PAIRS: ReadonlyArray<{ es: string; en: string }> = [
  { es: 'Sol', en: 'Sun' },
  { es: 'Luna', en: 'Moon' },
  { es: 'Río', en: 'River' },
  { es: 'Mar', en: 'Sea' },
  { es: 'Nube', en: 'Cloud' },
  { es: 'Viento', en: 'Wind' },
  { es: 'Lluvia', en: 'Rain' },
  { es: 'Nieve', en: 'Snow' },
  { es: 'Fuego', en: 'Fire' },
  { es: 'Tierra', en: 'Earth' },
  { es: 'Bosque', en: 'Forest' },
  { es: 'Ola', en: 'Wave' },
  { es: 'Isla', en: 'Island' },
  { es: 'Arena', en: 'Sand' },
  { es: 'Cielo', en: 'Sky' },
  { es: 'Estrella', en: 'Star' },
  { es: 'Cometa', en: 'Comet' },
  { es: 'Rayo', en: 'Bolt' },
  { es: 'Arco', en: 'Arc' },
  { es: 'Brisa', en: 'Breeze' },
  { es: 'Rocío', en: 'Dew' },
  { es: 'Rocas', en: 'Rocks' },
  { es: 'Valle', en: 'Valley' },
  { es: 'Colina', en: 'Hill' },
  { es: 'Sendero', en: 'Trail' },
  { es: 'Puente', en: 'Bridge' },
  { es: 'Farol', en: 'Lantern' },
  { es: 'Barco', en: 'Boat' },
  { es: 'Ancla', en: 'Anchor' },
  { es: 'Brújula', en: 'Compass' },
  { es: 'Mapa', en: 'Map' },
  { es: 'Ruta', en: 'Route' },
  { es: 'Meta', en: 'Goal' },
  { es: 'Paso', en: 'Step' },
  { es: 'Código', en: 'Code' },
  { es: 'Flujo', en: 'Flow' },
]

/** Focal words for Módulo 1, lecciones 2–9 (índices globales 1–8); distintos del bloque módulos 2–5. */
const HERO_PAIRS_MODULE1: ReadonlyArray<{ es: string; en: string }> = [
  { es: 'Gato', en: 'Cat' },
  { es: 'Perro', en: 'Dog' },
  { es: 'Casa', en: 'Home' },
  { es: 'Luz', en: 'Light' },
  { es: 'Vida', en: 'Life' },
  { es: 'Alma', en: 'Soul' },
  { es: 'Otoño', en: 'Autumn' },
  { es: 'Paz', en: 'Peace' },
]

const MODULE_1_HINT = {
  es: 'Módulo 1 — **solo la paleta**: empiezas con pocas **variables**; más adelante irán sumando y enlazándose.',
  en: 'Module 1 — **palette only**: you start with few **variables**; later they accumulate and link together.',
} as const

const MODULE_HINTS: ReadonlyArray<{ es: string; en: string }> = [
  {
    es: 'Módulo 2 — ya van **dos variables** antes de console; respeta el orden porque **listo** usa las anteriores.',
    en: 'Module 2 — **two variables** before console; order matters because **listo** uses the earlier ones.',
  },
  {
    es: 'Módulo 3 — **más const enlazadas**; no pongas **listo** antes de **pasos** y **minimo**.',
    en: 'Module 3 — **more linked consts**; do not place **listo** before **pasos** and **minimo**.',
  },
  {
    es: 'Módulo 4 — el programa crece: varias variables, luego salida, **if** y **for**.',
    en: 'Module 4 — the program grows: several variables, then output, **if**, and **for**.',
  },
  {
    es: 'Módulo 5 — cierre con **hasta seis variables** relacionadas antes de console, if y for.',
    en: 'Module 5 — finale with **up to six related variables** before console, if, and for.',
  },
]

const CONST_STEP_LABELS = [
  'mensaje',
  'pasos',
  'minimo',
  'listo',
  'activo',
  'sigue',
] as const

const CONST_STEP_CAPTIONS: ReadonlyArray<{ es: string; en: string }> = [
  { es: 'mensaje', en: 'mensaje' },
  { es: 'pasos', en: 'pasos' },
  { es: 'minimo', en: 'minimo' },
  { es: 'listo', en: 'listo' },
  { es: 'activo', en: 'activo' },
  { es: 'sigue', en: 'sigue' },
]

/** 44 focal labels: Módulo 1 (8) + módulos 2–5 (36); shared by extended beginner palette builders. */
export const BEGINNER_EXTENDED_HERO_WORDS_44: ReadonlyArray<{ es: string; en: string }> = [
  ...HERO_PAIRS_MODULE1,
  ...HERO_PAIRS,
]

function segmentFromGlobalSlot(globalSlot: number): { mod: number; lessonInMod: number } {
  if (globalSlot < 8) return { mod: 1, lessonInMod: globalSlot + 2 }
  const r = globalSlot - 8
  return { mod: Math.floor(r / 9) + 2, lessonInMod: (r % 9) + 1 }
}

function introducesConceptAt(globalSlot: number, mod: number, lessonInMod: number): GuidedConceptKey {
  if (mod === 1 || lessonInMod === 9) return 'variable'
  return globalSlot % 3 === 0 ? 'console' : globalSlot % 3 === 1 ? 'if_branch' : 'repeat_loop'
}

/** Active const lines for palette slot 0..43 (intro lesson is separate). */
export function constCountForSlot(globalSlot: number): number {
  return Math.min(1 + Math.floor((globalSlot + 1) / 7), 6)
}

function pasosValue(globalSlot: number): number {
  return 2 + (globalSlot % 5)
}

function buildJsConstChainLines(
  count: number,
  hero: { es: string; en: string },
  pasos: number,
): PaletteLine[] {
  const { es: wEs, en: wEn } = hero
  const all: PaletteLine[] = [
    {
      id: 'v1',
      role: 'variable',
      snippet: L(`const mensaje = "${wEs}";`, `const mensaje = "${wEn}";`),
      explain: L(
        '**mensaje** guarda la palabra del **lienzo**.',
        '**mensaje** stores the **canvas** word.',
      ),
    },
    {
      id: 'v2',
      role: 'variable',
      snippet: L(`const pasos = ${pasos};`, `const pasos = ${pasos};`),
      explain: L(
        '**pasos** es un número para el bucle y las comparaciones.',
        '**pasos** is a number for the loop and comparisons.',
      ),
    },
    {
      id: 'v3',
      role: 'variable',
      snippet: L('const minimo = 2;', 'const minimo = 2;'),
      explain: L(
        '**minimo** fija el umbral que usará **listo**.',
        '**minimo** sets the threshold **listo** will use.',
      ),
    },
    {
      id: 'v4',
      role: 'variable',
      snippet: L('const listo = pasos > minimo;', 'const listo = pasos > minimo;'),
      explain: L(
        '**listo** depende de **pasos** y **minimo** — van antes.',
        '**listo** depends on **pasos** and **minimo** — they come first.',
      ),
    },
    {
      id: 'v5',
      role: 'variable',
      snippet: L('const activo = true;', 'const activo = true;'),
      explain: L(
        '**activo** es un booleano para combinar con **listo**.',
        '**activo** is a boolean to combine with **listo**.',
      ),
    },
    {
      id: 'v6',
      role: 'variable',
      snippet: L('const sigue = listo && activo;', 'const sigue = listo && activo;'),
      explain: L(
        '**sigue** usa **listo** y **activo** — ambas deben existir ya.',
        '**sigue** uses **listo** and **activo** — both must exist already.',
      ),
    },
  ]
  return all.slice(0, count)
}

function buildJsFooterLines(constCount: number): PaletteLine[] {
  const ifSnippet =
    constCount >= 6
      ? L('if (sigue) { ... }', 'if (sigue) { ... }')
      : constCount >= 4
        ? L('if (listo) { ... }', 'if (listo) { ... }')
        : L('if (ok) { ... }', 'if (ok) { ... }')

  const ifExplain =
    constCount >= 6
      ? L('El **if** usa **sigue**, que resume varias variables.', '**if** uses **sigue**, which summarizes several variables.')
      : constCount >= 4
        ? L('El **if** pregunta por **listo**.', '**if** checks **listo**.')
        : L('El **if** elige una rama.', '**if** picks a branch.')

  const forSnippet =
    constCount >= 2
      ? L('for (let i = 0; i < pasos; i++)', 'for (let i = 0; i < pasos; i++)')
      : L('for (let i = 0; ...)', 'for (let i = 0; ...)')

  const forExplain =
    constCount >= 2
      ? L('El **for** repite hasta **pasos**.', '**for** repeats up to **pasos**.')
      : L('El **for** repite un trozo.', '**for** repeats a chunk.')

  return [
    {
      id: 'c',
      role: 'console',
      snippet: L('console.log(mensaje);', 'console.log(mensaje);'),
      explain: L(
        'Muestra **mensaje** en la consola.',
        'Print **mensaje** to the console.',
      ),
    },
    {
      id: 'i',
      role: 'if_branch',
      snippet: ifSnippet,
      explain: ifExplain,
    },
    {
      id: 'f',
      role: 'repeat_loop',
      snippet: forSnippet,
      explain: forExplain,
    },
  ]
}

function buildPreviewStripes(constCount: number): PaletteCodeResultStripe[] {
  const stripes: PaletteCodeResultStripe[] = []
  for (let i = 0; i < constCount; i++) {
    const cap = CONST_STEP_CAPTIONS[i]!
    stripes.push({
      swatch: 'violet',
      caption: L(`const ${cap.es}`, `const ${cap.en}`),
    })
  }
  stripes.push(
    { swatch: 'emerald', caption: L('Salida console', 'Console out') },
    { swatch: 'amber', caption: L('Condición if', 'if branch') },
    { swatch: 'sky', caption: L('Bucle for', 'for loop') },
  )
  return stripes
}

function orderHintLabels(constCount: number): string {
  const vars = CONST_STEP_LABELS.slice(0, constCount).join(' → ')
  return `${vars} → console → if → for`
}

function buildJavascriptBeginnerPaletteLesson(
  globalSlot: number,
  pair: { es: string; en: string },
): GuidedLesson {
  const { mod, lessonInMod } = segmentFromGlobalSlot(globalSlot)
  const { es: wEs, en: wEn } = pair
  const hint = mod === 1 ? MODULE_1_HINT : MODULE_HINTS[mod - 2]!
  const constCount = constCountForSlot(globalSlot)
  const pasos = pasosValue(globalSlot)
  const orderHint = orderHintLabels(constCount)

  const constLines = buildJsConstChainLines(constCount, pair, pasos)
  const footerLines = buildJsFooterLines(constCount)
  const lines = [...constLines, ...footerLines]

  const depNoteEs =
    constCount >= 4
      ? '\n\n**listo** y **sigue** solo tienen sentido **después** de las variables que usan.'
      : constCount >= 2
        ? '\n\nPrimero declara **mensaje** y **pasos**; luego salida, **if** y **for**.'
        : ''

  const depNoteEn =
    constCount >= 4
      ? '\n\n**listo** and **sigue** only make sense **after** the variables they use.'
      : constCount >= 2
        ? '\n\nDeclare **mensaje** and **pasos** first; then output, **if**, and **for**.'
        : ''

  const mandatoryEs =
    '\n\n**Obligatorio:** al menos una línea **Crear variable** (`const`) y un **Repetir** (`for`) — el comprobador no acepta el programa sin ellos.'
  const mandatoryEn =
    '\n\n**Required:** at least one **Create variable** line (`const`) and a **Repeat** (`for`) — the checker will not accept your program without them.'

  const blockGoal = blockAnchoredPaletteGoal('javascript')

  return paletteIntroLesson({
    id: `javascript-mod${mod}-pal-${lessonInMod}`,
    title: L(
      `Bandera del flujo · ${wEs} (módulo ${mod})`,
      `Flow flag · ${wEn} (module ${mod})`,
    ),
    instruction: L(
      `${hint.es}\n\nArma el programa **solo con la paleta**. Usa **Nueva línea** entre líneas.${depNoteEs}${mandatoryEs}\n\nMira el **lienzo de bloques** y el panel **Objetivo**: ahí está el flujo (sin copiar código de memoria). La palabra del lienzo va en **mensaje**.`,
      `${hint.en}\n\nBuild the program **from the palette only**. Use **New line** between lines.${depNoteEn}${mandatoryEn}\n\nSee the **block canvas** and **Goal** panel for the flow (no need to memorize code). The canvas word goes in **mensaje**.`,
    ),
    introducesConcept: introducesConceptAt(globalSlot, mod, lessonInMod),
    requiredConcepts: [...JS_BEGINNER_PALETTE_REQUIRED_CONCEPTS],
    canvasLienzo: buildBeginnerBlockBridgeCanvas('javascript', pasos),
    goalSummary: blockGoal,
    previewStripes: buildPreviewStripes(constCount),
    canvasHero: {
      mode: 'greeting',
      headline: L(wEs, wEn),
      highlightWhenFirstLineMatches: true,
    },
    lines,
    wrongHint: L(
      `Orden: ${orderHint} — **Nueva línea** entre líneas. No pongas **listo** ni **sigue** antes de las variables que necesitan.`,
      `Order: ${orderHint} — **New line** between lines. Do not place **listo** or **sigue** before the variables they need.`,
    ),
  })
}

/**
 * 8 palette-only lessons (global indices 1–8): Módulo 1, lecciones 2–9.
 * Same shell as the stripe intro (paletteCode).
 */
export function buildJavascriptBeginnerPaletteLessonsSlots1to8(): GuidedLesson[] {
  if (HERO_PAIRS_MODULE1.length !== 8) {
    throw new Error(`Expected 8 module-1 hero pairs, got ${HERO_PAIRS_MODULE1.length}`)
  }

  return HERO_PAIRS_MODULE1.map((pair, i) => buildJavascriptBeginnerPaletteLesson(i, pair))
}

/**
 * 36 palette-only lessons (indices 9–44) for JavaScript beginner extended course.
 * Variable count grows by slot; final lessons use six linked const lines + console/if/for.
 */
export function buildJavascriptBeginnerPaletteLessonsSlots9to44(): GuidedLesson[] {
  if (HERO_PAIRS.length !== 36) {
    throw new Error(`Expected 36 hero pairs, got ${HERO_PAIRS.length}`)
  }

  return HERO_PAIRS.map((pair, i) => buildJavascriptBeginnerPaletteLesson(8 + i, pair))
}
