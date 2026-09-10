import { useMemo } from 'react'
import { CITY_DEPTH, CITY_WIDTH, cellAt, cityBounds, lotToWorld } from './cityGrid'
import type { TimePreset } from '@/city/environment/timeOfDay'

const MARGIN = 1
const BASE_HEIGHT = 0.6

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
  const width = cityBounds.maxX - cityBounds.minX + MARGIN * 2
  const depth = cityBounds.maxZ - cityBounds.minZ + MARGIN * 2

  return (
    <group>
      <mesh position={[cityBounds.centerX, -BASE_HEIGHT / 2, cityBounds.centerZ]} receiveShadow>
        <boxGeometry args={[width, BASE_HEIGHT, depth]} />
        <meshStandardMaterial color={preset.ground} />
      </mesh>
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
