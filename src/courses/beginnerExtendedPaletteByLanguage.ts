import type { LearningLanguageId } from '../app/learningTracks'

import type { GuidedConceptKey, GuidedLesson } from './guidedLessonTypes'
import {
  BEGINNER_EXTENDED_HERO_WORDS_44,
  buildJavascriptBeginnerPaletteLessonsSlots1to8,
  buildJavascriptBeginnerPaletteLessonsSlots9to44,
} from './javascriptBeginnerPaletteModules'
import { paletteIntroLesson } from './stripeIntroLessons'

const L = (es: string, en: string) => ({ es, en })

/** Hints for guided modules 2–5 in extended beginner tracks (any language). */
const EXT_MOD_HINTS: ReadonlyArray<{ es: string; en: string }> = [
  {
    es: 'Módulo 2 — refuerza **tres líneas** solo con la paleta.',
    en: 'Module 2 — reinforce **three lines** from the palette only.',
  },
  {
    es: 'Módulo 3 — misma mecánica: **solo tarjetas**, orden fijo.',
    en: 'Module 3 — same mechanic: **cards only**, fixed order.',
  },
  {
    es: 'Módulo 4 — el **lienzo** y el **modal** celebran el programa correcto.',
    en: 'Module 4 — the **canvas** and **modal** celebrate the correct program.',
  },
  {
    es: 'Módulo 5 — última tanda: mantén el ritmo de **tres líneas**.',
    en: 'Module 5 — last stretch: keep the **three-line** rhythm.',
  },
]

function segment(slot: number): { mod: number; lessonInMod: number } {
  if (slot < 8) return { mod: 1, lessonInMod: slot + 2 }
  const r = slot - 8
  return { mod: Math.floor(r / 9) + 2, lessonInMod: (r % 9) + 1 }
}

function conceptAt(slot: number): GuidedConceptKey {
  return slot % 3 === 0 ? 'console' : slot % 3 === 1 ? 'if_branch' : 'repeat_loop'
}

const TS_M1 = {
  es: 'Módulo 1 — continúa con **solo la paleta**: const tipado, **if** y **for** como en la primera lección.',
  en: 'Module 1 — keep **palette only**: typed **const**, **if**, and **for** like lesson 1.',
} as const

const PY_M1 = {
  es: 'Módulo 1 — **print**, asignación e **if** solo con la paleta, como la primera lección.',
  en: 'Module 1 — **print**, assignment, and **if** from the palette only, like lesson 1.',
} as const

const SQL_M1 = {
  es: 'Módulo 1 — **SELECT**, **FROM** y **WHERE** en tres líneas solo con la paleta.',
  en: 'Module 1 — **SELECT**, **FROM**, and **WHERE** in three palette-only lines.',
} as const

const HTML_M1 = {
  es: 'Módulo 1 — etiqueta, texto y **color** en tres líneas solo con la paleta.',
  en: 'Module 1 — tag, text, and **color** in three palette-only lines.',
} as const

const DEFAULT_M1 = {
  es: 'Módulo 1 — **entrada → proceso → salida** solo con la paleta, como la primera lección.',
  en: 'Module 1 — **input → process → output** from the palette only, like lesson 1.',
} as const

