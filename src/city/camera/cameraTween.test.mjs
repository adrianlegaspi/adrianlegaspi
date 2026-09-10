import assert from 'node:assert/strict'
import test from 'node:test'
import { Vector3 } from 'three'
import { tweenCamera } from './cameraTween.ts'

test('focus tween moves from the rendered pose without a jump', () => {
  const from = new Vector3(2, 0, 4)
  const to = new Vector3(10, 0, 12)
  const target = new Vector3()

  assert.equal(tweenCamera(target, from, to, 7, 15, 0), 7)
  assert.deepEqual(target.toArray(), from.toArray())

  assert.equal(tweenCamera(target, from, to, 7, 15, 0.5), 11)
  assert.deepEqual(target.toArray(), [6, 0, 8])

  assert.equal(tweenCamera(target, from, to, 7, 15, 1), 15)
  assert.deepEqual(target.toArray(), to.toArray())
})
