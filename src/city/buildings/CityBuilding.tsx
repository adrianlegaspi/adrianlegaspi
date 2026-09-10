import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Group } from 'three'
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

const SELECTED_LIFT = 1.05
const HOVERED_LIFT = 1.02
const MARKER_COLOR = '#ffb347'
/** Clearance between a roof and whatever floats above it, in lot units. */
const ROOF_GAP = 0.3
const PIN_HEIGHT = 0.34
const PIN_RADIUS = 0.17
/** Ring thickness, kept constant so hovering changes no geometry. */
const RING_WIDTH = 0.08

/**
 * How loudly the plate speaks per state. Interactive lots are marked even when
 * idle: with a skyline of look-alike models there is otherwise nothing to say
 * which buildings answer a click, so the amber plate is the affordance and the
 * spec's "idle: normal model" (§15) is relaxed to a ground marking only.
 */
const PLATE: Record<BuildingState, { ring: number; fill: number }> = {
  idle: { ring: 0.4, fill: 0.09 },
  hovered: { ring: 0.85, fill: 0.2 },
  selected: { ring: 1, fill: 0.28 },
}

/**
 * Selection feedback in the language of city builders: an amber plate on the
 * lot that brightens through idle, hover and selection, plus a pin above the
 * roof once selected, which stays readable over a dense skyline. A material
 * tint was rejected — it washes out the untextured models.
 */
export function LotMarker({
  footprint = [1, 1],
  height,
  state,
}: {
  footprint?: [number, number]
  /** Height of the thing being marked, in unscaled local units. */
  height: number
  state: BuildingState
}) {
  const radius = Math.max(footprint[0], footprint[1]) * 0.62
  const { ring, fill } = PLATE[state]

  return (
    <group>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius - RING_WIDTH, 48]} />
        <meshBasicMaterial
          color={MARKER_COLOR}
          transparent
          opacity={fill}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - RING_WIDTH, radius, 48]} />
        <meshBasicMaterial
          color={MARKER_COLOR}
          transparent
          opacity={ring}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* Four-sided and pointing down, so it reads as a marker rather than scenery. */}
      {state === 'selected' && (
        <mesh
          position={[0, height + ROOF_GAP + PIN_HEIGHT / 2, 0]}
          rotation={[Math.PI, Math.PI / 4, 0]}
        >
          <coneGeometry args={[PIN_RADIUS, PIN_HEIGHT, 4]} />
          <meshBasicMaterial color={MARKER_COLOR} toneMapped={false} />
        </mesh>
      )}
    </group>
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
 * An interactive building. Its lot plate is always drawn so the building reads
 * as clickable; hovering brightens the plate and shows the preview card, and
 * selecting lifts the model, so the state reads whether or not it is textured.
 *
 * The material is declared here rather than reusing the loaded one: the shared
 * instanced buildings must not inherit the night glow settings.
 */
export function CityBuilding({
  url,
  center,
  rotation = 0,
  scale = 1,
  footprint = [1, 1],
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
  footprint?: [number, number]
  state: BuildingState
  /** Night window glow from the time-of-day preset. */
  glow?: number
  preview?: BuildingPreview | null
  onSelect: () => void
  onHoverChange: (hovered: boolean) => void
}) {
  const { geometry, material, size } = useModel(url)
  const group = useRef<Group>(null)
  const selected = state === 'selected'
  const hovered = state === 'hovered'
  /** Window glow reads the atlas as an emissive mask; without one, a flat emissive would wash out vertex-coloured models. */
  const hasWindowMap = Boolean(material.map)

  useFrame((_, delta) => {
    const lift = selected ? SELECTED_LIFT : hovered ? HOVERED_LIFT : 1
    const target = scale * lift
    const node = group.current
    if (!node) return
    node.scale.setScalar(node.scale.x + (target - node.scale.x) * Math.min(1, delta * 10))
  })

  return (
    <group ref={group} position={[center[0], 0, center[1]]} scale={scale}>
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
      <LotMarker footprint={footprint} height={size.y} state={state} />
      <HoverLabel visible={hovered} height={size.y} preview={preview} />
    </group>
  )
}