function buildTypeScriptExtended44(): GuidedLesson[] {
  return Array.from({ length: 44 }, (_, slot) => {
    const { mod, lessonInMod } = segment(slot)
    const w = BEGINNER_EXTENDED_HERO_WORDS_44[slot]!
    const hint = mod === 1 ? TS_M1 : EXT_MOD_HINTS[mod - 2]!
    const nVal = (slot % 14) + 2
    return paletteIntroLesson({
      id: `typescript-mod${mod}-pal-${lessonInMod}`,
      title: L(
        `Bandera del flujo · ${w.es} (módulo ${mod})`,
        `Flow flag · ${w.en} (module ${mod})`,
      ),
      instruction: L(
        `${hint.es}\n\nConstruye las tres líneas **solo desde la paleta**. Usa **Nueva línea** entre líneas. Objetivo: **const n: number = ${nVal}**, luego **if (n > 0)**, luego **for** con el mismo **n**.`,
        `${hint.en}\n\nBuild the three lines **from the palette only**. Use **New line** between lines. Goal: **const n: number = ${nVal}**, then **if (n > 0)**, then **for** using the same **n**.`,
      ),
      introducesConcept: conceptAt(slot),
      goalSummary: L(
        `Tres líneas: const n = ${nVal} → if → for`,
        `Three lines: const n = ${nVal} → if → for`,
      ),
      previewStripes: [
        { swatch: 'violet', caption: L('Tipo const', 'Typed const') },
        { swatch: 'amber', caption: L('Condición if', 'if branch') },
        { swatch: 'teal', caption: L('Bucle for', 'for loop') },
      ],
      canvasHero: {
        mode: 'typeRibbon',
        headline: L('const', 'const'),
        highlightWhenFirstLineMatches: true,
      },
      lines: [
        {
          id: 't',
          snippet: L(`const n: number = ${nVal}`, `const n: number = ${nVal}`),
          explain: L('Anotas el **tipo** del valor.', 'You annotate the value **type**.'),
        },
        {
          id: 'b',
          snippet: L('if (n > 0) { ... }', 'if (n > 0) { ... }'),
          explain: L('La condición **if** usa ese dato.', 'The **if** condition uses that data.'),
        },
        {
          id: 'l',
          snippet: L('for (let i = 0; i < n; i++)', 'for (let i = 0; i < n; i++)'),
          explain: L('El **for** repite con el mismo límite.', 'The **for** repeats with the same bound.'),
        },
      ],
      wrongHint: L(
        'Orden: const tipado, luego if, luego for — **Nueva línea** entre líneas.',
        'Order: typed const, then if, then for — **New line** between lines.',
      ),
    })
  })
}

function buildPythonExtended44(): GuidedLesson[] {
  return Array.from({ length: 44 }, (_, slot) => {
    const { mod, lessonInMod } = segment(slot)
    const w = BEGINNER_EXTENDED_HERO_WORDS_44[slot]!
    const hint = mod === 1 ? PY_M1 : EXT_MOD_HINTS[mod - 2]!
    const val = (slot % 6) + 2
    return paletteIntroLesson({
      id: `python-mod${mod}-pal-${lessonInMod}`,
      title: L(
        `Bandera del flujo · ${w.es} (módulo ${mod})`,
        `Flow flag · ${w.en} (module ${mod})`,
      ),
      instruction: L(
        `${hint.es}\n\nMonta **print**, asignación e **if** solo con la paleta. **Nueva línea** entre líneas. Objetivo: imprimir **${w.es}**, luego **pasos = ${val}**, luego **if pasos > 0:**.`,
        `${hint.en}\n\nAssemble **print**, assignment, and **if** from the palette only. **New line** between lines. Goal: print **${w.en}**, then **steps = ${val}**, then **if steps > 0:**.`,
      ),
      introducesConcept: conceptAt(slot),
      goalSummary: L(
        `Tres líneas: print("${w.es}") → pasos = ${val} → if`,
        `Three lines: print("${w.en}") → steps = ${val} → if`,
      ),
      previewStripes: [
        { swatch: 'emerald', caption: L('print', 'print') },
        { swatch: 'lime', caption: L('Variable', 'Variable') },
        { swatch: 'orange', caption: L('if', 'if') },
      ],
      canvasHero: {
        mode: 'greeting',
        headline: L(w.es, w.en),
        highlightWhenFirstLineMatches: true,
      },
      lines: [
        {
          id: 'p',
          snippet: L(`print("${w.es}")`, `print("${w.en}")`),
          explain: L('`print` muestra valores en la consola.', '`print` shows values in the console.'),
        },
        {
          id: 'v',
          snippet: L(`pasos = ${val}`, `steps = ${val}`),
          explain: L('Guardas un valor en un **nombre**.', 'You store a value in a **name**.'),
        },
        {
          id: 'd',
          snippet: L('if pasos > 0:', 'if steps > 0:'),
          explain: L('El **if** usa esa variable.', '**if** uses that variable.'),
        },
      ],
      wrongHint: L(
        'Orden: print, luego asignación, luego if — **Nueva línea** entre líneas.',
        'Order: print, then assignment, then if — **New line** between lines.',
      ),
    })
  })
}

