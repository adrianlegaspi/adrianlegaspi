import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, Euler, InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three'
import { useModel } from './useModel'

export interface Instance {
  /** World position. */
  position: [number, number, number]
  /** Y rotation in radians. */
  rotation?: number
  scale?: number
  /** Multiplied into the shared material, so one model can wear several colours. */
  color?: string
}

const DEG = Math.PI / 180

export const deg = (degrees: number) => degrees * DEG

/** Every repeated model (roads, props, parked cars, decorative buildings) draws in one call. */
export function InstancedModel({
  url,
  instances,
  castShadow = true,
}: {
  url: string
  instances: Instance[]
  castShadow?: boolean
}) {
  const { geometry, material } = useModel(url)
  const ref = useRef<InstancedMesh>(null)

  const matrices = useMemo(() => {
    const matrix = new Matrix4()
    const quaternion = new Quaternion()
    const euler = new Euler()
    const position = new Vector3()
    const scale = new Vector3()
    return instances.map((instance) => {
      position.set(...instance.position)
      euler.set(0, instance.rotation ?? 0, 0)
      quaternion.setFromEuler(euler)
      const s = instance.scale ?? 1
      scale.set(s, s, s)
      return matrix.compose(position, quaternion, scale).clone()
    })
  }, [instances])

  const tinted = useMemo(() => instances.some((instance) => instance.color), [instances])

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    matrices.forEach((matrix, i) => mesh.setMatrixAt(i, matrix))
    mesh.instanceMatrix.needsUpdate = true
    if (tinted) {
      const color = new Color()
      instances.forEach((instance, i) => mesh.setColorAt(i, color.set(instance.color ?? '#ffffff')))
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
    mesh.computeBoundingSphere()
  }, [matrices, instances, tinted])

  if (!instances.length) return null
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, instances.length]}
      castShadow={castShadow}
      receiveShadow
    />
  )
}
