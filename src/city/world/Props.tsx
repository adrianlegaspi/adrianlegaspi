import { useMemo } from 'react'
import { propAssets } from '@/city/assets'
import { InstancedModel, deg, type Instance } from '@/city/models/InstancedModel'
import { CITY_DEPTH, CITY_WIDTH, cellAt, isRoad, lotToWorld } from './cityGrid'
import { hash } from './random'

type Props = Record<string, Instance[]>

/**
 * Street furniture, derived from the hand-authored map rather than listed one by
 * one: the map already says where roads and plazas are, and props only have to
 * decorate them (spec §20 — composition, not interactive clutter). Planting is
 * `Greenery`'s job and moving cars are `Traffic`'s.
 */
function buildProps() {
  const props: Props = {
    streetlight: [],
    trafficLight: [],
    planter: [],
  }

  for (let z = 0; z < CITY_DEPTH; z++) {
    for (let x = 0; x < CITY_WIDTH; x++) {
      const cell = cellAt(x, z)
      const [wx, wz] = lotToWorld(x, z)
      const r = hash(x, z)

      if (cell === 'p') {
        if ((x + z) % 3 === 0) props.planter.push({ position: [wx, 0, wz], rotation: 0 })
        continue
      }

      if (cell !== '#') continue

      const northSouth = isRoad(x, z - 1) || isRoad(x, z + 1)
      const eastWest = isRoad(x - 1, z) || isRoad(x + 1, z)

      if (northSouth && eastWest) {
        // One signal per junction, on the north-west corner.
        props.trafficLight.push({ position: [wx - 0.42, 0, wz - 0.42], rotation: deg(90) })
        continue
      }

      // Curb side: whichever neighbour across the road is buildable ground.
      const alongZ = northSouth
      const side = alongZ ? (isRoad(x - 1, z) ? 1 : -1) : isRoad(x, z - 1) ? 1 : -1
      const offset = 0.38 * side

      if ((x + z) % 4 === 0) {
        props.streetlight.push({
          position: alongZ ? [wx + offset, 0, wz] : [wx, 0, wz + offset],
          rotation: alongZ ? deg(side > 0 ? 270 : 90) : deg(side > 0 ? 0 : 180),
        })
      } else if (r > 0.78) {
        props.planter.push({
          position: alongZ ? [wx + offset, 0, wz] : [wx, 0, wz + offset],
          rotation: deg(r * 360),
        })
      }
    }
  }

  return props
}

/** A few lamps are lit at night. One light per lamp post would be far too many. */
const LIT_LAMPS = 8

export function Props({ lit = false }: { lit?: boolean }) {
  const props = useMemo(() => buildProps(), [])
  const lamps = useMemo(
    () => props.streetlight.filter((_, i) => i % 2 === 0).slice(0, LIT_LAMPS),
    [props.streetlight],
  )
  return (
    <group>
      <InstancedModel url={propAssets.streetlight} instances={props.streetlight} />
      <InstancedModel url={propAssets['traffic-light']} instances={props.trafficLight} />
      <InstancedModel url={propAssets.planter} instances={props.planter} />
      {lit &&
        lamps.map(({ position }) => (
          <pointLight
            key={`${position[0]},${position[2]}`}
            position={[position[0], 0.62, position[2]]}
            color="#ffd9a0"
            intensity={1.6}
            distance={3.2}
            decay={2}
          />
        ))}
    </group>
  )
}
