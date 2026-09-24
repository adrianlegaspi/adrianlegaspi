import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import { strings, type Locale, type Strings } from '@/i18n'
import { splitLocale } from '@/app/routes'
import { initialSoundEnabled, setCityAudioEnabled, storeSoundEnabled } from '@/audio/cityAudio'
import { renderQuality, type RenderQuality } from '@/city/renderQuality'
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
  t: Strings
  timeMode: TimeMode
  setTimeMode: (mode: TimeMode) => void
  theme: TimeTheme
  preset: TimePreset
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  hoveredProjectId: string | null
  setHoveredProjectId: (id: string | null) => void
  layout: Layout
  quality: RenderQuality
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
  // The URL is the only source of truth for language: /es/* is Spanish,
  // everything else English. A stored preference would disagree with the
  // canonical URL and with the hreflang pair pointing at it.
  const { locale } = splitLocale(useLocation().pathname)
  const [timeMode, setTimeModeState] = useState<TimeMode>(initialTimeMode)
  const [soundEnabled, setSoundEnabledState] = useState(initialSoundEnabled)
  const soundEnabledRef = useRef(soundEnabled)
  const soundRequest = useRef(0)
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)
  // Only bumped to force the render that re-reads the clock below.
  const [, tick] = useState(0)

  const isMobile = useMediaQuery('(max-width: 767px)')
  const lowQuality = useMediaQuery('(max-width: 1023px), (pointer: coarse)')
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
    // Browser chrome matches the header, read from the token so it tracks the theme.
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        'content',
        getComputedStyle(document.documentElement).getPropertyValue('--color-surface-bare').trim(),
      )
  }, [locale, theme])

  const setTimeMode = useCallback((next: TimeMode) => {
    setTimeModeState(next)
    storeTimeMode(next)
  }, [])

  const setSoundEnabled = useCallback((enabled: boolean) => {
    const request = ++soundRequest.current
    soundEnabledRef.current = enabled
    setSoundEnabledState(enabled)
    storeSoundEnabled(enabled)
    void setCityAudioEnabled(enabled).then((started) => {
      if (request === soundRequest.current && enabled && !started) {
        soundEnabledRef.current = false
        setSoundEnabledState(false)
        storeSoundEnabled(false)
      }
    })
  }, [])

  useEffect(() => {
    if (!soundEnabledRef.current) return

    const cleanup = () => {
      window.removeEventListener('pointerdown', restoreSound)
      window.removeEventListener('keydown', restoreSound)
    }
    const restoreSound = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key.toLowerCase() === 'm') return
      cleanup()
      if (soundEnabledRef.current) setSoundEnabled(true)
    }

    window.addEventListener('pointerdown', restoreSound)
    window.addEventListener('keydown', restoreSound)
    return cleanup
  }, [setSoundEnabled])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return
      if (event.key.toLowerCase() !== 'm') return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      )
        return
      setSoundEnabled(!soundEnabledRef.current)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setSoundEnabled])

  const value = useMemo<Portfolio>(
    () => ({
      locale,
      t: strings(locale),
      timeMode,
      setTimeMode,
      theme,
      preset: timePresets[theme],
      soundEnabled,
      setSoundEnabled,
      hoveredProjectId,
      setHoveredProjectId,
      layout: isMobile ? 'mobile' : 'desktop',
      quality: lowQuality ? renderQuality.low : renderQuality.standard,
      reducedMotion,
    }),
    [
      locale,
      timeMode,
      setTimeMode,
      theme,
      soundEnabled,
      setSoundEnabled,
      hoveredProjectId,
      isMobile,
      lowQuality,
      reducedMotion,
    ],
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const value = useContext(PortfolioContext)
  if (!value) throw new Error('usePortfolio must be used inside PortfolioProvider')
  return value
}
