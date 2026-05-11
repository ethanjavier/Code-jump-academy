import type { LucideIcon } from 'lucide-react'
import {
  Binary,
  Blocks as BlocksIcon,
  Code2,
  Coffee,
  Cpu,
  Database,
  FileCode2,
  FlaskConical,
  Gem,
  Infinity as InfinityIcon,
  Layers,
  LayoutGrid,
  LayoutTemplate,
  LineChart,
  Moon,
  Rocket,
  Shield,
  SquareCode,
  Terminal,
  Wind,
  Zap,
} from 'lucide-react'

/** Ordered list of programming tracks on the learning hub: `blocks` = canvas game; others = quiz practice. */
export const LEARNING_TRACK_ORDER = [
  'blocks',
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'cpp',
  'c_lang',
  'go',
  'rust',
  'swift',
  'kotlin',
  'ruby',
  'php',
  'sql',
  'html_css',
  'dart',
  'lua',
  'shell_bash',
  'r_lang',
  'scala',
  'elixir',
  'haskell',
] as const

export type LearningLanguageId = (typeof LEARNING_TRACK_ORDER)[number]

/** Canvas + block puzzle campaign */
export function isCanvasTrack(id: LearningLanguageId): boolean {
  return id === 'blocks'
}

/** Text / quiz exercises exist for every programming track except blocks */
export function hasLanguagePractice(id: LearningLanguageId): boolean {
  return id !== 'blocks'
}

export const TRACK_ICONS: Record<LearningLanguageId, LucideIcon> = {
  blocks: LayoutGrid,
  javascript: Code2,
  typescript: SquareCode,
  python: Binary,
  java: Coffee,
  csharp: BlocksIcon,
  cpp: Cpu,
  c_lang: FileCode2,
  go: Rocket,
  rust: Shield,
  swift: Wind,
  kotlin: Gem,
  ruby: Gem,
  php: FileCode2,
  sql: Database,
  html_css: LayoutTemplate,
  dart: Zap,
  lua: Moon,
  shell_bash: Terminal,
  r_lang: LineChart,
  scala: Layers,
  elixir: FlaskConical,
  haskell: InfinityIcon,
}

/** First selected track that is not the blocks canvas (for tips / copy). */
export function primaryCodeFocus(ids: LearningLanguageId[]): LearningLanguageId | null {
  for (const id of ids) {
    if (id !== 'blocks') return id
  }
  return null
}