function buildSqlExtended44(): GuidedLesson[] {
  return Array.from({ length: 44 }, (_, slot) => {
    const { mod, lessonInMod } = segment(slot)
    const w = BEGINNER_EXTENDED_HERO_WORDS_44[slot]!
    const hint = mod === 1 ? SQL_M1 : EXT_MOD_HINTS[mod - 2]!
    const age = 12 + (slot % 18)
    return paletteIntroLesson({
      id: `sql-mod${mod}-pal-${lessonInMod}`,
      title: L(
        `Bandera SQL · ${w.es} (módulo ${mod})`,
        `SQL flag · ${w.en} (module ${mod})`,
      ),
      instruction: L(
        `${hint.es}\n\nCompón **SELECT**, **FROM** y **WHERE** solo con la paleta. Filtro de ejemplo: edad > **${age}** / age > **${age}**.`,
        `${hint.en}\n\nCompose **SELECT**, **FROM**, and **WHERE** from the palette only. Sample filter: age > **${age}**.`,
      ),
      introducesConcept: conceptAt(slot),
      goalSummary: L('Objetivo: SELECT → FROM → WHERE', 'Goal: SELECT → FROM → WHERE'),
      previewStripes: [
        { swatch: 'sky', caption: L('SELECT', 'SELECT') },
        { swatch: 'indigo', caption: L('FROM', 'FROM') },
        { swatch: 'rose', caption: L('WHERE', 'WHERE') },
      ],
      canvasHero: {
        mode: 'sqlRiver',
        highlightWhenFirstLineMatches: true,
      },
      lines: [
        {
          id: 's',
          snippet: L('SELECT nombre, edad', 'SELECT name, age'),
          explain: L('Qué **columnas** traes.', 'Which **columns** you fetch.'),
        },
        {
          id: 'r',
          snippet: L('FROM personas', 'FROM people'),
          explain: L('De qué **tabla** vienen las filas.', 'Which **table** rows come from.'),
        },
        {
          id: 'w',
          snippet: L(`WHERE edad > ${age}`, `WHERE age > ${age}`),
          explain: L('Qué **filas** pasan el filtro.', 'Which **rows** pass the filter.'),
        },
      ],
      wrongHint: L(
        'Orden SQL típico: SELECT, FROM, WHERE — tres líneas.',
        'Typical SQL order: SELECT, FROM, WHERE — three lines.',
      ),
    })
  })
}

const HTML_COLORS_ES = ['rojo', 'azul', 'verde', 'naranja', 'violeta'] as const
const HTML_COLORS_EN = ['red', 'blue', 'green', 'orange', 'violet'] as const

function buildHtmlCssExtended44(): GuidedLesson[] {
  return Array.from({ length: 44 }, (_, slot) => {
    const { mod, lessonInMod } = segment(slot)
    const w = BEGINNER_EXTENDED_HERO_WORDS_44[slot]!
    const hint = mod === 1 ? HTML_M1 : EXT_MOD_HINTS[mod - 2]!
    const ci = slot % HTML_COLORS_EN.length
    const colorEs = HTML_COLORS_ES[ci]!
    const colorEn = HTML_COLORS_EN[ci]!
    return paletteIntroLesson({
      id: `html_css-mod${mod}-pal-${lessonInMod}`,
      title: L(
        `Bandera HTML/CSS · ${w.es} (módulo ${mod})`,
        `HTML/CSS flag · ${w.en} (module ${mod})`,
      ),
      instruction: L(
        `${hint.es}\n\nTres líneas: **<div>**, texto **${w.es}**, regla **color: ${colorEs};**. Usa **Nueva línea** entre líneas.`,
        `${hint.en}\n\nThree lines: **<div>**, text **${w.en}**, rule **color: ${colorEn};**. Use **New line** between lines.`,
      ),
      introducesConcept: conceptAt(slot),
      goalSummary: L(
        `Objetivo: div → ${w.es} → color ${colorEs}`,
        `Goal: div → ${w.en} → color ${colorEn}`,
      ),
      previewStripes: [
        { swatch: 'slate', caption: L('HTML', 'HTML') },
        { swatch: 'amber', caption: L('Texto', 'Text') },
        { swatch: 'fuchsia', caption: L('CSS color', 'CSS color') },
      ],
      canvasHero: {
        mode: 'htmlLayers',
        headline: L(w.es, w.en),
        highlightWhenFirstLineMatches: true,
      },
      lines: [
        {
          id: 'h',
          snippet: L('<div>', '<div>'),
          explain: L('Contenedor de bloque.', 'Block container.'),
        },
        {
          id: 'x',
          snippet: L(w.es, w.en),
          explain: L('Texto que ve el usuario.', 'Text the user reads.'),
        },
        {
          id: 'c',
          snippet: L(`color: ${colorEn};`, `color: ${colorEn};`),
          explain: L('Regla **color** para el texto.', '**color** rule for the text.'),
        },
      ],
      wrongHint: L(
        'Orden: etiqueta, contenido, estilo — **Nueva línea** entre líneas.',
        'Order: tag, content, style — **New line** between lines.',
      ),
    })
  })
}

