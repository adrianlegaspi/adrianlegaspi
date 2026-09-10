import { Html } from '@react-three/drei'
import { wasClick } from '@/city/camera/dragGuard'
import { useModel } from '@/city/models/useModel'
import { deg } from '@/city/models/InstancedModel'
import { cx, surface } from '@/design-system'

export type BuildingState = 'idle' | 'hovered' | 'selected'

/** Title and one-line summary shown in the hover preview (spec: content stays out of city components). */
export interface BuildingPreview {
  title: string
  summary: string
}

/** Clearance between a roof and whatever floats above it, in lot units. */
const ROOF_GAP = 0.3
const MARKER: Record<BuildingState, string> = {
  idle: 'size-3',
  hovered: 'size-4 scale-110',
  selected: 'size-4 outline-2 outline-offset-2 outline-accent-ring',
}

/** Stable screen-space marker: no duplicate model geometry, so no z-fighting. */
export function InteractionMarker({ height, state }: { height: number; state: BuildingState }) {
  return (
    <Html
      position={[0, height + ROOF_GAP, 0]}
      center
      zIndexRange={[1, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <span
        aria-hidden="true"
        className={cx(
          'block rotate-45 border-2 border-surface-bare bg-accent shadow-md',
          'transition-transform duration-150 ease-out',
          MARKER[state],
        )}
      />
    </Html>
  )
}

/** Floating title/summary card above the hovered building (spec: preview what a building is about). */
export function HoverLabel({
  visible,
  height,
  preview,
}: {
  visible: boolean
  /** Height of the hovered building, so the card clears its roof. */
  height: number
  preview?: BuildingPreview | null
}) {
  if (!visible || !preview) return null
  return (
    <Html position={[0, height + ROOF_GAP, 0]} center style={{ pointerEvents: 'none' }}>
      <div className={cx(surface.menu, 'w-56')}>
        <p className="text-sm font-semibold text-ink">{preview.title}</p>
        <p className="mt-1 text-xs text-ink-muted">{preview.summary}</p>
      </div>
    </Html>
  )
}

/**
 * Interactive buildings carry a screen-space roof marker so they read as
 * clickable in every time preset without duplicating model geometry.
 *
 * The material is declared here rather than reusing the loaded one: the shared
 * instanced buildings must not inherit the night glow settings.
 */
export function CityBuilding({
  url,
  center,
  rotation = 0,
  scale = 1,
  state,
  glow = 0,
  preview,
  onSelect,
  onHoverChange,
}: {
  url: string
  center: [number, number]
  rotation?: number
  scale?: number
  state: BuildingState
  /** Night window glow from the time-of-day preset. */
  glow?: number
  preview?: BuildingPreview | null
  onSelect: () => void
  onHoverChange: (hovered: boolean) => void
}) {
  const { geometry, material, size } = useModel(url)
  const hovered = state === 'hovered'
  /** Window glow reads the atlas as an emissive mask; without one, a flat emissive would wash out vertex-coloured models. */
  const hasWindowMap = Boolean(material.map)

  return (
    <group position={[center[0], 0, center[1]]} scale={scale}>
      <mesh
        geometry={geometry}
        rotation={[0, deg(rotation), 0]}
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation()
          if (wasClick(event)) onSelect()
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          onHoverChange(true)
        }}
        onPointerOut={() => onHoverChange(false)}
      >
        <meshStandardMaterial
          map={material.map}
          color={material.color}
          flatShading={material.flatShading}
          vertexColors={material.vertexColors}
          emissive="#ffffff"
          emissiveMap={material.map}
          emissiveIntensity={hasWindowMap ? glow : 0}
        />
      </mesh>
      <InteractionMarker height={size.y} state={state} />
      <HoverLabel visible={hovered} height={size.y} preview={preview} />
    </group>
  )
}
