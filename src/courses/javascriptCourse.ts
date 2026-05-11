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
          },
        ],
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
          'Igual que **Crear variable** en bloques, en JavaScript guardas un valor con `const`. Aquí sigues con **código real**: **ordenarás fragmentos** (palabra clave, nombre, números, signos…) en **Tu código** hasta que la **Vista previa** muestre un programa válido.\n\nObjetivo: primero declaras `const pasos = 4;`, luego usas el mismo nombre en `console.log`; cuando encaje, pulsa **Comprobar orden**.',
        en:
          'Like **Create variable** on blocks, in JavaScript you store a value with `const`. This is still **real code**: **reorder fragments** (keyword, name, numbers, punctuation…) in **Your code** until the **Preview** shows valid code.\n\nGoal: first declare `const steps = 4;`, then use the same name in `console.log`; when it lines up, press **Check order**.',
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
        type: 'assembleLine',
        tokens: [
          { es: 'const ', en: 'const ' },
          { es: 'pasos', en: 'steps' },
          { es: ' = ', en: ' = ' },
          { es: '4', en: '4' },
          { es: ';\n', en: ';\n' },
          { es: 'console.log(', en: 'console.log(' },
          { es: 'pasos', en: 'steps' },
          { es: ');', en: ');' },
        ],
        correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
        wrongHint: {
          es: 'Orden: primero la declaración `const pasos = 4;`, después la llamada que imprime el mismo nombre.',
          en: 'Order: first the declaration `const steps = 4;`, then the call that prints the same name.',
        },
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
          'En bloques, una **condición** elige un camino u otro; en JavaScript, **`if` / `else`** hace lo mismo con código real. Lee el fragmento de arriba a abajo: primero la condición, luego solo una rama se ejecuta.\n\nObjetivo: en **Tu código** lee la pregunta, marca la opción correcta y pulsa **Comprobar respuesta**.',
        en:
          'On blocks, a **condition** picks one path or another; in JavaScript, **`if` / `else`** does that with real code. Read the snippet top to bottom: condition first, then only one branch runs.\n\nGoal: in **Your code** read the question, pick the right option, then press **Check answer**.',
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
        [
          {
            kind: 'caption',
            text: L(
              'Solo una rama llega a la salida — como un único color ganador en el lienzo:',
              'Only one branch reaches the output — like a single winning color on the canvas:',
            ),
          },
        ],
        [
          { kind: 'terminal', line: L('Hola', 'Hi') },
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
      id: 'js-03b-run-checklist',
      title: {
        es: 'Varias comprobaciones en la salida',
        en: 'Several checks in the output',
      },
      instruction: {
        es:
          'Aquí sigues con **código real** que se ejecuta línea a línea. A veces el panel **Objetivo** lista **varios fragmentos**: al **Comprobar salida**, **todos** deben aparecer en la caja (junto con la salida de **Ejecutar** y el error, si lo hay).\n\nYa tienes `let x = 8;`. Objetivo: **Ejecutar** y conseguir primero **Hola** y, en otra línea, el valor de `x`; luego **Comprobar salida**.',
        en:
          'This is still **real code** running line by line. Sometimes the **Goal** panel lists **several fragments**: when you **Check output**, **all** of them must appear in the box (together with **Run** output and any error).\n\nYou already have `let x = 8;`. Goal: **Run** so you print **Hi** first, then the value of `x` on another line; then **Check output**.',
      },
      introducesConcept: 'variable',
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Comprobar dos pistas en la misma salida',
              'Check two clues in the same output',
            ),
            detail: L(
              'Como revisar dos etiquetas en el lienzo antes de pasar de nivel.',
              'Like checking two labels on the canvas before leveling up.',
            ),
          },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'La lista de fragmentos puede crecer con la lección — cada uno es una mini meta:',
              'The fragment list can grow with the lesson — each one is a mini goal:',
            ),
          },
        ],
        [
          { kind: 'varDecl', name: L('x', 'x'), value: 8 },
          { kind: 'arrowHint' },
          { kind: 'terminal', line: L('Hola\n8', 'Hi\n8') },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'Dos líneas en consola — texto fijo y valor leído del nombre guardado:',
              'Two console lines — fixed text and the value read from the saved name:',
            ),
          },
        ],
        [
          { kind: 'drawBox', color: 'green' },
          { kind: 'newLine' },
          { kind: 'drawBox', color: 'blue' },
        ],
      ],
      exercise: {
        type: 'runCode',
        runtime: 'javascript',
        starter: {
          es: 'let x = 8;\n// Dos líneas: primero Hola, luego el valor de x (usa console.log dos veces)\n\n',
          en: 'let x = 8;\n// Two lines: first Hi, then the value of x (use console.log twice)\n\n',
        },
        expectOutputIncludes: {
          es: ['Hola', '8'],
          en: ['Hi', '8'],
        },
        wrongHint: {
          es: 'Ejemplo: console.log("Hola"); y luego console.log(x); — ejecuta y mira que salgan las dos líneas.',
          en: 'Example: console.log("Hi"); then console.log(x); — run and confirm you see both lines.',
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
          'En bloques usas **Repetir** para no copiar lo mismo muchas veces; en JavaScript el **`for`** repite el cuerpo `{ ... }` varias veces. Lee también el panel **Idea nueva** arriba si aparece.\n\nObjetivo: en **Tu código** **ordenarás líneas** con las flechas hasta que arriba quede lo primero que debe ejecutarse (abajo = después). Luego pulsa **Comprobar orden**.',
        en:
          'On blocks you use **Repeat** to avoid pasting the same thing many times; in JavaScript a **`for`** repeats the `{ ... }` body several times. Read the **New idea** panel above when it shows.\n\nGoal: in **Your code** **reorder lines** with the arrows until the top line runs first (bottom runs later). Then press **Check order**.',
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
        [
          {
            kind: 'caption',
            text: L(
              'Arriba el `for`; debajo, indentado, lo que se ejecuta en cada vuelta:',
              '`for` on top; below, indented — what runs each turn:',
            ),
          },
        ],
        [
          { kind: 'drawBox', color: 'indigo' },
          { kind: 'drawBox', color: 'indigo' },
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
          'Cuando un conjunto de pasos tiene sentido junto, lo envuelves en una **función** con nombre — **código real** que puedes llamar cuando quieras.\n\nObjetivo: en **Tu código** **ordenarás líneas** con las flechas (cabecera `function` primero, cuerpo con `return` después) y pulsa **Comprobar orden**.',
        en:
          'When steps belong together, wrap them in a named **function** — **real code** you can call anytime.\n\nGoal: in **Your code** **reorder lines** with the arrows (`function` header first, body with `return` next) and press **Check order**.',
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
        [
          {
            kind: 'caption',
            text: L(
              'La cabecera `function` arriba; dentro, indentado, lo que calcula y devuelve:',
              'The `function` header on top; indented inside is what computes and returns:',
            ),
          },
        ],
        [
          { kind: 'drawBox', color: 'yellow' },
          { kind: 'drawBox', color: 'red' },
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
          'Un **array** guarda muchos valores en **orden**; el índice empieza en 0 — como contar celdas en una fila desde la izquierda.\n\nObjetivo: en **Tu código** lee la pregunta, elige la opción correcta y pulsa **Comprobar respuesta**.',
        en:
          'An **array** stores values in **order**; indexes start at 0 — like counting cells in a row from the left.\n\nGoal: in **Your code** read the question, pick the right option, then press **Check answer**.',
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
        [
          {
            kind: 'caption',
            text: L(
              '`[0]` es la primera celda, `[1]` la segunda — siempre desde la izquierda:',
              '`[0]` is the first slot, `[1]` the second — always from the left:',
            ),
          },
        ],
        [
          { kind: 'terminal', line: L('[1] → 2.ª celda', '[1] → 2nd cell') },
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
    {
      id: 'js-07-review-order',
      title: {
        es: 'Repaso: orden de ejecución',
        en: 'Review: execution order',
      },
      instruction: {
        es:
          'Última parada del recorrido guiado en JavaScript: el programa se lee **de arriba abajo**, salvo ramas (`if` / `else`), bucles (`for`) y cuando llamas a una **función**.\n\nObjetivo: en **Tu código** elige la mejor descripción y pulsa **Comprobar respuesta**.',
        en:
          'Last stop on the JavaScript guided tour: code runs **top to bottom**, except branches (`if` / `else`), loops (`for`), and when you call a **function**.\n\nGoal: in **Your code** pick the best description and press **Check answer**.',
      },
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Leer tu código como una receta: paso a paso',
              'Read your code like a recipe: step by step',
            ),
            detail: L(
              'Si algo va mal, suele ser el orden o una condición.',
              'When something breaks, it is often order or a condition.',
            ),
            preview: { type: 'stripes', colors: ['green', 'yellow', 'blue'] },
          },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'Instrucciones encadenadas — como bloques uno tras otro en el lienzo:',
              'Chained instructions — like blocks one after another on the canvas:',
            ),
          },
        ],
        [
          { kind: 'drawBox', color: 'green' },
          { kind: 'skip' },
          { kind: 'drawBox', color: 'blue' },
        ],
      ],
      exercise: {
        type: 'pickOne',
        prompt: {
          es: '¿Qué idea describe mejor la ejecución lineal por defecto?',
          en: 'Which idea best describes default linear execution?',
        },
        options: [
          { es: 'Siempre se ejecuta todo a la vez', en: 'Everything runs at once' },
          {
            es: 'Las instrucciones siguen un orden salvo bucles o condiciones',
            en: 'Statements follow an order except loops or conditions',
          },
          { es: 'Solo importa la última línea', en: 'Only the last line matters' },
          { es: 'El orden es aleatorio', en: 'Order is random' },
        ],
        correctIndex: 1,
        wrongHint: {
          es: 'Piensa en leer una receta paso a paso.',
          en: 'Think of reading a recipe step by step.',
        },
      },
    },
  ],
}
