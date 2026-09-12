/**
 * Asset manifest. Content and layout data reference these IDs, never file paths,
 * so a model can be swapped without touching project or layout files.
 *
 * Source: Kenney city/road/suburban/industrial/modular/car kits (CC0).
 */

export const buildingAssets = {
  'tower-xl': '/models/commercial/building-skyscraper-e.glb',
  'tower-l': '/models/commercial/building-skyscraper-a.glb',
  'tower-m': '/models/commercial/building-skyscraper-b.glb',
  'tower-s': '/models/commercial/building-skyscraper-c.glb',
  'office-a': '/models/commercial/building-a.glb',
  'office-b': '/models/commercial/building-b.glb',
  'office-c': '/models/commercial/building-c.glb',
  'office-d': '/models/commercial/building-d.glb',
  'office-e': '/models/commercial/building-e.glb',
  'office-f': '/models/commercial/building-f.glb',
  'office-g': '/models/commercial/building-g.glb',
  'office-h': '/models/commercial/building-h.glb',
  'office-i': '/models/commercial/building-i.glb',
  'office-j': '/models/commercial/building-j.glb',
  'office-k': '/models/commercial/building-k.glb',
  'office-l': '/models/commercial/building-l.glb',
  'office-m': '/models/commercial/building-m.glb',
  'office-n': '/models/commercial/building-n.glb',
  'civic-hall': '/models/commercial/building-n.glb',
  lab: '/models/industrial/building-q.glb',
  'plant-large': '/models/industrial/building-l.glb',
  'plant-hall': '/models/industrial/building-c.glb',
  depot: '/models/industrial/building-s.glb',
  works: '/models/industrial/building-p.glb',
  'fire-station': '/models/civic/fire-station.glb',
  warehouse: '/models/industrial/building-h.glb',
  'water-tower': '/models/industrial/water-tower.glb',
  'house-a': '/models/suburban/building-type-a.glb',
  'house-b': '/models/suburban/building-type-b.glb',
  'house-c': '/models/suburban/building-type-c.glb',
  'house-d': '/models/suburban/building-type-e.glb',
  'house-e': '/models/suburban/building-type-k.glb',
  'house-f': '/models/suburban/building-type-p.glb',
  'shell-block': '/models/modular/building-block.glb',
  'shell-corner': '/models/modular/building-corner-bottom.glb',
  'shell-steps': '/models/modular/building-steps-wide.glb',
} as const

export const roadAssets = {
  straight: '/models/roads/road-straight.glb',
  crossroad: '/models/roads/road-crossroad.glb',
  crossing: '/models/roads/road-crossing.glb',
  plaza: '/models/roads/road-square.glb',
  /** Boundary road: the corners and the junctions where an avenue leaves the grid. */
  bend: '/models/roads/road-bend.glb',
  tee: '/models/roads/road-intersection.glb',
} as const

/** The rail line along the western belt, and the modern commuter train that runs it. */
export const railAssets = {
  track: '/models/rail/track.glb',
  curve: '/models/rail/railroad-corner-small.glb',
  'track-detailed': '/models/rail/track-detailed.glb',
  front: '/models/rail/train-electric-bullet-a.glb',
  middle: '/models/rail/train-electric-bullet-c.glb',
  rear: '/models/rail/train-electric-bullet-b.glb',
  'container-blue': '/models/rail/train-carriage-container-blue.glb',
  'container-green': '/models/rail/train-carriage-container-green.glb',
  'container-red': '/models/rail/train-carriage-container-red.glb',
  'tank-large': '/models/rail/train-carriage-tank-large.glb',
} as const

/**
 * Kenney's nature kit, converted to vertex colours by `tools/fbx-to-glb.mjs`
 * because it ships one material per colour instead of the city atlas.
 */
