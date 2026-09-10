import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { initialLocale, storeLocale, strings, type Locale, type Strings } from '@/i18n'
import {
  initialTimeMode,
  resolveTheme,
  storeTimeMode,
  timePresets,
  type TimeMode,
  type TimePreset,
  type TimeTheme,
} from '@/city/environment/timeOfDay'

export type Layout = 'desktop' | 'mobile'

interface Portfolio {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Strings
  timeMode: TimeMode
  setTimeMode: (mode: TimeMode) => void
  theme: TimeTheme
  preset: TimePreset
  hoveredProjectId: string | null
  setHoveredProjectId: (id: string | null) => void
  layout: Layout
  reducedMotion: boolean
}

const PortfolioContext = createContext<Portfolio | null>(null)

/** Media query as state, so the UI and the camera agree on the layout. */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

const THEME_REFRESH_MS = 10 * 60 * 1000

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [timeMode, setTimeModeState] = useState<TimeMode>(initialTimeMode)
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)
  // Only bumped to force the render that re-reads the clock below.
  const [, tick] = useState(0)

  const isMobile = useMediaQuery('(max-width: 767px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  // `auto` follows the visitor's clock, so it has to be re-checked while the
  // tab stays open. The theme itself is resolved on render, which is also what
  // makes switching back to `auto` land on the current hour immediately.
  useEffect(() => {
    if (timeMode !== 'auto') return
    const timer = setInterval(() => tick((value) => value + 1), THEME_REFRESH_MS)
    return () => clearInterval(timer)
  }, [timeMode])

  const theme: TimeTheme = resolveTheme(timeMode)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dataset.theme = theme
  }, [locale, theme])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    storeLocale(next)
  }, [])

  const setTimeMode = useCallback((next: TimeMode) => {
    setTimeModeState(next)
    storeTimeMode(next)
  }, [])

  const value = useMemo<Portfolio>(
    () => ({
      locale,
      setLocale,
      t: strings(locale),
      timeMode,
      setTimeMode,
      theme,
      preset: timePresets[theme],
      hoveredProjectId,
      setHoveredProjectId,
      layout: isMobile ? 'mobile' : 'desktop',
      reducedMotion,
    }),
    [locale, setLocale, timeMode, setTimeMode, theme, hoveredProjectId, isMobile, reducedMotion],
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const value = useContext(PortfolioContext)
  if (!value) throw new Error('usePortfolio must be used inside PortfolioProvider')
  return value
}
