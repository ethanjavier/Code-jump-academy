import type { GuidedLesson } from './guidedLessonTypes'
import { paletteIntroLesson } from './stripeIntroLessons'

const L = (es: string, en: string) => ({ es, en })

/** One focal word per lesson (canvas hero + first console.log line). */
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
  es: 'Módulo 1 — continúa con **solo la paleta**, igual que la primera lección: tres líneas en orden y el **lienzo** reacciona al completarlas.',
  en: 'Module 1 — keep using **the palette only**, like lesson 1: three lines in order and the **canvas** reacts when they are complete.',
} as const

const MODULE_HINTS: ReadonlyArray<{ es: string; en: string }> = [
  {
    es: 'Módulo 2 — refuerza **salida → condición → bucle** con la paleta.',
    en: 'Module 2 — reinforce **output → condition → loop** with the palette.',
  },
  {
    es: 'Módulo 3 — misma mecánica: **solo tarjetas**, tres líneas en orden.',
    en: 'Module 3 — same mechanic: **cards only**, three lines in order.',
  },
  {
    es: 'Módulo 4 — el **lienzo** y el **modal** reaccionan al programa correcto.',
    en: 'Module 4 — the **canvas** and **modal** react when the program is correct.',
  },
  {
    es: 'Módulo 5 — última tanda: mantén el ritmo **console, if, for**.',
    en: 'Module 5 — last set: keep the **console, if, for** rhythm.',
  },
]

/** 44 focal labels: Módulo 1 (8) + módulos 2–5 (36); shared by extended beginner palette builders. */
export const BEGINNER_EXTENDED_HERO_WORDS_44: ReadonlyArray<{ es: string; en: string }> = [
  ...HERO_PAIRS_MODULE1,
  ...HERO_PAIRS,
]

/**
 * 8 palette-only lessons (global indices 1–8): Módulo 1, lecciones 2–9.
 * Same shell as the stripe intro (paletteCode).
 */
export function buildJavascriptBeginnerPaletteLessonsSlots1to8(): GuidedLesson[] {
  if (HERO_PAIRS_MODULE1.length !== 8) {
    throw new Error(`Expected 8 module-1 hero pairs, got ${HERO_PAIRS_MODULE1.length}`)
  }

  return HERO_PAIRS_MODULE1.map((pair, i) => {
    const lessonInMod = i + 2
    const { es: wEs, en: wEn } = pair

    return paletteIntroLesson({
      id: `javascript-mod1-pal-${lessonInMod}`,
      title: L(
        `Bandera del flujo · ${wEs} (módulo 1)`,
        `Flow flag · ${wEn} (module 1)`,
      ),
      instruction: L(
        `${MODULE_1_HINT.es}\n\nArma el mini programa **solo con la paleta**: encadena **salida → condición → bucle** como tres líneas separadas con **Nueva línea** entre ellas.\n\nObjetivo: que la primera línea muestre **${wEs}** en consola; luego **if**, luego **for** — en ese orden.`,
        `${MODULE_1_HINT.en}\n\nBuild the tiny program **from the palette only**: chain **output → condition → loop** as three lines separated with **New line** between them.\n\nGoal: the first line prints **${wEn}** to the console; then **if**, then **for** — in that order.`,
      ),
      introducesConcept: i % 3 === 0 ? 'console' : i % 3 === 1 ? 'if_branch' : 'repeat_loop',
      goalSummary: L(
        `Tres líneas: console("${wEs}"), if, for`,
        `Three lines: console("${wEn}"), if, for`,
      ),
      previewStripes: [
        { swatch: 'emerald', caption: L('Salida console', 'Console out') },
        { swatch: 'amber', caption: L('Condición if', 'if branch') },
        { swatch: 'sky', caption: L('Bucle for', 'for loop') },
      ],
      canvasHero: {
        mode: 'greeting',
        headline: L(wEs, wEn),
        highlightWhenFirstLineMatches: true,
      },
      lines: [
        {
          id: 'c',
          snippet: L(`console.log("${wEs}");`, `console.log("${wEn}");`),
          explain: L(
            'Primera línea: texto visible en la **consola**.',
            'First line: visible text in the **console**.',
          ),
        },
        {
          id: 'i',
          snippet: L('if (ok) { ... }', 'if (ok) { ... }'),
          explain: L(
            'Segunda línea: el **if** elige una rama.',
            'Second line: **if** picks a branch.',
          ),
        },
        {
          id: 'f',
          snippet: L('for (let i = 0; ...)', 'for (let i = 0; ...)'),
          explain: L(
            'Tercera línea: el **for** repite un trozo.',
            'Third line: **for** repeats a chunk.',
          ),
        },
      ],
      wrongHint: L(
        'Orden: primero console.log con el mensaje del **lienzo**, luego if, luego for — usa **Nueva línea** entre líneas.',
        'Order: first console.log with the **canvas** message, then if, then for — use **New line** between lines.',
      ),
    })
  })
}

