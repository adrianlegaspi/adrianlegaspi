import { forwardRef } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import type { Mesh } from 'three'
import { useModel } from './useModel'

type ModelProps = Omit<ThreeElements['mesh'], 'geometry' | 'material' | 'ref'> & {
  url: string
}

/** One model, centred on its origin and standing on the ground. */
export const Model = forwardRef<Mesh, ModelProps>(function Model({ url, ...props }, ref) {
  const { geometry, material } = useModel(url)
  return (
    <mesh ref={ref} geometry={geometry} material={material} castShadow receiveShadow {...props} />
  )
})
