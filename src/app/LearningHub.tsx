import { Button } from 'antd'
import { motion } from 'framer-motion'
import { Columns2, Globe, LayoutGrid, LayoutTemplate, SquareCode } from 'lucide-react'
import { useCallback, useMemo, type ReactNode } from 'react'

import { useI18n } from '../i18n/I18nContext'
import { iconStroke } from './icons'
import {
  LEARNING_TRACK_ORDER,
  TRACK_ICONS,
  type LearningLanguageId,
} from './learningTracks'
import type { PracticeDeepLink } from './appUrl'
import {
  saveLearningLanguages,
  saveTrackPracticeMode,
  type PracticeTrackMode,
} from './learningPreferences'

type Props = {
  onContinueBlocks: () => void
  onContinuePractice: (deep?: PracticeDeepLink | null) => void
}

type LangCardProps = {
  id: LearningLanguageId
  onPick: (mode: PracticeTrackMode) => void
}

function LanguageModeCard({ id, onPick }: LangCardProps) {
  const { t } = useI18n()
  const Icon = TRACK_ICONS[id]
  const langTitle = t(`hub.track.${id}.title`)
  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-slate-900/85 p-3 shadow-sm ring-1 ring-white/5">
      <div className="flex items-start gap-2.5 border-b border-white/[0.06] pb-3">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-800/90">
          <Icon className="size-[17px] text-indigo-300" strokeWidth={iconStroke.medium} aria-hidden />
        </div>
        <p className="min-w-0 flex-1 overflow-visible break-words font-display text-[13px] font-semibold leading-snug text-white text-pretty hyphens-auto">
          {langTitle}
        </p>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <Button
          type="primary"
          size="small"
          title={t('practice.modeBeginnerHint')}
          aria-label={`${langTitle} — ${t('hub.ctaBeginner')}`}
          className="!flex min-h-[36px] !items-center !justify-center !gap-1 !overflow-visible !whitespace-normal !px-1.5 !py-1.5 text-center font-display !text-[10px] font-semibold leading-tight sm:!text-[11px]"
          icon={<LayoutGrid className="size-3 shrink-0 opacity-95" strokeWidth={iconStroke.medium} aria-hidden />}
          onClick={() => onPick('beginner')}
        >
          {t('hub.ctaBeginnerShort')}
        </Button>
        <Button
          size="small"
          title={t('practice.modeAdvancedHint')}
          aria-label={`${langTitle} — ${t('hub.ctaAdvanced')}`}
          className="!flex min-h-[36px] !items-center !justify-center !gap-1 !overflow-visible !whitespace-normal !border-slate-600/75 !bg-slate-950/90 !px-1.5 !py-1.5 text-center font-display !text-[10px] font-medium leading-tight text-slate-100 hover:!border-slate-500 hover:!bg-slate-900 sm:!text-[11px]"
          icon={<Columns2 className="size-3 shrink-0 opacity-95" strokeWidth={iconStroke.medium} aria-hidden />}
          onClick={() => onPick('advanced')}
        >
          {t('hub.ctaAdvancedShort')}
        </Button>
      </div>
    </div>
  )
}

function SectionLabel({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div className="mb-4 border-b border-white/10 pb-3">
      <h2 id={id} className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {children}
      </h2>
    </div>
  )
}

