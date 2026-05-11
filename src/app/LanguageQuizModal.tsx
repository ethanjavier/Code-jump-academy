import { Button, Modal, Radio, Select, Space } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useI18n } from '../i18n/I18nContext'
import {
  LANGUAGE_QUIZZES,
  localized,
  quizQuestionsForModule,
  type QuizQuestion,
} from './languageQuizzes'
import type { LearningLanguageId } from './learningTracks'

type Props = {
  open: boolean
  onClose: () => void
  /** Tracks the learner selected on the hub (typically excludes only unavailable picks). */
  candidateIds: LearningLanguageId[]
}

export function LanguageQuizModal({ open, onClose, candidateIds }: Props) {
  const { t, locale } = useI18n()

  const quizLanguages = useMemo(
    () =>
      candidateIds.filter((id) => id !== 'blocks' && Boolean(LANGUAGE_QUIZZES[id]?.length)),
    [candidateIds],
  )

  const [lang, setLang] = useState<LearningLanguageId | null>(null)
  const [deck, setDeck] = useState<QuizQuestion[]>([])
  const [step, setStep] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)

  const resetForLanguage = useCallback((next: LearningLanguageId) => {
    const full = LANGUAGE_QUIZZES[next]
    if (!full?.length) return
    setLang(next)
    setDeck(quizQuestionsForModule(next, 0))
    setStep(0)
    setChoice(null)
    setRevealed(false)
    setCorrectCount(0)
    setDone(false)
  }, [])

  useEffect(() => {
    if (!open) return
    if (quizLanguages.length === 0) {
      setLang(null)
      setDeck([])
      setDone(true)
      return
    }
    resetForLanguage(quizLanguages[0]!)
  }, [open, quizLanguages, resetForLanguage])

  const q = deck[step]
  const total = deck.length

  const handleCheck = useCallback(() => {
    if (choice === null || !q) return
    const ok = choice === q.correctIndex
    if (ok) setCorrectCount((c) => c + 1)
    setRevealed(true)
  }, [choice, q])

  const handleNext = useCallback(() => {
    if (step + 1 >= total) {
      setDone(true)
      return
    }
    setStep((s) => s + 1)
    setChoice(null)
    setRevealed(false)
  }, [step, total])

  const handleLangChange = useCallback(
    (next: LearningLanguageId) => {
      resetForLanguage(next)
    },
    [resetForLanguage],
  )

  return (
    <Modal
      title={t('quiz.title')}
      open={open}
      onCancel={onClose}
      footer={
        done ? (
          <Button type="primary" onClick={onClose}>
            {t('quiz.close')}
          </Button>
        ) : quizLanguages.length === 0 ? (
          <Button onClick={onClose}>{t('quiz.close')}</Button>
        ) : (
          <Space>
            {!revealed ? (
              <Button type="primary" disabled={choice === null} onClick={handleCheck}>
                {t('quiz.check')}
              </Button>
            ) : step + 1 >= total ? (
              <Button type="primary" onClick={handleNext}>
                {t('quiz.finish')}
              </Button>
            ) : (
              <Button type="primary" onClick={handleNext}>
                {t('quiz.next')}
              </Button>
            )}
          </Space>
        )
      }
      width={520}
      destroyOnClose
    >
      {quizLanguages.length === 0 ? (
        <p className="text-sm text-slate-300">{t('quiz.noTracks')}</p>
      ) : done ? (
        <div className="space-y-2 text-center">
          <p className="font-display text-lg font-bold text-white">{t('quiz.doneTitle')}</p>
          <p className="text-sm text-slate-300">
            {t('quiz.score', { correct: String(correctCount), total: String(total) })}
          </p>
          {lang ? (
            <p className="text-xs text-slate-500">
              {t('quiz.deckLabel', { track: t(`hub.track.${lang}.title`) })}
            </p>
          ) : null}
        </div>
      ) : q ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t('quiz.pickLanguage')}
            </span>
            <Select<LearningLanguageId>
              className="min-w-[200px]"
              value={lang ?? undefined}
              options={quizLanguages.map((id) => ({
                value: id,
                label: t(`hub.track.${id}.title`),
              }))}
              onChange={handleLangChange}
            />
          </div>
          <p className="text-xs text-slate-500">
            {t('quiz.progress', {
              current: String(step + 1),
              total: String(total),
            })}
          </p>
          <p className="text-sm font-medium text-slate-100">{localized(q.prompt, locale)}</p>
          <Radio.Group
            className="flex w-full flex-col gap-2"
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
          >
            {q.options.map((opt, i) => (
              <Radio
                key={`opt-${step}-${i}`}
                value={i}
                className="!flex items-start !py-1 text-slate-200"
                disabled={revealed}
              >
                <span className="whitespace-normal">{localized(opt, locale)}</span>
              </Radio>
            ))}
          </Radio.Group>
          {revealed ? (
            <div
              className={`rounded-xl border px-3 py-2 text-sm ${
                choice === q.correctIndex
                  ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-100'
                  : 'border-amber-500/40 bg-amber-950/35 text-amber-100'
              }`}
            >
              <p className="font-semibold">
                {choice === q.correctIndex ? t('quiz.correct') : t('quiz.incorrect')}
              </p>
              <p className="mt-1 text-slate-200/95">{localized(q.explain, locale)}</p>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-slate-400">{t('quiz.loading')}</p>
      )}
    </Modal>
  )
}
