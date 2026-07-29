/**
 * Generates the CV PDF + Markdown from public/cv/Adrian_Legaspi_CV.yaml using
 * RenderCV. https://github.com/rendercv/rendercv
 *
 * RenderCV is a Python tool, so this script keeps a throwaway virtualenv in
 * .venv-cv/ and bootstraps it on first run. It is a dev-only utility: the
 * Next.js build and the Vercel deploy never invoke it.
 *
 * Versioning
 * ----------
 * Output is versioned in the filename: Adrian_Legaspi_CV_v10.pdf. The version
 * is NOT hardcoded in the YAML -- this script computes it and passes it to
 * RenderCV via --pdf-path / --markdown-path.
 *
 * The version only increments when the YAML actually changes: the number and a
 * hash of the source live in src/constants/cvVersion.json, and a render whose
 * hash matches the manifest reuses the current version instead of inflating it.
 * So re-running this command is idempotent.
 *
 * Older versioned files are deliberately left in place rather than cleaned up.
 * Because the version is in the public URL, a CV link already shared with
 * someone would 404 the moment it stopped being the newest build.
 *
 * The download button reads the filename from that same manifest (see
 * src/components/About.js), so nothing has to be renamed by hand.
 *
 * Usage: npm run generate-cv
 */
const { spawnSync } = require('child_process');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const crypto = require('crypto');
const path = require('path');

const root = path.resolve(__dirname, '..');
const venvDir = path.join(root, '.venv-cv');
const requirementsFile = path.join(root, 'scripts', 'cv-requirements.txt');
const cvDir = path.join(root, 'public', 'cv');
const cvFile = path.join(cvDir, 'Adrian_Legaspi_CV.yaml');
const baseName = 'Adrian_Legaspi_CV';

// Imported by the download button, so it must live under src/ where Next.js can
// bundle it -- not in public/, which is served as-is rather than compiled.
const manifestFile = path.join(root, 'src', 'constants', 'cvVersion.json');

const isWindows = process.platform === 'win32';
const venvBin = path.join(venvDir, isWindows ? 'Scripts' : 'bin');
const venvPython = path.join(venvBin, isWindows ? 'python.exe' : 'python');
// Written after a successful install so we only reinstall when the pins change.
const stampFile = path.join(venvDir, '.requirements-stamp');

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

/** Locate a usable system Python to build the virtualenv from. */
function findSystemPython() {
  const candidates = isWindows
    ? [['py', ['-3']], ['python', []], ['python3', []]]
    : [['python3', []], ['python', []]];

  for (const [command, prefix] of candidates) {
    const probe = spawnSync(command, [...prefix, '--version'], { stdio: 'ignore' });
    if (probe.status === 0) return { command, prefix };
  }
  return null;
}

function ensureVirtualenv() {
  const requirements = readFileSync(requirementsFile, 'utf8');
  const alreadyCurrent =
    existsSync(venvPython) &&
    existsSync(stampFile) &&
    readFileSync(stampFile, 'utf8') === requirements;

  if (alreadyCurrent) return;

  if (!existsSync(venvPython)) {
    const python = findSystemPython();
    if (!python) {
      fail(
        'Python 3 was not found on PATH. RenderCV is a Python tool.\n' +
          '   Install Python 3.10+ from https://www.python.org/downloads/ and retry.'
      );
    }

    console.log('Creating virtualenv in .venv-cv ...');
    const created = spawnSync(
      python.command,
      [...python.prefix, '-m', 'venv', venvDir],
      { stdio: 'inherit', cwd: root }
    );
    if (created.status !== 0) fail('Could not create the virtualenv.');
  }

  console.log('Installing RenderCV (first run only, this takes a moment) ...');
  const installed = spawnSync(
    venvPython,
    ['-m', 'pip', 'install', '--disable-pip-version-check', '-q', '-r', requirementsFile],
    { stdio: 'inherit', cwd: root }
  );
  if (installed.status !== 0) fail('Could not install RenderCV.');

  writeFileSync(stampFile, requirements);
}

/** Identifies the CV content, so an unchanged render does not bump the version. */
function fingerprintSource() {
  return crypto.createHash('sha256').update(readFileSync(cvFile)).digest('hex');
}

function resolveVersion(fingerprint) {
  let manifest = { version: 0, sourceHash: null };

  if (existsSync(manifestFile)) {
    try {
      manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
    } catch (error) {
      fail(
        `${path.relative(root, manifestFile)} is not valid JSON: ${error.message}\n` +
          '   Fix or delete it, then retry.'
      );
    }
  }

  if (!Number.isInteger(manifest.version) || manifest.version < 0) {
    fail(`${path.relative(root, manifestFile)} has a non-integer "version".`);
  }

  const unchanged = manifest.sourceHash === fingerprint;
  return { version: unchanged ? manifest.version : manifest.version + 1, unchanged };
}

/**
 * --pdf-path and --markdown-path are resolved relative to the input YAML, which
 * already lives in public/cv/, so bare filenames land next to it.
 */
function render(pdfName, markdownName) {
  console.log('Rendering CV ...');
  const rendered = spawnSync(
    venvPython,
    [
      '-m', 'rendercv', 'render', cvFile,
      '--pdf-path', pdfName,
      '--markdown-path', markdownName
    ],
    { stdio: 'inherit', cwd: root }
  );
  if (rendered.status !== 0) fail('RenderCV failed to render the CV.');

  for (const name of [pdfName, markdownName]) {
    if (!existsSync(path.join(cvDir, name))) {
      fail(
        `RenderCV reported success but did not write public/cv/${name}.\n` +
          '   Check settings.render_command in the YAML: dont_generate_typst must\n' +
          '   stay false, since the PDF is compiled from the .typ file.'
      );
    }
  }
}

if (!existsSync(cvFile)) fail(`CV source not found: ${path.relative(root, cvFile)}`);

ensureVirtualenv();

const fingerprint = fingerprintSource();
const { version, unchanged } = resolveVersion(fingerprint);
const pdfName = `${baseName}_v${version}.pdf`;
const markdownName = `${baseName}_v${version}.md`;

render(pdfName, markdownName);

writeFileSync(
  manifestFile,
  `${JSON.stringify(
    {
      version,
      pdf: pdfName,
      markdown: markdownName,
      sourceHash: fingerprint,
      generatedAt: new Date().toISOString().slice(0, 10)
    },
    null,
    2
  )}\n`
);

console.log(
  `\n✅ CV v${version} generated${unchanged ? ' (source unchanged, version kept)' : ''}:\n` +
    `   public/cv/${pdfName}\n` +
    `   public/cv/${markdownName}   (generated -- edit the .yaml, not this)\n` +
    '   The download button picks this up from src/constants/cvVersion.json.'
);
