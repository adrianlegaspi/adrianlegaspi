import { useMemo } from 'react'
import { CITY_DEPTH, CITY_WIDTH, baseBounds, cellAt, lotToWorld, roadRing } from './cityGrid'
import type { TimePreset } from '@/city/environment/timeOfDay'

const BASE_HEIGHT = 0.6

/**
 * The green belt: everything on the base outside the boundary road, drawn as
 * four strips so the district reads as a model on a lawn rather than a slab
 * that stops.
 */
const belt = (() => {
  const outer = {
    minX: roadRing.low - 0.5,
    maxX: roadRing.highX + 0.5,
    minZ: roadRing.low - 0.5,
    maxZ: roadRing.highZ + 0.5,
  }
  const strip = (minX: number, maxX: number, minZ: number, maxZ: number) => ({
    size: [maxX - minX, maxZ - minZ] as [number, number],
    center: [(minX + maxX) / 2, (minZ + maxZ) / 2] as [number, number],
  })
  return [
    strip(baseBounds.minX, baseBounds.maxX, baseBounds.minZ, outer.minZ),
    strip(baseBounds.minX, baseBounds.maxX, outer.maxZ, baseBounds.maxZ),
    strip(baseBounds.minX, outer.minX, outer.minZ, outer.maxZ),
    strip(outer.maxX, baseBounds.maxX, outer.minZ, outer.maxZ),
  ]
})()

/** Lots that are parkland rather than built ground. */
function parkLots() {
  const lots: [number, number][] = []
  for (let z = 0; z < CITY_DEPTH; z++)
    for (let x = 0; x < CITY_WIDTH; x++) if (cellAt(x, z) === 'g') lots.push([x, z])
  return lots
}

/**
 * A contained district on a raised base, not an infinite plane (spec §20).
 */
export function Ground({ preset }: { preset: TimePreset }) {
  const parks = useMemo(() => parkLots(), [])
  const width = baseBounds.maxX - baseBounds.minX
  const depth = baseBounds.maxZ - baseBounds.minZ

  return (
    <group>
      <mesh position={[baseBounds.centerX, -BASE_HEIGHT / 2, baseBounds.centerZ]} receiveShadow>
        <boxGeometry args={[width, BASE_HEIGHT, depth]} />
        <meshStandardMaterial color={preset.ground} />
      </mesh>
      {belt.map(({ size, center }) => (
        <mesh
          key={`${center[0]},${center[1]}`}
          position={[center[0], 0.008, center[1]]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={size} />
          <meshStandardMaterial color={preset.park} />
        </mesh>
      ))}
      {parks.map(([x, z]) => {
        const [wx, wz] = lotToWorld(x, z)
        return (
          <mesh
            key={`${x},${z}`}
            position={[wx, 0.012, wz]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial color={preset.park} />
          </mesh>
        )
      })}
    </group>
  )
}
