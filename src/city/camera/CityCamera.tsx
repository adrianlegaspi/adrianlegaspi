import { useEffect, useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, type PerspectiveCamera, type Vector3 } from 'three'
import {
  CAMERA_DIRECTION,
  FOCUS_DISTANCE,
  INITIAL_DISTANCE,
  MAX_DISTANCE,
  MIN_DISTANCE,
  clampTarget,
  cityCenter,
  focusTarget,
  groundRight,
  groundUp,
  panInset,
} from './cameraBounds'
import { tweenCamera } from './cameraTween'

/** Panning keys, by physical position, mapped to how they move the view. */
const PAN_KEYS: Record<string, [number, number]> = {
  KeyW: [0, 1],
  ArrowUp: [0, 1],
  KeyS: [0, -1],
  ArrowDown: [0, -1],
  KeyA: [-1, 0],
  ArrowLeft: [-1, 0],
  KeyD: [1, 0],
  ArrowRight: [1, 0],
}

/** Fraction of the viewing distance a held key travels per second. */
const KEY_SPEED = 0.3
/** Wheel deltas are coarse, so the exponent stays small. */
const WHEEL_ZOOM = 0.0012
/** How fast the view catches up with direct visitor input. */
const SETTLE = 14
/** A focus move has zero velocity at both ends, so it never snaps into motion. */
const FOCUS_DURATION = 1.2

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const typing = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  Boolean(target.closest('input, textarea, select, [contenteditable]'))

/**
 * Pan and zoom only: the viewing angle never changes and no orbit is exposed
 * (spec §14). Written by hand rather than taken from a controls library because
 * drag, WASD, wheel and pinch all have to drive one clamped target, and because
 * selecting a project glides that same target onto the building.
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
  const camera = useThree((state) => state.camera)
  const canvas = useThree((state) => state.gl.domElement)
  const height = useThree((state) => state.size.height)

  // `want` is where the visitor has asked to be, `view` is where the camera has
  // got to. Input only ever writes the first and the frame loop only ever writes
  // the second, which is what makes damping and the focus glide the same code.
  const want = useRef({ target: cityCenter(), distance: INITIAL_DISTANCE })
  const view = useRef({ target: cityCenter(), distance: INITIAL_DISTANCE })
  const glide = useRef<{
    fromTarget: Vector3
    fromDistance: number
    elapsed: number
  } | null>(null)
  const focused = useRef(false)
  const keys = useRef(new Set<string>())
  const pointers = useRef(new Map<number, { x: number; y: number }>())

  useEffect(() => {
    const perspective = camera as PerspectiveCamera

    /** World units under one pixel, at the distance the camera is actually at. */
    const perPixel = () =>
      (2 * view.current.distance * Math.tan(MathUtils.degToRad(perspective.fov / 2))) / height

    // Clamping is left to the frame loop, which knows the current pan box.
    const pan = (dx: number, dy: number) => {
      glide.current = null
      focused.current = false
      want.current.target.addScaledVector(groundRight, -dx).addScaledVector(groundUp, dy)
    }

    const zoom = (factor: number) => {
      glide.current = null
      focused.current = false
      want.current.distance = clamp(want.current.distance * factor, MIN_DISTANCE, MAX_DISTANCE)
    }

    /** Centroid of the live pointers, so one finger and two pan the same way. */
    const centroid = () => {
      let x = 0
      let y = 0
      for (const point of pointers.current.values()) {
        x += point.x
        y += point.y
      }
      const count = pointers.current.size || 1
      return { x: x / count, y: y / count }
    }

    /** Gap between the first two pointers: the pinch measurement. */
    const spread = () => {
      const [a, b] = [...pointers.current.values()]
      return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0
    }

    const onPointerDown = (event: PointerEvent) => {
      // The right button dismisses the case study, so it must not drag the city.
      if (event.button === 2) return
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!pointers.current.has(event.pointerId)) return
      const from = centroid()
      const fromSpread = spread()
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
      const to = centroid()
      const toSpread = spread()

      const units = perPixel()
      pan((to.x - from.x) * units, (to.y - from.y) * units)
      if (fromSpread > 0 && toSpread > 0) zoom(fromSpread / toSpread)
    }

    const onPointerUp = (event: PointerEvent) => {
      pointers.current.delete(event.pointerId)
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      zoom(Math.exp(event.deltaY * WHEEL_ZOOM))
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (typing(event.target) || event.metaKey || event.ctrlKey || event.altKey) return
      if (!(event.code in PAN_KEYS)) return
      event.preventDefault()
      keys.current.add(event.code)
    }

    const onKeyUp = (event: KeyboardEvent) => {
      keys.current.delete(event.code)
    }

    const onBlur = () => keys.current.clear()

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [camera, canvas, height])

  // Depending on the tuple identity would re-run this on every parent render.
  const focusX = focus?.[0]
  const focusZ = focus?.[1]
  // Start focus before the panel's first paint; a passive effect leaves one
  // unfocused frame visible only when opening the first project.
  useLayoutEffect(() => {
    if (focusX === undefined || focusZ === undefined) return
    const goal = focusTarget([focusX, focusZ], layout, FOCUS_DISTANCE)
    want.current.target.copy(goal)
    want.current.distance = FOCUS_DISTANCE
    focused.current = true
    if (instant) {
      glide.current = null
      view.current.target.copy(goal)
      view.current.distance = want.current.distance
    } else {
      glide.current = {
        fromTarget: view.current.target.clone(),
        fromDistance: view.current.distance,
        elapsed: 0,
      }
    }
  }, [focusX, focusZ, layout, instant])

  useFrame((_, delta) => {
    // A backgrounded tab must not fling the camera across the district.
    const step = Math.min(delta, 0.1)

    let kx = 0
    let ky = 0
    for (const code of keys.current) {
      const [x, y] = PAN_KEYS[code]
      kx += x
      ky += y
    }
    if (kx || ky) {
      const reach = (KEY_SPEED * want.current.distance * step) / Math.hypot(kx, ky)
      glide.current = null
      focused.current = false
      want.current.target
        .addScaledVector(groundRight, kx * reach)
        .addScaledVector(groundUp, ky * reach)
    }

    // Zooming out narrows free panning; focused views may use the full base.
    clampTarget(want.current.target, focused.current ? 0 : panInset(want.current.distance))

    const motion = glide.current
    if (motion) {
      motion.elapsed += step
      const t = Math.min(motion.elapsed / FOCUS_DURATION, 1)
      view.current.distance = tweenCamera(
        view.current.target,
        motion.fromTarget,
        want.current.target,
        motion.fromDistance,
        want.current.distance,
        t,
      )
      if (t === 1) glide.current = null
    } else {
      const rate = 1 - Math.exp(-SETTLE * step)
      view.current.target.lerp(want.current.target, rate)
      view.current.distance += (want.current.distance - view.current.distance) * rate
    }

    camera.position
      .copy(view.current.target)
      .addScaledVector(CAMERA_DIRECTION, view.current.distance)
    camera.lookAt(view.current.target)
  })

  return null
}
