import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { Locale } from './messages'
import { messages } from './messages'

const STORAGE_LOCALE = 'codejump-locale'

export type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function readStoredLocale(): Locale {
  try {
    const raw = localStorage.getItem(STORAGE_LOCALE)
    if (raw === 'es' || raw === 'en') return raw
  } catch {
    /* ignore */
  }
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale())

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_LOCALE, next)
    } catch {
      /* ignore */
    }
  }, [])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let s = messages[locale][key] ?? messages.en[key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.split(`{{${k}}}`).join(String(v))
        }
      }
      return s
    },
    [locale],
  )

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
