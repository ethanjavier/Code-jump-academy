import type { LearningLanguageId } from '../app/learningTracks'

import type {
  GuidedConceptKey,
  GuidedLesson,
  Localized,
  PaletteCodeCanvasHero,
  PaletteCodeExercise,
  PaletteCodeResultStripe,
} from './guidedLessonTypes'

const L = (es: string, en: string): Localized => ({ es, en })

/** Builds a palette-code intro; extend `lines` when the lesson should offer more snippets (names, keywords, extra lines). */
export function paletteIntroLesson(opts: {
  id: string
  title: Localized
  instruction: Localized
  introducesConcept: GuidedConceptKey
  lines: Array<{ id: string; snippet: Localized; explain: Localized }>
  wrongHint: Localized
  goalSummary: Localized
  /** Visual stripes for canvas + modal (same order as lines). */
  previewStripes: PaletteCodeResultStripe[]
  /** Large focal word on beginner canvas. */
  canvasHero?: PaletteCodeCanvasHero
}): GuidedLesson {
  const palette = [
    ...opts.lines.map((line) => ({
      id: line.id,
      insertText: line.snippet,
      hint: line.explain,
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
  }
  return {
    id: opts.id,
    title: opts.title,
    instruction: opts.instruction,
    introducesConcept: opts.introducesConcept,
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
          'Arma el mini programa **solo con la paleta**: cada tarjeta inserta código en el cursor. No escribas letras con el teclado (solo borrar o mover el cursor). Encadena **salida → condición → bucle** como tres líneas separadas con **Nueva línea** entre ellas.\n\nEn el **lienzo** aparecerá una imagen al completar el programa; el **modal** te muestra el flujo completo con colores.',
          'Build the tiny program **from the palette only**: each card inserts code at the cursor (only delete or move the caret). Chain **output → condition → loop** as three lines separated with **New line** between them.\n\nThe **canvas** unlocks a picture when your program is correct; the **modal** shows the full color flow.',
        ),
        introducesConcept: 'console',
        goalSummary: L(
          'Objetivo: tres líneas — console, luego if, luego for',
          'Goal: three lines — console, then if, then for',
        ),
        previewStripes: [
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
            id: 'c',
            snippet: L('console.log("Hola");', 'console.log("Hi");'),
            explain: L(
              'Manda texto a la **consola** del navegador.',
              'Sends text to the browser **console**.',
            ),
          },
          {
            id: 'i',
            snippet: L('if (ok) { ... }', 'if (ok) { ... }'),
            explain: L(
              'El **if** decide si entra un bloque.',
              '**if** decides whether a block runs.',
            ),
          },
          {
            id: 'f',
            snippet: L('for (let i = 0; ...)', 'for (let i = 0; ...)'),
            explain: L(
              'El **for** repite un trozo varias veces.',
              'A **for** repeats a chunk several times.',
            ),
          },
        ],
        wrongHint: L(
          'Orden de líneas: primero console.log, luego if, luego for — usa “Nueva línea” entre líneas.',
          'Line order: console.log first, then if, then for — use “New line” between lines.',
        ),
      })

    case 'typescript':
      return paletteIntroLesson({
        id: 'stripe-intro-ts',
        title: L('Bandera del flujo (TypeScript)', 'Flow flag (TypeScript)'),
        instruction: L(
          'Construye las tres líneas **solo desde la paleta**: tipo → if → for. Entre líneas usa la tarjeta **Nueva línea**. Al acertar, el **lienzo** muestra tu imagen de celebración y el **modal** el flujo con franjas.',
          'Build the three lines **from the palette only**: type → if → for. Between lines use the **New line** card. When correct, the **canvas** shows your celebration art and the **modal** the striped flow.',
        ),
        introducesConcept: 'console',
        goalSummary: L(
          'Objetivo: const tipado → if → for',
          'Goal: typed const → if → for',
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
            snippet: L('const n: number = 3', 'const n: number = 3'),
            explain: L(
              'Anotas el **tipo** del valor.',
              'You annotate the value **type**.',
            ),
          },
          {
            id: 'b',
            snippet: L('if (n > 0) { ... }', 'if (n > 0) { ... }'),
            explain: L(
              'La condición **if** usa ese dato.',
              'The **if** condition uses that data.',
            ),
          },
          {
            id: 'l',
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
          'Monta el programa **solo con la paleta**: print → asignación → if. Entre líneas inserta **Nueva línea**. Al completar, el **lienzo** desbloquea la imagen y el **modal** el resumen a color.',
          'Assemble the program **from the palette only**: print → assignment → if. Insert **New line** between lines. When done, the **canvas** unlocks the picture and the **modal** the color summary.',
        ),
        introducesConcept: 'console',
        goalSummary: L(
          'Objetivo: print → pasos = … → if',
          'Goal: print → steps = … → if',
        ),
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
            snippet: L('print("Hola")', 'print("Hello")'),
            explain: L(
              '`print` muestra valores en la consola.',
              '`print` shows values in the console.',
            ),
          },
          {
            id: 'v',
            snippet: L('pasos = 4', 'steps = 4'),
            explain: L(
              'Guardas un valor en un **nombre**.',
              'You store a value in a **name**.',
            ),
          },
          {
            id: 'd',
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
          'Compón el **SELECT** en tres líneas solo con la paleta: columnas, tabla, filtro. Usa **Nueva línea** después de cada parte. Al acertar, el **lienzo** muestra el embudo visual y el **modal** las franjas.',
          'Compose the **SELECT** in three lines from the palette only: columns, table, filter. Use **New line** after each part. When correct, the **canvas** shows the funnel art and the **modal** the stripes.',
        ),
        introducesConcept: 'console',
        goalSummary: L(
          'Objetivo: SELECT → FROM → WHERE',
          'Goal: SELECT → FROM → WHERE',
        ),
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
          'Construye tres líneas con la paleta: etiqueta, texto visible, regla CSS. **Nueva línea** entre cada una. Al acertar, el **lienzo** muestra las capas animadas y el **modal** las franjas.',
          'Build three lines with the palette: tag, visible text, CSS rule. **New line** between each. When correct, the **canvas** shows the animated layers and the **modal** the stripes.',
        ),
        introducesConcept: 'console',
        goalSummary: L(
          'Objetivo: etiqueta div → texto → color',
          'Goal: div tag → text → color',
        ),
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
          'Escribe el programa de ejemplo **solo con la paleta** (tres líneas + **Nueva línea** entre ellas). El teclado no añade letras; solo puedes borrar o mover el cursor.\n\nAl completar, el **lienzo** celebra el flujo y el **modal** resume tu código con franjas.',
          'Write the sample program **from the palette only** (three lines + **New line** between them). The keyboard won’t insert letters; you can only delete or move the caret.\n\nWhen you finish, the **canvas** celebrates the flow and the **modal** summarizes your code with stripes.',
        ),
        introducesConcept: 'console',
        goalSummary: L(
          'Objetivo: entrada → proceso → salida',
          'Goal: input → process → output',
        ),
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
