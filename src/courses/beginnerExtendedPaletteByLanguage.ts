import type { LearningLanguageId } from '../app/learningTracks'

import type { GuidedConceptKey, GuidedLesson } from './guidedLessonTypes'
import { buildBeginnerBlockBridgeCanvas } from './beginnerBlockBridgeByLanguage'
import { blockAnchoredPaletteGoal, requiredConceptsForLanguage } from './beginnerPaletteBlockGoals'
import {
  BEGINNER_EXTENDED_HERO_WORDS_44,
  buildJavascriptBeginnerPaletteLessonsSlots1to8,
  buildJavascriptBeginnerPaletteLessonsSlots9to44,
} from './javascriptBeginnerPaletteModules'
import { paletteIntroLesson } from './stripeIntroLessons'

const L = (es: string, en: string) => ({ es, en })

const BLOCK_FLOW_REF = L(
  '\n\nMira el **lienzo de bloques** y el panel **Objetivo** (flujo en bloques, sin memorizar código).',
  '\n\nSee the **block canvas** and **Goal** panel (block flow — no need to memorize code).',
)

const TS_MANDATORY = L(
  '\n\n**Obligatorio:** al menos una línea **Crear variable** y un **Repetir** (`for`) en tu programa.',
  '\n\n**Required:** at least one **Create variable** line and a **Repeat** (`for`) in your program.',
)

const PY_MANDATORY = L(
  '\n\n**Obligatorio:** una asignación (variable) y un **if** en tu programa.',
  '\n\n**Required:** an assignment (variable) and an **if** in your program.',
)

function pasosForSlot(slot: number): number {
  return 2 + (slot % 5)
}

