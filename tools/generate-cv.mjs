/**
 * Generates the PDF + Markdown for each document under public/ using RenderCV.
 * https://github.com/rendercv/rendercv
 *
 * Two documents are defined below, each in its own folder with its own source
 * YAML and its own version manifest:
 *   cv            public/cv/            -> src/data/cvVersion.json
 *   cover-letter  public/cover-letter/  -> public/cover-letter/version.json
 *
 * The CV manifest lives under src/ because the app imports it to build the
 * download link (see src/data/profile.ts). Nothing reads the letter's manifest,
 * so it sits next to the document it versions.
 *
 * RenderCV has no cover-letter document type, so the letter is a CV whose only
 * section holds the paragraphs. Its design block mirrors the CV's so both share
 * one letterhead; the two files are kept in sync by hand.
 *
 * RenderCV is a Python tool, so this script keeps a throwaway virtualenv in
 * .venv-cv/ and bootstraps it on first run. It is a dev-only utility: the Vite
 * build and the Vercel deploy never invoke it.
 *
 * Versioning
 * ----------
 * Output is versioned major.minor in the filename: Adrian_Legaspi_CV_v5.2.pdf.
 * The version is NOT hardcoded in the YAML -- this script computes it and
 * passes it to RenderCV via --pdf-path / --markdown-path.
 *
 * The version only increments when the YAML actually changes: the number and a
 * hash of the source live in that document's manifest, and a render whose hash
 * matches the manifest is skipped entirely rather than rewriting identical
 * output. So re-running this command is idempotent. A content change bumps the
 * minor version by default (5.1 -> 5.2); pass --major for a substantial
 * rewrite, which bumps the major and resets minor to 0 (5.2 -> 6.0).
 *
 * Older versioned files are deliberately left in place rather than cleaned up.
 * Because the version is in the public URL, a link already shared with someone
 * would 404 the moment it stopped being the newest build.
 *
 *   pnpm cv:generate                  both documents
 *   pnpm cv:generate cover-letter     just the cover letter
 *   pnpm cv:generate -- --major       bump the major version
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const venvDir = join(root, '.venv-cv')
const requirementsFile = join(root, 'tools', 'cv-requirements.txt')
const cvDir = join(root, 'public', 'cv')
const coverLetterDir = join(root, 'public', 'cover-letter')

// Each document lives in its own public/ folder and versions itself
// independently, so editing the cover letter does not bump the CV.
const documents = {
  cv: {
    baseName: 'Adrian_Legaspi_CV',
    dir: cvDir,
    source: join(cvDir, 'Adrian_Legaspi_CV.yaml'),
    manifest: join(root, 'src', 'data', 'cvVersion.json'),
  },
  'cover-letter': {
    baseName: 'Adrian_Legaspi_Cover_Letter',
    dir: coverLetterDir,
    source: join(coverLetterDir, 'Adrian_Legaspi_Cover_Letter.yaml'),
    manifest: join(coverLetterDir, 'version.json'),
    coverLetter: true,
  },
}

/** public/cv -> "public/cv", for messages that name a path. */
const publicPath = (doc) => relative(root, doc.dir).replace(/\\/g, '/')

const isWindows = process.platform === 'win32'
const venvBin = join(venvDir, isWindows ? 'Scripts' : 'bin')
const venvPython = join(venvBin, isWindows ? 'python.exe' : 'python')
// Written after a successful install so we only reinstall when the pins change.
const stampFile = join(venvDir, '.requirements-stamp')

function fail(message) {
  console.error(`\n❌ ${message}\n`)
  process.exit(1)
}

/** Locate a usable system Python to build the virtualenv from. */
function findSystemPython() {
  const candidates = isWindows
    ? [
        ['py', ['-3']],
        ['python', []],
        ['python3', []],
      ]
    : [
        ['python3', []],
        ['python', []],
      ]

  for (const [command, prefix] of candidates) {
    const probe = spawnSync(command, [...prefix, '--version'], { stdio: 'ignore' })
    if (probe.status === 0) return { command, prefix }
  }
  return null
}

function ensureVirtualenv() {
  const requirements = readFileSync(requirementsFile, 'utf8')
  const alreadyCurrent =
    existsSync(venvPython) &&
    existsSync(stampFile) &&
    readFileSync(stampFile, 'utf8') === requirements

  if (alreadyCurrent) return

  if (!existsSync(venvPython)) {
    const python = findSystemPython()
    if (!python) {
      fail(
        'Python 3 was not found on PATH. RenderCV is a Python tool.\n' +
          '   Install Python 3.10+ from https://www.python.org/downloads/ and retry.',
      )
    }

    console.log('Creating virtualenv in .venv-cv ...')
    const created = spawnSync(python.command, [...python.prefix, '-m', 'venv', venvDir], {
      stdio: 'inherit',
      cwd: root,
    })
    if (created.status !== 0) fail('Could not create the virtualenv.')
  }

  console.log('Installing RenderCV (first run only, this takes a moment) ...')
  const installed = spawnSync(
    venvPython,
    ['-m', 'pip', 'install', '--disable-pip-version-check', '-q', '-r', requirementsFile],
    { stdio: 'inherit', cwd: root },
  )
  if (installed.status !== 0) fail('Could not install RenderCV.')

  writeFileSync(stampFile, requirements)
}

