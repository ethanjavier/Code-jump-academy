import { PRACTICE_MODULE_COUNT } from '../app/languageQuizzes'
import type { GuidedCourse, GuidedLesson, Localized } from './guidedLessonTypes'
import { buildBeginnerExtendedPaletteLessons } from './beginnerExtendedPaletteByLanguage'
import { sortGuidedLessonsForBeginnerSpine } from './guidedLessonCanonicalOrder'
import { introStripeLesson } from './stripeIntroLessons'

const L = (es: string, en: string): Localized => ({ es, en })

/** Same guided lesson count per track (overview buttons aligned); includes interactive intro stripe. */
export const GUIDED_LESSON_TARGET = 9

/** Beginner extended track: five guided “chapters” (same count as quiz modules), nine lessons each. */
export const GUIDED_BEGINNER_LESSONS_PER_MODULE = 9
export const GUIDED_BEGINNER_GUIDED_MODULE_COUNT = PRACTICE_MODULE_COUNT
export const GUIDED_BEGINNER_EXTENDED_LESSON_TOTAL =
  GUIDED_BEGINNER_LESSONS_PER_MODULE * GUIDED_BEGINNER_GUIDED_MODULE_COUNT

/** @deprecated Use GUIDED_BEGINNER_* exports */
export const JAVASCRIPT_BEGINNER_LESSONS_PER_MODULE = GUIDED_BEGINNER_LESSONS_PER_MODULE
/** @deprecated */
export const JAVASCRIPT_BEGINNER_GUIDED_MODULE_COUNT = GUIDED_BEGINNER_GUIDED_MODULE_COUNT
/** @deprecated */
export const JAVASCRIPT_BEGINNER_GUIDED_LESSON_TOTAL = GUIDED_BEGINNER_EXTENDED_LESSON_TOTAL

export type PadGuidedCourseOptions = {
  /** When set, overrides {@link GUIDED_LESSON_TARGET} (trim or pad to this length). */
  lessonTarget?: number
}

