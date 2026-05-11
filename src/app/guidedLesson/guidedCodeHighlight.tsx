import type { ReactNode } from 'react'

import type { LearningLanguageId } from '../learningTracks'
import { buildKeywordSet, emeraldCallRegexes } from './guidedHighlightLexicon'

/** Outer canvas — deep navy (stack interactive bands inside {@link GuidedReorderBandStack}). */
export function GuidedReorderFlowSurface({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#0f172a] ring-1 ring-white/[0.08]">{children}</div>
  )
}

/** Padded column with gaps between band cards (second reference image). */
export function GuidedReorderBandStack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2.5 p-3">{children}</div>
}

/**
 * One draggable row: lighter slab than canvas, rounded corners, subtle border — matches “block” reorder UI.
 */
export function GuidedReorderBandCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex min-h-[2.75rem] items-center gap-3 rounded-xl border border-white/[0.1] bg-[#1e293b]/95 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ring-1 ring-black/25 ${className}`}
    >
      {children}
    </div>
  )
}

/** Split `line` into string literals vs other (supports ', ", `). */
function splitByStrings(line: string): Array<{ t: 'code' | 'str'; v: string }> {
  const out: Array<{ t: 'code' | 'str'; v: string }> = []
  let i = 0
  while (i < line.length) {
    const q = line[i]
    if (q === '"' || q === "'" || q === '`') {
      let j = i + 1
      let esc = false
      for (; j < line.length; j++) {
        const ch = line[j]!
        if (esc) {
          esc = false
          continue
        }
        if (ch === '\\') {
          esc = true
          continue
        }
        if (ch === q) {
          j++
          break
        }
      }
      out.push({ t: 'str', v: line.slice(i, j) })
      i = j
    } else {
      let j = i
      while (j < line.length && line[j] !== '"' && line[j] !== "'" && line[j] !== '`') {
        j++
      }
      if (j > i) out.push({ t: 'code', v: line.slice(i, j) })
      i = j
    }
  }
  return out
}

function highlightWordTokens(segment: string, keyPrefix: string, kw: Set<string>): ReactNode[] {
  const out: ReactNode[] = []
  const wordRe = /\b[a-zA-Z_][a-zA-Z0-9_]*\b|[^\w]+|\d+/g
  let m: RegExpExecArray | null
  let k = 0
  while ((m = wordRe.exec(segment)) !== null) {
    const token = m[0]
    const isWord = /^\w+$/.test(token) && kw.has(token)
    if (isWord) {
      out.push(
        <span key={`${keyPrefix}-kw-${k++}`} className="font-medium text-cyan-300">
          {token}
        </span>,
      )
    } else if (/^\d+$/.test(token)) {
      out.push(
        <span key={`${keyPrefix}-num-${k++}`} className="text-violet-200/90">
          {token}
        </span>,
      )
    } else {
      out.push(
        <span key={`${keyPrefix}-def-${k++}`} className="text-white/95">
          {token}
        </span>,
      )
    }
  }
  return out
}

function highlightCodeChunk(
  chunk: string,
  keyPrefix: string,
  kw: Set<string>,
  emeraldRes: readonly RegExp[],
): ReactNode[] {
  if (!chunk) return []
  let work = chunk
  const stash: string[] = []
  for (const re of emeraldRes) {
    work = work.replace(re, (m) => {
      stash.push(m)
      return `\uE000${stash.length - 1}\uE001`
    })
  }
  const segments = work.split(/\uE000(\d+)\uE001/)
  const out: ReactNode[] = []
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!
    if (i % 2 === 0) {
      out.push(...highlightWordTokens(seg, `${keyPrefix}-w${i}`, kw))
    } else {
      const stashIdx = Number(seg)
      const text = stash[stashIdx]
      if (text) {
        out.push(
          <span key={`${keyPrefix}-em-${i}`} className="font-medium text-emerald-400">
            {text}
          </span>,
        )
      }
    }
  }
  return out
}

/** Syntax colors tuned for advanced guided “flow” rows (cyan keywords, emerald calls, violet digits). */
export function highlightGuidedCodeLine(line: string, rowKey: string, lang: LearningLanguageId): ReactNode {
  if (!line.trim()) {
    return <span className="text-white/40">…</span>
  }
  const kw = buildKeywordSet(lang)
  const emeraldRes = emeraldCallRegexes(lang)
  const pieces = splitByStrings(line)
  const nodes: ReactNode[] = []
  pieces.forEach((p, i) => {
    if (p.t === 'str') {
      nodes.push(
        <span key={`${rowKey}-s${i}`} className="text-amber-200/90">
          {p.v}
        </span>,
      )
    } else {
      nodes.push(
        <span key={`${rowKey}-c${i}`}>{highlightCodeChunk(p.v, `${rowKey}-c${i}`, kw, emeraldRes)}</span>,
      )
    }
  })
  return <>{nodes}</>
}
