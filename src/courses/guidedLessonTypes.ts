import type { LearningLanguageId } from '../app/learningTracks'
import type { ColorKey } from '../engine/blocks'

import type { StripeSwatch } from './stripeSwatch'

export type Localized = { es: string; en: string }

/** Concepts that unlock the “new idea” explainer (ties to CodeJump blocks when useful). */
export type GuidedConceptKey =
  | 'variable'
  | 'console'
  | 'if_branch'
  | 'repeat_loop'
  | 'function_block'
  | 'array_data'

export type OrderLinesExercise = {
  type: 'orderLines'
  /**
   * Code lines (short, one per row). Add more rows as the lesson’s flow grows (e.g. declare → use → close).
   */
  lines: Localized[]
  /** Permutation of indices 0..n-1 that is correct top-to-bottom. */
  correctOrder: number[]
}

/**
 * One program built from small fragments (keywords, names, punctuation).
 * User reorders rows top → bottom; concatenating fragments in that order must yield valid source.
 */
export type AssembleLineExercise = {
  type: 'assembleLine'
  /**
   * Tokens top → bottom concatenate into one line. Add more entries as the lesson introduces names,
   * operators, literals, or punctuation the learner must place in order.
   */
  tokens: Localized[]
  /** Indices top → bottom when fragments read correctly as one program (concatenate in order). */
  correctOrder: number[]
  wrongHint: Localized
}

export type PickOneExercise = {
  type: 'pickOne'
  prompt: Localized
  options: [Localized, Localized, Localized, Localized]
  correctIndex: 0 | 1 | 2 | 3
  wrongHint: Localized
}

export type RunCodeExercise = {
  type: 'runCode'
  runtime: 'javascript' | 'python'
  /** Starter template shown in the editor (user edits and taps Run). */
  starter: Localized
  /**
   * Every substring must appear in the combined Run output + error text (locale-specific).
   * Add more entries as the lesson checks extra outcomes (e.g. a literal, a label, a second line).
   */
  expectOutputIncludes: { es: string[]; en: string[] }
  wrongHint: Localized
}

/** One “franja” of the logic flag: label + role + color (interactive ordering exercise). */
export type StripePiece = {
  id: string
  /** Short title on the chip */
  label: Localized
  /** Optional monospace snippet */
  snippet?: Localized
  /** What this step/idea does in the program (shown in the tools panel). */
  roleExplanation: Localized
  swatch: StripeSwatch
}

/**
 * Order scrambled stripes top → bottom to match the correct program / trace flow.
 * Like painting a flag: each stripe is a variable step you learn by reading its role.
 */
export type StripeChallengeExercise = {
  type: 'stripeChallenge'
  /** Shown above the goal flag preview */
  flagTitle: Localized
  /** Add more stripes as the lesson’s story has more steps (variables, branches, loops, …). */
  pieces: StripePiece[]
  /** Permutation of indices 0..n-1: correct order top → bottom */
  correctOrder: number[]
  wrongHint: Localized
}

/** Snippets-only coding: learner builds text using palette inserts; typing from keyboard is disabled in the runner. */
export type PaletteCodePiece = {
  id: string
  insertText: Localized
  hint?: Localized
}

/** One colored band in the live canvas / success modal (same order as lines in {@link PaletteCodeExercise.correctText}). */
export type PaletteCodeResultStripe = {
  swatch: StripeSwatch
  caption: Localized
}

/**
 * Large interactive focal on the beginner canvas — matches the lesson metaphor
 * (greeting word, SQL funnel, HTML sandwich, etc.).
 */
export type PaletteCodeCanvasHero =
  | {
      mode: 'greeting'
      headline: Localized
      highlightWhenFirstLineMatches?: boolean
    }
  | {
      mode: 'typeRibbon'
      headline: Localized
      highlightWhenFirstLineMatches?: boolean
    }
  | {
      mode: 'sqlRiver'
      highlightWhenFirstLineMatches?: boolean
    }
  | {
      mode: 'htmlLayers'
      headline: Localized
      highlightWhenFirstLineMatches?: boolean
    }
  | {
      mode: 'pipeline'
      headline: Localized
      highlightWhenFirstLineMatches?: boolean
    }

export type PaletteCodeExercise = {
  type: 'paletteCode'
  /**
   * Insert-only snippets for the editor. Add more cards as the lesson needs (keywords, literals,
   * new lines, extra lines of code).
   */
  palette: PaletteCodePiece[]
  /** Exact expected source after normalizing newlines (matches concatenation of lines with \\n). */
  correctText: Localized
  wrongHint: Localized
  /** Short goal line for the tools column */
  goalSummary: Localized
  /** Drives the beginner canvas preview and celebration modal — one stripe per program line. */
  resultPreview?: PaletteCodeResultStripe[]
  /** Optional giant canvas focal word — see {@link PaletteCodeCanvasHero}. */
  canvasHero?: PaletteCodeCanvasHero
}

export type GuidedExercise =
  | OrderLinesExercise
  | AssembleLineExercise
  | PickOneExercise
  | RunCodeExercise
  | StripeChallengeExercise
  | PaletteCodeExercise

/**
 * Mini “lienzo” para modo principiante: misma analogía visual que Bloques (drawBox, skip,
 * newLine, variables, Repetir…). Filas = bandas que se leen de arriba abajo.
 */
/** Miniatura del objetivo en el lienzo (bandera, fila con huecos…). */
export type GuidedCanvasGoalPreview =
  | { type: 'stripes'; colors: ColorKey[] }
  | { type: 'cells'; items: Array<ColorKey | 'skip'> }

export type GuidedCanvasPiece =
  | {
      kind: 'realGoal'
      headline: Localized
      detail?: Localized
      preview?: GuidedCanvasGoalPreview
    }
  | { kind: 'drawBox'; color: ColorKey }
  | { kind: 'skip' }
  | { kind: 'newLine' }
  | { kind: 'varDecl'; name: Localized; value: number }
  | { kind: 'repeat'; count: Localized; inner: GuidedCanvasPiece[] }
  | { kind: 'caption'; text: Localized }
  | { kind: 'terminal'; line: Localized }
  | { kind: 'arrowHint' }
  | {
      kind: 'ifSplit'
      cond: Localized
      thenLine: Localized
      elseLine: Localized
    }
  | { kind: 'functionShell'; name: Localized; inner: GuidedCanvasPiece[] }
  | { kind: 'arrayCells'; items: Localized[] }
  /** Beginner palette: one row per stripe piece (mirrors block palette cards). */
  | { kind: 'stripePaletteChip'; label: Localized; snippet?: Localized; swatch: StripeSwatch }

export type GuidedCanvasRow = GuidedCanvasPiece[]

export type GuidedLesson = {
  id: string
  title: Localized
  /** Teaching text: instructions + goal (like blocks/canvas instructions). */
  instruction: Localized
  /** When set, shows the concept panel + links to blocks canvas ideas. */
  introducesConcept?: GuidedConceptKey
  /** Optional beginner-only block canvas; if omitted, a default is derived from `introducesConcept`. */
  canvasLienzo?: GuidedCanvasRow[]
  exercise: GuidedExercise
}

export type GuidedCourse = {
  languageId: LearningLanguageId
  lessons: GuidedLesson[]
}
