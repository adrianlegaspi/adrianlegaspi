import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Euler, InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three'
import { useModel } from '@/city/models/useModel'
import { carModels, carPose, driveCar, makePool, roadNetwork, type Car } from './carPool'
import { CarLights } from './VehicleLights'

/**
 * The whole moving-car budget. A handful of cars is enough to make the streets
 * read as alive, and the pool never grows (spec §31).
 */
const POOL = { desktop: 5, mobile: 3 }

const matrix = new Matrix4()
const quaternion = new Quaternion()
const euler = new Euler()
const position = new Vector3()
const scale = new Vector3()

/** One instanced mesh per car model; the pool is shared and indexed by model. */
function CarModel({
  url,
  cars,
  meshRef,
}: {
  url: string
  cars: Car[]
  meshRef: (mesh: InstancedMesh | null) => void
}) {
  const { geometry, material } = useModel(url)
  if (!cars.length) return null
  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, cars.length]}
      castShadow
      receiveShadow
    />
  )
}

/**
 * Traffic. Cars are pooled rather than spawned: a fixed set of agents walks the
 * road graph forever, and a car that reaches a building it can pull in beside
 * parks there for a few seconds before rejoining. Nothing is ever created or
 * destroyed at runtime, so the cost is one matrix write per car per frame.
 */
export function Traffic({
  layout,
  moving = true,
  lights = 0,
}: {
  layout: 'desktop' | 'mobile'
  moving?: boolean
  /** Headlight strength from the time-of-day preset. */
  lights?: number
}) {
  const network = useMemo(() => roadNetwork(), [])
  const cars = useMemo(() => makePool(POOL[layout], network), [layout, network])
  const byModel = useMemo(
    () => carModels.map((_, model) => cars.filter((car) => car.model === model)),
    [cars],
  )
  const meshes = useRef<(InstancedMesh | null)[]>([])

  useFrame((_, delta) => {
    // A long stall must not teleport the whole fleet across the district.
    const step = Math.min(delta, 0.1)
    if (moving) for (const car of cars) driveCar(car, step, network)

    byModel.forEach((group, model) => {
      const mesh = meshes.current[model]
      if (!mesh) return
      group.forEach((car, i) => {
        const pose = carPose(car)
        position.set(pose.x, 0, pose.z)
        euler.set(0, pose.angle, 0)
        quaternion.setFromEuler(euler)
        scale.setScalar(car.scale)
        mesh.setMatrixAt(i, matrix.compose(position, quaternion, scale))
      })
      mesh.instanceMatrix.needsUpdate = true
    })
  })

  return (
    <group>
      {carModels.map((url, model) => (
        <CarModel
          key={url}
          url={url}
          cars={byModel[model]}
          meshRef={(mesh) => {
            meshes.current[model] = mesh
          }}
        />
      ))}
      {lights > 0 && <CarLights cars={cars} strength={lights} />}
    </group>
  )
}
