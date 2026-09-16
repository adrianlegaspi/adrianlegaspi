import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createServer } from 'vite'

const vite = await createServer({ appType: 'custom', server: { middlewareMode: true } })
const assets = await vite.ssrLoadModule('/src/city/assets.ts')

after(() => vite.close())

test('junctions use road kit variants with integrated crosswalks', () => {
  assert.equal(assets.roadAssets.crossroad, '/models/roads/road-crossroad-path.glb')
  assert.equal(assets.roadAssets.tee, '/models/roads/road-intersection-path.glb')
})
