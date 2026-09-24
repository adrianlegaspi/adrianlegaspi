import { Suspense, useCallback, useEffect } from 'react'
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
import { PylonSign } from './world/PylonSign'
import { Roads } from './world/Roads'
import { Scenery } from './world/Scenery'
import { Traffic } from './world/Traffic'
import { footprintCenter, lotToWorld } from './world/cityGrid'
import { DebugCity } from './debug/DebugCity'
import { doc, projects } from '@/content/registry'
import { landmarks } from '@/data/landmarks'
import { page } from '@/content/pages'
import { usePortfolio } from '@/app/providers/portfolio'
import { useSelection } from '@/app/selection'

/** Roadside pylon sign standing beside Kinoko Merge's lot, facing the avenue. */
const KINOKO_SIGN_POSITION: [number, number, number] = (() => {
  const [wx, wz] = lotToWorld(14, 12)
  return [wx, 0, wz]
})()

/**
 * Cardom Quest's building model (raw mesh, before its 0.78 scale) is nearly
 * as wide as its single-lot footprint, so there's almost no clearance beside
 * it, but its footprint is 2 lots deep while the scaled model only fills the
 * middle of that span, leaving a real gap at the lot's north edge. The sign
 * stands there instead, still facing the avenue to the east.
 */
const CARDOM_SIGN_SCALE = 0.7
const CARDOM_SIGN_POSITION: [number, number, number] = (() => {
  const [wx, wz] = lotToWorld(12.3, 4.76)
  return [wx, 0, wz]
})()

export function CityScene() {
  const { preset, hoveredProjectId, setHoveredProjectId, layout, quality, reducedMotion, locale } =
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
      <Environment preset={preset} shadows={quality.shadows} />
      <Ground preset={preset} />
      <Suspense fallback={null}>
        <Roads />
      </Suspense>
      <Suspense fallback={null}>
        <Rail moving={!reducedMotion && quality.animate} lights={preset.vehicleLights} />
      </Suspense>
      <Suspense fallback={null}>
        <Greenery />
      </Suspense>
      <Suspense fallback={null}>
        <DecorativeBuildings />
      </Suspense>
      <Suspense fallback={null}>
        <Props lit={preset.streetlights} localLights={quality.localLights} />
      </Suspense>
      <Suspense fallback={null}>
        <Scenery />
      </Suspense>
      <Suspense fallback={null}>
        <PylonSign position={KINOKO_SIGN_POSITION} texture="/textures/kinoko-merge-sign.png" />
        <PylonSign
          position={CARDOM_SIGN_POSITION}
          rotation={90}
          scale={CARDOM_SIGN_SCALE}
          texture="/textures/cardom-quest-sign.png"
        />
      </Suspense>
      <Suspense fallback={null}>
        <Traffic
          layout={layout}
          moving={!reducedMotion && quality.animate}
          lights={preset.vehicleLights}
        />
      </Suspense>

      {projects.map((project) => {
        const content = doc(project, locale)
        return (
          <Suspense key={project.id} fallback={null}>
            <CityBuilding
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
          </Suspense>
        )
      })}

      {landmarks.map((landmark) => {
        const content = page(landmark.page, locale)
        const preview = { title: content.title, summary: content.summary }
        return (
          <Suspense key={landmark.id} fallback={null}>
            {landmark.model ? (
              <CityBuilding
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
                center={footprintCenter(landmark.grid, landmark.footprint)}
                footprint={landmark.footprint}
                state={stateOf(landmark.id)}
                lit={preset.streetlights}
                localLights={quality.localLights}
                preview={preview}
                onSelect={() => selectLandmark(landmark.id)}
                onHoverChange={hover(landmark.id)}
              />
            )}
          </Suspense>
        )
      })}

      <CityCamera focus={selection?.center ?? null} layout={layout} instant={reducedMotion} />
      <DebugCity />
    </>
  )
}
