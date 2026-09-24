import { LoaderCircle } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { CityScene } from './CityScene'
import { pressPointer, wasClick } from './camera/dragGuard'
import { usePortfolio } from '@/app/providers/portfolio'
import { useSelection } from '@/app/selection'
import { cx, icon, surface } from '@/design-system'

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
  const { quality, t } = usePortfolio()
  const { clear } = useSelection()

  /**
   * Only buildings carry pointer handlers, so a "missed" click is any click on
   * the city that was not a building: ground, roads, scenery or sky, and
   * dismisses the panel. A pointer that travelled was a camera pan, not a click.
   */
  const onPointerMissed = (event: MouseEvent) => {
    if (wasClick(event)) clear()
  }

  return (
    <div
      className="absolute inset-0"
      onPointerDown={pressPointer}
      // A right-click anywhere on the city dismisses the case study.
      onContextMenu={(event) => {
        event.preventDefault()
        clear()
      }}
    >
      <Canvas
        flat
        shadows={quality.shadows}
        dpr={quality.dpr}
        frameloop={quality.frameloop}
        camera={{ fov: 38, near: 0.5, far: 200 }}
        // Local clipping is on for the train, which is cut off at the lips of the base.
        gl={{
          antialias: quality.antialias,
          powerPreference: 'high-performance',
          localClippingEnabled: true,
        }}
        aria-label={t.city.canvasLabel}
        style={{ touchAction: 'none' }}
        onPointerMissed={onPointerMissed}
      >
        <CityScene />
      </Canvas>
      <LoadingLabel />
    </div>
  )
}
