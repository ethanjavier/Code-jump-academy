export type LessonRunResult = { output: string; error?: string }

/** Safe-ish runner for authored curriculum snippets only (not arbitrary untrusted code). */
export function runJavaScriptLesson(code: string): LessonRunResult {
  const logs: string[] = []
  const fakeConsole = {
    log: (...args: unknown[]) => {
      logs.push(args.map(stringifyArg).join(' '))
    },
    warn: (...args: unknown[]) => {
      logs.push(args.map(stringifyArg).join(' '))
    },
    error: (...args: unknown[]) => {
      logs.push(args.map(stringifyArg).join(' '))
    },
    info: (...args: unknown[]) => {
      logs.push(args.map(stringifyArg).join(' '))
    },
  }
  try {
    const fn = new Function('console', `"use strict";\n${code}`)
    fn(fakeConsole)
  } catch (e) {
    return {
      output: logs.join('\n'),
      error: e instanceof Error ? e.message : String(e),
    }
  }
  return { output: logs.join('\n') }
}

function stringifyArg(a: unknown): string {
  if (typeof a === 'string') return a
  try {
    return JSON.stringify(a)
  } catch {
    return String(a)
  }
}

type PyodideModule = typeof import('pyodide')

let pyodideSingleton: Awaited<ReturnType<PyodideModule['loadPyodide']>> | null = null
let pyodideLoading: Promise<Awaited<ReturnType<PyodideModule['loadPyodide']>>> | null = null

export async function ensurePyodideLoaded(): Promise<Awaited<ReturnType<PyodideModule['loadPyodide']>>> {
  if (pyodideSingleton) return pyodideSingleton
  if (!pyodideLoading) {
    pyodideLoading = (async () => {
      const { loadPyodide } = await import('pyodide')
      pyodideSingleton = await loadPyodide()
      return pyodideSingleton
    })()
  }
  return pyodideLoading
}

export async function runPythonLesson(code: string): Promise<LessonRunResult> {
  const parts: string[] = []
  try {
    const pyodide = await ensurePyodideLoaded()
    pyodide.setStdout({ batched: (s: string) => parts.push(s) })
    pyodide.setStderr({ batched: (s: string) => parts.push(s) })
    await pyodide.runPythonAsync(code)
    return { output: parts.join('').replace(/\s+$/u, '') }
  } catch (e) {
    return {
      output: parts.join('').replace(/\s+$/u, ''),
      error: e instanceof Error ? e.message : String(e),
    }
  }
}
