import assert from 'node:assert/strict'
import { after, beforeEach, test } from 'node:test'
import { createServer } from 'vite'

const values = new Map()
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
}

const vite = await createServer({ appType: 'custom', server: { middlewareMode: true } })
const audio = await vite.ssrLoadModule('/src/audio/cityAudio.ts')

beforeEach(() => values.clear())
after(() => vite.close())

test('sound preference stores the muted flag and restores enabled state', () => {
  assert.equal(audio.initialSoundEnabled(), false)

  audio.storeSoundEnabled(true)
  assert.equal(values.get('legaspi.sound-muted'), 'false')
  assert.equal(audio.initialSoundEnabled(), true)

  audio.storeSoundEnabled(false)
  assert.equal(values.get('legaspi.sound-muted'), 'true')
  assert.equal(audio.initialSoundEnabled(), false)
})
