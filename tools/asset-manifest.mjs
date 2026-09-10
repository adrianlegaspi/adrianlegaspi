/**
 * Non-Kenney source art: what to convert, where it lands, and how big it is
 * in city units (1 unit = 1 road tile = 1 lot).
 *
 * The Kenney kits already ship city-scale GLBs with a shared texture atlas and
 * are copied into `public/models` as-is. These packs are FBX with per-material
 * colours and arbitrary units, so they go through `tools/fbx-to-glb.mjs`.
 */

/** Sources are relative to the (gitignored) `tmp` drop folder. */
export const sources = {
  construction: 'Low Poly Construction',
  civic: '.',
  nature: 'kenney_nature-kit/Models/GLTF format',
}

/**
 * `width` is the target size in city units along the model's longest ground
 * axis; the converter scales uniformly to match it. `scale` multiplies instead,
 * which is what the nature kit wants: it is internally consistent, just modelled
 * about twice the size of the city kits.
 */

/** One factor for the whole nature kit, so its own proportions survive. */
const NATURE = 0.55

const nature = (out, file) => ({
  out: `nature/${out}.glb`,
  from: 'nature',
  file: `${file}.glb`,
  scale: NATURE,
})
export const assets = [
  { out: 'construction/crane.glb', from: 'construction', file: 'Crane.fbx', width: 2.4 },
  { out: 'construction/container.glb', from: 'construction', file: 'Container.fbx', width: 0.62 },
  { out: 'construction/skip.glb', from: 'construction', file: 'Skip.fbx', width: 0.42 },
  { out: 'construction/mixer.glb', from: 'construction', file: 'Cement Mixer.fbx', width: 0.3 },
  {
    out: 'construction/scaffolding.glb',
    from: 'construction',
    file: 'Scaffolding A.fbx',
    width: 0.6,
  },
  { out: 'construction/fence.glb', from: 'construction', file: 'Fence A.fbx', width: 0.5 },
  { out: 'construction/gate.glb', from: 'construction', file: 'Fence Gate .fbx', width: 0.5 },
  { out: 'construction/pillar.glb', from: 'construction', file: 'Pillar A.fbx', width: 0.16 },
  { out: 'construction/steel.glb', from: 'construction', file: 'Steel Holder .fbx', width: 0.42 },
  { out: 'construction/pipes.glb', from: 'construction', file: 'Pipe Holder A.fbx', width: 0.4 },
  { out: 'construction/planks.glb', from: 'construction', file: 'Plank Holder.fbx', width: 0.4 },
  { out: 'construction/bricks.glb', from: 'construction', file: 'Brick C.fbx', width: 0.28 },
  { out: 'construction/cement.glb', from: 'construction', file: 'Cement Bag B.fbx', width: 0.26 },
  { out: 'construction/barrier.glb', from: 'construction', file: 'Barrier A.fbx', width: 0.3 },
  { out: 'construction/cone.glb', from: 'construction', file: 'Cone A.fbx', width: 0.09 },
  { out: 'construction/light.glb', from: 'construction', file: 'Work Light A.fbx', width: 0.2 },
  { out: 'construction/toilet.glb', from: 'construction', file: 'Toilet A.fbx', width: 0.16 },
  {
    out: 'construction/wheelbarrow.glb',
    from: 'construction',
    file: 'Wheelbarrow.fbx',
    width: 0.24,
  },
  { out: 'civic/fire-station.glb', from: 'civic', file: 'Fire Station.fbx', width: 1.9 },

  nature('pine-tall', 'tree_pineTallA'),
  nature('pine-round', 'tree_pineRoundC'),
  nature('tree-oak', 'tree_oak'),
  nature('tree-tall', 'tree_tall'),
  nature('tree-thin', 'tree_thin'),
  nature('tree-fall', 'tree_default_fall'),
  nature('bush-large', 'plant_bushLarge'),
  nature('bush', 'plant_bushDetailed'),
  nature('grass', 'grass_large'),
  nature('flowers-red', 'flower_redA'),
  nature('flowers-yellow', 'flower_yellowA'),
  nature('rock-large', 'rock_largeA'),
  nature('rock-small', 'rock_smallB'),
  nature('stone-tall', 'stone_tallC'),
  nature('log', 'log_stack'),
  nature('stump', 'stump_roundDetailed'),
]
