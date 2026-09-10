import { useMemo } from 'react'
import { Object3D } from 'three'
import { cityBounds } from '@/city/world/cityGrid'
import type { TimePreset } from './timeOfDay'

/**
 * Visual environment only. The geometry of the city never changes with the
 * time of day (spec §19).
 */
export function Environment({ preset }: { preset: TimePreset }) {
  const { centerX, centerZ } = cityBounds
  // The sun aims at the middle of the district, so the shadow frustum only has
  // to cover the city rather than everything between the light and the origin.
  const target = useMemo(() => new Object3D(), [])
  const radius =
    0.75 * Math.max(cityBounds.maxX - cityBounds.minX, cityBounds.maxZ - cityBounds.minZ)

  return (
    <>
      <color attach="background" args={[preset.background]} />
      <fog attach="fog" args={[preset.fog.color, preset.fog.near, preset.fog.far]} />
      <ambientLight color={preset.ambient.color} intensity={preset.ambient.intensity} />
      <primitive object={target} position={[centerX, 0, centerZ]} />
      <directionalLight
        target={target}
        color={preset.sun.color}
        intensity={preset.sun.intensity}
        position={[
          centerX + preset.sun.position[0],
          preset.sun.position[1],
          centerZ + preset.sun.position[2],
        ]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-radius}
        shadow-camera-right={radius}
        shadow-camera-top={radius}
        shadow-camera-bottom={-radius}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-bias={-0.0008}
      />
    </>
  )
}