/** Identifies the source content, so an unchanged render does not bump the version. */
const fingerprintSource = (doc) =>
  createHash('sha256').update(readFileSync(doc.source)).digest('hex')

/** Parses "5" or "5.2" into { major, minor }, tolerating the old integer-only manifests. */
function parseVersion(doc, raw) {
  const parts = String(raw).split('.')
  const major = Number(parts[0])
  const minor = parts.length > 1 ? Number(parts[1]) : 0
  if (!Number.isInteger(major) || major < 0 || !Number.isInteger(minor) || minor < 0) {
    fail(`${relative(root, doc.manifest)} has an invalid "version": ${raw}`)
  }
  return { major, minor }
}

/**
 * Version is major.minor (e.g. 5.2). A content change bumps the minor version
 * by default; pass --major to bump the major version and reset minor to 0
 * (reserved for a substantial rewrite, not routine edits). A document with no
 * manifest yet starts at 1.0.
 */
function resolveVersion(doc, fingerprint) {
  if (!existsSync(doc.manifest)) return { version: '1.0', unchanged: false }

  let manifest
  try {
    manifest = JSON.parse(readFileSync(doc.manifest, 'utf8'))
  } catch (error) {
    fail(
      `${relative(root, doc.manifest)} is not valid JSON: ${error.message}\n` +
        '   Fix or delete it, then retry.',
    )
  }

  const { major, minor } = parseVersion(doc, manifest.version)
  const unchanged = manifest.sourceHash === fingerprint
  const bumpMajor = process.argv.includes('--major')

  let version
  if (unchanged) {
    version = `${major}.${minor}`
  } else if (bumpMajor) {
    version = `${major + 1}.0`
  } else {
    version = `${major}.${minor + 1}`
  }

  return { version, unchanged }
}

/**
 * --pdf-path and --markdown-path are resolved relative to the input YAML, so
 * bare filenames land next to it in that document's own folder.
 */
function render(doc, pdfName, markdownName) {
  console.log(`Rendering ${doc.baseName} ...`)
  const rendered = spawnSync(
    venvPython,
    [
      '-m',
      'rendercv',
      'render',
      doc.source,
      '--pdf-path',
      pdfName,
      '--markdown-path',
      markdownName,
    ],
    { stdio: 'inherit', cwd: root },
  )
  if (rendered.status !== 0) fail(`RenderCV failed to render ${doc.baseName}.`)

  for (const name of [pdfName, markdownName]) {
    if (!existsSync(join(doc.dir, name))) {
      fail(
        `RenderCV reported success but did not write ${publicPath(doc)}/${name}.\n` +
          '   Check settings.render_command in the YAML: dont_generate_typst must\n' +
          '   stay false, since the PDF is compiled from the .typ file.',
      )
    }
  }

  // RenderCV labels every Markdown document as a CV, even when used for a letter.
  if (doc.coverLetter) {
    const markdownPath = join(doc.dir, markdownName)
    const markdown = readFileSync(markdownPath, 'utf8')
    writeFileSync(markdownPath, markdown.replace(/^# (.+)'s CV$/m, '# $1'))
  }
}

function generate(name, doc) {
  if (!existsSync(doc.source)) fail(`Source not found: ${relative(root, doc.source)}`)

  const fingerprint = fingerprintSource(doc)
  const { version, unchanged } = resolveVersion(doc, fingerprint)
  const pdfName = `${doc.baseName}_v${version}.pdf`
  const markdownName = `${doc.baseName}_v${version}.md`
  const pdfPath = join(doc.dir, pdfName)

  // Re-rendering identical source still rewrites the PDF bytes, which would show
  // up as a spurious diff on the document that did not change.
  if (unchanged && existsSync(pdfPath) && existsSync(join(doc.dir, markdownName))) {
    console.log(`${name}: v${version} already up to date, skipping.`)
    return
  }

  render(doc, pdfName, markdownName)

  writeFileSync(
    doc.manifest,
    `${JSON.stringify(
      {
        version,
        pdf: pdfName,
        markdown: markdownName,
        pdfSizeBytes: statSync(pdfPath).size,
        sourceHash: fingerprint,
        generatedAt: new Date().toISOString().slice(0, 10),
      },
      null,
      2,
    )}\n`,
  )

  console.log(
    `\n✅ ${name} v${version} generated:\n` +
      `   ${publicPath(doc)}/${pdfName}\n` +
      `   ${publicPath(doc)}/${markdownName}   (generated -- edit the .yaml, not this)\n` +
      `   Filename is published in ${relative(root, doc.manifest).replace(/\\/g, '/')}.`,
  )
}

const requested = process.argv.slice(2).filter((arg) => !arg.startsWith('--'))
for (const name of requested) {
  if (!documents[name]) {
    fail(`Unknown document "${name}". Choose from: ${Object.keys(documents).join(', ')}.`)
  }
}

const selected = requested.length > 0 ? requested : ['cv', 'cover-letter']

ensureVirtualenv()

for (const name of selected) generate(name, documents[name])
