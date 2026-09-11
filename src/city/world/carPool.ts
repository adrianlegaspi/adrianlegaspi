import { CAR_SCALE, carAssets } from '@/city/assets'
import {
  CITY_DEPTH,
  CITY_WIDTH,
  cellAt,
  isRoad,
  lotToWorld,
  gapConnectors,
  ringLots,
  roadRing,
} from './cityGrid'
import { isCrossingClosed } from './railPath'
import { hash } from './random'

/** Compass directions, clockwise from north. */
export const DIRECTIONS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
] as const

const key = (x: number, z: number) => `${x},${z}`

/**
 * Every lot a car may drive on: the avenues of the layout map plus the boundary
 * road. Plazas and parks are deliberately left out — roads have no simulation
 * purpose beyond this (spec §20).
 */
export function roadNetwork() {
  const lots = new Map<string, [number, number]>()
  const addLot = (x: number, z: number) => lots.set(key(x, z), [x, z])

  for (let z = 0; z < CITY_DEPTH; z++)
    for (let x = 0; x < CITY_WIDTH; x++) if (isRoad(x, z)) addLot(x, z)
  for (const { x, z } of ringLots(roadRing)) addLot(x, z)
  for (const { x, z } of gapConnectors) addLot(x, z)

  /** Exits of a lot, as direction indices. */
  const exits = new Map<string, number[]>()
  for (const [id, [x, z]] of lots) {
    const open: number[] = []
    DIRECTIONS.forEach(([dx, dz], direction) => {
      if (lots.has(key(x + dx, z + dz))) open.push(direction)
    })
    exits.set(id, open)
  }

  return { lots: [...lots.values()], exits }
}

/** Whether the lot on a car's right is somewhere it could pull in and wait. */
export const hasCurb = (x: number, z: number, direction: number) => {
  const [dx, dz] = DIRECTIONS[direction]
  const cell = cellAt(x - dz, z + dx)
  return cell === '.' || cell === 'p'
}

/**
 * The fleet, handed out in order. The patrol sits early enough that a police car
 * is on the streets at every pool size, and rare enough that the traffic still
 * reads as ordinary.
 */
export const carModels = [
  carAssets.sedan,
  carAssets.suv,
  carAssets.police,
  carAssets.taxi,
  carAssets.van,
  carAssets.delivery,
]

/**
 * Top of a road tile. Cars ride on the tarmac rather than on the ground under
 * it: placed at zero they stand 0.02 low, which is invisible from across the
 * district and reads as driving through the road once the visitor zooms in.
 */
export const ROAD_TOP = 0.02

/** Half a lot out from the centre, the near side of the lane. */
const LANE = 0.17
/** How far past the lane a parked car sits, so it reads as pulled over. */
const CURB = 0.2

export type Phase = 'drive' | 'pull-in' | 'wait' | 'pull-out'

export interface Car {
  model: number
  /** Lot being crossed. */
  x: number
  z: number
  /** Direction the car came from, and the one it leaves by. */
  from: number
  to: number
  phase: Phase
  /** Progress through the current phase, 0..1 for everything but `wait`. */
  t: number
  /** Lots per second. */
  speed: number
  /** Seconds left to wait, when parked. */
  dwell: number
  scale: number
  /** Junctions crossed, so a car's route varies instead of cycling forever. */
  trip: number
}

/**
 * A fixed pool, sized once and never grown: cars are the only thing in the city
 * that moves every frame, so the count is the performance budget (spec §31).
 */
export function makePool(size: number, network: ReturnType<typeof roadNetwork>): Car[] {
  const cars: Car[] = []
  const { lots, exits } = network
  for (let i = 0; i < size; i++) {
    // Spread the pool over the network instead of clustering at one junction.
    const [x, z] = lots[Math.floor((i * 7919) % lots.length)]
    const open = exits.get(key(x, z)) ?? []
    if (open.length < 2) continue
    const r = hash(x, z, i)
    const from = open[Math.floor(r * open.length) % open.length]
    const ahead = open.filter((direction) => direction !== from)
    cars.push({
      model: i % carModels.length,
      x,
      z,
      from,
      to: ahead[Math.floor(r * 13) % ahead.length],
      phase: 'drive',
      t: r,
      speed: 1.1 + r * 0.7,
      dwell: 0,
      scale: CAR_SCALE,
      trip: i,
    })
  }
  return cars
}

const PULL_SECONDS = 0.55

