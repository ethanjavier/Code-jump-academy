import type { GuidedCanvasRow, GuidedConceptKey } from './guidedLessonTypes'

const L = (es: string, en: string) => ({ es, en })

/** Block-canvas rows linking Crear variable + Repetir to palette-code lessons. */
export function buildJsBeginnerBlockBridgeCanvas(pasos: number): GuidedCanvasRow[] {
  const count = L(String(pasos), String(pasos))
  return [
    [
      {
        kind: 'caption',
        text: L(
          'En bloques: **Crear variable** guarda el número; **Repetir** lo usa varias veces (como el `for` en código).',
          'In blocks: **Create variable** stores the number; **Repeat** uses it several times (like `for` in code).',
        ),
      },
    ],
    [
      { kind: 'varDecl', name: L('pasos', 'steps'), value: pasos },
      { kind: 'arrowHint' },
      { kind: 'terminal', line: count },
    ],
    [
      {
        kind: 'repeat',
        count,
        inner: [
          { kind: 'drawBox', color: 'green' },
          { kind: 'drawBox', color: 'blue' },
          { kind: 'skip' },
        ],
      },
    ],
  ]
}

/** Concepts every JS beginner palette lesson must use in the draft. */
export const JS_BEGINNER_PALETTE_REQUIRED_CONCEPTS: readonly GuidedConceptKey[] = [
  'variable',
  'repeat_loop',
]
