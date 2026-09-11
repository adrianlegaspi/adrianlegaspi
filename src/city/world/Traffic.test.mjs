import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('moving car meshes bypass stale frustum bounds', async () => {
  const source = await readFile(new URL('./Traffic.tsx', import.meta.url), 'utf8')
  const carModel = source.slice(
    source.indexOf('function CarModel'),
    source.indexOf('export function Traffic'),
  )

  assert.match(carModel, /frustumCulled=\{false\}/)
})
