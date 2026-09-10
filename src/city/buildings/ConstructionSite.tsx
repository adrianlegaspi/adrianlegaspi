import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { siteAssets } from '@/city/assets'
import { wasClick } from '@/city/camera/dragGuard'
import { Model } from '@/city/models/Model'
import { deg, InstancedModel, type Instance } from '@/city/models/InstancedModel'
import { HoverLabel, LotMarker, type BuildingPreview, type BuildingState } from './CityBuilding'

/**
 * The "next project" lot: a fenced, prepared plot standing in for work that
 * has not happened yet. Nothing is built on it on purpose — the copy says the
 * plot is empty, so the site is a poured slab, hoarding and idle equipment.
 */
const INSET = 0.1
/** Fence panel length along its unrotated Z axis. */
const PANEL = 0.5
const SLAB_HEIGHT = 0.06
/** Where the hoarding opens, as a fraction of the south edge. */
const GATE_SPAN = 0.5

/** Hoarding around the plot, with a gated gap in the middle of the south edge. */
function perimeter(width: number, depth: number) {
  const x = width / 2 - INSET
  const z = depth / 2 - INSET
  const fence: Instance[] = []
  const gate: Instance[] = []
  const along = (length: number) => {
    const count = Math.max(1, Math.round(length / PANEL))
    const step = length / count
    return Array.from({ length: count }, (_, i) => -length / 2 + step * (i + 0.5))
  }
  for (const px of along(2 * x)) {
    fence.push({ position: [px, 0, -z], rotation: deg(90) })
    // The equipment has to have arrived through something.
    ;(Math.abs(px) < GATE_SPAN ? gate : fence).push({ position: [px, 0, z], rotation: deg(90) })
  }
  for (const pz of along(2 * z)) {
    fence.push({ position: [-x, 0, pz] })
    fence.push({ position: [x, 0, pz] })
  }
  return { fence, gate }
}

/** Everything standing on the slab. Positions are lot-relative, y is added below. */
const equipment: { url: string; position: [number, number]; rotation?: number }[] = [
  { url: siteAssets.crane, position: [0.1, -0.35], rotation: 12 },
  { url: siteAssets.container, position: [-1.05, -0.55], rotation: 90 },
  { url: siteAssets.scaffolding, position: [1.15, -0.5], rotation: 90 },
  { url: siteAssets.skip, position: [-1.15, 0.35], rotation: 20 },
  { url: siteAssets.mixer, position: [0.95, 0.5], rotation: 200 },
  { url: siteAssets.steel, position: [-0.55, 0.55], rotation: 8 },
  { url: siteAssets.pipes, position: [-0.2, 0.62], rotation: 172 },
  { url: siteAssets.planks, position: [0.4, 0.6], rotation: 96 },
  { url: siteAssets.bricks, position: [0.62, 0.28], rotation: 40 },
  { url: siteAssets.cement, position: [-0.75, -0.05], rotation: 130 },
  { url: siteAssets.wheelbarrow, position: [-0.35, 0.15], rotation: 250 },
  { url: siteAssets.toilet, position: [1.3, 0.25], rotation: 270 },
  { url: siteAssets.pillar, position: [1.32, -0.15] },
  { url: siteAssets.light, position: [-1.32, -0.05], rotation: 100 },
  { url: siteAssets.light, position: [1.32, -0.85], rotation: 240 },
  { url: siteAssets.barrier, position: [-0.85, 0.82], rotation: 90 },
  { url: siteAssets.barrier, position: [0.85, 0.82], rotation: 90 },
  { url: siteAssets.cone, position: [-0.45, 0.86] },
  { url: siteAssets.cone, position: [0.15, 0.88] },
  { url: siteAssets.cone, position: [0.5, 0.84] },
]

const SELECTED_LIFT = 1.05
/** Top of the hoarding and equipment, for the marker and the preview card. */
const SITE_HEIGHT = 1.1

export function ConstructionSite({
  center,
  footprint,
  state,
  preview,
  onSelect,
  onHoverChange,
}: {
  center: [number, number]
  footprint: [number, number]
  state: BuildingState
  preview?: BuildingPreview | null
  onSelect: () => void
  onHoverChange: (hovered: boolean) => void
}) {
  const group = useRef<Group>(null)
  const { fence, gate } = useMemo(() => perimeter(footprint[0], footprint[1]), [footprint])

  useFrame((_, delta) => {
    const node = group.current
    if (!node) return
    const target = state === 'selected' ? SELECTED_LIFT : 1
    node.scale.setScalar(node.scale.x + (target - node.scale.x) * Math.min(1, delta * 10))
  })

  return (
    <group ref={group} position={[center[0], 0, center[1]]}>
      {/* One collider for the whole site, so the small props stay non-interactive. */}
      <mesh
        position={[0, 0.45, 0]}
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
        <boxGeometry args={[footprint[0], 0.9, footprint[1]]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {/* Poured slab: the plot is prepared, nothing is built on it yet. */}
      <mesh position={[0, SLAB_HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[footprint[0] - 2 * INSET, SLAB_HEIGHT, footprint[1] - 2 * INSET]} />
        <meshStandardMaterial color="#8d8b86" flatShading />
      </mesh>
      <InstancedModel url={siteAssets.fence} instances={fence} />
      <InstancedModel url={siteAssets.gate} instances={gate} />
      {equipment.map((part, i) => (
        <Model
          key={`${part.url}-${i}`}
          url={part.url}
          position={[part.position[0], SLAB_HEIGHT, part.position[1]]}
          rotation={[0, deg(part.rotation ?? 0), 0]}
          raycast={() => null}
        />
      ))}
      <LotMarker footprint={footprint} height={SITE_HEIGHT} state={state} />
      <HoverLabel visible={state === 'hovered'} height={SITE_HEIGHT} preview={preview} />
    </group>
  )
}
