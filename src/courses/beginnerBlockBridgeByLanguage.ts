import type { LearningLanguageId } from '../app/learningTracks'
import type { GuidedCanvasRow } from './guidedLessonTypes'
import { buildJsBeginnerBlockBridgeCanvas } from './jsBeginnerBlockBridge'

const L = (es: string, en: string) => ({ es, en })

/** Mini-lienzo de bloques alineado con la lección de paleta de cada idioma. */
export function buildBeginnerBlockBridgeCanvas(
  languageId: LearningLanguageId,
  pasos = 3,
): GuidedCanvasRow[] {
  switch (languageId) {
    case 'javascript':
    case 'typescript':
      return buildJsBeginnerBlockBridgeCanvas(pasos)
    case 'python':
      return [
        [
          {
            kind: 'caption',
            text: L(
              'En bloques: primero **mostrar**, luego **guardar un nombre** (variable), luego **decidir** con **if**.',
              'In blocks: first **show**, then **store a name** (variable), then **decide** with **if**.',
            ),
          },
        ],
        [
          { kind: 'varDecl', name: L('pasos', 'steps'), value: pasos },
          { kind: 'arrowHint' },
          { kind: 'terminal', line: L(String(pasos), String(pasos)) },
        ],
      ]
    case 'sql':
      return [
        [
          {
            kind: 'caption',
            text: L(
              'Como un río de datos: **SELECT** (qué traes) → **FROM** (de dónde) → **WHERE** (filtro).',
              'Like a data river: **SELECT** (what) → **FROM** (where) → **WHERE** (filter).',
            ),
          },
        ],
        [
          { kind: 'caption', text: L('↓ columnas', '↓ columns') },
          { kind: 'caption', text: L('↓ tabla', '↓ table') },
          { kind: 'caption', text: L('↓ filas', '↓ rows') },
        ],
      ]
    case 'html_css':
      return [
        [
          {
            kind: 'caption',
            text: L(
              'Como capas apiladas: **etiqueta** → **texto** → **color** en CSS.',
              'Like stacked layers: **tag** → **text** → **CSS color**.',
            ),
          },
        ],
        [
          { kind: 'caption', text: L('<div> contenedor', '<div> container') },
          { kind: 'caption', text: L('texto visible', 'visible text') },
          { kind: 'caption', text: L('color: …', 'color: …') },
        ],
      ]
    default:
      return [
        [
          {
            kind: 'caption',
            text: L(
              'En bloques: **preparar** → **procesar** → **mostrar** — tres pasos en orden.',
              'In blocks: **prepare** → **process** → **show** — three steps in order.',
            ),
          },
        ],
        [
          { kind: 'varDecl', name: L('pasos', 'steps'), value: pasos },
          { kind: 'arrowHint' },
          { kind: 'terminal', line: L('…', '…') },
        ],
        [
          {
            kind: 'repeat',
            count: L(String(pasos), String(pasos)),
            inner: [{ kind: 'drawBox', color: 'green' }],
          },
        ],
      ]
  }
}
