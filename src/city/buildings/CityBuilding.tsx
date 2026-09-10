import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Group } from 'three'
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
const MARKER_COLOR = '#ffb347'
/** Clearance between a roof and whatever floats above it, in lot units. */
const ROOF_GAP = 0.3
const PIN_HEIGHT = 0.34
const PIN_RADIUS = 0.17

/**
 * Selection feedback in the language of city builders: a pin above the roof,
 * which stays readable over a dense skyline, plus a ring around the lot. A
 * material tint was rejected — it washes out the untextured models, and the
 * selection has to read without hover (spec §15).
 */
export function SelectionMarker({
  footprint = [1, 1],
  height,
  active,
}: {
  footprint?: [number, number]
  /** Height of the thing being marked, in unscaled local units. */
  height: number
  active: boolean
}) {
  if (!active) return null
  const radius = Math.max(footprint[0], footprint[1]) * 0.62

  return (
    <group>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.07, radius, 48]} />
        <meshBasicMaterial
          color={MARKER_COLOR}
          transparent
          opacity={0.85}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* Four-sided and pointing down, so it reads as a marker rather than scenery. */}
      <mesh
        position={[0, height + ROOF_GAP + PIN_HEIGHT / 2, 0]}
        rotation={[Math.PI, Math.PI / 4, 0]}
      >
        <coneGeometry args={[PIN_RADIUS, PIN_HEIGHT, 4]} />
        <meshBasicMaterial color={MARKER_COLOR} toneMapped={false} />
      </mesh>
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
 * An interactive building. Hover shows the preview card and nothing else — the
 * spec allows one hover treatment. Selection lifts the model slightly and adds
 * the marker, so it reads the same whether the building is textured or not.
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
    const target = selected ? scale * SELECTED_LIFT : scale
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
          onSelect()
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
      <SelectionMarker footprint={footprint} height={size.y} active={selected} />
      <HoverLabel visible={hovered} height={size.y} preview={preview} />
    </group>
  )
}
