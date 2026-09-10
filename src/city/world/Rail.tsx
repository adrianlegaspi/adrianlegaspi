import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Plane, Vector3, type Group, type Mesh, type MeshStandardMaterial } from 'three'
import { TRAIN_SCALE, railAssets } from '@/city/assets'
import { InstancedModel, deg, type Instance } from '@/city/models/InstancedModel'
import { Model } from '@/city/models/Model'
import { RAIL_RING, baseBounds } from './cityGrid'

/**
 * Unlike the road straights, an unrotated Kenney track tile already runs along
 * Z: its rails lie north-south, so the tiles of a north-south line go down
 * unturned and butt into a continuous pair of rails.
 */

/**
 * The line crosses the whole diorama rather than terminating on it: the track
 * runs from one lip of the base to the other, so it reads as a route passing
 * through the district instead of a siding that stops in the grass (spec §20).
 */
const RAIL_X = -RAIL_RING
const FIRST_Z = baseBounds.minZ + 0.5
const LAST_Z = baseBounds.maxZ - 0.5

/** Train kit cars are modelled nose-to-tail along Z, nose towards +Z. */
const CARS = [railAssets.locomotive, railAssets['wagon-front'], railAssets['wagon-back']]
/** A shade longer than the 2.7-unit models, which leaves a coupling gap. */
const CAR_LENGTH = 2.8 * TRAIN_SCALE
const TRAIN_LENGTH = CARS.length * CAR_LENGTH

/** Lots per second, and the empty line between two services. */
const SPEED = 2.4
const GAP = 8

/**
 * A service starts and ends with the whole consist beyond the edge of the base,
 * where the clipping planes below have cut it away entirely.
 */
const ENTRY = baseBounds.minZ - TRAIN_LENGTH / 2
const EXIT = baseBounds.maxZ + TRAIN_LENGTH / 2
const TRAVEL = EXIT - ENTRY
const RUN = TRAVEL / SPEED
const CYCLE = RUN + GAP
/** Where a parked train stands when the visitor asked for no motion (spec §29). */
const PARKED_Z = baseBounds.minZ + (baseBounds.maxZ - baseBounds.minZ) * 0.42

/**
 * Which service is running and how far into it we are. Services alternate
 * direction, so the locomotive always leads and the line looks worked from both
 * ends rather than shuttling back and forth.
 */
function service(elapsed: number) {
  const pass = Math.floor(elapsed / CYCLE)
  const t = Math.min((elapsed % CYCLE) / RUN, 1)
  const southbound = pass % 2 === 0
  return {
    southbound,
    z: southbound ? ENTRY + TRAVEL * t : EXIT - TRAVEL * t,
  }
}

/**
 * The rail line closing the western belt, with a train through it now and then.
 * Four meshes and one matrix each: cheap enough to keep moving at all times
 * (spec §31), and it gives the diorama an edge that leads somewhere.
 */
export function Rail({ moving = true }: { moving?: boolean }) {
  const train = useRef<Group>(null)
  const cars = useRef<(Mesh | null)[]>([])

  const ties = useMemo<Instance[]>(() => {
    const tiles: Instance[] = []
    for (let z = FIRST_Z; z <= LAST_Z; z++) {
      tiles.push({ position: [RAIL_X, 0, z] })
    }
    return tiles
  }, [])

  // The base is a hard cut, so the train is cut on the same two planes: it
  // slides out of the scene instead of popping out of existence at the lip.
  const clippingPlanes = useMemo(
    () => [
      new Plane(new Vector3(0, 0, 1), -baseBounds.minZ),
      new Plane(new Vector3(0, 0, -1), baseBounds.maxZ),
    ],
    [],
  )

  // `localClippingEnabled` is switched on where the renderer is made, in
  // `CityCanvas`, because a renderer setting is not this component's to change.
  useEffect(() => {
    for (const mesh of cars.current) {
      const material = mesh?.material as MeshStandardMaterial | undefined
      if (!material) continue
      material.clippingPlanes = clippingPlanes
      material.clipShadows = true
    }
  }, [clippingPlanes])

  useFrame((state) => {
    const node = train.current
    if (!node) return
    if (!moving) {
      node.position.z = PARKED_Z
      node.rotation.y = 0
      return
    }
    const { z, southbound } = service(state.clock.elapsedTime)
    node.position.z = z
    node.rotation.y = southbound ? 0 : deg(180)
  })

  return (
    <group>
      <InstancedModel url={railAssets.track} instances={ties} castShadow={false} />
      {/* Centred on the group, locomotive first, so the consist reads as one train. */}
      <group ref={train} position={[RAIL_X, 0, 0]}>
        {CARS.map((url, i) => (
          <Model
            key={url}
            ref={(node) => {
              cars.current[i] = node
            }}
            url={url}
            position={[0, 0, ((CARS.length - 1) / 2 - i) * CAR_LENGTH]}
            scale={TRAIN_SCALE}
          />
        ))}
      </group>
    </group>
  )
}