/**
 * 36 palette-only lessons (indices 9–44) for JavaScript beginner extended course.
 * Same exercise shape as the stripe intro: palette inserts, three lines, canvas + modal flow.
 */
export function buildJavascriptBeginnerPaletteLessonsSlots9to44(): GuidedLesson[] {
  if (HERO_PAIRS.length !== 36) {
    throw new Error(`Expected 36 hero pairs, got ${HERO_PAIRS.length}`)
  }

  return HERO_PAIRS.map((pair, i) => {
    const mod = Math.floor(i / 9) + 2
    const lessonInMod = (i % 9) + 1
    const hint = MODULE_HINTS[mod - 2]!
    const { es: wEs, en: wEn } = pair

    return paletteIntroLesson({
      id: `javascript-mod${mod}-pal-${lessonInMod}`,
      title: L(
        `Bandera del flujo · ${wEs} (módulo ${mod})`,
        `Flow flag · ${wEn} (module ${mod})`,
      ),
      instruction: L(
        `${hint.es}\n\nArma el mini programa **solo con la paleta**: cada tarjeta inserta código en el cursor. Encadena **salida → condición → bucle** como tres líneas separadas con **Nueva línea** entre ellas.\n\nObjetivo: que la primera línea muestre **${wEs}** en consola; luego **if**, luego **for** — en ese orden.`,
        `${hint.en}\n\nBuild the tiny program **from the palette only**: each card inserts code at the caret. Chain **output → condition → loop** as three lines separated with **New line** between them.\n\nGoal: the first line prints **${wEn}** to the console; then **if**, then **for** — in that order.`,
      ),
      introducesConcept: i % 3 === 0 ? 'console' : i % 3 === 1 ? 'if_branch' : 'repeat_loop',
      goalSummary: L(
        `Tres líneas: console("${wEs}"), if, for`,
        `Three lines: console("${wEn}"), if, for`,
      ),
      previewStripes: [
        { swatch: 'emerald', caption: L('Salida console', 'Console out') },
        { swatch: 'amber', caption: L('Condición if', 'if branch') },
        { swatch: 'sky', caption: L('Bucle for', 'for loop') },
      ],
      canvasHero: {
        mode: 'greeting',
        headline: L(wEs, wEn),
        highlightWhenFirstLineMatches: true,
      },
      lines: [
        {
          id: 'c',
          snippet: L(`console.log("${wEs}");`, `console.log("${wEn}");`),
          explain: L(
            'Primera línea: texto visible en la **consola**.',
            'First line: visible text in the **console**.',
          ),
        },
        {
          id: 'i',
          snippet: L('if (ok) { ... }', 'if (ok) { ... }'),
          explain: L(
            'Segunda línea: el **if** elige una rama.',
            'Second line: **if** picks a branch.',
          ),
        },
        {
          id: 'f',
          snippet: L('for (let i = 0; ...)', 'for (let i = 0; ...)'),
          explain: L(
            'Tercera línea: el **for** repite un trozo.',
            'Third line: **for** repeats a chunk.',
          ),
        },
      ],
      wrongHint: L(
        'Orden: primero console.log con el mensaje del **lienzo**, luego if, luego for — usa **Nueva línea** entre líneas.',
        'Order: first console.log with the **canvas** message, then if, then for — use **New line** between lines.',
      ),
    })
  })
}
