import { RAIL_X, RAIL_Z, baseBounds, railCrossings } from './cityGrid'

/**
 * The route of the line, as one continuous curve measured in lots travelled.
 * Track tiles, the train and the level crossings all read their position from
 * here, so there is one description of where the rail goes and no chance of the
 * three drifting apart.
 *
 * The line enters at the western lip and runs east along the green belt, well
 * clear of the boundary road; it turns at the south-east corner, crosses the
 * ring, and runs north between the grid and the ring to leave by the northern
 * lip. Only the eastern leg is inside the district, which is where every level
 * crossing is.
 */

/**
 * Radius of Kenney's small 90-degree track corner.
 */
const RADIUS = 2
const CENTER = { x: RAIL_X - RADIUS, z: RAIL_Z - RADIUS }

/** Minimum X/Z bounds of the curve model before `useModel` centres it. */
export const RAIL_CURVE_MIN = [CENTER.x, CENTER.z] as const

/** The southern leg, the corner, then the eastern leg. */
export const SOUTH_LEG = CENTER.x - baseBounds.minX
export const CORNER_ARC = (RADIUS * Math.PI) / 2
export const EAST_LEG = CENTER.z - baseBounds.minZ
const CORNER_END = SOUTH_LEG + CORNER_ARC
export const RAIL_LENGTH = CORNER_END + EAST_LEG

export interface RailPoint {
  x: number
  z: number
  /** Heading as a Y rotation, measured the way the kit models face: along +Z. */
  angle: number
}

/**
 * A point on the line. Distances outside the route run straight on past the lip
 * of the base, which is where a service waits between runs.
 */
export function railPoint(s: number): RailPoint {
  if (s <= SOUTH_LEG) return { x: baseBounds.minX + s, z: RAIL_Z, angle: Math.PI / 2 }
  if (s >= CORNER_END) return { x: RAIL_X, z: CENTER.z - (s - CORNER_END), angle: Math.PI }

  const theta = (s - SOUTH_LEG) / RADIUS
  return {
    x: CENTER.x + RADIUS * Math.sin(theta),
    z: CENTER.z + RADIUS * Math.cos(theta),
    angle: Math.PI / 2 + theta,
  }
}

/** One track tile: a lot-long piece of the line, laid flat along it. */
export interface RailTile {
  position: [number, number, number]
  rotation: number
}

/**
 * Straight tiles on either side of the kit's dedicated corner model.
 */
export function railTiles(): RailTile[] {
  const tiles: RailTile[] = []
  const lay = (s: number) => {
    const { x, z, angle } = railPoint(s)
    tiles.push({ position: [x, 0, z], rotation: angle })
  }

  for (let s = 0; s < SOUTH_LEG; s += 1) lay(s)
  for (let s = 0.5; s <= EAST_LEG; s += 1) lay(CORNER_END + s)

  return tiles
}

/** Every lot the track lies in, so the planting leaves the line alone. */
const railLots = new Set(
  railTiles().map(({ position }) => `${Math.round(position[0])},${Math.round(position[2])}`),
)
for (let s = SOUTH_LEG; s <= CORNER_END; s += 0.25) {
  const point = railPoint(s)
  railLots.add(`${Math.round(point.x)},${Math.round(point.z)}`)
}

export const isRailLot = (x: number, z: number) => railLots.has(`${x},${z}`)

/**
 * Where each level crossing sits along the line, found by walking the route and
 * keeping the closest approach to the lot centre. The corner means there is no
 * closed form for it, and this runs once.
 */
export const crossings = railCrossings.map(({ x, z }) => {
  let s = 0
  let nearest = Infinity
  for (let at = 0; at <= RAIL_LENGTH; at += 0.01) {
    const point = railPoint(at)
    const away = (point.x - x) ** 2 + (point.z - z) ** 2
    if (away < nearest) {
      nearest = away
      s = at
    }
  }
  return { x, z, s }
})

/**
 * Which crossings are closed right now. `Rail` writes it once a frame and the
 * traffic reads it: one small set is cheaper than giving every car a view of the
 * train, and it keeps the two simulations from having to know about each other.
 */
export const closedCrossings = new Set<string>()

/**
 * How far ahead of the train a crossing shuts, in lots, and how far behind it
 * reopens. At line speed the barriers come down a good second before the train
 * arrives, which is what makes the queue read as waiting rather than as cars
 * braking for no reason.
 */
const APPROACH = 3.5
const CLEARED = 0.8

export const isCrossingClosed = (x: number, z: number) => closedCrossings.has(`${x},${z}`)

/** Closes every crossing a train stretching from `tail` to `nose` has claimed. */
export function closeCrossings(nose: number, tail: number) {
  const way = Math.sign(nose - tail) || 1
  const ahead = nose + way * APPROACH
  const behind = tail - way * CLEARED
  const low = Math.min(ahead, behind)
  const high = Math.max(ahead, behind)
  closedCrossings.clear()
  for (const crossing of crossings)
    if (crossing.s >= low && crossing.s <= high) closedCrossings.add(`${crossing.x},${crossing.z}`)
}
