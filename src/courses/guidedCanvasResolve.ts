import type {
  GuidedCanvasRow,
  GuidedConceptKey,
  GuidedLesson,
  Localized,
} from './guidedLessonTypes'

const L = (es: string, en: string): Localized => ({ es, en })

/** Fallback mini-lienzo when a lesson has no explicit `canvasLienzo`. */
function fallbackRowsForConcept(concept: GuidedConceptKey): GuidedCanvasRow[] {
  switch (concept) {
    case 'console':
      return [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Que el usuario vea un mensaje claro en pantalla',
              'Make a clear message visible on screen',
            ),
            detail: L(
              'Como un cartel o el primer texto de una app — no cuadros vacíos sin sentido.',
              'Like a banner or the first line of an app — not meaningless empty boxes.',
            ),
            preview: { type: 'stripes', colors: ['green'] },
          },
        ],
        [{ kind: 'caption', text: L('Salida de texto', 'Text output') }],
        [{ kind: 'terminal', line: L('Hola', 'Hello') }],
      ]
    case 'variable':
      return [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Completar un dibujo usando el mismo número varias veces',
              'Finish a drawing by reusing one number in several places',
            ),
            detail: L(
              'Igual que una bandera: tres franjas con anchos coherentes — aquí pasos = vueltas de pintura.',
              'Like a flag: coherent stripes — here “steps” means how many paint passes.',
            ),
            preview: { type: 'stripes', colors: ['green', 'yellow', 'red'] },
          },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'Primero el nombre guarda un número — como Crear variable:',
              'First the name stores a number — like Create variable:',
            ),
          },
        ],
        [
          { kind: 'varDecl', name: L('pasos', 'steps'), value: 3 },
          { kind: 'arrowHint' },
          { kind: 'terminal', line: L('3', '3') },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'En el lienzo también ordenas pintar, huecos y filas:',
              'On the canvas you also order painting, gaps, and rows:',
            ),
          },
        ],
        [
          { kind: 'drawBox', color: 'purple' },
          { kind: 'drawBox', color: 'orange' },
          { kind: 'skip' },
          { kind: 'newLine' },
        ],
        [
          {
            kind: 'repeat',
            count: L('3', '3'),
            inner: [{ kind: 'drawBox', color: 'green' }],
          },
        ],
      ]
    case 'if_branch':
      return [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Dos dibujos posibles según la situación',
              'Two possible drawings depending on the situation',
            ),
            detail: L(
              'Como elegir si pintas la franja de arriba o la de abajo en una bandera distinta.',
              'Like choosing whether you paint the top stripe or the bottom on a different flag.',
            ),
            preview: {
              type: 'cells',
              items: ['blue', 'skip', 'orange'],
            },
          },
        ],
        [
          {
            kind: 'ifSplit',
            cond: L('¿condición?', 'condition?'),
            thenLine: L('rama sí', 'yes branch'),
            elseLine: L('rama no', 'no branch'),
          },
        ],
      ]
    case 'repeat_loop':
      return [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Rellenar una fila larga sin pegar el mismo bloque mil veces',
              'Fill a long row without pasting the same block endlessly',
            ),
            detail: L(
              'Objetivo real: una fila de celdas como en el puzzle — varias vueltas del mismo patrón.',
              'Real goal: a row of cells like in the puzzle — several rounds of the same pattern.',
            ),
            preview: {
              type: 'cells',
              items: ['purple', 'purple', 'skip', 'orange', 'orange'],
            },
          },
        ],
        [{ kind: 'caption', text: L('Repetir varias veces', 'Repeat several times') }],
        [
          {
            kind: 'repeat',
            count: L('3', '3'),
            inner: [
              { kind: 'drawBox', color: 'blue' },
              { kind: 'drawBox', color: 'yellow' },
              { kind: 'skip' },
            ],
          },
        ],
      ]
    case 'function_block':
      return [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Guardar un mini-programa con nombre para reutilizarlo',
              'Save a mini-program under a name you can reuse',
            ),
            detail: L(
              'Como tener una plantilla que pinta siempre el mismo motivo (una cruz, una cruz…).',
              'Like a template that always paints the same motif.',
            ),
            preview: { type: 'stripes', colors: ['indigo', 'purple'] },
          },
        ],
        [
          {
            kind: 'functionShell',
            name: L('miFn', 'fn'),
            inner: [{ kind: 'terminal', line: L('resultado', 'result') }],
          },
        ],
      ]
    case 'array_data':
      return [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Leer la celda correcta en una fila ordenada',
              'Read the right cell in an ordered row',
            ),
            detail: L(
              'Igual que mirar la segunda franja de una bandera: importa la posición (índice).',
              'Like looking at the second stripe of a flag: position (index) matters.',
            ),
            preview: { type: 'stripes', colors: ['red', 'green', 'blue'] },
          },
        ],
        [
          {
            kind: 'caption',
            text: L('Lista ordenada — índices 0, 1, 2…', 'Ordered list — indexes 0, 1, 2…'),
          },
        ],
        [{ kind: 'arrayCells', items: [L('a', 'a'), L('b', 'b'), L('c', 'c')] }],
      ]
    default:
      return []
  }
}

/**
 * Rows shown in beginner mode next to “result preview”: explicit `lesson.canvasLienzo`
 * or a concept-based fallback (drawBox / skip / variables / …).
 */
export function resolveCanvasLienzo(lesson: GuidedLesson): GuidedCanvasRow[] {
  if (lesson.canvasLienzo?.length) return lesson.canvasLienzo
  if (lesson.introducesConcept) return fallbackRowsForConcept(lesson.introducesConcept)
  return []
}
