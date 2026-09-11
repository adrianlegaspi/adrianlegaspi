import layout from '@/data/city-layout.json'

/** World size of one city lot. Matches the Kenney road tiles, which are 1x1. */
export const LOT_SIZE = 1

export type Cell = '#' | 'p' | 'g' | '.'

export const cityRows = layout.rows
export const CITY_WIDTH = cityRows[0].length
export const CITY_DEPTH = cityRows.length

export const cellAt = (x: number, z: number): Cell | null =>
  z < 0 || z >= CITY_DEPTH || x < 0 || x >= CITY_WIDTH ? null : (cityRows[z][x] as Cell)

export const isRoad = (x: number, z: number) => cellAt(x, z) === '#'

/** Lot centre in world space. */
export const lotToWorld = (x: number, z: number): [number, number] => [x * LOT_SIZE, z * LOT_SIZE]

export type Footprint = [number, number]

/** Centre of a footprint anchored at its north-west lot. */
export const footprintCenter = ([x, z]: [number, number], [w, d]: Footprint): [number, number] => [
  (x + (w - 1) / 2) * LOT_SIZE,
  (z + (d - 1) / 2) * LOT_SIZE,
]

export const footprintLots = ([x, z]: [number, number], [w, d]: Footprint) => {
  const lots: [number, number][] = []
  for (let dz = 0; dz < d; dz++) for (let dx = 0; dx < w; dx++) lots.push([x + dx, z + dz])
  return lots
}

/** City bounds in world space, used for camera clamping and the ground slab. */
export const cityBounds = {
  minX: -LOT_SIZE / 2,
  maxX: (CITY_WIDTH - 0.5) * LOT_SIZE,
  minZ: -LOT_SIZE / 2,
  maxZ: (CITY_DEPTH - 0.5) * LOT_SIZE,
  centerX: ((CITY_WIDTH - 1) / 2) * LOT_SIZE,
  centerZ: ((CITY_DEPTH - 1) / 2) * LOT_SIZE,
}

/**
 * The district is ringed rather than cut off: a boundary road closes every
 * avenue that would otherwise end in mid-air, and a green belt finishes the
 * base (spec §20 — the edge of the environment is deliberate).
 *
 * The road hugs the grid on the west, north and south. Its east side leaves one
 * lot for the rail line: every avenue leaving the grid there crosses the track
 * to reach the ring, which is where the level crossings are.
 */
export interface Ring {
  low: number
  highX: number
  highZ: number
}

export const roadRing: Ring = { low: -1, highX: CITY_WIDTH + 1, highZ: CITY_DEPTH }

/**
 * Track axes stay fixed while the southern road moves in beside the last block.
 * The line runs north through the eastern gap, then turns west outside the
 * southern road.
 */
export const RAIL_X = CITY_WIDTH
export const RAIL_Z = CITY_DEPTH + 2

/** A ring pushed `by` lots further out than another. */
const outward = ({ low, highX, highZ }: Ring, by: number): Ring => ({
  low: low - by,
  highX: highX + by,
  highZ: highZ + by,
})

export type RingLot = { x: number; z: number }

/** The rectangle of lots that makes up one ring, walked in reading order. */
export function ringLots({ low, highX, highZ }: Ring): RingLot[] {
  const lots: RingLot[] = []
  for (let z = low; z <= highZ; z++)
    for (let x = low; x <= highX; x++)
      if (x === low || x === highX || z === low || z === highZ) lots.push({ x, z })
  return lots
}

/**
 * Grass between the boundary road and the lip of the base. Two lots wide: the
 * rail line takes the inner one where it runs outside the city, which leaves a
 * full lot of planting between the track and the edge.
 */
const BELT = 2

/** The belt, ring by ring, so the planting can be walked lot by lot. */
export const beltRings: Ring[] = Array.from({ length: BELT }, (_, i) => outward(roadRing, i + 1))

/** Extra planting behind the fixed southern track. */
export const southBeltLots: RingLot[] = Array.from(
  { length: roadRing.highX - roadRing.low + 2 * BELT + 1 },
  (_, i) => ({ x: roadRing.low - BELT + i, z: RAIL_Z + 1 }),
)

/** The whole base, including the boundary road, the rail line and the green belt. */
const baseMinX = roadRing.low - 0.5 - BELT
const baseMaxX = roadRing.highX + 0.5 + BELT
const baseMinZ = roadRing.low - 0.5 - BELT
const baseMaxZ = RAIL_Z + 1.5
export const baseBounds = {
  minX: baseMinX,
  maxX: baseMaxX,
  minZ: baseMinZ,
  maxZ: baseMaxZ,
  centerX: (baseMinX + baseMaxX) / 2,
  centerZ: (baseMinZ + baseMaxZ) / 2,
}

/** A city road that runs off the grid edge, and so meets the boundary road. */
export const isBoundaryExit = (x: number, z: number) => {
  const { low, highX, highZ } = roadRing
  if (x === low || x === highX) return isRoad(x === low ? 0 : CITY_WIDTH - 1, z)
  if (z === low || z === highZ) return isRoad(x, z === low ? 0 : CITY_DEPTH - 1)
  return false
}

/** Grid rows whose avenue leaves by the east edge. */
const exitRows = () => {
  const rows: number[] = []
  for (let z = 0; z < CITY_DEPTH; z++) if (isRoad(CITY_WIDTH - 1, z)) rows.push(z)
  return rows
}

/**
 * Lots carrying eastern avenues across the track to the boundary road.
 */
export const gapConnectors: RingLot[] = exitRows().map((z) => ({ x: RAIL_X, z }))

/**
 * Every lot where road meets track, all of them on the eastern leg: the two
 * stretches of boundary road the leg runs between, and the avenues in between.
 */
export const railCrossings: RingLot[] = [
  { x: RAIL_X, z: roadRing.low },
  ...exitRows().map((z) => ({ x: RAIL_X, z })),
  { x: RAIL_X, z: roadRing.highZ },
]

export interface Placement {
  id: string
  grid: [number, number]
  footprint: Footprint
}

/** Deterministic occupancy check. Reports overlaps and lots outside the grid or on a road. */
export function validatePlacements(placements: Placement[]) {
  const owner = new Map<string, string>()
  const problems: string[] = []

  for (const p of placements) {
    for (const [x, z] of footprintLots(p.grid, p.footprint)) {
      const key = `${x},${z}`
      const cell = cellAt(x, z)
      if (cell === null) problems.push(`${p.id}: lot ${key} is outside the city grid`)
      else if (cell === '#') problems.push(`${p.id}: lot ${key} is a road`)
      const taken = owner.get(key)
      if (taken) problems.push(`${p.id}: lot ${key} already occupied by ${taken}`)
      else owner.set(key, p.id)
    }
  }
  return { problems, occupied: owner }
}
