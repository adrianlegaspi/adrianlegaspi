import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createServer } from 'vite'

const vite = await createServer({ appType: 'custom', server: { middlewareMode: true } })
const grid = await vite.ssrLoadModule('/src/city/world/cityGrid.ts')
const rail = await vite.ssrLoadModule('/src/city/world/railPath.ts')

after(() => vite.close())

test('southern boundary road hugs the final city row', () => {
  assert.equal(grid.roadRing.highZ, grid.CITY_DEPTH)
})

test('rail path follows the two-lot corner model', () => {
  const start = rail.railPoint(rail.SOUTH_LEG)
  const end = rail.railPoint(rail.SOUTH_LEG + rail.CORNER_ARC)

  assert.deepEqual([start.x, start.z], [rail.RAIL_CURVE_MIN[0], rail.RAIL_CURVE_MIN[1] + 2])
  assert.deepEqual([end.x, end.z], [rail.RAIL_CURVE_MIN[0] + 2, rail.RAIL_CURVE_MIN[1]])
})
