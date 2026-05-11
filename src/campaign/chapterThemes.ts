/**
 * Campaña por lecciones temáticas (estilo curso, no bloque de test).
 * Cada capítulo tiene foco de “lenguaje” / concepto de programación en español.
 */

/** Ejercicios por capítulo — suficientes para practicar sin parecer un examen largo */
export const PUZZLES_PER_CHAPTER = 10

export type ChapterTheme = {
  /** Título visible en el selector y en la instrucción */
  title: string
  /** Párrafo que enlaza el tema con ideas de código (orden, bucles, memoria, etc.) */
  hook: string
  /**
   * Índice de plantilla `t` en buildCampaign (0…21): prioriza ejercicios acordes al tema.
   * Se usa `puzzleIndex % templates.length` para repartir variedad dentro del capítulo.
   */
  templates: readonly number[]
}

export const CHAPTER_THEMES: readonly ChapterTheme[] = [
  {
    title: 'Primeros trazos',
    hook:
      'Tu programa es una lista de órdenes: cada bloque ocurre después del anterior, igual que las líneas de código.',
    templates: [0, 1, 6, 7, 18, 0, 1, 6, 7, 18],
  },
  {
    title: 'Secuencia y orden',
    hook:
      'El orden de ejecución importa: primero una instrucción, luego la siguiente — como leer código de arriba abajo.',
    templates: [6, 7, 0, 1, 18, 6, 7, 0, 1, 18],
  },
  {
    title: 'Saltar de línea',
    hook:
      'newLine() es como pulsar Enter: terminas una “línea” del dibujo y empiezas otra fila en el lienzo.',
    templates: [2, 3, 10, 11, 2, 3, 10, 11, 2, 3],
  },
  {
    title: 'Huecos y decisiones',
    hook:
      'A veces no pintas: skip() es una orden que dice “avanza sin dibujar”, como omitir un paso cuando no hace falta.',
    templates: [4, 5, 16, 17, 4, 5, 14, 15, 16, 17],
  },
  {
    title: 'Repetir sin copiar',
    hook:
      'Los bucles evitan repetir lo mismo muchas veces: Repetir agrupa acciones que deben ejecutarse varias veces.',
    templates: [8, 9, 10, 11, 8, 9, 10, 11, 8, 9],
  },
  {
    title: 'Patrones con ritmo',
    hook:
      'Los patrones son secuencias que se reconocen: combina Repetir con colores para describir ritmos cortos.',
    templates: [12, 13, 8, 9, 12, 13, 6, 7, 12, 13],
  },
  {
    title: 'Dos dimensiones',
    hook:
      'Piensa el lienzo como filas y columnas: primero una fila completa, luego la siguiente — orden de lectura.',
    templates: [2, 3, 12, 13, 10, 11, 2, 3, 12, 13],
  },
  {
    title: 'Variables con nombre',
    hook:
      'Una variable guarda un valor con una etiqueta que eliges: lo declaras una vez y lo reutilizas en Repetir.',
    templates: [8, 9, 10, 0, 1, 8, 9, 10, 8, 9],
  },
  {
    title: 'Memoria y reutilización',
    hook:
      'Guardar números en variables evita “números mágicos”: el nombre recuerda qué representa (pasos, vueltas…).',
    templates: [10, 11, 8, 9, 14, 15, 10, 11, 8, 9],
  },
  {
    title: 'Mezcla de herramientas',
    hook:
      'Programar real es combinar: secuencia, saltos, bucles y a veces variables — cada puzzle pide un combo distinto.',
    templates: [14, 15, 16, 18, 19, 20, 21, 14, 15, 16],
  },
  {
    title: 'Tableros más grandes',
    hook:
      'Cuando el lienzo crece, divide el problema: una fila, luego la siguiente; usa skip donde la meta está vacía.',
    templates: [19, 20, 21, 14, 15, 19, 20, 21, 14, 15],
  },
  {
    title: 'Proyecto final del recorrido',
    hook:
      'Junta todo lo visto: orden, líneas, huecos, bucles y variables — léelo como un mini proyecto antes de ejecutar.',
    templates: [21, 19, 20, 18, 12, 13, 21, 19, 20, 18],
  },
]

/** English hooks for lesson intros (paired with {@link CHAPTER_THEMES}). */
export const CHAPTER_HOOKS_EN: readonly string[] = [
  'Your program is a list of instructions: each block runs after the previous one, just like lines of code.',
  'Execution order matters: one instruction first, then the next — like reading code from top to bottom.',
  'newLine() is like pressing Enter: you finish one “line” of the drawing and start another row on the canvas.',
  'Sometimes you do not paint: skip() means “move forward without drawing”, like skipping a step when it is not needed.',
  'Loops avoid repeating the same thing over and over: Repeat groups actions that must run multiple times.',
  'Patterns are recognizable sequences: combine Repeat with colors to describe short rhythms.',
  'Think of the canvas as rows and columns: first one full row, then the next — reading order.',
  'A variable stores a value with a label you choose: you declare it once and reuse it in Repeat.',
  'Saving numbers in variables avoids “magic numbers”: the name reminds you what it stands for (steps, rounds…).',
  'Real programming mixes sequence, breaks, loops, and sometimes variables — each puzzle asks for a different combo.',
  'When the canvas grows, split the problem: one row, then the next; use skip where the goal is empty.',
  'Bring it all together: order, lines, gaps, loops, and variables — read it like a mini project before you run.',
]

/** English chapter titles for the selector and lesson intros. */
export const CHAPTER_TITLES_EN: readonly string[] = [
  'First strokes',
  'Sequence and order',
  'Line break',
  'Gaps and choices',
  'Repeat without copying',
  'Patterns with rhythm',
  'Two dimensions',
  'Named variables',
  'Memory and reuse',
  'Mixing tools',
  'Larger boards',
  'Final project run',
]
