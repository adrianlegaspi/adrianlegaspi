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