/** Hints for guided modules 2–5 in extended beginner tracks (any language). */
const EXT_MOD_HINTS: ReadonlyArray<{ es: string; en: string }> = [
  {
    es: 'Módulo 2 — mismo flujo en bloques; **solo tarjetas** de la paleta.',
    en: 'Module 2 — same block flow; **palette cards** only.',
  },
  {
    es: 'Módulo 3 — respeta el orden del **lienzo** y del panel **Objetivo**.',
    en: 'Module 3 — follow the order on the **canvas** and **Goal** panel.',
  },
  {
    es: 'Módulo 4 — el **lienzo** y el **modal** celebran el programa correcto.',
    en: 'Module 4 — the **canvas** and **modal** celebrate the correct program.',
  },
  {
    es: 'Módulo 5 — última tanda: mantén el ritmo del flujo en bloques.',
    en: 'Module 5 — last stretch: keep the block-flow rhythm.',
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
  const required = [...requiredConceptsForLanguage('typescript')]
  const blockGoal = blockAnchoredPaletteGoal('typescript')
  return Array.from({ length: 44 }, (_, slot) => {
    const { mod, lessonInMod } = segment(slot)
    const w = BEGINNER_EXTENDED_HERO_WORDS_44[slot]!
    const hint = mod === 1 ? TS_M1 : EXT_MOD_HINTS[mod - 2]!
    const nVal = (slot % 14) + 2
    const pasos = pasosForSlot(slot)
    return paletteIntroLesson({
      id: `typescript-mod${mod}-pal-${lessonInMod}`,
      title: L(
        `Bandera del flujo · ${w.es} (módulo ${mod})`,
        `Flow flag · ${w.en} (module ${mod})`,
      ),
      instruction: L(
        `${hint.es}\n\nConstruye el programa **solo desde la paleta**. Usa **Nueva línea** entre líneas.${TS_MANDATORY.es}${BLOCK_FLOW_REF.es}`,
        `${hint.en}\n\nBuild the program **from the palette only**. Use **New line** between lines.${TS_MANDATORY.en}${BLOCK_FLOW_REF.en}`,
      ),
      introducesConcept: conceptAt(slot),
      requiredConcepts: required,
      canvasLienzo: buildBeginnerBlockBridgeCanvas('typescript', pasos),
      goalSummary: blockGoal,
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
          role: 'variable',
          snippet: L(`const n: number = ${nVal}`, `const n: number = ${nVal}`),
          explain: L('Anotas el **tipo** del valor.', 'You annotate the value **type**.'),
        },
        {
          id: 'b',
          role: 'if_branch',
          snippet: L('if (n > 0) { ... }', 'if (n > 0) { ... }'),
          explain: L('La condición **if** usa ese dato.', 'The **if** condition uses that data.'),
        },
        {
          id: 'l',
          role: 'repeat_loop',
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
  const required = [...requiredConceptsForLanguage('python')]
  const blockGoal = blockAnchoredPaletteGoal('python')
  return Array.from({ length: 44 }, (_, slot) => {
    const { mod, lessonInMod } = segment(slot)
    const w = BEGINNER_EXTENDED_HERO_WORDS_44[slot]!
    const hint = mod === 1 ? PY_M1 : EXT_MOD_HINTS[mod - 2]!
    const val = (slot % 6) + 2
    const pasos = pasosForSlot(slot)
    return paletteIntroLesson({
      id: `python-mod${mod}-pal-${lessonInMod}`,
      title: L(
        `Bandera del flujo · ${w.es} (módulo ${mod})`,
        `Flow flag · ${w.en} (module ${mod})`,
      ),
      instruction: L(
        `${hint.es}\n\nMonta el programa solo con la paleta. **Nueva línea** entre líneas.${PY_MANDATORY.es}${BLOCK_FLOW_REF.es} La palabra del lienzo va en el **print**.`,
        `${hint.en}\n\nAssemble the program from the palette only. **New line** between lines.${PY_MANDATORY.en}${BLOCK_FLOW_REF.en} The canvas word goes in **print**.`,
      ),
      introducesConcept: conceptAt(slot),
      requiredConcepts: required,
      canvasLienzo: buildBeginnerBlockBridgeCanvas('python', pasos),
      goalSummary: blockGoal,
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
          role: 'console',
          snippet: L(`print("${w.es}")`, `print("${w.en}")`),
          explain: L('`print` muestra valores en la consola.', '`print` shows values in the console.'),
        },
        {
          id: 'v',
          role: 'variable',
          snippet: L(`pasos = ${val}`, `steps = ${val}`),
          explain: L('Guardas un valor en un **nombre**.', 'You store a value in a **name**.'),
        },
        {
          id: 'd',
          role: 'if_branch',
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
  const blockGoal = blockAnchoredPaletteGoal('sql')
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
        `${hint.es}\n\nCompón la consulta solo con la paleta.${BLOCK_FLOW_REF.es}`,
        `${hint.en}\n\nCompose the query from the palette only.${BLOCK_FLOW_REF.en}`,
      ),
      introducesConcept: conceptAt(slot),
      canvasLienzo: buildBeginnerBlockBridgeCanvas('sql'),
      goalSummary: blockGoal,
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
  const blockGoal = blockAnchoredPaletteGoal('html_css')
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
        `${hint.es}\n\nArma las capas solo con la paleta. El texto visible usa la palabra del lienzo (**${w.es}**).${BLOCK_FLOW_REF.es}`,
        `${hint.en}\n\nBuild the layers from the palette only. Visible text uses the canvas word (**${w.en}**).${BLOCK_FLOW_REF.en}`,
      ),
      introducesConcept: conceptAt(slot),
      canvasLienzo: buildBeginnerBlockBridgeCanvas('html_css'),
      goalSummary: blockGoal,
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
          snippet: L(`color: ${colorEs};`, `color: ${colorEn};`),
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
  const blockGoal = blockAnchoredPaletteGoal(languageId)
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
        `${hint.es}\n\nEscribe el programa de ejemplo **solo con la paleta**.${BLOCK_FLOW_REF.es}`,
        `${hint.en}\n\nWrite the sample program **from the palette only**.${BLOCK_FLOW_REF.en}`,
      ),
      introducesConcept: conceptAt(slot),
      canvasLienzo: buildBeginnerBlockBridgeCanvas(languageId),
      goalSummary: blockGoal,
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
