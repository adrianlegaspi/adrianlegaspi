import { useMemo } from 'react'
import { propAssets } from '@/city/assets'
import { InstancedModel, deg, type Instance } from '@/city/models/InstancedModel'
import { projects } from '@/content/registry'
import { landmarks } from '@/data/landmarks'
import { CITY_DEPTH, CITY_WIDTH, cellAt, footprintCenter, isRoad, lotToWorld } from './cityGrid'
import { LightBulb } from './VehicleLights'

type Props = Record<string, Instance[]>

interface CurbSlot {
  position: [number, number, number]
  rotation: number
}

const CURB = 0.38

const isJunction = (x: number, z: number) =>
  isRoad(x, z) && (isRoad(x, z - 1) || isRoad(x, z + 1)) && (isRoad(x - 1, z) || isRoad(x + 1, z))

/** Lamp slots on straight sidewalk, excluding junctions and their crossings. */
function curbSlots(): CurbSlot[] {
  const slots: CurbSlot[] = []

  for (let z = 0; z < CITY_DEPTH; z++) {
    for (let x = 0; x < CITY_WIDTH; x++) {
      if (!isRoad(x, z) || isJunction(x, z)) continue

      const northSouth = isRoad(x, z - 1) || isRoad(x, z + 1)
      const eastWest = isRoad(x - 1, z) || isRoad(x + 1, z)
      const besideJunction = eastWest
        ? isJunction(x - 1, z) || isJunction(x + 1, z)
        : isJunction(x, z - 1) || isJunction(x, z + 1)
      if (besideJunction) continue

      const [wx, wz] = lotToWorld(x, z)
      if (northSouth) {
        // The model's arm points down -Z before rotation: both arms face the road.
        slots.push({ position: [wx - CURB, 0, wz], rotation: deg(270) })
        slots.push({ position: [wx + CURB, 0, wz], rotation: deg(90) })
      } else if (eastWest) {
        slots.push({ position: [wx, 0, wz - CURB], rotation: deg(180) })
        slots.push({ position: [wx, 0, wz + CURB], rotation: 0 })
      }
    }
  }

  return slots
}

/** One unique, nearest sidewalk lamp for every focusable building. */
function interactiveStreetlights(): Instance[] {
  const available = curbSlots()
  const buildings = [
    ...projects.map((project) => project.building),
    ...landmarks.map((landmark) => landmark),
  ]

  return buildings.map((building) => {
    const [x, z] = footprintCenter(building.grid, building.footprint)
    let nearest = 0
    let distance = Infinity
    available.forEach((slot, index) => {
      const dx = slot.position[0] - x
      const dz = slot.position[2] - z
      const next = dx * dx + dz * dz
      if (next < distance) {
        nearest = index
        distance = next
      }
    })
    return available.splice(nearest, 1)[0]
  })
}

/** Four balanced corner planters frame City Hall without touching crossings. */
const PLAZA_PLANTERS: Instance[] = [
  { position: [4, 0, 4], rotation: 0 },
  { position: [7, 0, 4], rotation: deg(90) },
  { position: [4, 0, 7], rotation: deg(270) },
  { position: [7, 0, 7], rotation: deg(180) },
]

/**
 * Street furniture, derived from the hand-authored map rather than listed one by
 * one: the map already says where roads and plazas are, and props only have to
 * decorate them (spec §20: composition, not interactive clutter). Planting is
 * `Greenery`'s job and moving cars are `Traffic`'s.
 */
function buildProps() {
  const props: Props = {
    streetlight: interactiveStreetlights(),
    trafficLight: [],
    planter: PLAZA_PLANTERS,
  }

  for (let z = 0; z < CITY_DEPTH; z++) {
    for (let x = 0; x < CITY_WIDTH; x++) {
      const cell = cellAt(x, z)
      const [wx, wz] = lotToWorld(x, z)
      if (cell !== '#') continue

      const northSouth = isRoad(x, z - 1) || isRoad(x, z + 1)
      const eastWest = isRoad(x - 1, z) || isRoad(x + 1, z)

      if (northSouth && eastWest) {
        // One signal per junction, on the north-west corner.
        props.trafficLight.push({ position: [wx - 0.42, 0, wz - 0.42], rotation: deg(90) })
      }
    }
  }

  return props
}

export function Props({
  lit = false,
  localLights = true,
}: {
  lit?: boolean
  localLights?: boolean
}) {
  const props = useMemo(() => buildProps(), [])
  return (
    <group>
      <InstancedModel url={propAssets.streetlight} instances={props.streetlight} />
      <InstancedModel url={propAssets['traffic-light']} instances={props.trafficLight} />
      <InstancedModel url={propAssets.planter} instances={props.planter} />
      {lit &&
        props.streetlight.map(({ position, rotation = 0 }) => {
          const lampPosition: [number, number, number] = [
            position[0] - Math.sin(rotation) * 0.18,
            0.58,
            position[2] - Math.cos(rotation) * 0.18,
          ]
          return localLights ? (
            <pointLight
              key={`${position[0]},${position[2]}`}
              position={lampPosition}
              color="#ffd9a0"
              intensity={1.4}
              distance={2.8}
              decay={2}
            />
          ) : (
            <LightBulb key={`${position[0]},${position[2]}`} position={lampPosition} />
          )
        })}
    </group>
  )
}
