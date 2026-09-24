import assert from 'node:assert/strict'
import test from 'node:test'
import { renderQuality } from './renderQuality.ts'

test('low quality keeps the mobile city within its render budget', () => {
  const low = renderQuality.low
  assert.equal(low.dpr, 1)
  assert.equal(low.shadows, false)
  assert.equal(low.antialias, false)
  assert.equal(low.localLights, false)
  assert.equal(low.animate, false)
  assert.equal(low.frameloop, 'demand')
})
