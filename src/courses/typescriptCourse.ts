import type { GuidedCourse } from './guidedLessonTypes'

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
      id: 'ts-02-typed',
      title: {
        es: 'Tipos básicos',
        en: 'Basic types',
      },
      instruction: {
        es:
          'TypeScript añade **tipos** a JavaScript: anotas la forma de los datos antes de ejecutar. Ayuda a detectar errores pronto, como revisar el puzzle antes de pulsar Ejecutar.',
        en:
          'TypeScript adds **types** to JavaScript: you describe data shapes before running. It catches mistakes early — like checking the puzzle before pressing Run.',
      },
      introducesConcept: 'variable',
      exercise: {
        type: 'pickOne',
        prompt: {
          es: '¿Qué palabra clave declara una constante tipada?',
          en: 'Which keyword declares a typed constant?',
        },
        options: [
          { es: 'var', en: 'var' },
          { es: 'const', en: 'const' },
          { es: 'typedef', en: 'typedef' },
          { es: 'static', en: 'static' },
        ],
        correctIndex: 1,
        wrongHint: {
          es: '`const nombre: tipo = valor` es el patrón habitual.',
          en: '`const name: type = value` is the usual pattern.',
        },
      },
    },
    {
      id: 'ts-03-loop',
      title: {
        es: 'for tipado',
        en: 'Typed for',
      },
      instruction: {
        es:
          'Los bucles **`for`** siguen la misma lógica que **Repetir** en bloques; TypeScript puede inferir o anotar el tipo del índice.',
        en:
          '`for` loops follow the same logic as **Repeat** in blocks; TypeScript can infer or annotate the index type.',
      },
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
      id: 'ts-04-fn',
      title: {
        es: 'Función con tipo',
        en: 'Typed function',
      },
      instruction: {
        es:
          'Puedes decir qué entra y qué sale de una función con tipos en los paréntesis y tras la flecha `=>`.',
        en:
          'You can declare inputs and outputs with types in parentheses and after `=>`.',
      },
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
  ],
}
