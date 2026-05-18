import type { PracticeTrackMode } from '../app/learningPreferences'
import type { LearningLanguageId } from '../app/learningTracks'

import type { GuidedCourse } from './guidedLessonTypes'
import { GUIDED_BEGINNER_EXTENDED_LESSON_TOTAL, padGuidedCourse } from './guidedLessonPadding'
import {
  C_LANG_GUIDED_COURSE,
  CPP_GUIDED_COURSE,
  CSHARP_GUIDED_COURSE,
  DART_GUIDED_COURSE,
  ELIXIR_GUIDED_COURSE,
  GO_GUIDED_COURSE,
  HASKELL_GUIDED_COURSE,
  HTML_CSS_GUIDED_COURSE,
  JAVA_GUIDED_COURSE,
  KOTLIN_GUIDED_COURSE,
  LUA_GUIDED_COURSE,
  PHP_GUIDED_COURSE,
  R_LANG_GUIDED_COURSE,
  RUBY_GUIDED_COURSE,
  RUST_GUIDED_COURSE,
  SCALA_GUIDED_COURSE,
  SHELL_BASH_GUIDED_COURSE,
  SQL_GUIDED_COURSE,
  SWIFT_GUIDED_COURSE,
} from './extraGuidedCourses'
import { JAVASCRIPT_GUIDED_COURSE } from './javascriptCourse'
import { PYTHON_GUIDED_COURSE } from './pythonCourse'
import { TYPESCRIPT_GUIDED_COURSE } from './typescriptCourse'

const BY_LANG: Partial<Record<LearningLanguageId, GuidedCourse>> = {
  javascript: JAVASCRIPT_GUIDED_COURSE,
  typescript: TYPESCRIPT_GUIDED_COURSE,
  python: PYTHON_GUIDED_COURSE,
  java: JAVA_GUIDED_COURSE,
  csharp: CSHARP_GUIDED_COURSE,
  cpp: CPP_GUIDED_COURSE,
  c_lang: C_LANG_GUIDED_COURSE,
  go: GO_GUIDED_COURSE,
  rust: RUST_GUIDED_COURSE,
  swift: SWIFT_GUIDED_COURSE,
  kotlin: KOTLIN_GUIDED_COURSE,
  ruby: RUBY_GUIDED_COURSE,
  php: PHP_GUIDED_COURSE,
  sql: SQL_GUIDED_COURSE,
  html_css: HTML_CSS_GUIDED_COURSE,
  dart: DART_GUIDED_COURSE,
  lua: LUA_GUIDED_COURSE,
  shell_bash: SHELL_BASH_GUIDED_COURSE,
  r_lang: R_LANG_GUIDED_COURSE,
  scala: SCALA_GUIDED_COURSE,
  elixir: ELIXIR_GUIDED_COURSE,
  haskell: HASKELL_GUIDED_COURSE,
}

export function getGuidedCourse(
  lang: LearningLanguageId,
  practiceMode?: PracticeTrackMode,
): GuidedCourse | undefined {
  const raw = BY_LANG[lang]
  if (!raw) return undefined
  const lessonTarget = GUIDED_BEGINNER_EXTENDED_LESSON_TOTAL
  return padGuidedCourse(raw, { lessonTarget, practiceMode })
}

export function hasGuidedCourse(lang: LearningLanguageId): boolean {
  return Boolean(BY_LANG[lang]?.lessons.length)
}
