import type { ColorKey } from '../engine/blocks'

export const STEP_DELAY_MS = 380

export type Meta = {
  label: string
  tailwindClass: string
  dotClass: string
}

/** Display names for puzzle instructions when UI locale is English */
export const COLOR_LABEL_EN: Record<ColorKey, string> = {
  red: 'Red',
  orange: 'Orange',
  yellow: 'Yellow',
  green: 'Green',
  blue: 'Blue',
  indigo: 'Indigo',
  purple: 'Purple',
}

export function colorLabel(c: ColorKey, locale: 'es' | 'en'): string {
  return locale === 'en' ? COLOR_LABEL_EN[c] : COLOR_META[c].label
}

export const COLOR_META: Record<ColorKey, Meta> = {
  red: { label: 'Rojo', tailwindClass: 'bg-red-500', dotClass: 'bg-red-500' },
  orange: {
    label: 'Naranja',
    tailwindClass: 'bg-orange-500',
    dotClass: 'bg-orange-500',
  },
  yellow: {
    label: 'Amarillo',
    tailwindClass: 'bg-yellow-400',
    dotClass: 'bg-yellow-400',
  },
  green: { label: 'Verde', tailwindClass: 'bg-green-500', dotClass: 'bg-green-500' },
  blue: { label: 'Azul', tailwindClass: 'bg-blue-500', dotClass: 'bg-blue-500' },
  indigo: {
    label: 'Índigo',
    tailwindClass: 'bg-indigo-500',
    dotClass: 'bg-indigo-500',
  },
  purple: {
    label: 'Morado',
    tailwindClass: 'bg-purple-500',
    dotClass: 'bg-purple-500',
  },
}

export type PaletteEntry = {
  id: string
  label: string
  description: string
  group: string
}

export const BLOCK_OPTIONS: PaletteEntry[] = [
  {
    id: 'newLine',
    label: 'newLine()',
    description: 'Salta a la siguiente fila',
    group: 'Acciones',
  },
  {
    id: 'skip',
    label: 'skip()',
    description: 'Avanza sin pintar (celda en blanco)',
    group: 'Acciones',
  },
  {
    id: 'repeat',
    label: 'Repetir',
    description: 'Repite los bloques internos',
    group: 'Control',
  },
  {
    id: 'varDecl',
    label: 'Crear variable',
    description: 'Guarda un número para usarlo en Repetir',
    group: 'Valores',
  },
  ...(
    [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'indigo',
      'purple',
    ] as ColorKey[]
  ).map((c) => ({
    id: `drawBox:${c}`,
    label: `drawBox("${c}")`,
    description: `Pinta la celda actual de ${COLOR_META[c].label.toLowerCase()}`,
    group: 'Acciones',
  })),
]
