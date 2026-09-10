import { useMemo } from 'react'
import { roadAssets } from '@/city/assets'
import { InstancedModel, deg, type Instance } from '@/city/models/InstancedModel'
import { CITY_DEPTH, CITY_WIDTH, cellAt, isRoad, lotToWorld } from './cityGrid'

/**
 * Road tiles come from the layout map, so no bends or T-junctions are needed:
 * the grid only contains straights and symmetric four-way crossroads.
 * An unrotated Kenney `road-straight` runs along X — its curbs sit at the two
 * X edges — so a north-south tile is the one turned 90 degrees.
 */
function roadTiles() {
  const straights: Instance[] = []
  const crossroads: Instance[] = []
  const crossings: Instance[] = []
  const plazas: Instance[] = []

  for (let z = 0; z < CITY_DEPTH; z++) {
    for (let x = 0; x < CITY_WIDTH; x++) {
      const cell = cellAt(x, z)
      const [wx, wz] = lotToWorld(x, z)
      if (cell === 'p') {
        plazas.push({ position: [wx, 0, wz] })
        continue
      }
      if (cell !== '#') continue

      const northSouth = isRoad(x, z - 1) || isRoad(x, z + 1)
      const eastWest = isRoad(x - 1, z) || isRoad(x + 1, z)

      if (northSouth && eastWest) {
        crossroads.push({ position: [wx, 0, wz] })
        continue
      }

      const rotation = eastWest ? 0 : deg(90)
      // A pedestrian crossing on each junction approach.
      const nextToJunction = eastWest
        ? isCrossroad(x - 1, z) || isCrossroad(x + 1, z)
        : isCrossroad(x, z - 1) || isCrossroad(x, z + 1)
      const tile = { position: [wx, 0, wz] as [number, number, number], rotation }
      if (nextToJunction) crossings.push(tile)
      else straights.push(tile)
    }
  }

  return { straights, crossroads, crossings, plazas }
}

const isCrossroad = (x: number, z: number) =>
  isRoad(x, z) && (isRoad(x, z - 1) || isRoad(x, z + 1)) && (isRoad(x - 1, z) || isRoad(x + 1, z))

export function Roads() {
  const { straights, crossroads, crossings, plazas } = useMemo(() => roadTiles(), [])
  return (
    <group>
      <InstancedModel url={roadAssets.straight} instances={straights} castShadow={false} />
      <InstancedModel url={roadAssets.crossroad} instances={crossroads} castShadow={false} />
      <InstancedModel url={roadAssets.crossing} instances={crossings} castShadow={false} />
      <InstancedModel url={roadAssets.plaza} instances={plazas} castShadow={false} />
    </group>
  )
}
