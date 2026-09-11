import { useMemo } from 'react'
import { roadAssets } from '@/city/assets'
import { InstancedModel, deg, type Instance } from '@/city/models/InstancedModel'
import {
  CITY_DEPTH,
  CITY_WIDTH,
  cellAt,
  isBoundaryExit,
  isRoad,
  lotToWorld,
  gapConnectors,
  ringLots,
  roadRing,
} from './cityGrid'

/** Compass directions as quarter turns, clockwise from north (-Z). */
const NORTH = 0
const EAST = 1
const SOUTH = 2
const WEST = 3

/**
 * Which edges a tile connects when it is not rotated, read off the kerbs of the
 * tiles themselves: `road-bend` is open west and south, `road-intersection` is
 * closed to the north. The Kenney road tiles are flat and painted, so their
 * orientation lives in the texture and cannot be derived from the geometry —
 * these two constants are the whole convention.
 */
const BEND_BASE = [WEST, SOUTH]
const TEE_BASE = SOUTH

/**
 * Where a base edge ends up after a quarter turn. A positive rotation about Y
 * runs anticlockwise on the compass above, so the index counts down.
 */
const turned = (side: number, turn: number) => (side - turn + 4) % 4

/** Turn needed to point a tee's stem at `stem`. */
const teeRotation = (stem: number) => deg(((TEE_BASE - stem + 4) % 4) * 90)

/** Turn needed to make a bend join `a` and `b`. */
function bendRotation(a: number, b: number) {
  const want = new Set([a, b])
  for (let turn = 0; turn < 4; turn++) {
    const [p, q] = BEND_BASE.map((side) => turned(side, turn))
    if (want.has(p) && want.has(q)) return deg(turn * 90)
  }
  return 0
}

type Tiles = Record<
  'straights' | 'crossroads' | 'crossings' | 'plazas' | 'bends' | 'tees',
  Instance[]
>

const empty = (): Tiles => ({
  straights: [],
  crossroads: [],
  crossings: [],
  plazas: [],
  bends: [],
  tees: [],
})

const isCrossroad = (x: number, z: number) =>
  isRoad(x, z) && (isRoad(x, z - 1) || isRoad(x, z + 1)) && (isRoad(x - 1, z) || isRoad(x + 1, z))

/**
 * Road tiles come from the layout map, so no bends or T-junctions are needed
 * inside the grid: it only contains straights and symmetric four-way crossroads.
 * An unrotated Kenney `road-straight` runs along X — its curbs sit at the two
 * X edges — so a north-south tile is the one turned 90 degrees.
 */
function gridTiles(tiles: Tiles) {
  for (let z = 0; z < CITY_DEPTH; z++) {
    for (let x = 0; x < CITY_WIDTH; x++) {
      const cell = cellAt(x, z)
      const [wx, wz] = lotToWorld(x, z)
      if (cell === 'p') {
        tiles.plazas.push({ position: [wx, 0, wz] })
        continue
      }
      if (cell !== '#') continue

      const northSouth = isRoad(x, z - 1) || isRoad(x, z + 1)
      const eastWest = isRoad(x - 1, z) || isRoad(x + 1, z)

      if (northSouth && eastWest) {
        tiles.crossroads.push({ position: [wx, 0, wz] })
        continue
      }

      const rotation = eastWest ? 0 : deg(90)
      // A pedestrian crossing on each junction approach.
      const nextToJunction = eastWest
        ? isCrossroad(x - 1, z) || isCrossroad(x + 1, z)
        : isCrossroad(x, z - 1) || isCrossroad(x, z + 1)
      const tile = { position: [wx, 0, wz] as [number, number, number], rotation }
      if (nextToJunction) tiles.crossings.push(tile)
      else tiles.straights.push(tile)
    }
  }
}

/**
 * The boundary road. Every avenue used to stop at the edge of the grid; the ring
 * gives each one somewhere to go, and closes the district with a deliberate edge
 * rather than a cut (spec §20).
 */
function ringTiles(tiles: Tiles) {
  const { low, highX, highZ } = roadRing

  for (const { x, z } of ringLots(roadRing)) {
    const [wx, wz] = lotToWorld(x, z)
    const position: [number, number, number] = [wx, 0, wz]
    const onWest = x === low
    const onEast = x === highX
    const onNorth = z === low
    const onSouth = z === highZ

    if ((onWest || onEast) && (onNorth || onSouth)) {
      // A corner joins the two ring edges that meet there.
      tiles.bends.push({
        position,
        rotation: bendRotation(onNorth ? SOUTH : NORTH, onWest ? EAST : WEST),
      })
      continue
    }

    if (isBoundaryExit(x, z)) {
      // The stem points back into the city, at the avenue it collects.
      const stem = onWest ? EAST : onEast ? WEST : onNorth ? SOUTH : NORTH
      tiles.tees.push({ position, rotation: teeRotation(stem) })
      continue
    }

    tiles.straights.push({ position, rotation: onWest || onEast ? deg(90) : 0 })
  }
}

/**
 * The lots that carry an eastern avenue across the track to the boundary road.
 */
function connectorTiles(tiles: Tiles) {
  for (const { x, z } of gapConnectors) {
    const [wx, wz] = lotToWorld(x, z)
    tiles.straights.push({ position: [wx, 0, wz] })
  }
}

export function Roads() {
  const tiles = useMemo(() => {
    const built = empty()
    gridTiles(built)
    ringTiles(built)
    connectorTiles(built)
    return built
  }, [])

  return (
    <group>
      <InstancedModel url={roadAssets.straight} instances={tiles.straights} castShadow={false} />
      <InstancedModel url={roadAssets.crossroad} instances={tiles.crossroads} castShadow={false} />
      <InstancedModel url={roadAssets.crossing} instances={tiles.crossings} castShadow={false} />
      <InstancedModel url={roadAssets.plaza} instances={tiles.plazas} castShadow={false} />
      <InstancedModel url={roadAssets.bend} instances={tiles.bends} castShadow={false} />
      <InstancedModel url={roadAssets.tee} instances={tiles.tees} castShadow={false} />
    </group>
  )
}
