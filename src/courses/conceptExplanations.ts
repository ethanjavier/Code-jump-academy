import type { GuidedConceptKey } from './guidedLessonTypes'

/**
 * Shown when a lesson introduces a new idea — compares to CodeJump blocks where it helps.
 */
export const CONCEPT_EXPLANATIONS: Record<
  GuidedConceptKey,
  { es: string; en: string }
> = {
  variable: {
    es:
      'En el lienzo de bloques guardas números con **Crear variable** para usarlos después en **Repetir**. En JavaScript, una variable es lo mismo en texto: un **nombre** que recuerda un valor (`let`, `const`) para no repetir números mágicos y para que el código se lea con sentido.',
    en:
      'On the block canvas you store numbers with **Create variable** and reuse them in **Repeat**. In JavaScript, a variable is the same idea in text: a **name** that remembers a value (`let`, `const`) so you avoid magic numbers and your code reads clearly.',
  },
  console: {
    es:
      '`console.log(...)` es tu **salida de texto**: muestra valores en la consola del navegador, parecido a ver el resultado de ejecutar bloques paso a paso. Úsalo para comprobar qué vale cada variable o expresión.',
    en:
      '`console.log(...)` is your **text output**: it prints values in the browser console, like watching block execution step by step. Use it to check what each variable or expression evaluates to.',
  },
  if_branch: {
    es:
      'Un **if** elige si ejecutas un trozo de código o no: como decidir “solo si pasa esto, pinta esta celda”. En bloques sería una decisión antes de encadenar órdenes; aquí la escribes con `if (condición) { ... }`.',
    en:
      'An **if** chooses whether to run a chunk of code — like deciding “only if this is true, take this action”. In blocks that would be a decision before stacking orders; here you write `if (condition) { ... }`.',
  },
  repeat_loop: {
    es:
      'En CodeJump, el bloque **Repetir** ejecuta varias veces lo que hay **dentro**. En JavaScript, un **`for`** hace esa misma idea: el código entre llaves `{ }` se ejecuta una vez por **vuelta**; el contador (`let i = 0; i < n; i++`) dice cuántas vueltas — como la **cuenta** del Repetir. Cada vuelta puede usar `i` como el “paso actual”.',
    en:
      'In CodeJump, **Repeat** runs whatever is **inside** it multiple times. In JavaScript, a **`for` loop** does the same: the code in `{ }` runs once per **iteration**; the header (`let i = 0; i < n; i++`) says how many times — like Repeat’s **count**. Each round can use `i` as the “current step”.',
  },
  function_block: {
    es:
      'Una **función** agrupa varias instrucciones con un nombre: como un **programa dentro del programa** que puedes llamar cuando quieras. Recuerda a agrupar bloques en un solo paso reutilizable; aquí usas `function nombre() { ... }` o flechas `() => { ... }`.',
    en:
      'A **function** groups instructions under one name — like a **mini program** you can call anytime. It is similar to grouping blocks into one reusable step; in JS you write `function name() { ... }` or arrow functions `() => { ... }`.',
  },
  array_data: {
    es:
      'Un **array** `[]` es una **lista ordenada** de valores: posición 0, 1, 2… Como una fila de celdas en el lienzo: accedes con `lista[i]` igual que recorrer columnas con un índice.',
    en:
      'An **array** `[]` is an **ordered list** of values at indexes 0, 1, 2… Like a row of cells on the canvas: you read `list[i]` much like stepping through columns with an index.',
  },
}
