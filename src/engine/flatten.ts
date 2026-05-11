import type { BlockNode, FlatStep, VarDeclBlock } from './blocks'
import { clampRepeatCount, DEFAULT_VAR_DECL_INITIAL } from './blocks'

export type FlattenResult =
  | { ok: true; steps: FlatStep[] }
  | { ok: false; message: string }

export type FlattenOptions = {
  /**
   * Puzzle-level names allowed for variables. If Repetir uses one of these before any
   * Crear variable appears, we assume that default count (matches UX: picking a name in the
   * dropdown should run without forcing block order when the student skipped Crear variable).
   */
  implicitVarNames?: readonly string[]
}

export function flattenToSteps(nodes: BlockNode[], options?: FlattenOptions): FlattenResult {
  const env: Record<string, number> = {}
  const steps: FlatStep[] = []
  const err = walk(nodes, env, steps, options)
  if (err) return { ok: false, message: err }
  return { ok: true, steps }
}

function walk(
  nodes: BlockNode[],
  env: Record<string, number>,
  out: FlatStep[],
  options?: FlattenOptions,
): string | undefined {
  for (const node of nodes) {
    if (node.kind === 'varDecl') {
      env[node.name] = clampRepeatCount(node.initial)
      continue
    }
    if (node.kind === 'drawBox') {
      out.push({ type: 'drawBox', color: node.color })
      continue
    }
    if (node.kind === 'newLine') {
      out.push({ type: 'newLine' })
      continue
    }
    if (node.kind === 'skip') {
      out.push({ type: 'skip' })
      continue
    }

    // `repeat` — only remaining node kind
    const repeatNode = node

    // Variable blocks nested inside Repetir often appear *before* inner draw instructions.
    // Apply leading varDecl children to `env` before resolving the loop count so
    // `Repetir(pasos)` works when `pasos` is the first child inside the repeat.
    let bodyOffset = 0
    while (
      bodyOffset < repeatNode.children.length &&
      repeatNode.children[bodyOffset]!.kind === 'varDecl'
    ) {
      const vd = repeatNode.children[bodyOffset] as VarDeclBlock
      env[vd.name] = clampRepeatCount(vd.initial)
      bodyOffset += 1
    }

    let count: number
    if (repeatNode.count.type === 'literal') {
      count = clampRepeatCount(repeatNode.count.value)
    } else {
      let v = env[repeatNode.count.name]
      if (
        v === undefined &&
        options?.implicitVarNames?.includes(repeatNode.count.name)
      ) {
        v = clampRepeatCount(DEFAULT_VAR_DECL_INITIAL)
        env[repeatNode.count.name] = v
      }
      if (v === undefined) {
        return `La variable "${repeatNode.count.name}" no está definida arriba en el programa.`
      }
      count = clampRepeatCount(v)
    }
    const innerSteps: FlatStep[] = []
    const innerErr = walk(repeatNode.children.slice(bodyOffset), env, innerSteps, options)
    if (innerErr) return innerErr
    for (let i = 0; i < count; i += 1) {
      out.push(...innerSteps.map((s) => ({ ...s })))
    }
  }
  return undefined
}
