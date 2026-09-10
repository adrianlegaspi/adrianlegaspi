import { MathUtils, type Vector3 } from 'three'

/** Applies one shared eased progress value to camera position and zoom. */
export function tweenCamera(
  target: Vector3,
  fromTarget: Vector3,
  toTarget: Vector3,
  fromDistance: number,
  toDistance: number,
  progress: number,
) {
  const eased = MathUtils.smootherstep(MathUtils.clamp(progress, 0, 1), 0, 1)
  target.lerpVectors(fromTarget, toTarget, eased)
  return MathUtils.lerp(fromDistance, toDistance, eased)
}