function buildDefaultPipeline44(languageId: LearningLanguageId): GuidedLesson[] {
  return Array.from({ length: 44 }, (_, slot) => {
    const { mod, lessonInMod } = segment(slot)
    const w = BEGINNER_EXTENDED_HERO_WORDS_44[slot]!
    const hint = mod === 1 ? DEFAULT_M1 : EXT_MOD_HINTS[mod - 2]!
    return paletteIntroLesson({
      id: `${languageId}-mod${mod}-pal-${lessonInMod}`,
      title: L(
        `Bandera lógica · ${w.es} (módulo ${mod})`,
        `Program flag · ${w.en} (module ${mod})`,
      ),
      instruction: L(
        `${hint.es}\n\nEscribe el programa de ejemplo **solo con la paleta** (tres líneas + **Nueva línea** entre ellas). El **lienzo** y el **modal** resumen el flujo.`,
        `${hint.en}\n\nWrite the sample program **from the palette only** (three lines + **New line** between them). The **canvas** and **modal** summarize the flow.`,
      ),
      introducesConcept: conceptAt(slot),
      goalSummary: L('Objetivo: entrada → proceso → salida', 'Goal: input → process → output'),
      previewStripes: [
        { swatch: 'emerald', caption: L('Entrada', 'Input') },
        { swatch: 'amber', caption: L('Proceso', 'Process') },
        { swatch: 'sky', caption: L('Salida', 'Output') },
      ],
      canvasHero: {
        mode: 'pipeline',
        headline: L(w.es, w.en),
        highlightWhenFirstLineMatches: false,
      },
      lines: [
        {
          id: 'a',
          snippet: L('(declarar datos)', '(declare data)'),
          explain: L('Preparas nombres o valores.', 'You prepare names or values.'),
        },
        {
          id: 'b',
          snippet: L('(calcular / decidir)', '(calculate / decide)'),
          explain: L('Aquí va la lógica.', 'Where logic runs.'),
        },
        {
          id: 'c',
          snippet: L('(mostrar resultado)', '(show result)'),
          explain: L('Muestras el resultado.', 'You show the result.'),
        },
      ],
      wrongHint: L(
        'Orden típico: preparar → trabajar → mostrar.',
        'Typical order: prepare → work → show.',
      ),
    })
  })
}

/**
 * 44 palette-only lessons (global indices 1–44) for extended beginner guided courses.
 * Index 0 stays the stripe intro from {@link introStripeLesson}.
 */
export function buildBeginnerExtendedPaletteLessons(languageId: LearningLanguageId): GuidedLesson[] {
  switch (languageId) {
    case 'javascript':
      return [
        ...buildJavascriptBeginnerPaletteLessonsSlots1to8(),
        ...buildJavascriptBeginnerPaletteLessonsSlots9to44(),
      ]
    case 'typescript':
      return buildTypeScriptExtended44()
    case 'python':
      return buildPythonExtended44()
    case 'sql':
      return buildSqlExtended44()
    case 'html_css':
      return buildHtmlCssExtended44()
    default:
      return buildDefaultPipeline44(languageId)
  }
}
