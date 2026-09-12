import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { projectById, type Project } from '@/content/registry'
import type { PageId } from '@/content/pages'
import { landmarks, type Landmark } from '@/data/landmarks'
import { footprintCenter } from '@/city/world/cityGrid'
import { legalRoutes, localized, splitLocale } from './routes'

export type Selection =
  | { kind: 'project'; id: string; project: Project; center: [number, number] }
  | { kind: 'landmark'; id: string; landmark: Landmark; center: [number, number] }
  | { kind: 'legal'; id: string; page: PageId; center: null }
  | null

const routePattern =
  /^\/(?:projects\/[a-z0-9-]+)?$|^\/(?:about|contact|privacy|tos|eula|copyright)$/

/** Unknown URLs go back to the city instead of showing an empty state. */
export const isKnownRoute = (pathname: string) => {
  const { path } = splitLocale(pathname)
  if (!routePattern.test(path)) return false
  const project = /^\/projects\/([a-z0-9-]+)$/.exec(path)
  return project ? Boolean(projectById(project[1])) : true
}

/** What a canonical path selects. Shared by the router and the prerender. */
export function selectionFor(path: string): Selection {
  const projectMatch = /^\/projects\/([a-z0-9-]+)$/.exec(path)
  if (projectMatch) {
    const project = projectById(projectMatch[1])
    if (!project) return null
    return {
      kind: 'project',
      id: project.id,
      project,
      center: footprintCenter(project.building.grid, project.building.footprint),
    }
  }
  const landmark = landmarks.find((entry) => entry.route === path)
  if (landmark) {
    return {
      kind: 'landmark',
      id: landmark.id,
      landmark,
      center: footprintCenter(landmark.grid, landmark.footprint),
    }
  }
  const legalPage = legalRoutes[path]
  if (legalPage) return { kind: 'legal', id: legalPage, page: legalPage, center: null }
  return null
}

/**
 * Selection lives in the URL (spec §36): opening a project link and clicking
 * its building produce the same state, and the back button works. The locale
 * prefix rides along so navigating never drops the visitor into English.
 */
export function useSelection() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { locale, path } = splitLocale(pathname)

  const selection = useMemo<Selection>(() => selectionFor(path), [path])

  const go = useCallback(
    (target: string) => navigate(localized(locale, target)),
    [navigate, locale],
  )
  const selectProject = useCallback((id: string) => go(`/projects/${id}`), [go])
  const selectLandmark = useCallback(
    (id: string) => {
      const landmark = landmarks.find((entry) => entry.id === id)
      if (landmark) go(landmark.route)
    },
    [go],
  )
  const clear = useCallback(() => go('/'), [go])

  return { selection, selectProject, selectLandmark, clear }
}