export function LearningHub({ onContinueBlocks, onContinuePractice }: Props) {
  const { t, locale, setLocale } = useI18n()

  const practiceLangs = useMemo(
    () =>
      LEARNING_TRACK_ORDER.filter((id): id is LearningLanguageId => id !== 'blocks'),
    [],
  )

  const enterPractice = useCallback(
    (lang: LearningLanguageId, mode: PracticeTrackMode) => {
      saveLearningLanguages([lang])
      saveTrackPracticeMode(lang, mode)
      onContinuePractice({ lang, pmode: mode })
    },
    [onContinuePractice],
  )

  const handleBlocks = useCallback(() => {
    saveLearningLanguages(['blocks'])
    onContinueBlocks()
  }, [onContinueBlocks])

  return (
    <div className="hub-root relative flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-contain bg-slate-950 text-slate-100 [scrollbar-gutter:stable]">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-950 to-[#0b1020]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(99,102,241,0.22),transparent_55%)]"
        aria-hidden
      />

      <header className="relative z-20 w-full shrink-0 border-b border-white/[0.06] bg-slate-950/90 backdrop-blur-md">
        <nav className="mx-auto w-full max-w-[1920px]" aria-label={t('hub.navAriaLabel')}>
          <div className="flex flex-col gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-3.5 md:px-10 lg:px-12 xl:px-14">
            <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="flex min-w-0 max-w-[min(100%,28rem)] flex-1 items-center gap-3 sm:gap-4">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/35 bg-gradient-to-br from-indigo-600 to-violet-700 shadow-lg shadow-indigo-950/40 ring-1 ring-white/15"
                  aria-hidden
                >
                  <SquareCode className="size-5 text-white" strokeWidth={iconStroke.strong} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base font-bold tracking-tight text-white sm:text-lg">
                    {t('hub.siteName')}
                  </p>
                  <p className="truncate text-[11px] text-slate-500 sm:text-xs">{t('header.tagline')}</p>
                </div>
                <span className="hidden shrink-0 rounded-full border border-amber-500/35 bg-amber-950/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200 lg:inline-flex">
                  {t('hub.badge')}
                </span>
              </div>

              <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-4">
                <a
                  href="#main-content"
                  className="whitespace-nowrap rounded-lg border border-white/15 bg-slate-900/90 px-3 py-1.5 font-display text-[11px] font-semibold text-indigo-200 ring-1 ring-indigo-500/25 hover:border-indigo-400/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                >
                  {t('hub.skipToContent')}
                </a>
                <div className="flex items-center gap-2">
                  <Globe className="size-4 shrink-0 text-indigo-300" aria-hidden />
                  <div className="flex shrink-0 rounded-lg border border-white/20 bg-slate-900/95 p-0.5 shadow-inner ring-1 ring-white/10">
                    <button
                      type="button"
                      onClick={() => setLocale('en')}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition sm:min-w-[3rem] ${
                        locale === 'en'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-100 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {t('locale.en')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocale('es')}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition sm:min-w-[3rem] ${
                        locale === 'es'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-100 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {t('locale.es')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main
        id="main-content"
        className="relative z-10 mx-auto flex w-full max-w-[1920px] flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 md:px-10 lg:px-12 xl:px-14 2xl:px-16"
      >
        {/* Hero + Bloques en una sola banda en pantallas grandes (aprovecha el hueco horizontal) */}
        <div className="flex w-full flex-col gap-8 lg:gap-10 xl:flex-row xl:items-stretch xl:gap-12 2xl:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center text-center xl:mx-0 xl:max-w-none xl:min-w-0 xl:pr-2 xl:text-left"
          >
            <div className="mb-3 inline-flex items-center gap-2 self-center rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-[11px] text-slate-400 xl:self-start">
              <LayoutTemplate className="size-3.5 text-indigo-400" strokeWidth={iconStroke.medium} aria-hidden />
              <span>{t('hub.section')}</span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl xl:text-[2.15rem] 2xl:text-[2.35rem]">
              {t('hub.title')}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-[15px] xl:mx-0 xl:max-w-xl 2xl:max-w-2xl">
              {t('hub.subtitleFull')}
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.05 }}
            aria-labelledby="hub-blocks-heading"
            className="flex w-full shrink-0 flex-col xl:w-[min(100%,440px)] 2xl:w-[min(100%,480px)]"
          >
            <SectionLabel id="hub-blocks-heading">{t('hub.sectionBlocks')}</SectionLabel>
            <div className="flex flex-1 flex-col gap-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/45 via-slate-900/80 to-slate-950/95 p-6 shadow-lg shadow-black/25 ring-1 ring-emerald-500/15 xl:h-full xl:justify-between xl:p-7">
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/95">{t('hub.blocks.badge')}</p>
                <h3 className="mt-1.5 font-display text-xl font-bold text-white sm:text-2xl">{t('hub.blocks.title')}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{t('hub.blocks.desc')}</p>
              </div>
              <Button
                type="primary"
                size="large"
                block
                className="h-12 shrink-0 rounded-xl border-0 bg-gradient-to-r from-emerald-600 to-teal-600 font-display text-sm font-bold shadow-md"
                onClick={handleBlocks}
              >
                {t('hub.continueBlocks')}
              </Button>
            </div>
          </motion.section>
        </div>

        <div className="mt-12 flex w-full flex-1 flex-col gap-12 lg:mt-14 lg:gap-14">

          {/* Lenguajes — rejilla fluida con tarjetas anchas (sin demasiadas columnas) */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.1 }}
            aria-labelledby="hub-lang-heading"
            className="flex w-full flex-1 flex-col pb-4"
          >
            <div className="mx-auto w-full max-w-[1680px]">
              <SectionLabel id="hub-lang-heading">{t('hub.sectionModes')}</SectionLabel>
              <div
                className="grid w-full gap-4"
                style={{
                  /* Min ~22rem so names like “HTML y CSS” / “Bash / shell” stay on card without clipping */
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))',
                }}
              >
                {practiceLangs.map((id) => (
                  <LanguageModeCard key={id} id={id} onPick={(mode) => enterPractice(id, mode)} />
                ))}
              </div>
              <p className="mt-10 max-w-3xl text-sm leading-relaxed text-slate-500">{t('hub.noteModes')}</p>
            </div>
          </motion.section>
        </div>
      </main>

      <footer className="relative z-10 mt-auto shrink-0 border-t border-white/10 bg-slate-950/90 backdrop-blur-sm">
        <div className="mx-auto grid w-full max-w-[1920px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end md:gap-12 md:px-10 lg:px-12 xl:px-14 2xl:px-16">
          <div className="min-w-0">
            <p className="font-display text-lg font-bold text-white">{t('hub.siteName')}</p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">{t('hub.footerLead')}</p>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600 md:text-right">{t('footer.line')}</p>
        </div>
      </footer>
    </div>
  )
}
