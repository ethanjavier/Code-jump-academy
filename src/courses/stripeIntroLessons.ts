import type { LearningLanguageId } from '../app/learningTracks'

import type { GuidedLesson } from './guidedLessonTypes'

const L = (es: string, en: string) => ({ es, en })

/** Intro “logic flag” lesson tailored to each track — replaces plain multiple-choice intros. */
export function introStripeLesson(languageId: LearningLanguageId): GuidedLesson {
  switch (languageId) {
    case 'javascript':
      return {
        id: 'stripe-intro-js',
        title: L('Bandera del flujo (JavaScript)', 'Flow flag (JavaScript)'),
        instruction: L(
          'Tres franjas = tres momentos de un mini programa. Ordena **de arriba abajo** como se ejecutarían: primero preparas salida, luego decides, luego repites.\n\nEn el panel derecho cada franja explica **para qué sirve** esa pieza.',
          'Three stripes = three moments in a tiny program. Order **top to bottom** as they would run: prepare output, then decide, then repeat.\n\nThe right panel explains **what each stripe is for**.',
        ),
        introducesConcept: 'console',
        exercise: {
          type: 'stripeChallenge',
          flagTitle: L('Objetivo: flujo console → if → for', 'Goal: console → if → for flow'),
          pieces: [
            {
              id: 'c',
              label: L('Salida', 'Output'),
              snippet: L('console.log("Hola");', 'console.log("Hi");'),
              roleExplanation: L(
                'Manda texto a la **consola** del navegador: es tu primera “pincelada” visible.',
                'Sends text to the browser **console** — your first visible “brush stroke”.',
              ),
              swatch: 'emerald',
            },
            {
              id: 'i',
              label: L('Decisión', 'Decision'),
              snippet: L('if (ok) { ... }', 'if (ok) { ... }'),
              roleExplanation: L(
                'El **if** elige si entras a un bloque o no; condiciona qué líneas se ejecutan.',
                '**if** chooses whether a block runs; it gates which lines execute.',
              ),
              swatch: 'amber',
            },
            {
              id: 'f',
              label: L('Repetición', 'Loop'),
              snippet: L('for (let i = 0; ...)', 'for (let i = 0; ...)'),
              roleExplanation: L(
                'El **for** repite un trozo varias veces sin copiar y pegar código.',
                'A **for** repeats a chunk several times without copy-pasting code.',
              ),
              swatch: 'sky',
            },
          ],
          correctOrder: [0, 1, 2],
          wrongHint: L(
            'Piensa en el orden real: primero suele haber salida o preparación, luego condiciones, luego bucles.',
            'Think about real order: output/setup often comes first, then conditions, then loops.',
          ),
        },
      }

    case 'typescript':
      return {
        id: 'stripe-intro-ts',
        title: L('Bandera del flujo (TypeScript)', 'Flow flag (TypeScript)'),
        instruction: L(
          'TypeScript añade **tipos** sobre JavaScript. Las tres franjas son: tipar datos → comprobar con if → repetir con for.',
          'TypeScript adds **types** on top of JavaScript. The three stripes: type data → branch with if → repeat with for.',
        ),
        introducesConcept: 'variable',
        exercise: {
          type: 'stripeChallenge',
          flagTitle: L('Objetivo: tipo → rama → bucle', 'Goal: type → branch → loop'),
          pieces: [
            {
              id: 't',
              label: L('Tipo', 'Type'),
              snippet: L('const n: number = 3', 'const n: number = 3'),
              roleExplanation: L(
                'Anotas **qué forma** tiene el valor (`number`, `string`…) antes de usarlo.',
                'You note **what shape** the value has (`number`, `string`…) before using it.',
              ),
              swatch: 'violet',
            },
            {
              id: 'b',
              label: L('Rama if', 'if branch'),
              snippet: L('if (n > 0) { ... }', 'if (n > 0) { ... }'),
              roleExplanation: L(
                'La condición **if** usa esos datos tipados para decidir el camino.',
                'The **if** condition uses typed data to choose the path.',
              ),
              swatch: 'amber',
            },
            {
              id: 'l',
              label: L('Bucle', 'Loop'),
              snippet: L('for (let i = 0; i < n; i++)', 'for (let i = 0; i < n; i++)'),
              roleExplanation: L(
                'El **for** repite usando el mismo conocimiento de tipos y límites.',
                'The **for** loop repeats using the same type information and bounds.',
              ),
              swatch: 'teal',
            },
          ],
          correctOrder: [0, 1, 2],
          wrongHint: L(
            'Primero defines datos con tipo; luego ramificas; luego repites.',
            'First you define typed data; then branch; then repeat.',
          ),
        },
      }

    case 'python':
      return {
        id: 'stripe-intro-py',
        title: L('Bandera del flujo (Python)', 'Flow flag (Python)'),
        instruction: L(
          'En Python el programa baja **línea a línea**. Las franjas: imprimir → asignar variable → decidir con if.',
          'In Python the program runs **line by line**. Stripes: print → assign variable → decide with if.',
        ),
        introducesConcept: 'console',
        exercise: {
          type: 'stripeChallenge',
          flagTitle: L('Objetivo: print → asignación → if', 'Goal: print → assign → if'),
          pieces: [
            {
              id: 'p',
              label: L('Salida print', 'print output'),
              snippet: L('print("Hola")', 'print("Hello")'),
              roleExplanation: L(
                '`print` muestra valores en la **consola**; suele ser lo primero que pruebas.',
                '`print` shows values in the **console** — usually the first thing you try.',
              ),
              swatch: 'emerald',
            },
            {
              id: 'v',
              label: L('Nombre = valor', 'name = value'),
              snippet: L('pasos = 4', 'steps = 4'),
              roleExplanation: L(
                'Guardas un número o texto en un **nombre** para reutilizarlo después.',
                'You store a number or text in a **name** to reuse it later.',
              ),
              swatch: 'lime',
            },
            {
              id: 'd',
              label: L('Decisión if', 'if decision'),
              snippet: L('if pasos > 0:', 'if steps > 0:'),
              roleExplanation: L(
                'El **if** sigue a tener datos: usa la variable en la condición.',
                '**if** comes after you have data: use the variable in the condition.',
              ),
              swatch: 'orange',
            },
          ],
          correctOrder: [0, 1, 2],
          wrongHint: L(
            'Orden típico: ver algo con print, guardar datos con =, luego decidir con if.',
            'Typical order: see something with print, store data with =, then decide with if.',
          ),
        },
      }

    case 'sql':
      return {
        id: 'stripe-intro-sql',
        title: L('Bandera de una consulta SQL', 'SQL query flag'),
        instruction: L(
          'Un SELECT tiene **capas**: qué columnas leer, de dónde, y qué filas quedarse. Ordena las franjas como en una receta.',
          'A SELECT has **layers**: which columns, from where, and which rows to keep. Order the stripes like a recipe.',
        ),
        introducesConcept: 'console',
        exercise: {
          type: 'stripeChallenge',
          flagTitle: L('Objetivo: SELECT → FROM → WHERE', 'Goal: SELECT → FROM → WHERE'),
          pieces: [
            {
              id: 's',
              label: L('SELECT columnas', 'SELECT columns'),
              snippet: L('SELECT nombre, edad', 'SELECT name, age'),
              roleExplanation: L(
                'Elige **qué campos** quieres ver en el resultado.',
                'Choose **which fields** you want in the result.',
              ),
              swatch: 'sky',
            },
            {
              id: 'r',
              label: L('FROM tabla', 'FROM table'),
              snippet: L('FROM personas', 'FROM people'),
              roleExplanation: L(
                'Indica **de qué tabla** vienen las filas.',
                'Names **which table** rows come from.',
              ),
              swatch: 'indigo',
            },
            {
              id: 'w',
              label: L('WHERE filtro', 'WHERE filter'),
              snippet: L('WHERE edad > 18', 'WHERE age > 18'),
              roleExplanation: L(
                'Filtra **qué filas** pasan al resultado.',
                'Filters **which rows** appear in the result.',
              ),
              swatch: 'rose',
            },
          ],
          correctOrder: [0, 1, 2],
          wrongHint: L(
            'Recuerda: primero qué traes, luego de dónde, luego condiciones.',
            'Remember: what to fetch, then from where, then conditions.',
          ),
        },
      }

    case 'html_css':
      return {
        id: 'stripe-intro-html',
        title: L('Bandera de capas HTML/CSS', 'HTML/CSS layer flag'),
        instruction: L(
          'Una página se construye en **capas**: estructura HTML, luego estilo. Aquí tres pasos de una franja simple.',
          'A page is built in **layers**: HTML structure, then style. Here are three steps for a simple stripe.',
        ),
        introducesConcept: 'console',
        exercise: {
          type: 'stripeChallenge',
          flagTitle: L('Objetivo: etiqueta → texto → color', 'Goal: tag → text → color'),
          pieces: [
            {
              id: 'h',
              label: L('Contenedor', 'Container'),
              snippet: L('<div>', '<div>'),
              roleExplanation: L(
                'El **div** agrupa bloques para poder maquetarlos y pintarlos.',
                'A **div** groups blocks so you can lay them out and paint them.',
              ),
              swatch: 'slate',
            },
            {
              id: 'x',
              label: L('Texto', 'Text'),
              snippet: L('Hola', 'Hello'),
              roleExplanation: L(
                'El contenido visible que el usuario lee dentro del contenedor.',
                'Visible content the user reads inside the container.',
              ),
              swatch: 'amber',
            },
            {
              id: 'c',
              label: L('Color CSS', 'CSS color'),
              snippet: L('color: red;', 'color: red;'),
              roleExplanation: L(
                'La regla **color** cambia el tono del texto en ese bloque.',
                'The **color** rule changes the text tone in that block.',
              ),
              swatch: 'fuchsia',
            },
          ],
          correctOrder: [0, 1, 2],
          wrongHint: L(
            'Primero estructura, luego contenido, luego estilo.',
            'Structure first, then content, then style.',
          ),
        },
      }

    default:
      return {
        id: `stripe-intro-${languageId}`,
        title: L('Bandera lógica del programa', 'Program logic flag'),
        instruction: L(
          'Cada franja es un **paso** del programa en este lenguaje. Ordénalos como se ejecutarían de arriba abajo.\n\nA la derecha verás **qué hace** cada pieza.',
          'Each stripe is one **step** in this language’s program. Order them as they would run top to bottom.\n\nOn the right you’ll see **what each piece does**.',
        ),
        introducesConcept: 'console',
        exercise: {
          type: 'stripeChallenge',
          flagTitle: L('Objetivo: entrada → proceso → salida', 'Goal: input → process → output'),
          pieces: [
            {
              id: 'a',
              label: L('Entrada / setup', 'Input / setup'),
              snippet: L('(declarar datos)', '(declare data)'),
              roleExplanation: L(
                'Preparas nombres, valores o recursos que el resto del código usará.',
                'You prepare names, values, or resources the rest of the code will use.',
              ),
              swatch: 'emerald',
            },
            {
              id: 'b',
              label: L('Proceso', 'Process'),
              snippet: L('(calcular / decidir)', '(calculate / decide)'),
              roleExplanation: L(
                'Aquí ocurre la lógica: condiciones, bucles, llamadas a funciones.',
                'Where logic happens: conditions, loops, function calls.',
              ),
              swatch: 'amber',
            },
            {
              id: 'c',
              label: L('Salida', 'Output'),
              snippet: L('(mostrar resultado)', '(show result)'),
              roleExplanation: L(
                'Muestras el resultado al usuario o a otro sistema.',
                'You show the result to the user or another system.',
              ),
              swatch: 'sky',
            },
          ],
          correctOrder: [0, 1, 2],
          wrongHint: L(
            'Orden típico: preparar → trabajar → mostrar.',
            'Typical order: prepare → work → show.',
          ),
        },
      }
  }
}
