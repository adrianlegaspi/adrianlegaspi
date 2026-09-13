import { useTexture } from '@react-three/drei'

interface PylonSignProps {
  position: [number, number, number]
  rotation?: number
  /** Shrinks the whole sign, for lots too tight to fit it at full size. */
  scale?: number
  texture: string
}

const BASE_RADIUS = 0.1
const BASE_HEIGHT = 0.05
const POLE_RADIUS = 0.03
const POLE_HEIGHT = 0.65
const CABINET_WIDTH = 0.5
const CABINET_HEIGHT = 0.45
const CABINET_DEPTH = 0.06

const CABINET_Y = BASE_HEIGHT + POLE_HEIGHT + CABINET_HEIGHT / 2

/** A roadside pylon sign: pole, backlit cabinet, logo facing both directions. */
export function PylonSign({ position, rotation = 0, scale = 1, texture }: PylonSignProps) {
  const map = useTexture(texture)

  return (
    <group position={position} rotation={[0, (rotation * Math.PI) / 180, 0]} scale={scale}>
      <mesh position={[0, BASE_HEIGHT / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[BASE_RADIUS, BASE_RADIUS * 1.15, BASE_HEIGHT, 16]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      <mesh position={[0, BASE_HEIGHT + POLE_HEIGHT / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[POLE_RADIUS, POLE_RADIUS, POLE_HEIGHT, 12]} />
        <meshStandardMaterial color="#555555" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, CABINET_Y, 0]} castShadow receiveShadow>
        <boxGeometry args={[CABINET_WIDTH, CABINET_HEIGHT, CABINET_DEPTH]} />
        <meshStandardMaterial attach="material-0" color="#f2f2f2" />
        <meshStandardMaterial attach="material-1" color="#f2f2f2" />
        <meshStandardMaterial attach="material-2" color="#f2f2f2" />
        <meshStandardMaterial attach="material-3" color="#f2f2f2" />
        <meshStandardMaterial
          attach="material-4"
          map={map}
          emissiveMap={map}
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
        <meshStandardMaterial
          attach="material-5"
          map={map}
          emissiveMap={map}
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}
