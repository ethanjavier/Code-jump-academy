import type { Level } from '../types/level'
import type { BlockNode, ColorKey, CountSource } from '../engine/blocks'

export function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `b-${Math.random().toString(36).slice(2)}`
}

export function parseRows(level: Level): number {
  const { gridCols, targetPattern } = level
  if (gridCols <= 0) return 0
  return Math.ceil(targetPattern.length / gridCols)
}

export function emptyGrid(rows: number, cols: number): (ColorKey | '')[][] {
  return Array.from({ length: rows }, () => Array<ColorKey | ''>(cols).fill(''))
}

export function cloneGrid(grid: (ColorKey | '')[][]): (ColorKey | '')[][] {
  return grid.map((row) => [...row])
}

export function gridToFlatPattern(
  grid: (ColorKey | '')[][],
  cols: number,
): string[] {
  const rows = grid.length
  const cells: string[] = []
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      cells.push(grid[r][c] === '' ? '' : grid[r][c])
    }
  }
  return cells
}

export function patternsMatch(actual: string[], target: string[]): boolean {
  if (actual.length !== target.length) return false
  for (let i = 0; i < actual.length; i += 1) {
    const t = target[i]
    if (t === 'skip') continue
    if (t === '' && actual[i] === '') continue
    if (t === '' && actual[i] !== '') return false
    if (actual[i] !== t) return false
  }
  return true
}

export function removeBlockById(nodes: BlockNode[], id: string): BlockNode[] {
  const next: BlockNode[] = []
  for (const node of nodes) {
    if (node.id === id) continue
    if (node.kind === 'repeat') {
      next.push({
        ...node,
        children: removeBlockById(node.children, id),
      })
    } else {
      next.push(node)
    }
  }
  return next
}

export function appendBlock(
  nodes: BlockNode[],
  targetParentId: 'root' | string,
  block: BlockNode,
): BlockNode[] {
  if (block.kind === 'varDecl') {
    return [...nodes, block]
  }
  if (targetParentId === 'root') {
    return [...nodes, block]
  }
  return nodes.map((node) => {
    if (node.kind === 'repeat') {
      if (node.id === targetParentId) {
        return { ...node, children: [...node.children, block] }
      }
      return {
        ...node,
        children: appendBlock(node.children, targetParentId, block),
      }
    }
    return node
  })
}

export function updateRepeatCountSource(
  nodes: BlockNode[],
  id: string,
  count: CountSource,
): BlockNode[] {
  return nodes.map((node) => {
    if (node.kind === 'repeat') {
      if (node.id === id) {
        return { ...node, count }
      }
      return {
        ...node,
        children: updateRepeatCountSource(node.children, id, count),
      }
    }
    return node
  })
}

export function updateVarDecl(
  nodes: BlockNode[],
  id: string,
  patch: Partial<{ name: string; initial: number }>,
): BlockNode[] {
  return nodes.map((node) => {
    if (node.kind === 'varDecl' && node.id === id) {
      return { ...node, ...patch }
    }
    if (node.kind === 'repeat') {
      return {
        ...node,
        children: updateVarDecl(node.children, id, patch),
      }
    }
    return node
  })
}

export function formatCountLabel(cs: CountSource): string {
  if (cs.type === 'literal') return `${cs.value}×`
  return cs.name
}
