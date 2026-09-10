import { useMemo } from 'react'
import { natureAssets, type NatureAssetId } from '@/city/assets'
import { InstancedModel, deg, type Instance } from '@/city/models/InstancedModel'
import { CITY_DEPTH, CITY_WIDTH, RAIL_RING, cellAt, lotToWorld, ringLots } from './cityGrid'
import { hash, pick } from './random'

/** Nothing shorter than this reads at diorama distance, so it stays off the shadow map. */
const CASTS_SHADOW: NatureAssetId[] = [
  'pine-tall',
  'pine-round',
  'tree-oak',
  'tree-tall',
  'tree-thin',
  'tree-fall',
  'rock-large',
  'stone-tall',
  'log',
]

/** Woodland on the belt, ornamental planting in the parks. */
const CANOPY = ['pine-tall', 'pine-round', 'tree-tall', 'tree-thin'] as const
const PARK_CANOPY = ['tree-oak', 'tree-fall', 'tree-tall', 'pine-round'] as const
const UNDERGROWTH = ['bush', 'bush-large', 'grass', 'rock-small', 'stump'] as const
const PARK_UNDERGROWTH = ['flowers-red', 'flowers-yellow', 'bush', 'grass'] as const
const ROCKS = ['rock-large', 'stone-tall', 'log'] as const

type Scatter = Partial<Record<NatureAssetId, Instance[]>>

const add = (into: Scatter, id: NatureAssetId, instance: Instance) => {
  ;(into[id] ??= []).push(instance)
}

/**
 * The green belt between the boundary road and the edge of the base, plus the
 * planting inside the city parks. Everything is placed from the layout map and
 * a deterministic hash, so the scatter is dense-looking but stable and needs no
 * hand-authored coordinates (spec §11).
 */
function scatter(): Scatter {
  const into: Scatter = {}

  for (const { x, z } of ringLots(RAIL_RING)) {
    // The western arm of this ring is the rail line, not planting.
    if (x === -RAIL_RING) continue
    const [wx, wz] = lotToWorld(x, z)

    for (let i = 0; i < 3; i++) {
      const r = hash(x, z, i)
      const jitterX = (hash(x, z, i + 10) - 0.5) * 0.8
      const jitterZ = (hash(x, z, i + 20) - 0.5) * 0.8
      const id =
        r > 0.55 ? pick(CANOPY, r * 7) : r > 0.22 ? pick(UNDERGROWTH, r * 11) : pick(ROCKS, r * 13)
      add(into, id, {
        position: [wx + jitterX, 0, wz + jitterZ],
        rotation: deg(r * 720),
        scale: 0.85 + r * 0.4,
      })
    }
  }

  for (let z = 0; z < CITY_DEPTH; z++) {
    for (let x = 0; x < CITY_WIDTH; x++) {
      if (cellAt(x, z) !== 'g') continue
      const [wx, wz] = lotToWorld(x, z)
      const r = hash(x, z, 3)
      add(into, pick(PARK_CANOPY, r * 5), {
        position: [wx - 0.16, 0, wz + 0.1],
        rotation: deg(r * 360),
        scale: 0.9 + r * 0.35,
      })
      for (let i = 0; i < 2; i++) {
        const s = hash(x, z, i + 30)
        add(into, pick(PARK_UNDERGROWTH, s * 9), {
          position: [wx + (s - 0.5) * 0.7, 0, wz + (hash(x, z, i + 40) - 0.5) * 0.7],
          rotation: deg(s * 720),
          scale: 0.85 + s * 0.3,
        })
      }
    }
  }

  return into
}

export function Greenery() {
  const groups = useMemo(() => Object.entries(scatter()) as [NatureAssetId, Instance[]][], [])
  return (
    <group>
      {groups.map(([id, instances]) => (
        <InstancedModel
          key={id}
          url={natureAssets[id]}
          instances={instances}
          castShadow={CASTS_SHADOW.includes(id)}
        />
      ))}
    </group>
  )
}
