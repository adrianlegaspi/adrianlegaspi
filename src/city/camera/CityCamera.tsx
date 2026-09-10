import { useEffect, useRef, type ComponentRef } from 'react'
import { MapControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { TOUCH, Vector3 } from 'three'
import {
  CAMERA_DIRECTION,
  FOCUS_DISTANCE,
  INITIAL_DISTANCE,
  MAX_DISTANCE,
  MIN_DISTANCE,
  clampTarget,
  cityCenter,
  focusTarget,
} from './cameraBounds'

/** drei owns the controls implementation, so the ref type comes from it. */
type MapControlsImpl = ComponentRef<typeof MapControls>

/**
 * Pan and zoom only: no orbit controls are exposed (spec §14). Selecting a
 * project glides the same fixed view onto the building.
 */
export function CityCamera({
  focus,
  layout,
  instant = false,
}: {
  /** World centre of the selected building, or `null` for free look. */
  focus: [number, number] | null
  layout: 'desktop' | 'mobile'
  /** Skip the glide when the visitor asked for reduced motion (spec §29). */
  instant?: boolean
}) {
  const controls = useRef<MapControlsImpl>(null)
  const camera = useThree((state) => state.camera)
  const goal = useRef<Vector3 | null>(null)

  // Start looking at the middle of the district.
  useEffect(() => {
    const target = cityCenter()
    camera.position.copy(target).addScaledVector(CAMERA_DIRECTION, INITIAL_DISTANCE)
    camera.lookAt(target)
    const node = controls.current
    if (node) {
      node.target.copy(target)
      node.update()
    }
  }, [camera])

  useEffect(() => {
    goal.current = focus ? focusTarget(focus, layout) : null
  }, [focus, layout])

  useFrame((_, delta) => {
    const node = controls.current
    if (!node) return
    let distance = camera.position.distanceTo(node.target)

    if (goal.current) {
      const step = instant ? 1 : Math.min(1, delta * 3)
      node.target.lerp(goal.current, step)
      // Selecting a project also settles the zoom, so the building reads as focused.
      distance += (Math.min(distance, FOCUS_DISTANCE) - distance) * step
      if (node.target.distanceTo(goal.current) < 0.02) {
        node.target.copy(goal.current)
        goal.current = null
      }
    }

    // Keep the district on screen and the viewing angle fixed.
    clampTarget(node.target)
    camera.position.copy(node.target).addScaledVector(CAMERA_DIRECTION, distance)
  })

  return (
    <MapControls
      ref={controls}
      makeDefault
      enableRotate={false}
      enableDamping
      dampingFactor={0.12}
      minDistance={MIN_DISTANCE}
      maxDistance={MAX_DISTANCE}
      touches={{ ONE: TOUCH.PAN, TWO: TOUCH.DOLLY_PAN }}
      // A manual pan wins over an in-flight focus move.
      onStart={() => {
        goal.current = null
      }}
    />
  )
}
