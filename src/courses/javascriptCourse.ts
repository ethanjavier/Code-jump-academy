import type { GuidedCourse } from './guidedLessonTypes'

const L = (es: string, en: string) => ({ es, en })

export const JAVASCRIPT_GUIDED_COURSE: GuidedCourse = {
  languageId: 'javascript',
  lessons: [
    {
      id: 'js-01-console',
      title: {
        es: 'Tu primera salida',
        en: 'Your first output',
      },
      instruction: {
        es:
          'Lee con calma. Aquí editas **código real**: el programa corre línea por línea de arriba abajo, igual que en el lienzo de bloques.\n\nObjetivo: pulsa **Ejecutar** y haz que la salida incluya la palabra que pide el ejercicio; luego **Comprobar salida**.',
        en:
          'Read slowly. Here you edit **real code**: it runs line by line top to bottom, like the block canvas.\n\nGoal: press **Run**, make the output include the word asked for, then **Check output**.',
      },
      introducesConcept: 'console',
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Mostrar un mensaje que el usuario pueda leer',
              'Show a message the user can read',
            ),
            detail: L(
              'Objetivo real: texto visible — como el rótulo de un proyecto o el título de una pantalla.',
              'Real goal: visible text — like a project banner or a screen title.',
            ),
            preview: { type: 'stripes', colors: ['green'] },
          },
        ],
        [{ kind: 'caption', text: L('Salida de texto (consola del navegador)', 'Text output (browser console)') }],
        [{ kind: 'terminal', line: L('Hola', 'Hello') }],
      ],
      exercise: {
        type: 'runCode',
        runtime: 'javascript',
        starter: {
          es: '// Escribe aquí una línea que muestre Hola usando console.log\n\n',
          en: '// Write a console.log line that prints Hello\n\n',
        },
        expectOutputIncludes: {
          es: ['Hola'],
          en: ['Hello'],
        },
        wrongHint: {
          es: 'Ejemplo: console.log("Hola"). Ejecuta y revisa la caja de salida antes de comprobar.',
          en: 'Example: console.log("Hello"). Run and read the output panel before checking.',
        },
      },
    },
    {
      id: 'js-02-variable',
      title: {
        es: 'Guardar un valor',
        en: 'Saving a value',
      },
      instruction: {
        es:
          'Igual que **Crear variable** en bloques, en JavaScript guardas un número o texto en un nombre con `let` o `const`. Luego puedes usar ese nombre en la siguiente línea.',
        en:
          'Just like **Create variable** on the canvas, in JavaScript you store a number or text in a name with `let` or `const`. Then you use that name on the next lines.',
      },
      introducesConcept: 'variable',
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Usar un mismo número para varias vueltas de pintura',
              'Use one number for several painting rounds',
            ),
            detail: L(
              'Como decidir cuántas franjas tendrá tu bandera antes de pintar cada una.',
              'Like deciding how many stripes your flag will have before painting each one.',
            ),
            preview: { type: 'stripes', colors: ['green', 'yellow', 'red'] },
          },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'Primero defines el nombre; luego lo lees — como Crear variable arriba del Repetir:',
              'Define the name first; then read it — like Create variable above Repeat:',
            ),
          },
        ],
        [
          { kind: 'varDecl', name: L('pasos', 'steps'), value: 4 },
          { kind: 'arrowHint' },
          { kind: 'terminal', line: L('4', '4') },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'En el lienzo de bloques combinas pintar, huecos, saltos de fila y repeticiones:',
              'On the block canvas you combine painting, gaps, line breaks, and repeats:',
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
            count: L('pasos', 'steps'),
            inner: [{ kind: 'drawBox', color: 'green' }, { kind: 'skip' }],
          },
        ],
      ],
      exercise: {
        type: 'orderLines',
        lines: [
          { es: 'console.log(pasos);', en: 'console.log(steps);' },
          { es: 'const pasos = 4;', en: 'const steps = 4;' },
        ],
        correctOrder: [1, 0],
      },
    },
    {
      id: 'js-03-if',
      title: {
        es: 'Decidir con if',
        en: 'Choosing with if',
      },
      instruction: {
        es:
          'A veces solo quieres ejecutar código **si** se cumple algo. El orden importa: primero decides, luego actúas.',
        en:
          'Sometimes you only run code **if** something is true. Order matters: decide first, then act.',
      },
      introducesConcept: 'if_branch',
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Elegir qué mensaje mostrar según la situación',
              'Choose which message to show depending on the situation',
            ),
            detail: L(
              'Dos resultados posibles — como dos banderas distintas según el resultado del puzzle.',
              'Two possible outcomes — like two different flags depending on the puzzle result.',
            ),
            preview: { type: 'cells', items: ['blue', 'skip', 'orange'] },
          },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'El programa elige un camino — en bloques sería una bifurcación antes de seguir pintando:',
              'The program picks a path — in blocks that is a branch before more painting:',
            ),
          },
        ],
        [
          {
            kind: 'ifSplit',
            cond: L('n > 2', 'n > 2'),
            thenLine: L('console.log("Hola")', 'console.log("Hi")'),
            elseLine: L('console.log("Adios")', 'console.log("Bye")'),
          },
        ],
      ],
      exercise: {
        type: 'pickOne',
        prompt: {
          es:
            'Lee este fragmento (orden de ejecución: arriba → abajo). ¿Qué imprime si `n` es 3?\n\nlet n = 3;\nif (n > 2) {\n  console.log("Hola");\n} else {\n  console.log("Adios");\n}',
          en:
            'Read this snippet (runs top → bottom). What prints if `n` is 3?\n\nlet n = 3;\nif (n > 2) {\n  console.log("Hi");\n} else {\n  console.log("Bye");\n}',
        },
        options: [
          { es: 'Adios', en: 'Bye' },
          { es: 'Hola', en: 'Hi' },
          { es: 'undefined', en: 'undefined' },
          { es: 'Nada', en: 'Nothing' },
        ],
        correctIndex: 1,
        wrongHint: {
          es: 'Si `n > 2` es verdadero, entra en el `if` y ejecuta el `console.log` interior.',
          en: 'If `n > 2` is true, the inner `console.log` runs.',
        },
      },
    },
    {
      id: 'js-04-for-loop',
      title: {
        es: 'Repetir con for',
        en: 'Repeat with for',
      },
      instruction: {
        es:
          'En bloques usas **Repetir** para no copiar lo mismo muchas veces. Aquí el **`for`** repite el cuerpo `{ ... }` varias veces. Lee el panel “Idea nueva” antes de ordenar las líneas.',
        en:
          'On blocks you use **Repeat** to avoid pasting the same thing many times. Here a **`for`** repeats the `{ ... }` body several times. Read the “New idea” panel before ordering lines.',
      },
      introducesConcept: 'repeat_loop',
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Completar una fila de motivos sin pegar el mismo bloque mil veces',
              'Complete a row of motifs without pasting the same block endlessly',
            ),
            detail: L(
              'Objetivo real: repetir el mismo patrón en el lienzo (varias celdas seguidas).',
              'Real goal: repeat the same pattern on the canvas (several cells in a row).',
            ),
            preview: { type: 'cells', items: ['indigo', 'indigo', 'skip', 'yellow', 'yellow'] },
          },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'Un for repite el cuerpo — misma idea que Repetir con bloques dentro:',
              'A for repeats its body — same idea as Repeat with blocks inside:',
            ),
          },
        ],
        [
          {
            kind: 'repeat',
            count: L('3 vueltas', '3 times'),
            inner: [
              { kind: 'terminal', line: L('i', 'i') },
              { kind: 'drawBox', color: 'indigo' },
              { kind: 'newLine' },
            ],
          },
        ],
      ],
      exercise: {
        type: 'orderLines',
        lines: [
          { es: '}', en: '}' },
          { es: '  console.log(i);', en: '  console.log(i);' },
          { es: 'for (let i = 0; i < 3; i++) {', en: 'for (let i = 0; i < 3; i++) {' },
        ],
        correctOrder: [2, 1, 0],
      },
    },
    {
      id: 'js-05-function',
      title: {
        es: 'Agrupar en una función',
        en: 'Group into a function',
      },
      instruction: {
        es:
          'Cuando un conjunto de pasos tiene sentido junto, lo envuelves en una **función** con nombre. Así lo llamas cuando lo necesitas, como un mini programa reutilizable.',
        en:
          'When a set of steps belongs together, wrap them in a named **function**. Then you call it when you need it — a reusable mini program.',
      },
      introducesConcept: 'function_block',
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Guardar un mini-dibujo con nombre y usarlo cuando lo necesites',
              'Save a mini-drawing under a name and use it when you need it',
            ),
            detail: L(
              'Como una plantilla que siempre pinta el mismo motivo (una cruz, dos franjas…).',
              'Like a template that always paints the same motif.',
            ),
            preview: { type: 'stripes', colors: ['yellow', 'red', 'orange'] },
          },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'Agrupar pasos con nombre — como un bloque reutilizable que envuelve varias órdenes:',
              'Group steps under a name — like a reusable block wrapping several commands:',
            ),
          },
        ],
        [
          {
            kind: 'functionShell',
            name: L('suma', 'add'),
            inner: [
              { kind: 'drawBox', color: 'yellow' },
              { kind: 'drawBox', color: 'red' },
              { kind: 'terminal', line: L('return', 'return') },
            ],
          },
        ],
      ],
      exercise: {
        type: 'orderLines',
        lines: [
          { es: '}', en: '}' },
          { es: '  return a + b;', en: '  return a + b;' },
          { es: 'function suma(a, b) {', en: 'function add(a, b) {' },
        ],
        correctOrder: [2, 1, 0],
      },
    },
    {
      id: 'js-06-array',
      title: {
        es: 'Listas con arrays',
        en: 'Lists with arrays',
      },
      instruction: {
        es:
          'Un array guarda muchos valores en **orden**. El índice empieza en 0 — como contar celdas en una fila desde la izquierda.',
        en:
          'An array stores many values in **order**. Indexes start at 0 — like counting cells in a row from the left.',
      },
      introducesConcept: 'array_data',
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Leer la celda correcta en una fila ordenada de colores',
              'Read the right cell in an ordered row of colors',
            ),
            detail: L(
              'Igual que elegir la segunda franja de una bandera: el índice importa.',
              'Like choosing the second stripe of a flag: the index matters.',
            ),
            preview: { type: 'stripes', colors: ['red', 'green', 'blue'] },
          },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'Una fila de celdas numeradas — parecido a recorrer columnas en el lienzo:',
              'A row of numbered slots — like stepping across columns on the canvas:',
            ),
          },
        ],
        [
          {
            kind: 'arrayCells',
            items: [L('rojo', 'red'), L('verde', 'green'), L('azul', 'blue')],
          },
        ],
      ],
      exercise: {
        type: 'pickOne',
        prompt: {
          es: '¿Qué muestra `colores[1]` si `colores = ["rojo","verde","azul"]`?',
          en: 'What does `colors[1]` show if `colors = ["red","green","blue"]`?',
        },
        options: [
          { es: '"rojo"', en: '"red"' },
          { es: '"verde"', en: '"green"' },
          { es: '"azul"', en: '"blue"' },
          { es: 'undefined', en: 'undefined' },
        ],
        correctIndex: 1,
        wrongHint: {
          es: 'El índice 1 es la segunda posición (0 es la primera).',
          en: 'Index 1 is the second slot (0 is the first).',
        },
      },
    },
  ],
}
