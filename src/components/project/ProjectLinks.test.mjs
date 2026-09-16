import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'

globalThis.window = {
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
}

const vite = await createServer({ appType: 'custom', server: { middlewareMode: true } })
const { PortfolioProvider } = await vite.ssrLoadModule('/src/app/providers/portfolio.tsx')
const { HtmlFallback } = await vite.ssrLoadModule('/src/components/layout/HtmlFallback.tsx')
const { ProjectLinks } = await vite.ssrLoadModule('/src/components/project/ProjectLinks.tsx')
const { copyText } = await vite.ssrLoadModule('/src/components/project/copyText.ts')
const { contactLinks } = await vite.ssrLoadModule('/src/app/panelContent.ts')

after(() => vite.close())

test('contact email renders as a copy button instead of a mailto link', () => {
  const html = renderToStaticMarkup(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(
        PortfolioProvider,
        null,
        React.createElement(ProjectLinks, {
          content: {
            id: 'next-project',
            title: '',
            icon: null,
            eyebrow: '',
            role: null,
            dates: null,
            summary: '',
            body: '',
            technologies: [],
            links: contactLinks('en'),
            media: [],
            confidential: false,
          },
        }),
      ),
    ),
  )

  assert.match(html, /<button[^>]*aria-label="Copy email"/)
  assert.doesNotMatch(html, /role="tooltip"/)
  assert.doesNotMatch(html, /href="mailto:/)
})

test('HTML fallback renders the email copy button', () => {
  const html = renderToStaticMarkup(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(PortfolioProvider, null, React.createElement(HtmlFallback)),
    ),
  )

  assert.match(html, /<button[^>]*aria-label="Copy email"/)
  assert.doesNotMatch(html, /role="tooltip"/)
  assert.doesNotMatch(html, /href="mailto:/)
})

test('email copying works without the Clipboard API', async () => {
  let selected = false
  const field = {
    value: '',
    style: {},
    setAttribute() {},
    select() {
      selected = true
    },
    remove() {},
  }
  const documentRoot = {
    createElement: () => field,
    body: { append() {} },
    execCommand: (command) => command === 'copy',
  }

  const copied = await copyText('contacto@legaspi.dev', null, documentRoot)

  assert.equal(copied, true)
  assert.equal(selected, true)
  assert.equal(field.value, 'contacto@legaspi.dev')
})
