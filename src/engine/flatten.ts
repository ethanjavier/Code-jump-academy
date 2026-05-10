import type { BlockNode, FlatStep } from './blocks'
import { clampRepeatCount } from './blocks'

export type FlattenResult =
  | { ok: true; steps: FlatStep[] }
  | { ok: false; message: string }

export function flattenToSteps(nodes: BlockNode[]): FlattenResult {
  const env: Record<string, number> = {}
  const steps: FlatStep[] = []
  const err = walk(nodes, env, steps)
  if (err) return { ok: false, message: err }
  return { ok: true, steps }
}

function walk(
  nodes: BlockNode[],
  env: Record<string, number>,
  out: FlatStep[],
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
    let count: number
    if (node.count.type === 'literal') {
      count = clampRepeatCount(node.count.value)
    } else {
      const v = env[node.count.name]
      if (v === undefined) {
        return `La variable "${node.count.name}" no está definida arriba en el programa.`
      }
      count = clampRepeatCount(v)
    }
    const innerSteps: FlatStep[] = []
    const innerErr = walk(node.children, env, innerSteps)
    if (innerErr) return innerErr
    for (let i = 0; i < count; i += 1) {
      out.push(...innerSteps.map((s) => ({ ...s })))
    }
  }
  return undefined
}
