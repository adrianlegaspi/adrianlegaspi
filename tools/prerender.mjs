/**
 * Writes one static HTML file per route into dist/, plus the sitemap.
 *
 * Runs after `vite build` (the browser bundle and the shell) and after
 * `vite build --ssr` (a Node build of src/prerender/entry.tsx). It takes the
 * shell Vite emitted, swaps the `seo` marker region for that route's head, and
 * drops the route's rendered body inside `#root`.
 *
 * Why this exists: the site is a single WebGL canvas behind a 1.5 MB bundle.
 * Googlebot renders JavaScript, but answer engines and social unfurlers fetch
 * raw HTML and stop, so without this every URL is an empty div to them
 * (spec §30). React clears `#root` when it mounts, so nothing here is ever what
 * a visitor interacts with.
 *
 * No dependency of its own: react-dom/server and react-markdown already ship
 * with the app.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = dirname(fileURLToPath(new URL('.', import.meta.url)))
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')

const SEO_REGION = /<!-- seo:start[\s\S]*?<!-- seo:end -->/
const ROOT_DIV = '<div id="root"></div>'

const { llms, pages } = await import(pathToFileURL(join(ssrDir, 'entry.js')).href)
const shell = await readFile(join(dist, 'index.html'), 'utf8')

if (!SEO_REGION.test(shell)) throw new Error('prerender: seo marker region missing from index.html')
if (!shell.includes(ROOT_DIV)) throw new Error(`prerender: ${ROOT_DIV} missing from index.html`)

const rendered = pages()

for (const page of rendered) {
  const html = shell
    .replace('<html lang="en">', `<html lang="${page.lang}">`)
    .replace(SEO_REGION, page.head)
    .replace(ROOT_DIV, `<div id="root">${page.body}</div>`)

  const target = join(dist, page.file)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, html)
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...rendered.map((page) =>
    [
      '  <url>',
      `    <loc>${page.url}</loc>`,
      ...page.alternates.map(
        (alternate) =>
          `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${alternate.href}"/>`,
      ),
      '  </url>',
    ].join('\n'),
  ),
  '</urlset>',
  '',
].join('\n')

await writeFile(join(dist, 'sitemap.xml'), sitemap)
await writeFile(join(dist, 'llms.txt'), llms())
await rm(ssrDir, { recursive: true, force: true })

console.log(`prerendered ${rendered.length} routes + sitemap.xml + llms.txt`)
