import { Vector3 } from 'three'
import { baseBounds, cityBounds } from '@/city/world/cityGrid'

/**
 * The camera keeps one fixed orientation for the whole visit (spec §14).
 * Panning and zooming move along this vector; the angle never changes.
 */
export const CAMERA_DIRECTION = new Vector3(0.62, 0.72, 0.62).normalize()

export const MIN_DISTANCE = 7
/** Far enough to see the whole base and no further: past this the diorama is a speck in the haze. */
export const MAX_DISTANCE = 40
export const INITIAL_DISTANCE = 32
/** Stable framing distance for every selected building. */
export const FOCUS_DISTANCE = 15
/** How far the target may travel past the base before the pan stops. */
const PAN_MARGIN = 1

export const cityCenter = () => new Vector3(cityBounds.centerX, 0, cityBounds.centerZ)

export const targetLimits = {
  minX: baseBounds.minX - PAN_MARGIN,
  maxX: baseBounds.maxX + PAN_MARGIN,
  minZ: baseBounds.minZ - PAN_MARGIN,
  maxZ: baseBounds.maxZ + PAN_MARGIN,
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Keeps the look-at point over the base. `inset` shrinks the box towards the
 * centre of the city, which is how the pan range narrows as the visitor zooms
 * out: reaching a far corner is useful up close, but from across the district it
 * only pushes the diorama into a corner of the screen.
 */
export function clampTarget(target: Vector3, inset = 0) {
  const center = cityCenter()
  target.x = clamp(
    target.x,
    Math.min(targetLimits.minX + inset, center.x),
    Math.max(targetLimits.maxX - inset, center.x),
  )
  target.z = clamp(
    target.z,
    Math.min(targetLimits.minZ + inset, center.z),
    Math.max(targetLimits.maxZ - inset, center.z),
  )
  target.y = 0
  return target
}

/** How much of the extra viewing distance is taken off the pan range. */
const INSET_PER_UNIT = 0.35

/** The pan box for a viewing distance: the whole base up close, the centre from afar. */
export const panInset = (distance: number) => INSET_PER_UNIT * (distance - MIN_DISTANCE)

/**
 * The two ground-plane axes the visitor pans along. Because the viewing angle is
 * fixed these are constants, so a drag is a plain two-term sum.
 */
export const groundRight = new Vector3()
  .crossVectors(new Vector3(0, 1, 0), CAMERA_DIRECTION)
  .setY(0)
  .normalize()

/** Screen-up on the ground: away from the viewer, so W walks into the city. */
export const groundUp = new Vector3(-CAMERA_DIRECTION.x, 0, -CAMERA_DIRECTION.z).normalize()

/**
 * Where the camera should look so a selected building stays clear of the
 * case-study UI: pushed left on desktop, pushed up on mobile.
 */
export function focusTarget(
  center: [number, number],
  layout: 'desktop' | 'mobile',
  distance: number,
): Vector3 {
  const target = new Vector3(center[0], 0, center[1])
  // Keep the building at the same screen anchor regardless of the visitor's zoom.
  const biasScale = distance / 15
  const bias =
    layout === 'desktop'
      ? groundRight.clone().multiplyScalar(3.2 * biasScale)
      : groundUp.clone().multiplyScalar(-2.6 * biasScale)
  return clampTarget(target.add(bias))
}
