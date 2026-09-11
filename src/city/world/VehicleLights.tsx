import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  DoubleSide,
  Euler,
  InstancedMesh,
  Matrix4,
  PlaneGeometry,
  Quaternion,
  Vector3,
  type Plane,
  type Texture,
} from 'three'
import { CAMERA_DIRECTION } from '@/city/camera/cameraBounds'
import { ROAD_TOP, carPose, type Car } from './carPool'

/**
 * Vehicle lights, drawn as additive quads rather than lit with real lights: a
 * moving point light per car would cost a shadow-free forward-render pass for
 * every fragment it touches, and at this camera distance a headlight reads as a
 * glow and a pool on the tarmac anyway (spec §31).
 */

export const HEADLIGHT = '#ffe3b0'
export const TAILLIGHT = '#a81f0d'

/** Lamps face the camera, and the viewing angle never changes (spec §14). */
export const FACING = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), CAMERA_DIRECTION)

/** One quad, shared by every lamp and pool in the city. */
export const GLOW_QUAD = new PlaneGeometry(1, 1)

let sprite: Texture | null = null

/**
 * The glow itself: a 64px radial gradient drawn once at runtime, so the effect
 * adds one texture and no request to the asset manifest.
 */
export function glowSprite() {
  if (sprite) return sprite
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.5)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 64, 64)
  }
  sprite = new CanvasTexture(canvas)
  return sprite
}

/**
 * Additive and depth-read-only: lamps brighten whatever is behind them, are
 * hidden by anything in front, and never occlude each other.
 */
export function GlowMaterial({
  strength,
  color = '#ffffff',
  clippingPlanes = null,
}: {
  strength: number
  color?: string
  /** The train is cut at the lips of the base, so its lights are cut with it. */
  clippingPlanes?: Plane[] | null
}) {
  return (
    <meshBasicMaterial
      map={glowSprite()}
      color={color}
      transparent
      opacity={strength}
      blending={AdditiveBlending}
      depthWrite={false}
      side={DoubleSide}
      clippingPlanes={clippingPlanes}
    />
  )
}

/** Lamp offsets in car space — the kit models all face +Z — and their sizes. */
const LAMPS = [
  { x: -0.12, y: 0.11, z: 0.33, size: 0.22, color: HEADLIGHT },
  { x: 0.12, y: 0.11, z: 0.33, size: 0.22, color: HEADLIGHT },
  { x: -0.13, y: 0.13, z: -0.33, size: 0.16, color: TAILLIGHT },
  { x: 0.13, y: 0.13, z: -0.33, size: 0.16, color: TAILLIGHT },
]

/**
 * The pool the headlights throw, centred ahead of the nose. One offset serves
 * all six models: the kit's cars are within a tenth of a lot of one length, and
 * the pool starts well clear of the longest of them.
 */
const POOL = { ahead: 0.8, width: 0.52, length: 1.6 }
/** Road tiles are 0.02 thick, so a pool laid at 0.03 clears the tarmac. */
const POOL_Y = 0.03
/** Reflected light is dimmer than the lamp throwing it. */
const POOL_STRENGTH = 0.6

const matrix = new Matrix4()
const quaternion = new Quaternion()
const euler = new Euler()
const position = new Vector3()
const scale = new Vector3()

/**
 * Lights for the whole fleet in two draw calls: every lamp is one instance of
 * the shared quad, every pool another. The pool is read from the same car state
 * `Traffic` drives, so nothing has to be handed between the two.
 */
export function CarLights({ cars, strength }: { cars: Car[]; strength: number }) {
  const lamps = useRef<InstancedMesh>(null)
  const pools = useRef<InstancedMesh>(null)

  // Which instance is a headlight and which a tail lamp never changes.
  useLayoutEffect(() => {
    const mesh = lamps.current
    if (!mesh) return
    const color = new Color()
    cars.forEach((_, index) =>
      LAMPS.forEach((lamp, i) => mesh.setColorAt(index * LAMPS.length + i, color.set(lamp.color))),
    )
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [cars])

  useFrame(() => {
    const lampMesh = lamps.current
    const poolMesh = pools.current
    if (!lampMesh || !poolMesh) return

    cars.forEach((car, index) => {
      const pose = carPose(car)
      const sin = Math.sin(pose.angle)
      const cos = Math.cos(pose.angle)

      LAMPS.forEach((lamp, i) => {
        position.set(
          pose.x + lamp.x * cos + lamp.z * sin,
          ROAD_TOP + lamp.y,
          pose.z - lamp.x * sin + lamp.z * cos,
        )
        scale.setScalar(lamp.size)
        lampMesh.setMatrixAt(index * LAMPS.length + i, matrix.compose(position, FACING, scale))
      })

      position.set(pose.x + POOL.ahead * sin, POOL_Y, pose.z + POOL.ahead * cos)
      euler.set(-Math.PI / 2, pose.angle, 0, 'YXZ')
      quaternion.setFromEuler(euler)
      scale.set(POOL.width, POOL.length, 1)
      poolMesh.setMatrixAt(index, matrix.compose(position, quaternion, scale))
    })

    lampMesh.instanceMatrix.needsUpdate = true
    poolMesh.instanceMatrix.needsUpdate = true
  })

  if (!cars.length) return null
  return (
    <group>
      {/* Cars roam the whole grid, so the instance bounds of both meshes are stale by design. */}
      <instancedMesh
        ref={lamps}
        args={[GLOW_QUAD, undefined, cars.length * LAMPS.length]}
        frustumCulled={false}
      >
        <GlowMaterial strength={strength} />
      </instancedMesh>
      <instancedMesh ref={pools} args={[GLOW_QUAD, undefined, cars.length]} frustumCulled={false}>
        <GlowMaterial strength={strength * POOL_STRENGTH} color={HEADLIGHT} />
      </instancedMesh>
    </group>
  )
}