/** Universal filler lessons when a track has fewer than {@link GUIDED_LESSON_TARGET} authored lessons. */
const PAD_POOL: Omit<GuidedLesson, 'id'>[] = [
  {
    title: L('Orden de ejecución', 'Execution order'),
    instruction: L(
      'En casi todos los lenguajes, el programa se lee y ejecuta **de arriba abajo**, salvo que un control de flujo (if, bucle…) cambie el camino.',
      'In almost every language, programs run **top to bottom** unless control flow (if, loops…) changes the path.',
    ),
    introducesConcept: 'if_branch',
    exercise: {
      type: 'pickOne',
      prompt: L(
        '¿Qué idea describe mejor la ejecución lineal por defecto?',
        'Which idea best describes default linear execution?',
      ),
      options: [
        L('Siempre se ejecuta todo a la vez', 'Everything runs at once'),
        L('Las instrucciones siguen un orden salvo bucles o condiciones', 'Statements follow an order except loops or conditions'),
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
  {
    title: L('Errores y mensajes', 'Errors and messages'),
    instruction: L(
      'Cuando algo falla, el entorno suele mostrar un **mensaje de error**. Leerlo con calma suele decirte la línea o el símbolo problemático.',
      'When something breaks, the environment usually shows an **error message**. Reading it slowly often points to the line or symbol that failed.',
    ),
    exercise: {
      type: 'pickOne',
      prompt: L(
        '¿Qué actitud ayuda más cuando aparece un error?',
        'Which attitude helps most when an error appears?',
      ),
      options: [
        L('Ignorar el texto del error', 'Ignore the error text'),
        L('Leer el mensaje y localizar línea o causa', 'Read the message and locate the line or cause'),
        L('Borrar todo el archivo', 'Delete the whole file'),
        L('Reiniciar el ordenador siempre', 'Always reboot the computer'),
      ],
      correctIndex: 1,
      wrongHint: L(
        'Los mensajes están ahí para orientarte.',
        'Messages are there to guide you.',
      ),
    },
  },
  {
    title: L('Práctica corta', 'Short practice'),
    instruction: L(
      'Los buenos hábitos: cambia **una cosa**, prueba, observa el resultado, repite.',
      'Good habits: change **one thing**, run it, watch the result, repeat.',
    ),
    introducesConcept: 'repeat_loop',
    exercise: {
      type: 'pickOne',
      prompt: L(
        '¿Por qué es útil probar en pasos pequeños?',
        'Why is it useful to test in small steps?',
      ),
      options: [
        L('Para hacer el código más largo', 'To make code longer'),
        L('Para saber qué cambio causó cada resultado', 'To know which change caused each result'),
        L('Para evitar guardar archivos', 'To avoid saving files'),
        L('No tiene ventaja', 'There is no benefit'),
      ],
      correctIndex: 1,
      wrongHint: L(
        'Los pasos pequeños acotan el fallo.',
        'Small steps narrow down failures.',
      ),
    },
  },
  {
    title: L('Comentarios', 'Comments'),
    instruction: L(
      'Los **comentarios** explican el código a humanos; el motor del lenguaje suele ignorarlos al ejecutar.',
      '**Comments** explain code to humans; the language runtime usually ignores them when running.',
    ),
    exercise: {
      type: 'pickOne',
      prompt: L(
        '¿Qué rol tienen los comentarios en la mayoría de lenguajes?',
        'What role do comments play in most languages?',
      ),
      options: [
        L('Se ejecutan como órdenes normales', 'They run like normal commands'),
        L('Documentan intención sin cambiar la ejecución', 'They document intent without changing execution'),
        L('Duplican la salida por pantalla', 'They duplicate console output'),
        L('Son obligatorios en cada línea', 'They are required on every line'),
      ],
      correctIndex: 1,
      wrongHint: L(
        'Sirven para futuro tú y para quien lea el código.',
        'They help future you and anyone reading the code.',
      ),
    },
  },
  {
    title: L('Variables en contexto', 'Variables in context'),
    instruction: L(
      'Una **variable** guarda un valor con nombre para reutilizarlo y que el programa sea más legible.',
      'A **variable** stores a value under a name so you can reuse it and keep programs readable.',
    ),
    introducesConcept: 'variable',
    exercise: {
      type: 'pickOne',
      prompt: L(
        '¿Cuál es una ventaja típica de usar variables?',
        'What is a typical advantage of using variables?',
      ),
      options: [
        L('Hacer el código imposible de leer', 'Make code impossible to read'),
        L('Evitar repetir el mismo valor muchas veces', 'Avoid repeating the same value many times'),
        L('Eliminar la necesidad de probar', 'Remove the need to test'),
        L('Borrar errores automáticamente', 'Erase errors automatically'),
      ],
      correctIndex: 1,
      wrongHint: L(
        'Centralizas el valor en un solo lugar.',
        'You centralize the value in one place.',
      ),
    },
  },
  {
    title: L('Funciones y bloques', 'Functions and blocks'),
    instruction: L(
      'Agrupar pasos en una **función** es como un mini programa: nombre, entradas y resultado.',
      'Grouping steps into a **function** is like a mini program: name, inputs, and result.',
    ),
    introducesConcept: 'function_block',
    exercise: {
      type: 'pickOne',
      prompt: L(
        '¿Qué describe mejor una función en programación?',
        'What best describes a function in programming?',
      ),
      options: [
        L('Solo sirve para imprimir texto', 'Only used to print text'),
        L('Empaqueta lógica reutilizable con un nombre', 'Packages reusable logic with a name'),
        L('Siempre se ejecuta solo una vez', 'It always runs exactly once'),
        L('No puede tener parámetros', 'It cannot have parameters'),
      ],
      correctIndex: 1,
      wrongHint: L(
        'Piensa en “receta con nombre” que puedes invocar cuando quieras.',
        'Think of a named recipe you can call whenever you need.',
      ),
    },
  },
]

export function padGuidedCourse(course: GuidedCourse, opts?: PadGuidedCourseOptions): GuidedCourse {
  const target = opts?.lessonTarget ?? GUIDED_LESSON_TARGET
  const intro = introStripeLesson(course.languageId)
  const tail = sortGuidedLessonsForBeginnerSpine(course.lessons.filter((l) => l.id !== intro.id))
  let lessons = [intro, ...tail]
  if (lessons.length > target) {
    lessons = lessons.slice(0, target)
  }
  let padIndex = 0
  while (lessons.length < target) {
    const template = PAD_POOL[padIndex % PAD_POOL.length]!
    const n = lessons.length + 1
    lessons.push({
      ...template,
      id: `${course.languageId}-guided-fill-${n}`,
    })
    padIndex += 1
  }
  if (
    target === GUIDED_BEGINNER_EXTENDED_LESSON_TOTAL &&
    lessons.length === GUIDED_BEGINNER_EXTENDED_LESSON_TOTAL
  ) {
    lessons = [lessons[0]!, ...buildBeginnerExtendedPaletteLessons(course.languageId)]
  }
  return { ...course, lessons }
}
