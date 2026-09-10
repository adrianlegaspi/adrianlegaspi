import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, BufferGeometry, Mesh, Vector3, type MeshStandardMaterial, type Object3D } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export interface ModelParts {
  geometry: BufferGeometry
  material: MeshStandardMaterial
  /** Bounding box size after centring, in world units. */
  size: Vector3
}

const parts = new Map<string, ModelParts>()

/**
 * Kept attributes. The Kenney kits sample a texture atlas; the converted FBX
 * packs (`tools/fbx-to-glb.mjs`) carry their colour per vertex instead and ship
 * without normals so they flat-shade.
 */
const ATTRIBUTES = ['position', 'normal', 'uv', 'color'] as const

/**
 * Kenney kits split some models across several meshes (a car body plus its
 * wheels) or several primitives (identical `colormap` and `colormap-specular`
 * materials), and their origins are inconsistent: some buildings are modelled
 * off-centre and cars sit at axle height.
 *
 * Flattening each model to one geometry with one material at load time lets
 * every placement treat a model as "centred on its lot, standing on the
 * ground", and keeps the repeated models instanceable in a single draw call.
 */
function extract(url: string, scene: Object3D): ModelParts {
  const cached = parts.get(url)
  if (cached) return cached

  scene.updateWorldMatrix(true, true)
  const geometries: BufferGeometry[] = []
  let material: MeshStandardMaterial | null = null

  scene.traverse((child) => {
    if (!(child instanceof Mesh)) return
    const source = child.geometry as BufferGeometry
    const baked = new BufferGeometry()
    for (const name of ATTRIBUTES) {
      const attribute = source.getAttribute(name)
      if (attribute) baked.setAttribute(name, attribute.clone())
    }
    if (source.index) baked.setIndex(source.index.clone())
    baked.applyMatrix4(child.matrixWorld)
    geometries.push(baked)
    material ??= (
      Array.isArray(child.material) ? child.material[0] : child.material
    ) as MeshStandardMaterial
  })

  const merged = geometries.length === 1 ? geometries[0] : mergeGeometries(geometries)
  if (!merged || !material) throw new Error(`${url} has no usable mesh`)

  merged.computeBoundingBox()
  const box = merged.boundingBox ?? new Box3()
  const center = box.getCenter(new Vector3())
  merged.translate(-center.x, -box.min.y, -center.z)
  merged.computeBoundingBox()
  merged.computeBoundingSphere()

  const value: ModelParts = { geometry: merged, material, size: box.getSize(new Vector3()) }
  parts.set(url, value)
  return value
}

export function useModel(url: string): ModelParts {
  const { scene } = useGLTF(url)
  return useMemo(() => extract(url, scene), [url, scene])
}
