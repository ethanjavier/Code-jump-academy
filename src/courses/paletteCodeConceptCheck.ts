import type { GuidedConceptKey } from './guidedLessonTypes'

const CONCEPT_PATTERNS: Record<GuidedConceptKey, RegExp> = {
  variable: /\b(?:const|let|var)\s+\w+\s*=|(?:^|\n)\s*[a-zA-Z_]\w*\s*=\s*[^=]/m,
  console: /console\.log\s*\(/,
  if_branch: /\bif\s*\(/,
  repeat_loop: /\bfor\s*\(/,
  function_block: /\bfunction\s+\w+\s*\(|\)\s*=>/,
  array_data: /\[[\s\S]*\]/,
}

export function draftHasConcept(draft: string, concept: GuidedConceptKey): boolean {
  return CONCEPT_PATTERNS[concept].test(draft)
}

export function draftHasVariableDecl(draft: string): boolean {
  return draftHasConcept(draft, 'variable')
}

/** Concepts from `required` that are missing in the normalized draft. */
export function missingRequiredConcepts(
  draft: string,
  required: readonly GuidedConceptKey[],
): GuidedConceptKey[] {
  return required.filter((c) => !draftHasConcept(draft, c))
}