export const natureAssets = {
  'pine-tall': '/models/nature/pine-tall.glb',
  'pine-round': '/models/nature/pine-round.glb',
  'tree-oak': '/models/nature/tree-oak.glb',
  'tree-tall': '/models/nature/tree-tall.glb',
  'tree-thin': '/models/nature/tree-thin.glb',
  'tree-fall': '/models/nature/tree-fall.glb',
  'bush-large': '/models/nature/bush-large.glb',
  bush: '/models/nature/bush.glb',
  grass: '/models/nature/grass.glb',
  'flowers-red': '/models/nature/flowers-red.glb',
  'flowers-yellow': '/models/nature/flowers-yellow.glb',
  'rock-large': '/models/nature/rock-large.glb',
  'rock-small': '/models/nature/rock-small.glb',
  'stone-tall': '/models/nature/stone-tall.glb',
  log: '/models/nature/log.glb',
  stump: '/models/nature/stump.glb',
} as const

export const propAssets = {
  'tree-large': '/models/suburban/tree-large.glb',
  'tree-small': '/models/suburban/tree-small.glb',
  planter: '/models/suburban/planter.glb',
  fence: '/models/suburban/fence-1x4.glb',
  streetlight: '/models/roads/light-square.glb',
  'traffic-light': '/models/roads/traffic-light.glb',
  barrier: '/models/roads/construction-barrier.glb',
  cone: '/models/roads/construction-cone.glb',
  'work-fence': '/models/roads/construction-fence.glb',
  'work-light': '/models/roads/construction-light.glb',
  dumpster: '/models/roads/dumpster.glb',
  billboard: '/models/roads/sign-highway.glb',
  chimney: '/models/industrial/chimney-large.glb',
  'solar-panels': '/models/industrial/solar-panel-landscape-group.glb',
  'container-a': '/models/industrial/shipping-container-a.glb',
  'container-b': '/models/industrial/shipping-container-b.glb',
  'container-c': '/models/industrial/shipping-container-c.glb',
  tank: '/models/industrial/detail-tank.glb',
  'chimney-medium': '/models/industrial/chimney-medium.glb',
} as const

/**
 * Construction pack (non-Kenney FBX, converted by `tools/fbx-to-glb.mjs`).
 * Vertex-coloured and flat-shaded rather than atlas-textured, so they are kept
 * apart from the Kenney props above.
 */
export const siteAssets = {
  crane: '/models/construction/crane.glb',
  container: '/models/construction/container.glb',
  skip: '/models/construction/skip.glb',
  mixer: '/models/construction/mixer.glb',
  scaffolding: '/models/construction/scaffolding.glb',
  fence: '/models/construction/fence.glb',
  gate: '/models/construction/gate.glb',
  pillar: '/models/construction/pillar.glb',
  steel: '/models/construction/steel.glb',
  pipes: '/models/construction/pipes.glb',
  planks: '/models/construction/planks.glb',
  bricks: '/models/construction/bricks.glb',
  cement: '/models/construction/cement.glb',
  barrier: '/models/construction/barrier.glb',
  cone: '/models/construction/cone.glb',
  light: '/models/construction/light.glb',
  toilet: '/models/construction/toilet.glb',
  wheelbarrow: '/models/construction/wheelbarrow.glb',
} as const

export const carAssets = {
  sedan: '/models/cars/sedan.glb',
  suv: '/models/cars/suv.glb',
  taxi: '/models/cars/taxi.glb',
  van: '/models/cars/van.glb',
  truck: '/models/cars/truck.glb',
  firetruck: '/models/cars/firetruck.glb',
  police: '/models/cars/police.glb',
  delivery: '/models/cars/delivery.glb',
} as const

export type BuildingAssetId = keyof typeof buildingAssets
export type NatureAssetId = keyof typeof natureAssets
export type PropAssetId = keyof typeof propAssets
export type SiteAssetId = keyof typeof siteAssets
export type CarAssetId = keyof typeof carAssets

/** The car kit is modelled at a larger scale than the city kits. */
export const CAR_SCALE = 0.28

/** So is the train kit, though its track already matches one lot. */
export const TRAIN_SCALE = 0.72

export const natureAssetIds = Object.keys(natureAssets) as NatureAssetId[]
export const propAssetIds = Object.keys(propAssets) as PropAssetId[]

export const isNatureAssetId = (id: string): id is NatureAssetId => id in natureAssets
export const isPropAssetId = (id: string): id is PropAssetId => id in propAssets

export const buildingAssetIds = Object.keys(buildingAssets) as BuildingAssetId[]

export const isBuildingAssetId = (id: string): id is BuildingAssetId => id in buildingAssets
