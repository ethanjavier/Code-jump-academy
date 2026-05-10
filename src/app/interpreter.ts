import type { ColorKey, FlatStep } from '../engine/blocks'
import { cloneGrid, emptyGrid } from './helpers'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function runStepsOnGrid(
  steps: FlatStep[],
  rows: number,
  cols: number,
  onFrame: (grid: (ColorKey | '')[][], cursor: { row: number; col: number }) => void,
  delayMs: number,
  signal: AbortSignal,
): Promise<(ColorKey | '')[][]> {
  const grid = emptyGrid(rows, cols)
  let row = 0
  let col = 0

  const paint = () => {
    onFrame(cloneGrid(grid), { row, col })
  }
  paint()

  for (const step of steps) {
    if (signal.aborted) break
    if (step.type === 'newLine') {
      row += 1
      col = 0
    } else {
      if (row < rows && col < cols) {
        grid[row][col] = step.color
      }
      col += 1
      if (col >= cols) {
        row += 1
        col = 0
      }
    }
    paint()
    await sleep(delayMs)
    if (signal.aborted) break
  }

  return grid
}
