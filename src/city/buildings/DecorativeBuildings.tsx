import { useMemo } from 'react'
import { buildingAssets } from '@/city/assets'
import { InstancedModel, deg, type Instance } from '@/city/models/InstancedModel'
import { footprintCenter } from '@/city/world/cityGrid'
import { decoratives } from '@/city/world/occupancy'
import { hash, pick } from '@/city/world/random'

/**
 * Render facades. The Kenney kits are near-white, which left the district
 * reading as one material and gave the interactive buildings nothing to stand
 * out against; a muted per-instance tint keeps the fill as background while
 * costing nothing — the tint is an instance colour, so the draw call is shared.
 */
const TINTS = [
  '#ffffff',
  '#f2ece1',
  '#e7ded1',
  '#dee4ec',
  '#ecdfd8',
  '#dfe8e1',
  '#e8e2ee',
  '#f0e4d6',
]

/** Street-defining fill. Never focusable (spec §11). */
export function DecorativeBuildings() {
  const byModel = useMemo(() => {
    const groups = new Map<string, Instance[]>()
    for (const building of decoratives) {
      const url = buildingAssets[building.model]
      const [x, z] = footprintCenter(building.grid, building.footprint)
      const list = groups.get(url) ?? []
      list.push({
        position: [x, 0, z],
        rotation: deg(building.rotation),
        color: pick(TINTS, hash(building.grid[0], building.grid[1], 5)),
      })
      groups.set(url, list)
    }
    return [...groups]
  }, [])

  return (
    <group>
      {byModel.map(([url, instances]) => (
        <InstancedModel key={url} url={url} instances={instances} />
      ))}
    </group>
  )
}
