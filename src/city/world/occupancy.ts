import decorativeData from '@/data/decorative-buildings.json'
import { landmarks } from '@/data/landmarks'
import { projects } from '@/content/registry'
import { isBuildingAssetId, type BuildingAssetId } from '@/city/assets'
import { validatePlacements, type Footprint, type Placement } from './cityGrid'

export interface DecorativeBuilding {
  model: BuildingAssetId
  grid: [number, number]
  footprint: Footprint
  rotation: number
}

export const decoratives = decorativeData.buildings as DecorativeBuilding[]

const placements: Placement[] = [
  ...projects.map((p) => ({
    id: `project:${p.id}`,
    grid: p.building.grid,
    footprint: p.building.footprint,
  })),
  ...landmarks.map((l) => ({ id: `landmark:${l.id}`, grid: l.grid, footprint: l.footprint })),
  ...decoratives.map((d, i) => ({
    id: `decorative:${i} (${d.model})`,
    grid: d.grid,
    footprint: d.footprint,
  })),
]

const { problems, occupied } = validatePlacements(placements)

for (const d of decoratives) {
  if (!isBuildingAssetId(d.model)) problems.push(`decorative: unknown model "${d.model}"`)
}

/** Lots covered by a building, so props can be scattered on what is left. */
export const occupiedLots = occupied

export const layoutProblems = problems

if (problems.length) {
  if (import.meta.env.DEV) throw new Error(`City layout is invalid:\n${problems.join('\n')}`)
  console.error('[city]', problems.join('\n'))
}
