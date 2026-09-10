import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CityCanvas, hasWebGL } from '@/city/CityCanvas'
import { CityHint } from '@/components/layout/CityHint'
import { DesktopSidePanel } from '@/components/layout/DesktopSidePanel'
import { Header } from '@/components/layout/Header'
import { HtmlFallback } from '@/components/layout/HtmlFallback'
import { MobileBottomSheet } from '@/components/layout/MobileBottomSheet'
import { usePortfolio } from './providers/portfolio'
import { panelContent } from './panelContent'
import { applySeo } from './seo'
import { isKnownRoute, useSelection } from './selection'

const webgl = hasWebGL()

export function App() {
  const { locale, layout, t } = usePortfolio()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { selection, clear } = useSelection()
  const content = useMemo(() => panelContent(selection, locale), [selection, locale])

  useEffect(() => {
    if (!isKnownRoute(pathname)) navigate('/', { replace: true })
  }, [pathname, navigate])

  useEffect(() => applySeo(content, t, pathname), [content, t, pathname])

  if (!webgl) return <HtmlFallback />

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <CityCanvas />
      <Header />
      <CityHint hidden={Boolean(content)} />
      {layout === 'desktop' ? (
        <DesktopSidePanel content={content} onClose={clear} />
      ) : (
        <MobileBottomSheet content={content} onClose={clear} />
      )}
    </div>
  )
}
