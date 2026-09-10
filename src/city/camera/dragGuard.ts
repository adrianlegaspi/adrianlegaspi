/**
 * Tells a pan from a click. Dragging the city necessarily ends with a pointer
 * release over whatever happens to be under the cursor, and without this a
 * pan that finished on a building opened that building's case study. Kept as
 * one module-level pointer because there is one primary pointer per gesture
 * and both the buildings and the empty-space handler have to agree on it.
 */

/** A pointer that travelled further than this between press and release was a pan. */
const TOLERANCE = 6

let pressed: { x: number; y: number } | null = null

interface PointerPosition {
  clientX: number
  clientY: number
}

export function pressPointer(event: PointerPosition) {
  pressed = { x: event.clientX, y: event.clientY }
}

/** True when the gesture ending here stayed put, so it counts as a click. */
export function wasClick(event: PointerPosition) {
  const start = pressed
  pressed = null
  if (!start) return false
  const dx = event.clientX - start.x
  const dy = event.clientY - start.y
  return dx * dx + dy * dy <= TOLERANCE * TOLERANCE
}
