import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Plane, Vector3, type Group, type Mesh, type MeshStandardMaterial } from 'three'
import { TRAIN_SCALE, propAssets, railAssets } from '@/city/assets'
import { InstancedModel, deg } from '@/city/models/InstancedModel'
import { Model } from '@/city/models/Model'
import { useModel } from '@/city/models/useModel'
import { baseBounds } from './cityGrid'
import {
  RAIL_CURVE_MIN,
  RAIL_LENGTH,
  closeCrossings,
  closedCrossings,
  railPoint,
  railTiles,
} from './railPath'
import { FACING, GlowMaterial, HEADLIGHT, TAILLIGHT } from './VehicleLights'
import { hash } from './random'

/**
 * The line runs east along the green belt, turns at the south-east corner and
 * runs north between the grid and the boundary road, crossing the ring twice
 * and three avenues in between. The route itself lives in `railPath`; this
 * draws it and runs the service over it.
 */

/** Train kit cars are modelled nose-to-tail along Z, nose towards +Z. */
const CAR_LENGTH = 2.8 * TRAIN_SCALE
/** Half the wheelbase. Sampling the line at two points lets a car cut the corner. */
const BOGIE = CAR_LENGTH * 0.32

/** The commuter service: a bullet set, front cab first. */
const COMMUTER = [railAssets.front, railAssets.middle, railAssets.rear]

/**
 * The freight service: the same cab hauling flat wagons. The wagons are built
 * here rather than imported — the kit has no rolling stock beyond the bullet
 * set, and a deck is a box — and they carry the industrial props the yards
 * elsewhere in the city are stacked with.
 */
const WAGONS = [
  propAssets['container-a'],
  propAssets['container-b'],
  null,
  propAssets['container-c'],
] as const

const CONSIST_LENGTH = {
  commuter: COMMUTER.length * CAR_LENGTH,
  freight: (WAGONS.length + 1) * CAR_LENGTH,
}
const LONGEST = Math.max(CONSIST_LENGTH.commuter, CONSIST_LENGTH.freight)

/** Lots per second, and the empty line between two services. */
const SPEED = 2.4
const GAP = 9

/** A service starts and ends with the whole consist beyond the lip of the base. */
const MARGIN = 1
const TRAVEL = RAIL_LENGTH + LONGEST + 2 * MARGIN
const RUN = TRAVEL / SPEED
const CYCLE = RUN + GAP

/** The cab light, the tail light, and the pool the cab light throws down the line. */
const LAMP_Y = 0.5
/** Just inside the nose and the tail of the consist. */
const LAMP_Z = CAR_LENGTH / 2 - 0.04
/** Track tiles are 0.15 thick, so the pool is laid above the rails. */
const POOL_Y = 0.17

/** Where a parked train stands when the visitor asked for no motion (spec §29). */
const PARKED = RAIL_LENGTH * 0.38

/** The flat wagon: a deck on a frame, sized to sit under a shipping container. */
const DECK = { width: 0.92, height: 0.3, length: CAR_LENGTH - 0.16 }
/** Containers are modelled a good deal larger than a wagon deck. */
const LOAD_SCALE = 0.6
const TANK = { radius: 0.42, length: 1.7 }

type Variant = keyof typeof CONSIST_LENGTH

/**
 * Which service is running and how far into it. Services alternate direction so
 * the line looks worked from both ends, and the consist changes between them so
 * the district reads as carrying freight as well as commuters.
 */
function service(elapsed: number) {
  const pass = Math.floor(elapsed / CYCLE)
  const into = elapsed % CYCLE
  const t = Math.min(into / RUN, 1)
  const way = pass % 2 === 0 ? 1 : -1
  const variant: Variant = hash(pass, 7, 3) > 0.55 ? 'freight' : 'commuter'
  return {
    variant,
    running: into < RUN,
    // The nose, from one lip of the base to the other.
    nose: (way > 0 ? -MARGIN : RAIL_LENGTH + MARGIN) + way * TRAVEL * t,
    way,
  }
}

/** Lays one car on the line, riding two points a wheelbase apart. */
function placeCar(node: Group, center: number, way: number) {
  const front = railPoint(center + way * BOGIE)
  const back = railPoint(center - way * BOGIE)
  node.position.set((front.x + back.x) / 2, 0, (front.z + back.z) / 2)
  node.rotation.y = Math.atan2(front.x - back.x, front.z - back.z)
}

/** A shipping container, laid along the wagon whichever axis it was modelled on. */
function Load({ url, onMesh }: { url: string; onMesh: (mesh: Mesh | null) => void }) {
  const { size } = useModel(url)
  return (
    <Model
      ref={onMesh}
      url={url}
      position={[0, DECK.height, 0]}
      rotation={[0, size.x > size.z ? deg(90) : 0, 0]}
      scale={LOAD_SCALE}
    />
  )
}

