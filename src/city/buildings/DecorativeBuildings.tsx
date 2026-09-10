import { useMemo } from 'react'
import { buildingAssets } from '@/city/assets'
import { InstancedModel, deg, type Instance } from '@/city/models/InstancedModel'
import { footprintCenter } from '@/city/world/cityGrid'
import { decoratives } from '@/city/world/occupancy'

/** Street-defining fill. Never focusable (spec §11). */
export function DecorativeBuildings() {
  const byModel = useMemo(() => {
    const groups = new Map<string, Instance[]>()
    for (const building of decoratives) {
      const url = buildingAssets[building.model]
      const [x, z] = footprintCenter(building.grid, building.footprint)
      const list = groups.get(url) ?? []
      list.push({ position: [x, 0, z], rotation: deg(building.rotation) })
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
