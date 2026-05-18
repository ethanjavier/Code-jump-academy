import type { LearningLanguageId } from '../app/learningTracks'

import type { GuidedLesson, Localized } from './guidedLessonTypes'

const L = (es: string, en: string): Localized => ({ es, en })

const MODULE_1_HINT = {
  es: 'Módulo 1 — ordena las líneas de arriba abajo en **Tu código**.',
  en: 'Module 1 — reorder the lines top to bottom in **Your code**.',
} as const

const MODULE_HINTS: ReadonlyArray<{ es: string; en: string }> = [
  {
    es: 'Módulo 2 — mismo ejercicio: líneas completas y **Comprobar orden**.',
    en: 'Module 2 — same exercise: full lines and **Check order**.',
  },
  {
    es: 'Módulo 3 — cabecera primero, cuerpo después, cierre al final.',
    en: 'Module 3 — header first, body next, closing brace last.',
  },
  {
    es: 'Módulo 4 — refuerza el orden ejecutable de tu programa.',
    en: 'Module 4 — reinforce runnable program order.',
  },
  {
    es: 'Módulo 5 — última tanda: mantén el orden ejecutable.',
    en: 'Module 5 — last stretch: keep runnable order.',
  },
]

type OrderLinesEx = Extract<GuidedLesson['exercise'], { type: 'orderLines' }>

type SlotExercise = Pick<OrderLinesEx, 'lines' | 'correctOrder'>

function segment(slot: number): { mod: number; lessonInMod: number } {
  return { mod: Math.floor(slot / 9) + 1, lessonInMod: (slot % 9) + 1 }
}

function moduleHint(mod: number): { es: string; en: string } {
  if (mod === 1) return MODULE_1_HINT
  return MODULE_HINTS[mod - 2]!
}

function instructionBody(hint: { es: string; en: string }, detailEs: string, detailEn: string) {
  return L(
    `${hint.es}\n\n${detailEs} Pulsa **Comprobar orden**.`,
    `${hint.en}\n\n${detailEn} Press **Check order**.`,
  )
}

function lessonFromExercise(
  languageId: LearningLanguageId,
  slot: number,
  title: Localized,
  instruction: Localized,
  exercise: SlotExercise,
): GuidedLesson {
  const { mod, lessonInMod } = segment(slot)
  return {
    id: `${languageId}-adv-m${mod}-l${lessonInMod}`,
    title,
    instruction,
    exercise: { type: 'orderLines', ...exercise },
  }
}

function jsFamilyExercises(slot: number): [
  SlotExercise,
  SlotExercise,
  SlotExercise,
  SlotExercise,
] {
  const vn = ['pasos', 'total', 'nivel', 'meta', 'dato', 'valor', 'suma', 'item', 'count'][slot % 9]!
  const num = String(2 + (slot % 6))
  const limit = 2 + (slot % 4)
  const fn = slot % 2 === 0 ? 'suma' : 'doble'
  const threshold = 2 + (slot % 3)
  return [
    {
      lines: [
        { es: `console.log(${vn});`, en: `console.log(${vn});` },
        { es: `const ${vn} = ${num};`, en: `const ${vn} = ${num};` },
      ],
      correctOrder: [1, 0],
    },
    {
      lines: [
        { es: '}', en: '}' },
        { es: '  console.log(i);', en: '  console.log(i);' },
        { es: `for (let i = 0; i < ${limit}; i++) {`, en: `for (let i = 0; i < ${limit}; i++) {` },
      ],
      correctOrder: [2, 1, 0],
    },
    {
      lines: [
        { es: '}', en: '}' },
        { es: '  return a + b;', en: '  return a + b;' },
        { es: `function ${fn}(a, b) {`, en: `function ${fn}(a, b) {` },
      ],
      correctOrder: [2, 1, 0],
    },
    {
      lines: [
        { es: '  console.log("No");', en: '  console.log("No");' },
        { es: '} else {', en: '} else {' },
        { es: '  console.log("Si");', en: '  console.log("Yes");' },
        { es: `if (n > ${threshold}) {`, en: `if (n > ${threshold}) {` },
      ],
      correctOrder: [3, 2, 1, 0],
    },
  ]
}

function pythonExercises(slot: number): [SlotExercise, SlotExercise, SlotExercise, SlotExercise] {
  const val = (slot % 6) + 2
  const limit = 2 + (slot % 4)
  const fn = slot % 2 === 0 ? 'suma' : 'doble'
  const threshold = 2 + (slot % 3)
  return [
    {
      lines: [
        { es: `print(pasos)`, en: `print(steps)` },
        { es: `pasos = ${val}`, en: `steps = ${val}` },
      ],
      correctOrder: [1, 0],
    },
    {
      lines: [
        { es: '    print(i)', en: '    print(i)' },
        { es: `for i in range(${limit}):`, en: `for i in range(${limit}):` },
      ],
      correctOrder: [1, 0],
    },
    {
      lines: [
        { es: '    return a + b', en: '    return a + b' },
        { es: `def ${fn}(a, b):`, en: `def ${fn}(a, b):` },
      ],
      correctOrder: [1, 0],
    },
    {
      lines: [
        { es: '    print("No")', en: '    print("No")' },
        { es: 'else:', en: 'else:' },
        { es: '    print("Si")', en: '    print("Yes")' },
        { es: `if n > ${threshold}:`, en: `if n > ${threshold}:` },
      ],
      correctOrder: [3, 2, 1, 0],
    },
  ]
}

