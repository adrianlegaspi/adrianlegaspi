import { useCallback, useEffect } from 'react'
import { buildingAssets } from './assets'
import { CityBuilding, type BuildingState } from './buildings/CityBuilding'
import { ConstructionSite } from './buildings/ConstructionSite'
import { DecorativeBuildings } from './buildings/DecorativeBuildings'
import { CityCamera } from './camera/CityCamera'
import { Environment } from './environment/Environment'
import { Greenery } from './world/Greenery'
import { Ground } from './world/Ground'
import { Props } from './world/Props'
import { Rail } from './world/Rail'
import { Roads } from './world/Roads'
import { Scenery } from './world/Scenery'
import { Traffic } from './world/Traffic'
import { footprintCenter } from './world/cityGrid'
import { DebugCity } from './debug/DebugCity'
import { doc, projects } from '@/content/registry'
import { landmarks } from '@/data/landmarks'
import { page } from '@/content/pages'
import { usePortfolio } from '@/app/providers/portfolio'
import { useSelection } from '@/app/selection'

export function CityScene() {
  const { preset, hoveredProjectId, setHoveredProjectId, layout, reducedMotion, locale } =
    usePortfolio()
  const { selection, selectProject, selectLandmark } = useSelection()

  const stateOf = useCallback(
    (id: string): BuildingState =>
      selection?.id === id ? 'selected' : hoveredProjectId === id ? 'hovered' : 'idle',
    [selection, hoveredProjectId],
  )

  const hover = useCallback(
    (id: string) => (hovered: boolean) =>
      setHoveredProjectId(hovered ? id : hoveredProjectId === id ? null : hoveredProjectId),
    [hoveredProjectId, setHoveredProjectId],
  )

  useEffect(() => {
    document.body.style.cursor = hoveredProjectId ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [hoveredProjectId])

  return (
    <>
      <Environment preset={preset} />
      <Ground preset={preset} />
      <Roads />
      <Rail moving={!reducedMotion} lights={preset.vehicleLights} />
      <Greenery />
      <DecorativeBuildings />
      <Props lit={preset.streetlights} />
      <Scenery />
      <Traffic layout={layout} moving={!reducedMotion} lights={preset.vehicleLights} />

      {projects.map((project) => {
        const content = doc(project, locale)
        return (
          <CityBuilding
            key={project.id}
            url={buildingAssets[project.building.model]}
            center={footprintCenter(project.building.grid, project.building.footprint)}
            rotation={project.building.rotation}
            scale={project.building.scale}
            state={stateOf(project.id)}
            glow={preset.windowGlow}
            preview={{ title: content.title, summary: content.summary }}
            onSelect={() => selectProject(project.id)}
            onHoverChange={hover(project.id)}
          />
        )
      })}

      {landmarks.map((landmark) => {
        const content = page(landmark.page, locale)
        const preview = { title: content.title, summary: content.summary }
        return landmark.model ? (
          <CityBuilding
            key={landmark.id}
            url={buildingAssets[landmark.model]}
            center={footprintCenter(landmark.grid, landmark.footprint)}
            rotation={landmark.rotation}
            state={stateOf(landmark.id)}
            glow={preset.windowGlow}
            preview={preview}
            onSelect={() => selectLandmark(landmark.id)}
            onHoverChange={hover(landmark.id)}
          />
        ) : (
          <ConstructionSite
            key={landmark.id}
            center={footprintCenter(landmark.grid, landmark.footprint)}
            footprint={landmark.footprint}
            state={stateOf(landmark.id)}
            lit={preset.streetlights}
            preview={preview}
            onSelect={() => selectLandmark(landmark.id)}
            onHoverChange={hover(landmark.id)}
          />
        )
      })}

      <CityCamera focus={selection?.center ?? null} layout={layout} instant={reducedMotion} />
      <DebugCity />
    </>
  )
}
