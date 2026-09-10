import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { projectById, type Project } from '@/content/registry'
import { landmarks, type Landmark } from '@/data/landmarks'
import { footprintCenter } from '@/city/world/cityGrid'

export type Selection =
  | { kind: 'project'; id: string; project: Project; center: [number, number] }
  | { kind: 'landmark'; id: string; landmark: Landmark; center: [number, number] }
  | null

const routePattern = /^\/(?:projects\/[a-z0-9-]+)?$|^\/(?:about|contact)$/

/** Unknown URLs go back to the city instead of showing an empty state. */
export const isKnownRoute = (pathname: string) => {
  const path = pathname.replace(/\/$/, '') || '/'
  if (!routePattern.test(path)) return false
  const project = /^\/projects\/([a-z0-9-]+)$/.exec(path)
  return project ? Boolean(projectById(project[1])) : true
}

/**
 * Selection lives in the URL (spec §36): opening a project link and clicking
 * its building produce the same state, and the back button works.
 */
export function useSelection() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const selection = useMemo<Selection>(() => {
    const projectMatch = /^\/projects\/([a-z0-9-]+)\/?$/.exec(pathname)
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
    const landmark = landmarks.find((entry) => entry.route === pathname.replace(/\/$/, ''))
    if (landmark) {
      return {
        kind: 'landmark',
        id: landmark.id,
        landmark,
        center: footprintCenter(landmark.grid, landmark.footprint),
      }
    }
    return null
  }, [pathname])

  const selectProject = useCallback((id: string) => navigate(`/projects/${id}`), [navigate])
  const selectLandmark = useCallback(
    (id: string) => {
      const landmark = landmarks.find((entry) => entry.id === id)
      if (landmark) navigate(landmark.route)
    },
    [navigate],
  )
  const clear = useCallback(() => navigate('/'), [navigate])

  return { selection, selectProject, selectLandmark, clear }
}
