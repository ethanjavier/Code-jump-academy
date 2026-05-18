import { motion } from 'framer-motion'
import { useMemo } from 'react'

import {
  getLanguagePracticePalette,
  type LanguagePalettePiece,
} from '../courses/languagePracticePalette'
import type { Localized, PaletteCodePieceRole } from '../courses/guidedLessonTypes'
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
  role?: PaletteCodePieceRole
}

const ROLE_SECTION_ORDER: PaletteCodePieceRole[] = [
  'variable',
  'console',
  'if_branch',
  'repeat_loop',
]

function roleSectionLabel(role: PaletteCodePieceRole, t: (key: string) => string): string {
  switch (role) {
    case 'variable':
      return t('guided.paletteRoleVariable')
    case 'console':
      return t('guided.paletteRoleConsole')
    case 'if_branch':
      return t('guided.paletteRoleIf')
    case 'repeat_loop':
      return t('guided.paletteRoleRepeat')
    default:
      return role
  }
}

function PaletteChip({
  entry,
  disabled,
  onPick,
}: {
  entry: LessonPaletteEntry
  disabled: boolean
  onPick: (entry: LessonPaletteEntry) => void
}) {
  const { locale } = useI18n()

  const chipLabel = () => {
    const raw = localized(entry.insertText, locale)
    if (raw === '\n') {
      return entry.hint ? localized(entry.hint, locale) : '↵'
    }
    return raw
  }

  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={() => onPick(entry)}
      title={entry.hint ? localized(entry.hint, locale) : undefined}
      className="flex flex-col items-start rounded-2xl border border-slate-600/80 bg-slate-900/90 px-3 py-2.5 text-left shadow-md shadow-black/30 transition hover:border-indigo-400/45 hover:bg-slate-800/95 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span className="break-all font-code text-[13px] font-medium leading-snug text-indigo-200">
        {chipLabel()}
      </span>
      {entry.hint && localized(entry.insertText, locale) !== '\n' ? (
        <span className="mt-1 line-clamp-2 text-[10px] leading-snug text-slate-500">
          {localized(entry.hint, locale)}
        </span>
      ) : null}
    </motion.button>
  )
}

/** Lesson-defined snippets only (e.g. paletteCode exercise). Inserts `insertText`; newline chip shows hint label. */
export function LessonInsertPalette({
  entries,
  onInsertSnippet,
  disabled,
  isEntryDisabled,
}: {
  entries: LessonPaletteEntry[]
  onInsertSnippet?: (text: string) => void
  disabled?: boolean
  /** Per-card gate (e.g. require a `const` before output / if / for). */
  isEntryDisabled?: (entry: LessonPaletteEntry) => boolean
}) {
  const { locale, t } = useI18n()
  const insertMode = Boolean(onInsertSnippet)

  const { grouped, ungrouped, newlineEntry } = useMemo(() => {
    const nl = entries.find((e) => localized(e.insertText, locale) === '\n')
    const coded = entries.filter((e) => e !== nl)
    const hasRoles = coded.some((e) => e.role)
    if (!hasRoles) {
      return { grouped: null as null, ungrouped: coded, newlineEntry: nl }
    }
    const byRole = new Map<PaletteCodePieceRole, LessonPaletteEntry[]>()
    for (const role of ROLE_SECTION_ORDER) {
      byRole.set(role, [])
    }
    for (const e of coded) {
      const r = e.role ?? 'variable'
      byRole.get(r)?.push(e)
    }
    return {
      grouped: ROLE_SECTION_ORDER.map((role) => ({
        role,
        items: byRole.get(role) ?? [],
      })).filter((g) => g.items.length > 0),
      ungrouped: [] as LessonPaletteEntry[],
      newlineEntry: nl,
    }
  }, [entries, locale])

  const handlePick = (b: LessonPaletteEntry) => {
    if (disabled || isEntryDisabled?.(b)) return
    const text = localized(b.insertText, locale)
    if (onInsertSnippet) {
      onInsertSnippet(text)
    } else {
      void navigator.clipboard?.writeText(text).catch(() => {})
    }
  }

  const chipDisabled = (b: LessonPaletteEntry) => Boolean(disabled || isEntryDisabled?.(b))

  return (
    <motion.div className="space-y-4 md:space-y-5" layout>
      <p className="text-[11px] leading-snug text-slate-500">
        {t(insertMode ? 'practice.paletteCode.introInsert' : 'practice.paletteCode.intro')}
      </p>

      {grouped
        ? grouped.map(({ role, items }) => (
            <div key={role} className="space-y-2">
              <h3 className="font-display text-[11px] font-semibold uppercase tracking-wide text-violet-300/95">
                {roleSectionLabel(role, t)}
              </h3>
              <motion.div layout className="grid gap-3 sm:grid-cols-2">
                {items.map((b) => (
                  <PaletteChip
                    key={b.id}
                    entry={b}
                    disabled={chipDisabled(b)}
                    onPick={handlePick}
                  />
                ))}
              </motion.div>
            </div>
          ))
        : (
          <div className="grid gap-3 sm:grid-cols-2">
            {ungrouped.map((b) => (
              <PaletteChip
                key={b.id}
                entry={b}
                disabled={chipDisabled(b)}
                onPick={handlePick}
              />
            ))}
          </div>
        )}

      {newlineEntry ? (
        <motion.div layout className="border-t border-white/10 pt-3">
          <PaletteChip
            entry={newlineEntry}
            disabled={chipDisabled(newlineEntry)}
            onPick={handlePick}
          />
        </motion.div>
      ) : null}
    </motion.div>
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
    <motion.div className="space-y-4 md:space-y-5" layout>
      <p className="text-[11px] leading-snug text-slate-500">
        {t(insertMode ? 'practice.langPalette.introInsert' : 'practice.langPalette.intro')}
      </p>
      <motion.div layout className="grid gap-3 sm:grid-cols-2">
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
      </motion.div>
    </motion.div>
  )
}
