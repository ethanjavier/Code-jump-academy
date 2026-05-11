import { Fragment, type ReactNode } from 'react'

/** Convierte `**así**` en negrita con color (explicaciones pedagógicas). */
export function renderMarkdownLite(text: string): ReactNode {
  if (!text) return null
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    const m = part.match(/^\*\*(.+)\*\*$/)
    if (m) {
      return (
        <strong key={i} className="font-semibold text-fuchsia-300">
          {m[1]}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

const HIGHLIGHT_TERMS = [
  'drawBox',
  'newLine()',
  'skip()',
  'Repetir',
  'Crear variable',
  'Secuenciación',
  'secuenciación',
  'Iteración',
  'iteración',
  'Sintaxis',
  'sintaxis',
  'función',
  'Función',
  'funciones',
  'Funciones',
  'bucle',
  'Bucle',
  'variable',
  'Variable',
  'newLine',
  'skip(',
]

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const TERM_RE = new RegExp(
  `(${[...HIGHLIGHT_TERMS].sort((a, b) => b.length - a.length).map(escapeRe).join('|')})`,
  'gi',
)

/** Resalta términos de código y conceptos en el texto largo de instrucciones. */
export function HighlightedInstructionText({ text }: { text: string }): ReactNode {
  if (!text) return null
  const parts = text.split(TERM_RE)
  return parts.map((p, i) => {
    if (!p) return null
    const hit = HIGHLIGHT_TERMS.find((t) => t.toLowerCase() === p.toLowerCase())
    if (hit) {
      return (
        <strong key={i} className="font-semibold text-cyan-300">
          {p}
        </strong>
      )
    }
    return <Fragment key={i}>{p}</Fragment>
  })
}
