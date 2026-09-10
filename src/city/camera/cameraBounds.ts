import { Vector3 } from 'three'
import { cityBounds } from '@/city/world/cityGrid'

/**
 * The camera keeps one fixed orientation for the whole visit (spec §14).
 * Panning and zooming move along this vector; the angle never changes.
 */
export const CAMERA_DIRECTION = new Vector3(0.62, 0.72, 0.62).normalize()

export const MIN_DISTANCE = 7
export const MAX_DISTANCE = 42
export const INITIAL_DISTANCE = 28
/** How close the camera settles when a project is selected. */
export const FOCUS_DISTANCE = 15

/** How far the target may travel from the district before the pan stops. */
const PAN_MARGIN = 2

export const targetLimits = {
  minX: cityBounds.minX - PAN_MARGIN,
  maxX: cityBounds.maxX + PAN_MARGIN,
  minZ: cityBounds.minZ - PAN_MARGIN,
  maxZ: cityBounds.maxZ + PAN_MARGIN,
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function clampTarget(target: Vector3) {
  target.x = clamp(target.x, targetLimits.minX, targetLimits.maxX)
  target.z = clamp(target.z, targetLimits.minZ, targetLimits.maxZ)
  target.y = 0
  return target
}

/** Screen-right on the ground plane, for the desktop panel bias. */
const screenRight = new Vector3()
  .crossVectors(new Vector3(0, 1, 0), CAMERA_DIRECTION)
  .setY(0)
  .normalize()

/** Toward the camera on the ground plane, for the mobile sheet bias. */
const towardCamera = new Vector3(CAMERA_DIRECTION.x, 0, CAMERA_DIRECTION.z).normalize()

/**
 * Where the camera should look so a selected building stays clear of the
 * case-study UI: pushed left on desktop, pushed up on mobile.
 */
export function focusTarget(center: [number, number], layout: 'desktop' | 'mobile'): Vector3 {
  const target = new Vector3(center[0], 0, center[1])
  const bias =
    layout === 'desktop'
      ? screenRight.clone().multiplyScalar(3.2)
      : towardCamera.clone().multiplyScalar(2.6)
  return clampTarget(target.add(bias))
}

export const cityCenter = () => new Vector3(cityBounds.centerX, 0, cityBounds.centerZ)
