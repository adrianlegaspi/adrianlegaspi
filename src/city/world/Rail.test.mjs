import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('freight consist uses train-kit carriage models', async () => {
  const source = await readFile(new URL('./Rail.tsx', import.meta.url), 'utf8')
  const wagons = source.slice(
    source.indexOf('const WAGONS'),
    source.indexOf('const CONSIST_LENGTH'),
  )

  for (const model of ['container-blue', 'container-green', 'tank-large', 'container-red']) {
    assert.match(wagons, new RegExp(`railAssets\\['${model}'\\]`))
  }
  assert.doesNotMatch(source, /<(?:box|cylinder)Geometry/)
})
