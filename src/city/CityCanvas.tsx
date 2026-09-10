import { Suspense, useRef } from 'react'
import { LoaderCircle } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { CityScene } from './CityScene'
import { usePortfolio } from '@/app/providers/portfolio'
import { useSelection } from '@/app/selection'
import { cx, icon, surface } from '@/design-system'

/** A pointer that travelled further than this between press and release was a camera pan, not a click. */
const CLICK_DRAG_TOLERANCE = 6

/** One probe at startup decides whether the city can render at all (spec §34). */
export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function LoadingLabel() {
  const { active } = useProgress()
  const { t } = usePortfolio()
  if (!active) return null
  return (
    <p
      className={cx(
        'pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2',
        'px-4 py-1.5 text-sm text-ink-muted',
        surface.pill,
      )}
    >
      <LoaderCircle {...icon} className="animate-spin text-ink-faint motion-reduce:animate-none" />
      {t.city.loading}
    </p>
  )
}

export function CityCanvas() {
  const { layout, t } = usePortfolio()
  const { clear } = useSelection()
  const pressedAt = useRef<{ x: number; y: number } | null>(null)

  /**
   * Only buildings carry pointer handlers, so a "missed" click is any click on
   * the city that was not a building — ground, roads, scenery or sky — and
   * dismisses the panel. A pointer that travelled was a camera pan, not a click.
   */
  const onPointerMissed = (event: MouseEvent) => {
    const start = pressedAt.current
    pressedAt.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (dx * dx + dy * dy <= CLICK_DRAG_TOLERANCE * CLICK_DRAG_TOLERANCE) clear()
  }

  return (
    <div
      className="absolute inset-0"
      onPointerDown={(event) => {
        pressedAt.current = { x: event.clientX, y: event.clientY }
      }}
    >
      <Canvas
        flat
        shadows
        dpr={[1, layout === 'mobile' ? 1.5 : 2]}
        camera={{ fov: 38, near: 0.5, far: 200 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        aria-label={t.city.canvasLabel}
        onPointerMissed={onPointerMissed}
      >
        <Suspense fallback={null}>
          <CityScene />
        </Suspense>
      </Canvas>
      <LoadingLabel />
    </div>
  )
}
