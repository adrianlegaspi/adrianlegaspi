import type { BuildingAssetId } from '@/city/assets'
import type { Footprint } from '@/city/world/cityGrid'
import type { PageId } from '@/content/pages'

/**
 * Focusable landmarks that are not projects: City Hall (about) and the
 * construction site (contact). Placed by hand like every other building.
 */
export interface Landmark {
  id: string
  page: PageId
  route: string
  grid: [number, number]
  footprint: Footprint
  rotation: 0 | 90 | 180 | 270
  /** A single building model, or `null` for the hand-built construction site. */
  model: BuildingAssetId | null
}

export const landmarks: Landmark[] = [
  {
    id: 'city-hall',
    page: 'about',
    route: '/about',
    grid: [5, 5],
    footprint: [2, 2],
    rotation: 0,
    model: 'civic-hall',
  },
  {
    id: 'next-project',
    page: 'contact',
    route: '/contact',
    grid: [4, 14],
    footprint: [3, 2],
    rotation: 0,
    model: null,
  },
]

export const landmarkById = (id: string | null | undefined) =>
  id ? landmarks.find((l) => l.id === id) : undefined
