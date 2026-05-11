import { Card, Tag } from 'antd'
import { Bot } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import type { Level } from '../types/level'
import { useI18n } from '../i18n/I18nContext'
import { iconStroke } from './icons'
import { renderMarkdownLite } from './pedagogyText'

const TYPE_MS = 22
const IDLE_HINT_MS = 78_000

function stripBoldMarkers(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, '$1')
}

type Props = {
  level: Level
  /** Cambia al cambiar de puzzle: reinicia máquina de escribir y temporizador de pista. */
  missionKey: string
}

export function MissionCaptainGuide({ level, missionKey }: Props) {
  const { locale, t } = useI18n()
  const explanation = locale === 'en' ? level.explanationEn : level.explanationEs
  const story = locale === 'en' ? level.storyGoalEn : level.storyGoalEs
  const concept = locale === 'en' ? level.conceptEn : level.conceptEs
  const hint = locale === 'en' ? level.hintEn : level.hintEs

  const plainExplanation = useMemo(() => stripBoldMarkers(explanation), [explanation])

  const [typedLen, setTypedLen] = useState(0)
  const [typingDone, setTypingDone] = useState(false)
  const [idleHint, setIdleHint] = useState(false)

  useEffect(() => {
    setIdleHint(false)
    setTypingDone(false)
    setTypedLen(0)
    const reduce =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setTypedLen(plainExplanation.length)
      setTypingDone(true)
      return
    }
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setTypedLen(i)
      if (i >= plainExplanation.length) {
        window.clearInterval(id)
        setTypingDone(true)
      }
    }, TYPE_MS)
    return () => window.clearInterval(id)
  }, [plainExplanation, missionKey])

  useEffect(() => {
    setIdleHint(false)
    const reduce =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const tmr = window.setTimeout(() => setIdleHint(true), IDLE_HINT_MS)
    return () => window.clearTimeout(tmr)
  }, [missionKey])

  return (
    <Card
      size="small"
      className="shrink-0 overflow-hidden rounded-3xl border border-sky-200/25 bg-gradient-to-br from-sky-950/55 via-indigo-950/40 to-violet-950/50 shadow-lg shadow-sky-950/30 ring-1 ring-sky-300/20 [&_.ant-card-body]:!px-4 [&_.ant-card-body]:!py-3"
    >
      <div className="flex gap-3">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-sky-300/35 bg-gradient-to-br from-sky-400/30 to-indigo-500/40 text-sky-100 shadow-inner"
          aria-hidden
        >
          <Bot className="size-7" strokeWidth={iconStroke.soft} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="font-display text-[11px] font-bold uppercase tracking-wide text-sky-200/95">
              {t('captain.briefing')}
            </span>
            <Tag className="m-0 border-sky-400/40 bg-sky-500/20 font-display text-[11px] text-sky-100">
              {concept}
            </Tag>
          </div>
          <p className="font-display text-sm font-bold leading-snug text-amber-100/95 drop-shadow-sm">
            {story}
          </p>
          <div className="mt-2 text-sm leading-relaxed text-slate-100/95">
            {typingDone ? (
              <p className="m-0">{renderMarkdownLite(explanation)}</p>
            ) : (
              <p className="m-0">
                {plainExplanation.slice(0, typedLen)}
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-sky-300 align-middle" aria-hidden />
              </p>
            )}
          </div>
        </div>
      </div>
      {idleHint ? (
        <div className="mt-3 rounded-2xl border border-amber-300/25 bg-amber-950/35 px-3 py-2 text-[12px] leading-snug text-amber-50 ring-1 ring-amber-400/20">
          <span className="font-display font-semibold text-amber-200">{t('captain.idleNudge')} </span>
          {renderMarkdownLite(hint)}
        </div>
      ) : null}
    </Card>
  )
}
