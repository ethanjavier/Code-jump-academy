/**
 * Copy pedagógico por plantilla de puzzle (alineado con ramas de `buildLevel`).
 * Tono: alentador, claro, es/neutro + en.
 */

export type LevelPedagogy = {
  conceptEs: string
  conceptEn: string
  explanationEs: string
  explanationEn: string
  hintEs: string
  hintEn: string
  storyGoalEs: string
  storyGoalEn: string
}

export function pedagogyForTemplate(
  templateId: number,
  opts: {
    chapterIndex: number
    puzzleIndex: number
    showRepeat: boolean
    hasSkipInPattern: boolean
    showVars: boolean
  },
): LevelPedagogy {
  const { chapterIndex, puzzleIndex, showRepeat, hasSkipInPattern, showVars } = opts

  if (chapterIndex === 0 && puzzleIndex === 0) {
    return {
      conceptEs: 'Secuenciación',
      conceptEn: 'Sequencing',
      explanationEs:
        '¡Hola, programador! Para pintar, usamos **funciones**: cada **drawBox("color")** es una orden que el robot entiende. Tu misión: ponerlas en el **orden exacto** de la meta — eso es **secuenciación**, el primer superpoder del código.',
      explanationEn:
        'Hey coder! To paint we use **functions**: each **drawBox("color")** is a command the robot understands. Your mission: place them in the **exact goal order** — that is **sequencing**, code’s first superpower.',
      hintEs:
        '¿El lienzo no coincide? Compara celda a celda con la miniatura: el **orden** de los **drawBox** debe ser idéntico. ¡Un color fuera de lugar cambia todo!',
      hintEn:
        'Canvas does not match? Compare cell by cell with the thumbnail: **drawBox** **order** must be identical. One color out of place changes everything!',
      storyGoalEs: '¡Ayuda al robot a pintar su primera franja del jardín!',
      storyGoalEn: 'Help the robot paint the first stripe in the garden!',
    }
  }

  const baseLoop = (): LevelPedagogy => ({
    conceptEs: 'Iteración',
    conceptEn: 'Iteration',
    explanationEs:
      '¿Cansado de repetir lo mismo? Un **bucle** (aquí: **Repetir**) es un superpoder: escribes el trozo una vez y el programa lo ejecuta varias veces por ti.',
    explanationEn:
      'Tired of repeating yourself? A **loop** (here: **Repeat**) is a superpower: you write a chunk once and the program runs it several times for you.',
    hintEs:
      '¡Casi! Cuenta cuántas celdas del mismo color necesitas: el número del **Repetir** debe coincidir. Dentro solo un **drawBox** del color correcto.',
    hintEn:
      'So close! Count how many same-color cells you need: the **Repeat** count must match. Put a single **drawBox** of the right color inside.',
    storyGoalEs: '¡Ayuda al robot a pintar varias casillas sin cansarse!',
    storyGoalEn: 'Help the robot paint many cells without getting tired!',
  })

  const baseSkip = (): LevelPedagogy => ({
    conceptEs: 'Sintaxis y huecos',
    conceptEn: 'Syntax and gaps',
    explanationEs:
      'No todas las casillas llevan color. **skip()** es una **función** que dice “avanza sin pintar”: igual de importante que **drawBox** para seguir la meta.',
    explanationEn:
      'Not every cell gets color. **skip()** is a **function** that means “move without painting”: just as important as **drawBox** to match the goal.',
    hintEs:
      '¡Casi lo tienes! ¿Revisaste si falta un **skip()** donde la meta muestra celda vacía? El cursor debe recorrer **todas** las casillas en orden.',
    hintEn:
      'Almost there! Did you add **skip()** wherever the goal shows an empty cell? The cursor must visit **every** cell in order.',
    storyGoalEs: '¡Guía al cursor por el camino exacto, con color y huecos!',
    storyGoalEn: 'Guide the cursor along the exact path — color and gaps!',
  })

  const baseSequence = (twoRows: boolean): LevelPedagogy => ({
    conceptEs: 'Secuenciación',
    conceptEn: 'Sequencing',
    explanationEs: twoRows
      ? 'Los programas se leen de arriba abajo. Primero una fila de **drawBox**, luego **newLine()** para bajar, y después la segunda fila: ¡eso es **secuenciación**!'
      : '¡Hola, programador! Para pintar usamos **funciones** como **drawBox("color")**: cada una es una orden. Encadenarlas en orden es **secuenciación** — el corazón del código.',
    explanationEn: twoRows
      ? 'Programs read top to bottom. First a row of **drawBox**, then **newLine()** to move down, then the second row — that is **sequencing**!'
      : 'Hey coder! To paint we use **functions** like **drawBox("color")**: each one is a command. Chaining them in order is **sequencing** — the heart of code.',
    hintEs: twoRows
      ? '¿La segunda fila quedó arriba? Falta **newLine()** entre filas. Revisa el orden de colores con la miniatura.'
      : '¿Algún color “saltó”? Compara celda a celda con la meta: el orden de **drawBox** debe ser idéntico.',
    hintEn: twoRows
      ? 'Is the second row stuck on top? You need **newLine()** between rows. Check the color order with the thumbnail.'
      : 'Did a color “jump”? Compare cell by cell with the goal: **drawBox** order must match exactly.',
    storyGoalEs: twoRows
      ? '¡Dos filas de colores: como un cartel de dos líneas!'
      : '¡Tu primer trazo en el lienzo: una fila perfecta!',
    storyGoalEn: twoRows
      ? 'Two rows of colors — like a two-line sign!'
      : 'Your first brushstroke on the canvas — one perfect row!',
  })

  if (templateId === 0 || templateId === 1) {
    const p = baseSequence(false)
    if (showRepeat) {
      return {
        ...p,
        conceptEs: 'Secuenciación + iteración',
        conceptEn: 'Sequencing + iteration',
        explanationEs:
          p.explanationEs +
          ' Si la fila repite el mismo color, un **Repetir** puede acortar tu código (mismo orden, menos bloques).',
        explanationEn:
          p.explanationEn +
          ' If the row repeats the same color, **Repeat** can shorten your code (same order, fewer blocks).',
        hintEs:
          p.hintEs +
          ' Si usas **Repetir**, el número debe ser igual al número de celdas de ese color.',
        hintEn:
          p.hintEn +
          ' If you use **Repeat**, the count must match how many cells use that color.',
      }
    }
    return p
  }

  if (templateId === 2 || templateId === 3) {
    return baseSequence(true)
  }

  if (templateId === 4 || templateId === 5) {
    return baseSkip()
  }

  if (templateId === 6 || templateId === 7) {
    return {
      ...baseSequence(false),
      storyGoalEs: '¡Una franja multicolor: precisión de campeón!',
      storyGoalEn: 'A multicolor stripe — champion precision!',
    }
  }

  if (templateId === 8 || templateId === 9) {
    if (showRepeat) return baseLoop()
    return {
      conceptEs: 'Secuenciación',
      conceptEn: 'Sequencing',
      explanationEs:
        'Aquí conviene repetir el mismo **drawBox** varias veces seguidas. Sin **Repetir** aún, la **secuenciación** pura: misma orden, varios bloques iguales.',
      explanationEn:
        'Here you repeat the same **drawBox** several times in a row. Without **Repeat** yet, pure **sequencing**: same order, several identical blocks.',
      hintEs: 'Cuenta las celdas del mismo color: necesitas ese número de **drawBox** seguidos (o activa **Repetir** si ya está en la paleta).',
      hintEn: 'Count same-color cells: you need that many **drawBox** calls in a row (or use **Repeat** if it is on the palette).',
      storyGoalEs: '¡Pinta la franja sólida como una máquina de precisión!',
      storyGoalEn: 'Paint the solid stripe like a precision machine!',
    }
  }

  if (templateId === 10 || templateId === 11) {
    const p = baseLoop()
    return {
      ...p,
      explanationEs:
        'Dos filas enteras: **Repetir** + **drawBox** ahorra bloques en cada fila. Entre filas, **newLine()** mantiene la **secuenciación** correcta.',
      explanationEn:
        'Two full rows: **Repeat** + **drawBox** saves blocks on each row. Between rows, **newLine()** keeps **sequencing** correct.',
      hintEs:
        '¿Solo una fila pintada? Falta **newLine()** entre la primera tanda de **Repetir** y la segunda. Revisa que cada **Repetir** tenga el mismo ancho que la fila.',
      hintEn:
        'Only one row painted? You need **newLine()** between the first **Repeat** block and the second. Each **Repeat** should span the full row width.',
      storyGoalEs: '¡Dos bandas de color: doble victoria en el jardín!',
      storyGoalEn: 'Two color bands — double win in the garden!',
    }
  }

  if (templateId === 12 || templateId === 13) {
    return {
      conceptEs: 'Patrones',
      conceptEn: 'Patterns',
      explanationEs:
        'Patrón tipo dama: alternas colores siguiendo la meta. Es **secuenciación** con regla visual: una celda sí, otra también, ¡pero en orden de lectura!',
      explanationEn:
        'Checkerboard-style pattern: alternate colors following the goal. It is **sequencing** with a visual rule — cell by cell in reading order!',
      hintEs:
        'Si el patrón “rompe” a mitad de fila, suele ser un **drawBox** fuera de orden o falta de **newLine()** entre filas.',
      hintEn:
        'If the pattern “breaks” mid-row, often a **drawBox** is out of order or **newLine()** is missing between rows.',
      storyGoalEs: '¡El tablero pide ritmo: alterna colores como un DJ!',
      storyGoalEn: 'The board wants rhythm — alternate colors like a DJ!',
    }
  }

  if (templateId === 14 || templateId === 15) {
    return {
      ...baseSkip(),
      explanationEs:
        'Zona con color y zona vacía: mezclas **drawBox** y **skip()** en una **secuencia** larga. El “porqué”: el cursor siempre avanza; tú eliges pintar o no.',
      explanationEn:
        'Colored zone and empty zone: you mix **drawBox** and **skip()** in one long **sequence**. Why? The cursor always moves; you choose paint or skip.',
      storyGoalEs: '¡Encuentra el tesoro entre celdas pintadas y pasos vacíos!',
      storyGoalEn: 'Find the treasure between painted cells and empty steps!',
    }
  }

  if (templateId === 16 || templateId === 17) {
    return {
      ...baseSkip(),
      explanationEs:
        'Empiezas con color y terminas con huecos: **secuenciación** + **skip()** al final de la fila. Piensa en “pintar primero, saltar después”.',
      explanationEn:
        'You start with color and end with gaps: **sequencing** + **skip()** at the end of the row. Think “paint first, skip after”.',
      storyGoalEs: '¡Como pintar la vereda y dejar el pasto sin tocar!',
      storyGoalEn: 'Like painting the path and leaving the grass untouched!',
    }
  }

  if (templateId === 18) {
    return {
      conceptEs: 'Secuenciación',
      conceptEn: 'Sequencing',
      explanationEs:
        'Arcoíris: un color distinto por celda. Es puro orden: **función** tras **función** sin saltarte ningún color de la lista.',
      explanationEn:
        'Rainbow: a different color per cell. Pure order: **function** after **function** without skipping any color in the list.',
      hintEs:
        '¿Un color duplicado donde no toca? Revisa la miniatura de izquierda a derecha: cada **drawBox** debe ser el siguiente color de la **secuencia**.',
      hintEn:
        'A color duplicated where it should not be? Check the thumbnail left to right: each **drawBox** must be the next color in the **sequence**.',
      storyGoalEs: '¡Un arcoíris en el lienzo: un color por paso!',
      storyGoalEn: 'A rainbow on the canvas — one color per step!',
    }
  }

  // t >= 19 default grid / complejo
  return {
    conceptEs: hasSkipInPattern ? 'Secuenciación + huecos' : 'Secuenciación',
    conceptEn: hasSkipInPattern ? 'Sequencing + gaps' : 'Sequencing',
    explanationEs:
      (hasSkipInPattern
        ? 'Varias filas: recorre como un libro (fila 1, luego 2…). Mezcla **drawBox** y **skip()** donde la meta lo pida: es leer el mapa con atención.'
        : 'Varias filas de color: sigue el orden de lectura. Cada **drawBox** es un paso; **newLine()** te cambia de “línea del libro”.') +
      (showVars
        ? ' Las **variables** guardan números para que **Repetir** y el código hablen el mismo idioma.'
        : ''),
    explanationEn:
      (hasSkipInPattern
        ? 'Multiple rows: walk like a book (row 1, then 2…). Mix **drawBox** and **skip()** where the goal says so — read the map carefully.'
        : 'Multiple colored rows: follow reading order. Each **drawBox** is a step; **newLine()** is your “next line in the book”.') +
      (showVars
        ? ' **Variables** store numbers so **Repeat** and your code speak the same language.'
        : ''),
    hintEs:
      'Si el lienzo “casi” coincide: falta un **skip()**, un **newLine()** o un **drawBox** en el sitio equivocado. Comparar con la meta fila por fila suele revelarlo.',
    hintEn:
      'If the canvas “almost” matches: a **skip()**, **newLine()**, or **drawBox** is missing or misplaced. Compare row by row with the goal.',
    storyGoalEs: '¡Mapa grande, misión épica: pinta solo donde hay magia!',
    storyGoalEn: 'Big map, epic mission — paint only where the magic is!',
  }
}
