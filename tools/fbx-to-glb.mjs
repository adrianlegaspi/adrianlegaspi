/**
 * Converts the non-Kenney FBX packs into city-scale GLBs.
 *
 * Those packs colour their meshes with one material per colour and no texture,
 * which would cost a draw call per colour and defeat instancing. The converter
 * bakes each material's base colour into vertex colours, joins everything into
 * a single primitive with one material, and scales the result to city units.
 *
 *   pnpm assets:convert            # everything in tools/asset-manifest.mjs
 *   pnpm assets:convert crane      # only outputs whose path contains "crane"
 *
 * Source art lives in the gitignored `tmp/` drop folder; the GLBs it writes to
 * `public/models` are what ships.
 */
import { mkdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import convertFbx from 'fbx2gltf'
import { NodeIO, getBounds } from '@gltf-transform/core'
import {
  dedup,
  flatten,
  join as joinPrimitives,
  prune,
  simplify,
  weld,
} from '@gltf-transform/functions'
import { MeshoptSimplifier } from 'meshoptimizer'
import { assets, sources } from './asset-manifest.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const io = new NodeIO()
const filter = process.argv[2]

await MeshoptSimplifier.ready

/** Base colour per material becomes a COLOR_0 attribute, so one material serves all. */
function bakeVertexColors(document) {
  const buffer = document.getRoot().listBuffers()[0]
  const shared = document
    .createMaterial('baked')
    .setBaseColorFactor([1, 1, 1, 1])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.85)

  for (const mesh of document.getRoot().listMeshes()) {
    for (const primitive of mesh.listPrimitives()) {
      const material = primitive.getMaterial()
      const color = material ? material.getBaseColorFactor() : [1, 1, 1, 1]
      const count = primitive.getAttribute('POSITION').getCount()
      // Normalized bytes: 4 per vertex instead of 16, and plenty for flat colours.
      const data = new Uint8Array(count * 4)
      const bytes = color.map((channel) => Math.round(Math.min(1, Math.max(0, channel)) * 255))
      for (let i = 0; i < count; i++) data.set(bytes, i * 4)
      primitive.setAttribute(
        'COLOR_0',
        document
          .createAccessor()
          .setType('VEC4')
          .setArray(data)
          .setNormalized(true)
          .setBuffer(buffer),
      )
      // Texture coordinates are meaningless without a texture and block joining.
      primitive.setAttribute('TEXCOORD_0', null)
      // Dropping normals lets welding collapse the split vertices the exporter
      // leaves behind, which is what makes decimation possible; GLTFLoader then
      // flat-shades any primitive without them, which is the look we want.
      primitive.setAttribute('NORMAL', null)
      primitive.setMaterial(shared)
    }
  }
}

/**
 * The source art is smooth-subdivided: a cement bag arrives at 30k triangles.
 * Nothing here is ever bigger than a few pixels of a screen-filling crane, so
 * collapse it as far as meshopt can while staying inside a 0.3%-of-size error.
 */
const decimate = () =>
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.1, error: 0.003 })

/**
 * Scales the model so its longest ground axis measures `width` city units and
 * parks it on the origin with its base at y=0, matching the Kenney convention.
 * Runs on world-space bounds, so the FBX exporter's 100x node scale and Z-up
 * rotation are already accounted for.
 */
function fitToWidth(document, width) {
  const scene = document.getRoot().listScenes()[0]
  const { min, max } = getBounds(scene)
  const span = Math.max(max[0] - min[0], max[2] - min[2])
  const scale = width / span
  const offset = [
    (-(min[0] + max[0]) / 2) * scale,
    -min[1] * scale,
    (-(min[2] + max[2]) / 2) * scale,
  ]
  for (const node of scene.listChildren()) {
    node.setScale(node.getScale().map((value) => value * scale))
    node.setTranslation(node.getTranslation().map((value, axis) => value * scale + offset[axis]))
  }
  return { scale, size: max.map((value, axis) => (value - min[axis]) * scale) }
}

async function convert(asset) {
  const source = join(root, 'tmp', sources[asset.from], asset.file)
  const target = join(root, 'public', 'models', asset.out)
  const staging = join(root, 'tmp', '.staging', asset.out.replace(/\//g, '-'))

  await mkdir(dirname(staging), { recursive: true })
  await mkdir(dirname(target), { recursive: true })
  await convertFbx(source, staging, ['--binary'])

  const document = await io.read(staging)
  bakeVertexColors(document)
  await document.transform(flatten(), dedup(), joinPrimitives(), weld(), decimate(), prune())
  const { size } = fitToWidth(document, asset.width)
  await io.write(target, document)

  const resources = (await io.readAsJSON(target)).resources
  const bytes = Object.values(resources).reduce((total, data) => total + data.byteLength, 0)
  const dimensions = size.map((value) => value.toFixed(2)).join(' x ')
  console.log(`${asset.out.padEnd(32)} ${dimensions.padStart(20)}  ${Math.round(bytes / 1024)} kB`)
}

const queue = filter ? assets.filter((asset) => asset.out.includes(filter)) : assets
if (!queue.length) throw new Error(`no asset matches "${filter}"`)
for (const asset of queue) await convert(asset)
await rm(join(root, 'tmp', '.staging'), { recursive: true, force: true })