function sqlExercises(slot: number): [SlotExercise, SlotExercise, SlotExercise, SlotExercise] {
  const age = 12 + (slot % 18)
  const base: SlotExercise = {
    lines: [
      { es: `WHERE edad > ${age}`, en: `WHERE age > ${age}` },
      { es: 'FROM personas', en: 'FROM people' },
      { es: 'SELECT nombre, edad', en: 'SELECT name, age' },
    ],
    correctOrder: [2, 1, 0],
  }
  return [base, base, base, base]
}

function htmlExercises(slot: number): [SlotExercise, SlotExercise, SlotExercise, SlotExercise] {
  const colors = ['teal', 'violet', 'amber', 'rose', 'sky', 'lime']
  const color = colors[slot % colors.length]!
  const base: SlotExercise = {
    lines: [
      { es: `  color: ${color};`, en: `  color: ${color};` },
      { es: '  Contenido', en: '  Content' },
      { es: '<div>', en: '<div>' },
    ],
    correctOrder: [2, 1, 0],
  }
  return [base, base, base, base]
}

function pipelineExercises(_slot: number): [SlotExercise, SlotExercise, SlotExercise, SlotExercise] {
  const base: SlotExercise = {
    lines: [
      { es: '(mostrar resultado)', en: '(show result)' },
      { es: '(calcular / decidir)', en: '(calculate / decide)' },
      { es: '(declarar datos)', en: '(declare data)' },
    ],
    correctOrder: [2, 1, 0],
  }
  return [base, base, base, base]
}

const TITLE_BY_KIND = [
  { es: 'Declarar y mostrar', en: 'Declare and show' },
  { es: 'Repetir con bucle', en: 'Repeat with a loop' },
  { es: 'Agrupar pasos', en: 'Group steps' },
  { es: 'Decidir con condición', en: 'Choose with a condition' },
] as const

function buildForLanguage(languageId: LearningLanguageId): GuidedLesson[] {
  const exercisesFor = (slot: number): SlotExercise => {
    let bank: [SlotExercise, SlotExercise, SlotExercise, SlotExercise]
    switch (languageId) {
      case 'javascript':
      case 'typescript':
        bank = jsFamilyExercises(slot)
        break
      case 'python':
        bank = pythonExercises(slot)
        break
      case 'sql':
        bank = sqlExercises(slot)
        break
      case 'html_css':
        bank = htmlExercises(slot)
        break
      default:
        bank = pipelineExercises(slot)
        break
    }
    return bank[slot % 4]!
  }

  return Array.from({ length: 45 }, (_, slot) => {
    const { mod } = segment(slot)
    const hint = moduleHint(mod)
    const kind = slot % 4
    const titleKind = TITLE_BY_KIND[kind]!
    const exercise = exercisesFor(slot)
    const details = [
      {
        es: 'Ordena las líneas para que el programa tenga sentido de arriba abajo.',
        en: 'Reorder the lines so the program reads top to bottom.',
      },
      {
        es: 'Ordena el bucle: cabecera arriba, cuerpo en el medio, cierre al final.',
        en: 'Order the loop: header on top, body in the middle, close last.',
      },
      {
        es: 'Ordena: definición arriba, cuerpo en el medio, cierre al final.',
        en: 'Order: definition on top, body in the middle, close last.',
      },
      {
        es: 'Ordena la condición y sus ramas de arriba abajo.',
        en: 'Order the condition and its branches top to bottom.',
      },
    ][kind]!
    return lessonFromExercise(
      languageId,
      slot,
      L(
        `${titleKind.es} · módulo ${mod}`,
        `${titleKind.en} · module ${mod}`,
      ),
      instructionBody(hint, details.es, details.en),
      exercise,
    )
  })
}

/** 45 advanced lessons (5×9); {@link orderLines} only — same practice UI for every track. */
export function buildAdvancedExtendedOrderLinesLessons(
  languageId: LearningLanguageId,
): GuidedLesson[] {
  return buildForLanguage(languageId)
}

/** @deprecated Use {@link buildAdvancedExtendedOrderLinesLessons}('javascript') */
export function buildJavascriptAdvancedExtendedLessons(): GuidedLesson[] {
  return buildAdvancedExtendedOrderLinesLessons('javascript')
}
