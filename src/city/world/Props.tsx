import { useMemo } from 'react'
import { CAR_SCALE, carAssets, propAssets } from '@/city/assets'
import { InstancedModel, deg, type Instance } from '@/city/models/InstancedModel'
import { CITY_DEPTH, CITY_WIDTH, cellAt, isRoad, lotToWorld } from './cityGrid'

/** Deterministic per-lot value, so the city looks scattered but never changes. */
function hash(x: number, z: number) {
  const n = Math.sin(x * 127.1 + z * 311.7) * 43758.5453
  return n - Math.floor(n)
}

type Props = Record<string, Instance[]>

/**
 * Props are derived from the hand-authored map rather than listed one by one:
 * the map already says where roads, parks and plazas are, and props only have
 * to decorate them (spec §20 — composition, not interactive clutter).
 */
function buildProps() {
  const props: Props = {
    streetlight: [],
    trafficLight: [],
    treeLarge: [],
    treeSmall: [],
    planter: [],
    cars: [],
  }
  const carModels = [
    carAssets.sedan,
    carAssets.suv,
    carAssets.taxi,
    carAssets.van,
    carAssets.delivery,
  ]
  const cars: Instance[][] = carModels.map(() => [])

  for (let z = 0; z < CITY_DEPTH; z++) {
    for (let x = 0; x < CITY_WIDTH; x++) {
      const cell = cellAt(x, z)
      const [wx, wz] = lotToWorld(x, z)
      const r = hash(x, z)

      if (cell === 'g') {
        props.treeLarge.push({ position: [wx - 0.15, 0, wz + 0.1], rotation: deg(r * 360) })
        if (r > 0.45)
          props.treeSmall.push({ position: [wx + 0.3, 0, wz - 0.28], rotation: deg(r * 720) })
        continue
      }

      if (cell === 'p' && (x + z) % 3 === 0) {
        props.planter.push({ position: [wx, 0, wz], rotation: 0 })
        continue
      }

      if (cell !== '#') continue

      const northSouth = isRoad(x, z - 1) || isRoad(x, z + 1)
      const eastWest = isRoad(x - 1, z) || isRoad(x + 1, z)
      const junction = northSouth && eastWest

      if (junction) {
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
      } else if (r > 0.62) {
        const model = Math.floor(r * 97) % carModels.length
        cars[model].push({
          position: alongZ ? [wx + offset * 0.8, 0, wz] : [wx, 0, wz + offset * 0.8],
          rotation: alongZ ? deg(r > 0.8 ? 180 : 0) : deg(r > 0.8 ? 90 : 270),
          scale: CAR_SCALE,
        })
      }
    }
  }

  return { props, carModels, cars }
}

/** A few lamps are lit at night. One light per lamp post would be far too many. */
const LIT_LAMPS = 8

export function Props({ lit = false }: { lit?: boolean }) {
  const { props, carModels, cars } = useMemo(() => buildProps(), [])
  const lamps = useMemo(
    () => props.streetlight.filter((_, i) => i % 2 === 0).slice(0, LIT_LAMPS),
    [props.streetlight],
  )
  return (
    <group>
      <InstancedModel url={propAssets.streetlight} instances={props.streetlight} />
      <InstancedModel url={propAssets['traffic-light']} instances={props.trafficLight} />
      <InstancedModel url={propAssets['tree-large']} instances={props.treeLarge} />
      <InstancedModel url={propAssets['tree-small']} instances={props.treeSmall} />
      <InstancedModel url={propAssets.planter} instances={props.planter} />
      {carModels.map((url, i) => (
        <InstancedModel key={url} url={url} instances={cars[i]} />
      ))}
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
