import type { GuidedCourse } from './guidedLessonTypes'

const L = (es: string, en: string) => ({ es, en })

export const PYTHON_GUIDED_COURSE: GuidedCourse = {
  languageId: 'python',
  lessons: [
    {
      id: 'py-01-print',
      title: { es: 'Salida con print', en: 'Output with print' },
      instruction: {
        es:
          'Igual que en bloques, las instrucciones se ejecutan **de arriba abajo**. Aquí escribes **Python real**: usa **Ejecutar** y comprueba la salida antes de **Comprobar salida**.',
        en:
          'Like blocks, instructions run **top to bottom**. Here you write **real Python**: use **Run**, review the output, then **Check output**.',
      },
      introducesConcept: 'console',
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Que se vea un mensaje claro al ejecutar el programa',
              'Make a clear message appear when the program runs',
            ),
            detail: L(
              'Objetivo real: texto útil en pantalla — como un cartel o el estado de un juego.',
              'Real goal: useful on-screen text — like a banner or a game status line.',
            ),
          },
        ],
      ],
      exercise: {
        type: 'runCode',
        runtime: 'python',
        starter: {
          es: '# Escribe una línea print que muestre Hola\n\n',
          en: '# Write a print line that outputs Hello\n\n',
        },
        expectOutputIncludes: {
          es: ['Hola'],
          en: ['Hello'],
        },
        wrongHint: {
          es: 'Ejemplo: print("Hola"). La primera carga de Python puede tardar unos segundos.',
          en: 'Example: print("Hello"). The first Python load may take a few seconds.',
        },
      },
    },
    {
      id: 'py-02-var',
      title: { es: 'Variables', en: 'Variables' },
      instruction: {
        es:
          'Asignas un nombre con `=` — como **Crear variable** en el lienzo. Aquí **ordenarás fragmentos** hasta que la vista previa forme un programa válido: primero `pasos = 3`, luego `print(pasos)` usando el mismo nombre.',
        en:
          'You assign a name with `=` — like **Create variable** on the canvas. **Reorder fragments** until the preview forms valid code: first `steps = 3`, then `print(steps)` with the same name.',
      },
      introducesConcept: 'variable',
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Reutilizar un número en varias partes del dibujo',
              'Reuse one number in several parts of the drawing',
            ),
            detail: L(
              'Como fijar cuántas franjas tiene tu bandera y pintar cada una con coherencia.',
              'Like fixing how many stripes your flag has and painting each one consistently.',
            ),
            preview: { type: 'stripes', colors: ['blue', 'yellow', 'red'] },
          },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'El nombre guarda el valor antes de usarlo — igual que Crear variable:',
              'The name stores the value before you use it — just like Create variable:',
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
              'En bloques también encadenas pintura, huecos y repeticiones:',
              'In blocks you also chain painting, gaps, and repeats:',
            ),
          },
        ],
        [
          { kind: 'drawBox', color: 'blue' },
          { kind: 'skip' },
          { kind: 'drawBox', color: 'yellow' },
          { kind: 'newLine' },
        ],
        [
          {
            kind: 'repeat',
            count: L('2', '2'),
            inner: [{ kind: 'drawBox', color: 'green' }],
          },
        ],
      ],
      exercise: {
        type: 'assembleLine',
        tokens: [
          { es: 'pasos', en: 'steps' },
          { es: ' = ', en: ' = ' },
          { es: '3', en: '3' },
          { es: '\n', en: '\n' },
          { es: 'print(', en: 'print(' },
          { es: 'pasos', en: 'steps' },
          { es: ')', en: ')' },
        ],
        correctOrder: [0, 1, 2, 3, 4, 5, 6],
        wrongHint: {
          es: 'Primero la asignación `pasos = 3`, después `print(pasos)` en una nueva línea.',
          en: 'First the assignment `steps = 3`, then `print(steps)` on the next line.',
        },
      },
    },
    {
      id: 'py-03-if',
      title: { es: 'if y sangría', en: 'if and indentation' },
      instruction: {
        es:
          'Python usa **sangría** para el cuerpo del `if` (no llaves `{ }`). Todo lo indentado bajo el `if` se ejecuta solo si la condición es cierta.',
        en:
          'Python uses **indentation** for the `if` body (no `{ }`). Everything indented under `if` runs only when the condition is true.',
      },
      introducesConcept: 'if_branch',
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Seguir un camino u otro según la condición',
              'Follow one path or another depending on the condition',
            ),
            detail: L(
              'Dos resultados distintos — como dos banderas según si aciertas el puzzle o no.',
              'Two different outcomes — like two flags depending on whether you solve the puzzle.',
            ),
            preview: { type: 'cells', items: ['green', 'skip', 'orange'] },
          },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'Python marca el cuerpo con sangría — dos caminos posibles:',
              'Python marks the body with indentation — two possible paths:',
            ),
          },
        ],
        [
          {
            kind: 'ifSplit',
            cond: L('condición', 'condition'),
            thenLine: L('bloque indentado', 'indented block'),
            elseLine: L('otra rama', 'other branch'),
          },
        ],
      ],
      exercise: {
        type: 'pickOne',
        prompt: {
          es: '¿Qué es obligatorio en el cuerpo de un `if` en Python?',
          en: 'What is required in a Python `if` body?',
        },
        options: [
          { es: 'Punto y coma', en: 'Semicolons' },
          { es: 'Sangría consistente', en: 'Consistent indentation' },
          { es: 'La palabra then', en: 'The word then' },
          { es: 'Corchetes []', en: 'Square brackets []' },
        ],
        correctIndex: 1,
        wrongHint: {
          es: 'El bloque del `if` se marca solo con espacios/tabs al inicio de línea.',
          en: 'The `if` block is marked only with leading spaces/tabs.',
        },
      },
    },
    {
      id: 'py-03b-run-checklist',
      title: { es: 'Varias comprobaciones en la salida', en: 'Several checks in the output' },
      instruction: {
        es:
          'Igual que en JavaScript, aquí la lista de **fragmentos** puede tener varias entradas: **todas** deben aparecer en la salida al comprobar. Ya tienes `x = 8`. Imprime **Hola** y, en otra línea, el valor de `x`.',
        en:
          'Like the JavaScript track, the **fragment** list can have several entries: **all** must appear in the output when you check. You already have `x = 8`. Print **Hello**, then the value of `x` on another line.',
      },
      introducesConcept: 'variable',
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Dos pistas en la misma salida de print',
              'Two clues in the same print output',
            ),
            detail: L(
              'Texto fijo y valor de variable — la lección puede pedir más fragmentos según avanza.',
              'Fixed text and a variable value — lessons can ask for more fragments as they go.',
            ),
          },
        ],
        [
          { kind: 'varDecl', name: L('x', 'x'), value: 8 },
          { kind: 'arrowHint' },
          { kind: 'terminal', line: L('Hola\n8', 'Hello\n8') },
        ],
      ],
      exercise: {
        type: 'runCode',
        runtime: 'python',
        starter: {
          es: 'x = 8\n# Dos líneas: primero Hola, luego el valor de x\n\n',
          en: 'x = 8\n# Two lines: first Hello, then the value of x\n\n',
        },
        expectOutputIncludes: {
          es: ['Hola', '8'],
          en: ['Hello', '8'],
        },
        wrongHint: {
          es: 'Ejemplo: print("Hola") y print(x) en líneas distintas.',
          en: 'Example: print("Hello") and print(x) on separate lines.',
        },
      },
    },
    {
      id: 'py-04-for',
      title: { es: 'Bucle for', en: 'for loop' },
      instruction: {
        es:
          'El **`for`** en Python recorre una secuencia — la misma idea que **Repetir** en bloques: varias vueltas con un nombre (`i` o el elemento) que cambia cada vez.',
        en:
          'A Python **`for`** walks a sequence — same idea as **Repeat** in blocks: several rounds with a name that changes each time.',
      },
      introducesConcept: 'repeat_loop',
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Recorrer una secuencia de pasos en el lienzo sin repetir código a mano',
              'Walk a sequence of canvas steps without duplicating code by hand',
            ),
            detail: L(
              'Objetivo real: varias celdas seguidas con el mismo patrón (como una franja larga).',
              'Real goal: several cells in a row with the same pattern (like a long stripe).',
            ),
            preview: { type: 'cells', items: ['purple', 'purple', 'skip', 'indigo', 'indigo'] },
          },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'for recorre varias vueltas — como Repetir con bloques dentro:',
              'for walks several rounds — like Repeat with blocks inside:',
            ),
          },
        ],
        [
          {
            kind: 'repeat',
            count: L('range(3)', 'range(3)'),
            inner: [
              { kind: 'terminal', line: L('n', 'n') },
              { kind: 'drawBox', color: 'purple' },
              { kind: 'skip' },
            ],
          },
        ],
      ],
      exercise: {
        type: 'orderLines',
        lines: [
          { es: '    print(n)', en: '    print(n)' },
          { es: 'for n in range(3):', en: 'for n in range(3):' },
        ],
        correctOrder: [1, 0],
      },
    },
    {
      id: 'py-05-def',
      title: { es: 'def function', en: 'def function' },
      instruction: {
        es:
          '`def nombre():` define una función. El cuerpo indentado es el “programa interno” que llamas cuando quieras.',
        en:
          '`def name():` defines a function. The indented body is the inner program you can call anytime.',
      },
      introducesConcept: 'function_block',
      canvasLienzo: [
        [
          {
            kind: 'realGoal',
            headline: L(
              'Empaquetar un trozo de programa con nombre para llamarlo después',
              'Package a chunk of program under a name you can call later',
            ),
            detail: L(
              'Como guardar “cómo dibujo mi bandera” y ejecutarlo cuando haga falta.',
              'Like saving “how I draw my flag” and running it whenever needed.',
            ),
            preview: { type: 'stripes', colors: ['orange', 'yellow', 'green'] },
          },
        ],
        [
          {
            kind: 'caption',
            text: L(
              'def agrupa el cuerpo indentado — mini lienzo dentro del programa:',
              'def groups the indented body — a mini canvas inside the program:',
            ),
          },
        ],
        [
          {
            kind: 'functionShell',
            name: L('doble', 'double'),
            inner: [{ kind: 'drawBox', color: 'orange' }, { kind: 'terminal', line: L('return x*2', 'return x*2') }],
          },
        ],
      ],
      exercise: {
        type: 'orderLines',
        lines: [
          { es: '    return x * 2', en: '    return x * 2' },
          { es: 'def doble(x):', en: 'def double(x):' },
        ],
        correctOrder: [1, 0],
      },
    },
    {
      id: 'py-06-array',
      title: { es: 'Listas con índices', en: 'Lists with indexes' },
      instruction: {
        es:
          'Una lista guarda muchos valores en **orden**. El índice empieza en 0 — la primera celda es `[0]`, la segunda es `[1]`.',
        en:
          'A list stores many values in **order**. Indexes start at 0 — the first slot is `[0]`, the second is `[1]`.',
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
    {
      id: 'py-07-review-order',
      title: { es: 'Repaso: orden de ejecución', en: 'Review: execution order' },
      instruction: {
        es:
          'Última parada del recorrido guiado en Python: el intérprete lee tu código **de arriba abajo**, salvo ramas (`if`), bucles (`for`) y llamadas a funciones.',
        en:
          'Last stop on the Python guided tour: the interpreter reads code **top to bottom**, except branches (`if`), loops (`for`), and function calls.',
      },
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
