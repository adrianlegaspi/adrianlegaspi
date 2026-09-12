import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createServer } from 'vite'

const vite = await createServer({ appType: 'custom', server: { middlewareMode: true } })
const routes = await vite.ssrLoadModule('/src/app/routes.ts')
const selection = await vite.ssrLoadModule('/src/app/selection.ts')

after(() => vite.close())

test('english paths stay unprefixed so existing links keep resolving', () => {
  assert.equal(routes.localized('en', '/projects/depguard'), '/projects/depguard')
  assert.equal(routes.localized('en', '/'), '/')
})

test('spanish paths carry the prefix, with no trailing slash on home', () => {
  assert.equal(routes.localized('es', '/'), '/es')
  assert.equal(routes.localized('es', '/about'), '/es/about')
})

test('splitLocale is the inverse of localized', () => {
  for (const locale of ['en', 'es']) {
    for (const path of routes.paths()) {
      assert.deepEqual(routes.splitLocale(routes.localized(locale, path)), { locale, path })
    }
  }
})

test('a trailing slash never changes what a URL selects', () => {
  assert.deepEqual(routes.splitLocale('/es/about/'), { locale: 'es', path: '/about' })
  assert.equal(selection.isKnownRoute('/es/projects/depguard/'), true)
})

test('unknown projects are not routes in either locale', () => {
  assert.equal(selection.isKnownRoute('/projects/not-a-project'), false)
  assert.equal(selection.isKnownRoute('/es/projects/not-a-project'), false)
})
