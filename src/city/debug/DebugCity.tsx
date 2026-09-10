import { useMemo } from 'react'
import { Html } from '@react-three/drei'
import { CITY_DEPTH, CITY_WIDTH, LOT_SIZE, footprintCenter, lotToWorld } from '../world/cityGrid'
import { occupiedLots } from '../world/occupancy'
import { projects } from '@/content/registry'
import { landmarks } from '@/data/landmarks'

const enabled = () =>
  import.meta.env.DEV && new URLSearchParams(window.location.search).get('debugCity') === '1'

/**
 * Placement helper for `?debugCity=1` (spec §41). Development only, so it can
 * never appear in a production build.
 */
export function DebugCity() {
  const on = useMemo(() => enabled(), [])
  const lots = useMemo(() => [...occupiedLots.entries()], [])

  if (!on) return null

  const half = LOT_SIZE / 2
  return (
    <group>
      <gridHelper
        args={[CITY_WIDTH * LOT_SIZE, CITY_WIDTH, '#ff4d6d', '#8892b0']}
        position={[(CITY_WIDTH * LOT_SIZE) / 2 - half, 0.05, (CITY_DEPTH * LOT_SIZE) / 2 - half]}
      />
      {lots.map(([key, id]) => {
        const [x, z] = key.split(',').map(Number)
        const [wx, wz] = lotToWorld(x, z)
        return (
          <mesh key={key} position={[wx, 0.06, wz]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[LOT_SIZE * 0.9, LOT_SIZE * 0.9]} />
            <meshBasicMaterial
              color={id.startsWith('decorative') ? '#3ddc97' : '#ff4d6d'}
              transparent
              opacity={0.25}
            />
          </mesh>
        )
      })}
      {[
        ...projects.map((p) => ({
          id: p.id,
          center: footprintCenter(p.building.grid, p.building.footprint),
          grid: p.building.grid,
        })),
        ...landmarks.map((l) => ({
          id: l.id,
          center: footprintCenter(l.grid, l.footprint),
          grid: l.grid,
        })),
      ].map((entry) => (
        <Html key={entry.id} position={[entry.center[0], 1.4, entry.center[1]]} center>
          <span
            style={{
              background: '#111827cc',
              color: 'white',
              font: '11px ui-monospace, monospace',
              padding: '2px 4px',
              borderRadius: 3,
              whiteSpace: 'nowrap',
            }}
          >
            {entry.id} [{entry.grid[0]},{entry.grid[1]}]
          </span>
        </Html>
      ))}
    </group>
  )
}
