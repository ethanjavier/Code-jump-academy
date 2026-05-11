import type { GuidedCourse } from './guidedLessonTypes'

const L = (es: string, en: string) => ({ es, en })

/**
 * Same beginner spine as JavaScript (lessons 2–9): console → assemble → if → dual run → for → fn → array → review quiz.
 * Stripe intro is prepended by {@link padGuidedCourse}.
 */
export const TYPESCRIPT_GUIDED_COURSE: GuidedCourse = {
  languageId: 'typescript',
  lessons: [
    {
      id: 'ts-01-console',
      title: { es: 'Salida en consola', en: 'Console output' },
      instruction: {
        es:
          'Este laboratorio usa el motor **JavaScript del navegador** para ejecutar tu código (TypeScript válido que también sea JS válido).\n\nObjetivo: que la salida contenga la palabra indicada; usa **Ejecutar** y **Comprobar salida**.',
        en:
          'This lab uses the browser **JavaScript engine** (write TypeScript that is also valid JavaScript here).\n\nGoal: output contains the asked word; use **Run** and **Check output**.',
      },
      introducesConcept: 'console',
      exercise: {
        type: 'runCode',
        runtime: 'javascript',
        starter: {
          es: '// Muestra Hola en consola\n\n',
          en: '// Print Hello to the console\n\n',
        },
        expectOutputIncludes: {
          es: ['Hola'],
          en: ['Hello'],
        },
        wrongHint: {
          es: 'Prueba console.log("Hola").',
          en: 'Try console.log("Hello").',
        },
      },
    },
    {
      id: 'ts-02-variable-assemble',
      title: L('Guardar un valor tipado', 'Saving a typed value'),
      instruction: L(
        'Igual que en JavaScript, aquí usas `const` y puedes **anotar tipos**. Ordena los fragmentos hasta que la vista previa forme un programa válido: primero declaras `pasos`, luego los imprimes en consola.',
        'Like JavaScript, you use `const` and can **annotate types**. Reorder fragments until the preview is valid code: declare `steps`, then print them.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'assembleLine',
        tokens: [
          { es: 'const ', en: 'const ' },
          { es: 'pasos', en: 'steps' },
          { es: ': number = ', en: ': number = ' },
          { es: '4', en: '4' },
          { es: ';\n', en: ';\n' },
          { es: 'console.log(', en: 'console.log(' },
          { es: 'pasos', en: 'steps' },
          { es: ');', en: ');' },
        ],
        correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
        wrongHint: {
          es: 'Orden: `const pasos: number = 4;` y después `console.log(pasos);`.',
          en: 'Order: `const steps: number = 4;` then `console.log(steps);`.',
        },
      },
    },
    {
      id: 'ts-03-if',
      title: L('Decidir con if', 'Choosing with if'),
      instruction: L(
        'Lee el fragmento como en la lección de JavaScript: el programa elige una rama según la condición.',
        'Read the snippet like the JavaScript lesson: the program picks a branch based on the condition.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: {
          es:
            '¿Qué imprime si `n` es 3?\n\nlet n = 3;\nif (n > 2) {\n  console.log("Hola");\n} else {\n  console.log("Adios");\n}',
          en:
            'What prints if `n` is 3?\n\nlet n = 3;\nif (n > 2) {\n  console.log("Hi");\n} else {\n  console.log("Bye");\n}',
        },
        options: [
          { es: 'Adios', en: 'Bye' },
          { es: 'Hola', en: 'Hi' },
          { es: 'undefined', en: 'undefined' },
          { es: 'Nada', en: 'Nothing' },
        ],
        correctIndex: 1,
        wrongHint: {
          es: 'Si `n > 2` es verdadero, corre el `console.log` del `if`.',
          en: 'If `n > 2` is true, the inner `console.log` runs.',
        },
      },
    },
    {
      id: 'ts-04-run-checklist',
      title: L('Varias comprobaciones en la salida', 'Several checks in the output'),
      instruction: L(
        'Igual que en JavaScript: varios fragmentos en el objetivo — todos deben aparecer en la salida. Ya tienes `const x: number = 8;`. Imprime **Hola** y el valor de `x` en líneas distintas.',
        'Like JavaScript: several goal fragments — all must appear in the output. You already have `const x: number = 8;`. Print **Hi** and the value of `x` on separate lines.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'runCode',
        runtime: 'javascript',
        starter: {
          es: 'const x: number = 8;\n// Dos líneas en consola: Hola y el valor de x\n\n',
          en: 'const x: number = 8;\n// Two console lines: Hi, then the value of x\n\n',
        },
        expectOutputIncludes: {
          es: ['Hola', '8'],
          en: ['Hi', '8'],
        },
        wrongHint: {
          es: 'Ejemplo: console.log("Hola"); y console.log(x);',
          en: 'Example: console.log("Hi"); then console.log(x);',
        },
      },
    },
    {
      id: 'ts-05-for-loop',
      title: L('Repetir con for', 'Repeat with for'),
      instruction: L(
        'El **`for`** repite el cuerpo varias veces — misma idea que **Repetir** en bloques. Ordena las líneas para que el bucle envuelva el `console.log`.',
        'A **`for`** repeats its body — same idea as **Repeat** in blocks. Order lines so the loop wraps `console.log`.',
      ),
      introducesConcept: 'repeat_loop',
      exercise: {
        type: 'orderLines',
        lines: [
          { es: '}', en: '}' },
          { es: '  console.log(i);', en: '  console.log(i);' },
          { es: 'for (let i = 0; i < 2; i++) {', en: 'for (let i = 0; i < 2; i++) {' },
        ],
        correctOrder: [2, 1, 0],
      },
    },
    {
      id: 'ts-06-function',
      title: L('Función con tipo', 'Typed function'),
      instruction: L(
        'Anota parámetros y valor de retorno. Ordena para que la flecha `=>` y el cuerpo tengan sentido.',
        'Annotate parameters and return values. Order so the `=>` arrow and body make sense.',
      ),
      introducesConcept: 'function_block',
      exercise: {
        type: 'orderLines',
        lines: [
          { es: '}', en: '}' },
          { es: '  return x + 1;', en: '  return x + 1;' },
          { es: 'const siguiente = (x: number): number => {', en: 'const next = (x: number): number => {' },
        ],
        correctOrder: [2, 1, 0],
      },
    },
    {
      id: 'ts-07-array',
      title: L('Listas con arrays', 'Lists with arrays'),
      instruction: L(
        'Los arrays guardan valores en orden; el índice empieza en 0 — igual que en JavaScript.',
        'Arrays store values in order; indexes start at 0 — same as JavaScript.',
      ),
      introducesConcept: 'array_data',
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
          es: 'El índice 1 es la segunda posición.',
          en: 'Index 1 is the second slot.',
        },
      },
    },
    {
      id: 'ts-08-review-order',
      title: L('Repaso: orden de ejecución', 'Review: execution order'),
      instruction: L(
        'Última parada del recorrido guiado: piensa en cómo el motor lee tu código **de arriba abajo** salvo ramas y bucles.',
        'Last stop on the guided tour: think how the engine reads code **top to bottom** except branches and loops.',
      ),
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué idea describe mejor la ejecución lineal por defecto?',
          'Which idea best describes default linear execution?',
        ),
        options: [
          L('Siempre se ejecuta todo a la vez', 'Everything runs at once'),
          L(
            'Las instrucciones siguen un orden salvo bucles o condiciones',
            'Statements follow an order except loops or conditions',
          ),
          L('Solo importa la última línea', 'Only the last line matters'),
          L('El orden es aleatorio', 'Order is random'),
        ],
        correctIndex: 1,
        wrongHint: L(
          'Piensa en leer una receta paso a paso.',
          'Think of reading a recipe step by step.',
        ),
      },
    },
  ],
}
