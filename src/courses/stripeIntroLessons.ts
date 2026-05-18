import type { LearningLanguageId } from '../app/learningTracks'

import type {
  GuidedCanvasRow,
  GuidedConceptKey,
  GuidedLesson,
  Localized,
  PaletteCodeCanvasHero,
  PaletteCodeExercise,
  PaletteCodePieceRole,
  PaletteCodeResultStripe,
} from './guidedLessonTypes'
import { buildBeginnerBlockBridgeCanvas } from './beginnerBlockBridgeByLanguage'
import { blockAnchoredPaletteGoal, requiredConceptsForLanguage } from './beginnerPaletteBlockGoals'
import { JS_BEGINNER_PALETTE_REQUIRED_CONCEPTS } from './jsBeginnerBlockBridge'

const L = (es: string, en: string): Localized => ({ es, en })

/** Builds a palette-code intro; extend `lines` when the lesson should offer more snippets (names, keywords, extra lines). */
export function paletteIntroLesson(opts: {
  id: string
  title: Localized
  instruction: Localized
  introducesConcept: GuidedConceptKey
  lines: Array<{
    id: string
    snippet: Localized
    explain: Localized
    role?: PaletteCodePieceRole
  }>
  wrongHint: Localized
  goalSummary: Localized
  /** Visual stripes for canvas + modal (same order as lines). */
  previewStripes: PaletteCodeResultStripe[]
  /** Large focal word on beginner canvas. */
  canvasHero?: PaletteCodeCanvasHero
  /** Block-canvas rows (varDecl, Repetir…) shown during the lesson. */
  canvasLienzo?: GuidedCanvasRow[]
  /** Concepts that must appear in the draft before the solution is accepted. */
  requiredConcepts?: GuidedConceptKey[]
}): GuidedLesson {
  const palette = [
    ...opts.lines.map((line) => ({
      id: line.id,
      insertText: line.snippet,
      hint: line.explain,
      ...(line.role ? { role: line.role } : {}),
    })),
    {
      id: 'nl',
      insertText: L('\n', '\n'),
      hint: L('Nueva línea', 'New line'),
    },
  ]
  const correctEs = opts.lines.map((l) => l.snippet.es).join('\n')
  const correctEn = opts.lines.map((l) => l.snippet.en).join('\n')
  const exercise: PaletteCodeExercise = {
    type: 'paletteCode',
    palette,
    correctText: L(correctEs, correctEn),
    wrongHint: opts.wrongHint,
    goalSummary: opts.goalSummary,
    resultPreview: opts.previewStripes,
    ...(opts.canvasHero ? { canvasHero: opts.canvasHero } : {}),
    ...(opts.requiredConcepts?.length ? { requiredConcepts: [...opts.requiredConcepts] } : {}),
  }
  return {
    id: opts.id,
    title: opts.title,
    instruction: opts.instruction,
    introducesConcept: opts.introducesConcept,
    ...(opts.canvasLienzo?.length ? { canvasLienzo: opts.canvasLienzo } : {}),
    exercise,
  }
}