/**
 * Control point of the arc a car takes across one lot. A turn bends around the
 * corner where the two lane centre-lines meet, so the car enters and leaves
 * exactly along its lane; a straight run gets the midpoint, which collapses the
 * curve onto the lane itself — with the lot centre instead, cars weaved down
 * every avenue and stood askew when parked. A U-turn, only reachable from a dead
 * end, swings through the middle of the lot.
 */
function control(
  cx: number,
  cz: number,
  car: Car,
  p0x: number,
  p0z: number,
  p2x: number,
  p2z: number,
): [number, number] {
  if (car.to === car.from) return [cx, cz]
  if ((car.to + 2) % 4 === car.from) return [(p0x + p2x) / 2, (p0z + p2z) / 2]
  return DIRECTIONS[car.from][0] !== 0 ? [p2x, p0z] : [p0x, p2z]
}

/** Where a car is, and which way it points, given its phase progress. */
export function carPose(car: Car): { x: number; z: number; angle: number } {
  const [cx, cz] = lotToWorld(car.x, car.z)
  const [ix, iz] = DIRECTIONS[car.from]
  const [ox, oz] = DIRECTIONS[car.to]

  // Entry and exit sit on the lot edge, one lane right of centre, which makes
  // consecutive lots line up exactly and turns curve on their own.
  const p0x = cx + ix * 0.5 + iz * LANE
  const p0z = cz + iz * 0.5 - ix * LANE
  const p2x = cx + ox * 0.5 - oz * LANE
  const p2z = cz + oz * 0.5 + ox * LANE
  const [c1x, c1z] = control(cx, cz, car, p0x, p0z, p2x, p2z)

  const t = car.phase === 'drive' ? car.t : 1
  const inv = 1 - t
  const x = inv * inv * p0x + 2 * inv * t * c1x + t * t * p2x
  const z = inv * inv * p0z + 2 * inv * t * c1z + t * t * p2z
  const dx = 2 * (inv * (c1x - p0x) + t * (p2x - c1x))
  const dz = 2 * (inv * (c1z - p0z) + t * (p2z - c1z))
  const angle = Math.atan2(dx, dz)

  if (car.phase === 'drive') return { x, z, angle }

  // Pulling over is a slide onto the curb, to the right of the exit heading.
  const slide = car.phase === 'pull-in' ? car.t : car.phase === 'pull-out' ? 1 - car.t : 1
  return { x: x - oz * CURB * slide, z: z + ox * CURB * slide, angle }
}

/** Advances one car. Kept out of the component so the frame loop stays readable. */
export function driveCar(car: Car, delta: number, network: ReturnType<typeof roadNetwork>) {
  if (car.phase === 'wait') {
    car.dwell -= delta
    if (car.dwell <= 0) car.phase = 'pull-out'
    return
  }

  if (car.phase !== 'drive') {
    car.t += delta / PULL_SECONDS
    if (car.t < 1) return
    car.t = 0
    if (car.phase === 'pull-in') {
      car.phase = 'wait'
      car.dwell = 2 + hash(car.x, car.z, car.model) * 3
    } else {
      car.phase = 'drive'
      advance(car, network)
    }
    return
  }

  car.t += delta * car.speed
  if (car.t < 1) return

  // Held at a level crossing. The car stops on the edge of the lot with the
  // track in it and stays there, nose at the barrier, until the train is past.
  const [dx, dz] = DIRECTIONS[car.to]
  if (isCrossingClosed(car.x + dx, car.z + dz)) {
    car.t = 1
    return
  }

  car.t = 0

  // A short errand at a building, so the street is not a conveyor belt. Rare on
  // purpose: with a pool this small, a common stop leaves the city looking parked.
  if (hasCurb(car.x, car.z, car.to) && hash(car.x * car.speed, car.z, car.model) > 0.97) {
    car.phase = 'pull-in'
    return
  }
  advance(car, network)
}

/** Steps onto the next lot and picks an exit that is not a U-turn. */
function advance(car: Car, network: ReturnType<typeof roadNetwork>) {
  const [dx, dz] = DIRECTIONS[car.to]
  car.x += dx
  car.z += dz
  car.from = (car.to + 2) % 4
  car.trip += 1
  const open = network.exits.get(key(car.x, car.z)) ?? [car.from]
  const ahead = open.filter((direction) => direction !== car.from)
  const choices = ahead.length ? ahead : open
  const r = hash(car.x * 3.1, car.z * 5.7, car.model + car.trip)
  car.to = choices[Math.floor(r * choices.length) % choices.length]
}
