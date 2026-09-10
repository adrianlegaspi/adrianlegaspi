import { useMemo } from 'react'
import sceneryData from '@/data/scenery.json'
import { isPropAssetId, propAssets, type PropAssetId } from '@/city/assets'
import { InstancedModel, deg, type Instance } from '@/city/models/InstancedModel'
import { lotToWorld } from './cityGrid'

interface SceneryProp {
  prop: PropAssetId
  lot: [number, number]
  /** Displacement from the lot centre, in lot units. */
  offset?: [number, number]
  /** Height off the ground, for a stacked container. */
  lift?: number
  rotation?: number
}

const props = sceneryData.props as SceneryProp[]

const unknown = props.filter((item) => !isPropAssetId(item.prop))
if (unknown.length) {
  const message = `Unknown scenery props: ${unknown.map((item) => item.prop).join(', ')}`
  if (import.meta.env.DEV) throw new Error(message)
  console.error('[city]', message)
}

/**
 * Hand-placed scenery: the few clusters that carry a story a scatter cannot,
 * like the container yard beside the industrial project. Everything here sits
 * on lots the building placement left empty, so it needs no layout changes.
 */
export function Scenery() {
  const byProp = useMemo(() => {
    const groups = new Map<PropAssetId, Instance[]>()
    for (const item of props) {
      if (!isPropAssetId(item.prop)) continue
      const [wx, wz] = lotToWorld(item.lot[0], item.lot[1])
      const [dx, dz] = item.offset ?? [0, 0]
      const list = groups.get(item.prop) ?? []
      list.push({
        position: [wx + dx, item.lift ?? 0, wz + dz],
        rotation: deg(item.rotation ?? 0),
      })
      groups.set(item.prop, list)
    }
    return [...groups]
  }, [])

  return (
    <group>
      {byProp.map(([prop, instances]) => (
        <InstancedModel key={prop} url={propAssets[prop]} instances={instances} />
      ))}
    </group>
  )
}
