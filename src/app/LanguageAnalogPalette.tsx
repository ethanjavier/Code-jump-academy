import { motion } from 'framer-motion'
import { useMemo } from 'react'

import {
  getLanguagePracticePalette,
  type LanguagePalettePiece,
} from '../courses/languagePracticePalette'
import type { Localized } from '../courses/guidedLessonTypes'
import { useI18n } from '../i18n/I18nContext'
import { localized } from './languageQuizzes'
import type { LearningLanguageId } from './learningTracks'

type PaletteProps = {
  lang: LearningLanguageId
  /** When set, tapping a card inserts the snippet into the workspace (code or scratch); otherwise copy to clipboard. */
  onInsertSnippet?: (text: string) => void
  disabled?: boolean
}

export type LessonPaletteEntry = {
  id: string
  insertText: Localized
  hint?: Localized
}

/** Lesson-defined snippets only (e.g. paletteCode exercise). Inserts `insertText`; newline chip shows hint label. */
export function LessonInsertPalette({
  entries,
  onInsertSnippet,
  disabled,
}: {
  entries: LessonPaletteEntry[]
  onInsertSnippet?: (text: string) => void
  disabled?: boolean
}) {
  const { locale, t } = useI18n()
  const insertMode = Boolean(onInsertSnippet)

  const chipLabel = (b: LessonPaletteEntry) => {
    const raw = localized(b.insertText, locale)
    if (raw === '\n') {
      return b.hint ? localized(b.hint, locale) : '↵'
    }
    return raw
  }

  const handlePick = (b: LessonPaletteEntry) => {
    if (disabled) return
    const text = localized(b.insertText, locale)
    if (onInsertSnippet) {
      onInsertSnippet(text)
    } else {
      void navigator.clipboard?.writeText(text).catch(() => {})
    }
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <p className="text-[11px] leading-snug text-slate-500">
        {t(insertMode ? 'practice.paletteCode.introInsert' : 'practice.paletteCode.intro')}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {entries.map((b) => (
          <motion.button
            key={b.id}
            type="button"
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={() => handlePick(b)}
            className="flex flex-col items-start rounded-2xl border border-slate-600/80 bg-slate-900/90 px-3 py-2.5 text-left shadow-md shadow-black/30 transition hover:border-indigo-400/45 hover:bg-slate-800/95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="break-all font-code text-[13px] font-medium leading-snug text-indigo-200">
              {chipLabel(b)}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export function LanguageAnalogPalette({ lang, onInsertSnippet, disabled }: PaletteProps) {
  const { locale, t } = useI18n()
  const items = useMemo(() => getLanguagePracticePalette(lang), [lang])

  const insertMode = Boolean(onInsertSnippet)

  const handlePick = (piece: LanguagePalettePiece) => {
    if (disabled) return
    const text = localized(piece.label, locale)
    if (onInsertSnippet) {
      onInsertSnippet(text)
    } else {
      void navigator.clipboard?.writeText(text).catch(() => {})
    }
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <p className="text-[11px] leading-snug text-slate-500">
        {t(insertMode ? 'practice.langPalette.introInsert' : 'practice.langPalette.intro')}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((b) => (
          <motion.button
            key={b.id}
            type="button"
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={() => handlePick(b)}
            className="flex flex-col items-start rounded-2xl border border-slate-600/80 bg-slate-900/90 px-3 py-2.5 text-left shadow-md shadow-black/30 transition hover:border-indigo-400/45 hover:bg-slate-800/95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="break-all font-code text-[13px] font-medium leading-snug text-indigo-200">
              {localized(b.label, locale)}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
