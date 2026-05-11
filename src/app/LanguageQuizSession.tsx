import { Button, Radio, Space } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useI18n } from '../i18n/I18nContext'
import { localized, quizQuestionsForModule } from './languageQuizzes'
import type { LearningLanguageId } from './learningTracks'

type Props = {
  lang: LearningLanguageId
  moduleIndex: number
  onBack: () => void
}

export function LanguageQuizSession({ lang, moduleIndex, onBack }: Props) {
  const { t, locale } = useI18n()

  const deck = useMemo(
    () => quizQuestionsForModule(lang, moduleIndex),
    [lang, moduleIndex],
  )

  const [step, setStep] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setStep(0)
    setChoice(null)
    setRevealed(false)
    setCorrectCount(0)
    setFinished(false)
  }, [lang, moduleIndex])

  const q = deck[step]
  const total = deck.length

  const handleCheck = useCallback(() => {
    if (choice === null || !q) return
    if (choice === q.correctIndex) setCorrectCount((c) => c + 1)
    setRevealed(true)
  }, [choice, q])

  const handleNext = useCallback(() => {
    if (step + 1 >= total) {
      setFinished(true)
      return
    }
    setStep((s) => s + 1)
    setChoice(null)
    setRevealed(false)
  }, [step, total])

  if (!deck.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-center">
        <p className="text-sm text-slate-400">{t('practice.noQuestions')}</p>
        <Button type="primary" className="mt-4" onClick={onBack}>
          {t('practice.backToOverview')}
        </Button>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-emerald-500/25 bg-slate-900/80 p-8 text-center shadow-xl ring-1 ring-emerald-500/15">
        <p className="font-display text-lg font-bold text-white">{t('quiz.doneTitle')}</p>
        <p className="mt-2 text-sm text-slate-300">
          {t('quiz.score', { correct: String(correctCount), total: String(total) })}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {t('quiz.deckLabel', { track: t(`hub.track.${lang}.title`) })}
        </p>
        <Button type="primary" size="large" className="mt-6 rounded-xl font-display font-bold" onClick={onBack}>
          {t('practice.backToModules')}
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-5 shadow-xl ring-1 ring-white/10 md:p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t('quiz.progress', {
          current: String(step + 1),
          total: String(total),
        })}
      </p>
      <p className="text-base font-medium leading-snug text-slate-100">{localized(q!.prompt, locale)}</p>
      <Radio.Group
        className="mt-4 flex w-full flex-col gap-2"
        value={choice}
        onChange={(e) => setChoice(e.target.value)}
      >
        {q!.options.map((opt, i) => (
          <Radio
            key={`opt-${step}-${i}`}
            value={i}
            className="!flex items-start !py-1.5 text-slate-200"
            disabled={revealed}
          >
            <span className="whitespace-normal">{localized(opt, locale)}</span>
          </Radio>
        ))}
      </Radio.Group>
      {revealed ? (
        <div
          className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
            choice === q!.correctIndex
              ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-100'
              : 'border-amber-500/40 bg-amber-950/35 text-amber-100'
          }`}
        >
          <p className="font-semibold">
            {choice === q!.correctIndex ? t('quiz.correct') : t('quiz.incorrect')}
          </p>
          <p className="mt-1 text-slate-200/95">{localized(q!.explain, locale)}</p>
        </div>
      ) : null}
      <div className="mt-6 flex flex-wrap justify-end gap-2">
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
      </div>
    </div>
  )
}