/** Intro lesson tailored to each track — build the sample program only from palette snippets. */
export function introStripeLesson(languageId: LearningLanguageId): GuidedLesson {
  switch (languageId) {
    case 'javascript':
      return paletteIntroLesson({
        id: 'stripe-intro-js',
        title: L('Bandera del flujo (JavaScript)', 'Flow flag (JavaScript)'),
        instruction: L(
          'Arma el mini programa **solo con la paleta**: cada tarjeta inserta código en el cursor. No escribas letras con el teclado (solo borrar o mover el cursor). Sigue el flujo del **lienzo de bloques**: **Crear variable** → **salida** → **condición** → **Repetir**. Usa **Nueva línea** entre líneas.\n\n**Obligatorio:** tu programa debe incluir al menos un **Crear variable** (`const`) y un **Repetir** (`for`). El panel **Objetivo** resume el mismo flujo (sin copiar código de memoria).\n\nEn lecciones siguientes irás **sumando más variables** enlazadas. Al acertar, el **lienzo** celebra y el **modal** muestra el flujo con colores.',
          'Build the tiny program **from the palette only**: each card inserts code at the cursor (only delete or move the caret). Follow the **block canvas** flow: **Create variable** → **output** → **condition** → **Repeat**. Use **New line** between lines.\n\n**Required:** your program must include at least one **Create variable** (`const`) and one **Repeat** (`for`). The **Goal** panel shows the same flow (no need to memorize code).\n\nLater lessons will **add more linked variables**. When correct, the **canvas** celebrates and the **modal** shows the color flow.',
        ),
        introducesConcept: 'variable',
        requiredConcepts: [...JS_BEGINNER_PALETTE_REQUIRED_CONCEPTS],
        canvasLienzo: buildBeginnerBlockBridgeCanvas('javascript', 3),
        goalSummary: blockAnchoredPaletteGoal('javascript'),
        previewStripes: [
          { swatch: 'violet', caption: L('Variable const', 'const variable') },
          { swatch: 'emerald', caption: L('Salida console', 'Console out') },
          { swatch: 'amber', caption: L('Condición if', 'if branch') },
          { swatch: 'sky', caption: L('Bucle for', 'for loop') },
        ],
        canvasHero: {
          mode: 'greeting',
          headline: L('Hola', 'Hi'),
          highlightWhenFirstLineMatches: true,
        },
        lines: [
          {
            id: 'v',
            role: 'variable',
            snippet: L('const saludo = "Hola";', 'const saludo = "Hi";'),
            explain: L(
              'Primera línea: **Crear variable** — guardas el saludo con `const`.',
              'First line: **Create variable** — store the greeting with `const`.',
            ),
          },
          {
            id: 'c',
            role: 'console',
            snippet: L('console.log(saludo);', 'console.log(saludo);'),
            explain: L(
              'Segunda línea: manda **saludo** a la consola del navegador.',
              'Second line: send **saludo** to the browser console.',
            ),
          },
          {
            id: 'i',
            role: 'if_branch',
            snippet: L('if (ok) { ... }', 'if (ok) { ... }'),
            explain: L(
              'Tercera línea: el **if** decide si entra un bloque.',
              'Third line: **if** decides whether a block runs.',
            ),
          },
          {
            id: 'f',
            role: 'repeat_loop',
            snippet: L('for (let i = 0; ...)', 'for (let i = 0; ...)'),
            explain: L(
              'Cuarta línea: **Repetir** en código — el `for` repite un trozo.',
              'Fourth line: **Repeat** in code — the `for` runs a chunk several times.',
            ),
          },
        ],
        wrongHint: L(
          'Orden: const saludo, console.log(saludo), if, for — usa “Nueva línea” entre líneas.',
          'Order: const saludo, console.log(saludo), if, for — use “New line” between lines.',
        ),
      })

    case 'typescript':
      return paletteIntroLesson({
        id: 'stripe-intro-ts',
        title: L('Bandera del flujo (TypeScript)', 'Flow flag (TypeScript)'),
        instruction: L(
          'Construye el programa **solo desde la paleta**. Sigue el **lienzo de bloques** y el panel **Objetivo**: **Crear variable** (con tipo) → **condición** → **Repetir**. Entre líneas usa **Nueva línea**.\n\n**Obligatorio:** al menos una línea **Crear variable** y un **Repetir** (`for`).',
          'Build the program **from the palette only**. Follow the **block canvas** and **Goal** panel: **Create variable** (with type) → **condition** → **Repeat**. Use **New line** between lines.\n\n**Required:** at least one **Create variable** line and a **Repeat** (`for`).',
        ),
        introducesConcept: 'variable',
        requiredConcepts: [...requiredConceptsForLanguage('typescript')],
        canvasLienzo: buildBeginnerBlockBridgeCanvas('typescript', 3),
        goalSummary: blockAnchoredPaletteGoal('typescript'),
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
            snippet: L('const n: number = 3', 'const n: number = 3'),
            explain: L(
              'Anotas el **tipo** del valor.',
              'You annotate the value **type**.',
            ),
          },
          {
            id: 'b',
            role: 'if_branch',
            snippet: L('if (n > 0) { ... }', 'if (n > 0) { ... }'),
            explain: L(
              'La condición **if** usa ese dato.',
              'The **if** condition uses that data.',
            ),
          },
          {
            id: 'l',
            role: 'repeat_loop',
            snippet: L('for (let i = 0; i < n; i++)', 'for (let i = 0; i < n; i++)'),
            explain: L(
              'El **for** repite con el mismo límite.',
              'The **for** repeats with the same bound.',
            ),
          },
        ],
        wrongHint: L(
          'Orden: declaración tipada, luego if, luego for — separa líneas con Nueva línea.',
          'Order: typed declaration, then if, then for — separate lines with New line.',
        ),
      })

    case 'python':
      return paletteIntroLesson({
        id: 'stripe-intro-py',
        title: L('Bandera del flujo (Python)', 'Flow flag (Python)'),
        instruction: L(
          'Monta el programa **solo con la paleta**. Sigue el **lienzo de bloques** y el panel **Objetivo**: **mostrar** (`print`) → **guardar un nombre** (variable) → **decidir** (`if`). Usa **Nueva línea** entre líneas.\n\n**Obligatorio:** una asignación (variable) y un **if** en tu programa.',
          'Assemble the program **from the palette only**. Follow the **block canvas** and **Goal** panel: **show** (`print`) → **store a name** (variable) → **decide** (`if`). Use **New line** between lines.\n\n**Required:** an assignment (variable) and an **if** in your program.',
        ),
        introducesConcept: 'console',
        requiredConcepts: [...requiredConceptsForLanguage('python')],
        canvasLienzo: buildBeginnerBlockBridgeCanvas('python', 4),
        goalSummary: blockAnchoredPaletteGoal('python'),
        previewStripes: [
          { swatch: 'emerald', caption: L('print', 'print') },
          { swatch: 'lime', caption: L('Variable', 'Variable') },
          { swatch: 'orange', caption: L('if', 'if') },
        ],
        canvasHero: {
          mode: 'greeting',
          headline: L('Hola', 'Hello'),
          highlightWhenFirstLineMatches: true,
        },
        lines: [
          {
            id: 'p',
            role: 'console',
            snippet: L('print("Hola")', 'print("Hello")'),
            explain: L(
              '`print` muestra valores en la consola.',
              '`print` shows values in the console.',
            ),
          },
          {
            id: 'v',
            role: 'variable',
            snippet: L('pasos = 4', 'steps = 4'),
            explain: L(
              'Guardas un valor en un **nombre**.',
              'You store a value in a **name**.',
            ),
          },
          {
            id: 'd',
            role: 'if_branch',
            snippet: L('if pasos > 0:', 'if steps > 0:'),
            explain: L(
              'El **if** usa esa variable en la condición.',
              '**if** uses that variable in the condition.',
            ),
          },
        ],
        wrongHint: L(
          'Orden: print, luego asignación, luego if — cada uno en su línea.',
          'Order: print, then assignment, then if — each on its own line.',
        ),
      })

    case 'sql':
      return paletteIntroLesson({
        id: 'stripe-intro-sql',
        title: L('Bandera de una consulta SQL', 'SQL query flag'),
        instruction: L(
          'Compón la consulta **solo con la paleta**. Sigue el **lienzo** y el panel **Objetivo**: **qué columnas** → **de qué tabla** → **qué filas**. Usa **Nueva línea** después de cada parte.',
          'Compose the query **from the palette only**. Follow the **canvas** and **Goal** panel: **which columns** → **which table** → **which rows**. Use **New line** after each part.',
        ),
        introducesConcept: 'console',
        canvasLienzo: buildBeginnerBlockBridgeCanvas('sql'),
        goalSummary: blockAnchoredPaletteGoal('sql'),
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
            explain: L(
              'Qué **columnas** traes.',
              'Which **columns** you fetch.',
            ),
          },
          {
            id: 'r',
            snippet: L('FROM personas', 'FROM people'),
            explain: L(
              'De qué **tabla** vienen las filas.',
              'Which **table** rows come from.',
            ),
          },
          {
            id: 'w',
            snippet: L('WHERE edad > 18', 'WHERE age > 18'),
            explain: L(
              'Qué **filas** pasan el filtro.',
              'Which **rows** pass the filter.',
            ),
          },
        ],
        wrongHint: L(
          'Orden SQL típico: SELECT, FROM, WHERE — tres líneas.',
          'Typical SQL order: SELECT, FROM, WHERE — three lines.',
        ),
      })

    case 'html_css':
      return paletteIntroLesson({
        id: 'stripe-intro-html',
        title: L('Bandera de capas HTML/CSS', 'HTML/CSS layer flag'),
        instruction: L(
          'Construye el fragmento **solo con la paleta**. Sigue el **lienzo** y el panel **Objetivo**: **etiqueta** → **texto visible** → **color** (CSS). **Nueva línea** entre cada parte.',
          'Build the snippet **from the palette only**. Follow the **canvas** and **Goal** panel: **tag** → **visible text** → **color** (CSS). **New line** between each part.',
        ),
        introducesConcept: 'console',
        canvasLienzo: buildBeginnerBlockBridgeCanvas('html_css'),
        goalSummary: blockAnchoredPaletteGoal('html_css'),
        previewStripes: [
          { swatch: 'slate', caption: L('HTML', 'HTML') },
          { swatch: 'amber', caption: L('Texto', 'Text') },
          { swatch: 'fuchsia', caption: L('CSS color', 'CSS color') },
        ],
        canvasHero: {
          mode: 'htmlLayers',
          headline: L('Hola', 'Hello'),
          highlightWhenFirstLineMatches: true,
        },
        lines: [
          {
            id: 'h',
            snippet: L('<div>', '<div>'),
            explain: L(
              'Contenedor de bloque.',
              'Block container.',
            ),
          },
          {
            id: 'x',
            snippet: L('Hola', 'Hello'),
            explain: L(
              'Texto que ve el usuario.',
              'Text the user reads.',
            ),
          },
          {
            id: 'c',
            snippet: L('color: red;', 'color: red;'),
            explain: L(
              'Regla **color** para el texto.',
              '**color** rule for the text.',
            ),
          },
        ],
        wrongHint: L(
          'Orden: etiqueta, contenido, estilo — cada uno en línea.',
          'Order: tag, content, style — one per line.',
        ),
      })

    default:
      return paletteIntroLesson({
        id: `stripe-intro-${languageId}`,
        title: L('Bandera lógica del programa', 'Program logic flag'),
        instruction: L(
          'Escribe el programa de ejemplo **solo con la paleta**. Sigue el **lienzo de bloques** y el panel **Objetivo** (tres pasos + **Nueva línea** entre líneas). El teclado no añade letras; solo puedes borrar o mover el cursor.\n\nAl completar, el **lienzo** celebra el flujo y el **modal** resume tu código con franjas.',
          'Write the sample program **from the palette only**. Follow the **block canvas** and **Goal** panel (three steps + **New line** between lines). The keyboard won’t insert letters; you can only delete or move the caret.\n\nWhen you finish, the **canvas** celebrates the flow and the **modal** summarizes your code with stripes.',
        ),
        introducesConcept: 'console',
        canvasLienzo: buildBeginnerBlockBridgeCanvas(languageId),
        goalSummary: blockAnchoredPaletteGoal(languageId),
        previewStripes: [
          { swatch: 'emerald', caption: L('Entrada', 'Input') },
          { swatch: 'amber', caption: L('Proceso', 'Process') },
          { swatch: 'sky', caption: L('Salida', 'Output') },
        ],
        canvasHero: {
          mode: 'pipeline',
          headline: L('Flujo', 'Flow'),
          highlightWhenFirstLineMatches: false,
        },
        lines: [
          {
            id: 'a',
            snippet: L('(declarar datos)', '(declare data)'),
            explain: L(
              'Preparas nombres o valores.',
              'You prepare names or values.',
            ),
          },
          {
            id: 'b',
            snippet: L('(calcular / decidir)', '(calculate / decide)'),
            explain: L(
              'Aquí va la lógica.',
              'Where logic runs.',
            ),
          },
          {
            id: 'c',
            snippet: L('(mostrar resultado)', '(show result)'),
            explain: L(
              'Muestras el resultado.',
              'You show the result.',
            ),
          },
        ],
        wrongHint: L(
          'Orden típico: preparar → trabajar → mostrar.',
          'Typical order: prepare → work → show.',
        ),
      })
  }
}
