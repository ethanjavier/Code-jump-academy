import type { GuidedLesson } from './guidedLessonTypes'

/**
 * Beginner spine (after stripe intro): same exercise-type progression across languages.
 * Lower rank = earlier lesson slot.
 */
export function beginnerSpineRank(lesson: GuidedLesson): number {
  const ex = lesson.exercise
  const ic = lesson.introducesConcept

  if (ex.type === 'runCode') {
    const frags = Math.max(ex.expectOutputIncludes.en.length, ex.expectOutputIncludes.es.length)
    return frags >= 2 ? 40 : 10
  }
  if (ex.type === 'assembleLine') return 20
  if (ex.type === 'paletteCode') return 5
  if (ex.type === 'pickOne') {
    if (ic === 'if_branch') return 30
    if (ic === 'array_data') return 70
    if (ic === 'variable') return 22
    return 85
  }
  if (ex.type === 'orderLines') {
    if (ic === 'repeat_loop') return 50
    if (ic === 'function_block') return 60
    return 52
  }
  if (ex.type === 'stripeChallenge') return 53
  return 90
}

/** Stable sort: keeps relative order when ranks tie (deterministic spine). */
export function sortGuidedLessonsForBeginnerSpine(tail: GuidedLesson[]): GuidedLesson[] {
  return [...tail]
    .map((lesson, idx) => ({ lesson, idx, r: beginnerSpineRank(lesson) }))
    .sort((a, b) => {
      if (a.r !== b.r) return a.r - b.r
      return a.idx - b.idx
    })
    .map((x) => x.lesson)
}