export function Rail({ moving = true, lights = 0 }: { moving?: boolean; lights?: number }) {
  const [variant, setVariant] = useState<Variant>('commuter')
  const cars = useRef<Record<Variant, (Group | null)[]>>({ commuter: [], freight: [] })
  const meshes = useRef<(Mesh | null)[]>([])

  const tiles = useMemo(() => railTiles(), [])
  const { size: curveSize } = useModel(railAssets.curve)

  // The base is a hard cut, so the train is cut on the same two planes: it
  // slides out of the scene instead of popping out of existence at the lip. The
  // line leaves by the western and northern lips, so those are the two.
  const clippingPlanes = useMemo(
    () => [
      new Plane(new Vector3(1, 0, 0), -baseBounds.minX),
      new Plane(new Vector3(0, 0, 1), -baseBounds.minZ),
    ],
    [],
  )

  // `localClippingEnabled` is switched on where the renderer is made, in
  // `CityCanvas`, because a renderer setting is not this component's to change.
  // Materials are shared per model, so the props the wagons carry are clipped
  // wherever else they appear — all of which stand well inside these planes.
  useEffect(() => {
    for (const mesh of meshes.current) {
      const material = mesh?.material as MeshStandardMaterial | undefined
      if (!material) continue
      material.clippingPlanes = clippingPlanes
      material.clipShadows = true
    }
  }, [clippingPlanes])

  useFrame((state) => {
    const now = moving
      ? service(state.clock.elapsedTime)
      : { variant: 'commuter' as Variant, running: false, nose: PARKED, way: 1 }

    if (now.variant !== variant) setVariant(now.variant)

    const consist = cars.current[now.variant]
    consist.forEach((node, i) => {
      if (node) placeCar(node, now.nose - now.way * (i + 0.5) * CAR_LENGTH, now.way)
    })

    if (now.running) closeCrossings(now.nose, now.nose - now.way * CONSIST_LENGTH[now.variant])
    else if (closedCrossings.size) closedCrossings.clear()
  })

  const lamps = (last: boolean) =>
    lights > 0 && (
      <>
        {!last && (
          <>
            <mesh position={[0, LAMP_Y, LAMP_Z]} quaternion={FACING} scale={[0.62, 0.34, 1]}>
              <planeGeometry />
              <GlowMaterial strength={lights} color={HEADLIGHT} clippingPlanes={clippingPlanes} />
            </mesh>
            <mesh
              position={[0, POOL_Y, LAMP_Z + 1]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={[0.7, 2, 1]}
            >
              <planeGeometry />
              <GlowMaterial
                strength={lights * 0.5}
                color={HEADLIGHT}
                clippingPlanes={clippingPlanes}
              />
            </mesh>
          </>
        )}
        {last && (
          <mesh position={[0, LAMP_Y, -LAMP_Z]} quaternion={FACING} scale={[0.5, 0.28, 1]}>
            <planeGeometry />
            <GlowMaterial strength={lights} color={TAILLIGHT} clippingPlanes={clippingPlanes} />
          </mesh>
        )}
      </>
    )

  return (
    <group>
      <InstancedModel url={railAssets.track} instances={tiles} castShadow={false} />
      <Model
        url={railAssets.curve}
        position={[RAIL_CURVE_MIN[0] + curveSize.x / 2, 0, RAIL_CURVE_MIN[1] + curveSize.z / 2]}
        castShadow={false}
      />

      <group visible={variant === 'commuter'}>
        {COMMUTER.map((url, i) => (
          <group
            key={url}
            ref={(node) => {
              cars.current.commuter[i] = node
            }}
          >
            <Model
              ref={(node) => {
                meshes.current[i] = node
              }}
              url={url}
              scale={TRAIN_SCALE}
            />
            {lamps(i === COMMUTER.length - 1)}
          </group>
        ))}
      </group>

      <group visible={variant === 'freight'}>
        <group
          ref={(node) => {
            cars.current.freight[0] = node
          }}
        >
          <Model
            ref={(node) => {
              meshes.current[COMMUTER.length] = node
            }}
            url={railAssets.front}
            scale={TRAIN_SCALE}
          />
          {lamps(false)}
        </group>
        {WAGONS.map((load, i) => (
          <group
            key={i}
            ref={(node) => {
              cars.current.freight[i + 1] = node
            }}
          >
            <mesh position={[0, DECK.height / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[DECK.width, DECK.height, DECK.length]} />
              <meshStandardMaterial
                color="#4a4f57"
                flatShading
                clippingPlanes={clippingPlanes}
                clipShadows
              />
            </mesh>
            {load ? (
              <Load
                url={load}
                onMesh={(node) => {
                  meshes.current[COMMUTER.length + 1 + i] = node
                }}
              />
            ) : (
              <mesh
                position={[0, DECK.height + TANK.radius, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                castShadow
                receiveShadow
              >
                <cylinderGeometry args={[TANK.radius, TANK.radius, TANK.length, 12]} />
                <meshStandardMaterial
                  color="#b9bdc4"
                  flatShading
                  clippingPlanes={clippingPlanes}
                  clipShadows
                />
              </mesh>
            )}
            {lamps(i === WAGONS.length - 1)}
          </group>
        ))}
      </group>
    </group>
  )
}
