import type { LearningLanguageId } from '../app/learningTracks'
import type { GuidedConceptKey, Localized } from './guidedLessonTypes'

const L = (es: string, en: string): Localized => ({ es, en })

/** Objetivo en lenguaje de bloques (sin código de ejemplo). */
export function blockAnchoredPaletteGoal(languageId: LearningLanguageId): Localized {
  switch (languageId) {
    case 'javascript':
      return L(
        'Como en bloques: **Crear variable** → **salida** (`console`) → **condición** (`if`) → **Repetir** (`for`). Ordena las tarjetas de la paleta.',
        'Like blocks: **Create variable** → **output** (`console`) → **condition** (`if`) → **Repeat** (`for`). Order the palette cards.',
      )
    case 'typescript':
      return L(
        'Como en bloques: **Crear variable** (con tipo) → **condición** → **Repetir**. Ordena las tarjetas de la paleta.',
        'Like blocks: **Create variable** (with type) → **condition** → **Repeat**. Order the palette cards.',
      )
    case 'python':
      return L(
        'Como en bloques: **mostrar** (`print`) → **guardar un nombre** (variable) → **decidir** (`if`). Ordena las tarjetas de la paleta.',
        'Like blocks: **show** (`print`) → **store a name** (variable) → **decide** (`if`). Order the palette cards.',
      )
    case 'sql':
      return L(
        'Como un embudo: **qué columnas** (SELECT) → **de qué tabla** (FROM) → **qué filas** (WHERE). Ordena las tarjetas.',
        'Like a funnel: **which columns** (SELECT) → **which table** (FROM) → **which rows** (WHERE). Order the cards.',
      )
    case 'html_css':
      return L(
        'Como capas: **etiqueta** → **texto visible** → **color** (CSS). Ordena las tarjetas de la paleta.',
        'Like layers: **tag** → **visible text** → **color** (CSS). Order the palette cards.',
      )
    default:
      return L(
        'Como en bloques: **preparar datos** → **procesar / decidir** → **mostrar resultado**. Ordena las tarjetas de la paleta.',
        'Like blocks: **prepare data** → **process / decide** → **show result**. Order the palette cards.',
      )
  }
}

/** Conceptos obligatorios en el borrador (solo donde aplica sintaxis). */
export function requiredConceptsForLanguage(languageId: LearningLanguageId): GuidedConceptKey[] {
  switch (languageId) {
    case 'javascript':
    case 'typescript':
      return ['variable', 'repeat_loop']
    case 'python':
      return ['variable', 'if_branch']
    default:
      return []
  }
}
