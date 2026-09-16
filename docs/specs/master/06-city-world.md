# 06: City World, Assets & Visual Direction

Part of the [legaspi.dev Master Spec](../legaspi_dev_master_spec.md). Covers original sections §11, §13, §20, §40, §41.

---

## 11. City Layout

The city uses a deterministic logical grid.

Example:

```text
grid unit = 1 city lot
```

Each building has:

- `gridX`;
- `gridZ`;
- footprint width;
- footprint depth;
- rotation;
- model;
- scale.

World coordinates are calculated from grid coordinates.

Do not hardcode arbitrary world coordinates throughout React components.

Example conversion:

```ts
worldX = gridX * LOT_SIZE
worldZ = gridZ * LOT_SIZE
```

### Initial conceptual layout

```text
                 NORTH

       ┌────────┬────────┬────────┐
       │        │        │        │
       │        │  Park  │ Viasat │
       │        │        │ Tower  │
       ├────────┼────────┼────────┤
       │ Fixed  │ City   │ ERP    │
       │ AI     │ Hall   │        │
       ├────────┼────────┼────────┤
       │ Fire   │ Plaza  │ Dep    │
       │ App    │        │ Guard  │
       ├────────┼────────┼────────┤
       │ Casa   │        │        │
       │ Bombero│  NEXT PROJECT   │
       └────────┴─────────────────┘
```

This is illustrative, not a final map.

The final arrangement should prioritize visual composition rather than literal chronology.

### Decorative content

Decorative buildings and props should be loaded from separate configuration.

They exist to:

- define streets;
- fill empty lots;
- create depth;
- establish visual scale;
- make major project buildings feel like landmarks.

Decorative buildings are never focusable as projects.

---

## 13. Asset Strategy

Primary source: Kenney 3D city assets.

Prioritize compatible low-poly packs such as city/commercial, suburban, road, vehicle, and related modular packs available from Kenney.

### Asset rules

- Prefer GLB/GLTF for runtime assets.
- Reuse materials aggressively.
- Avoid unique high-resolution textures where unnecessary.
- Prefer modular low-poly assets.
- Keep decorative asset variety controlled.
- Optimize scene draw calls where practical.
- Avoid importing enormous packs into the final build if only a small subset is used.

Create an asset manifest:

```ts
export const buildingAssets = {
  'commercial-large-01': '/models/buildings/commercial-large-01.glb',
  'commercial-small-02': '/models/buildings/commercial-small-02.glb',
  'fire-station-01': '/models/buildings/fire-station-01.glb',
} as const
```

Project configuration references asset IDs, never raw file paths.

This allows models to be replaced later without editing project files.

---

## 20. Visual Direction

### Style

- colorful;
- low-poly;
- miniature city/diorama;
- modern;
- clean;
- playful;
- professional enough for a senior-engineering portfolio.

Avoid:

- cyberpunk overload;
- neon everywhere;
- overly dark "hacker" aesthetics;
- photorealism;
- generic SaaS gradients covering the scene;
- childish toy aesthetics.

Kenney assets establish the base aesthetic.

Custom materials may adjust the palette enough to produce visual consistency across packs.

### Ground

Contained rectangular city district.

The edge of the environment should be deliberate.

Possible treatment:

- raised architectural-model base;
- clean terrain border;
- subtle surrounding background/void.

Do not create an infinite plane.

### Roads

Roads visually establish the grid.

Roads have no simulation purpose.

### Props

Allowed examples:

- trees;
- lamp posts;
- benches;
- parked cars;
- traffic signs;
- construction barriers;
- crane;
- small plazas.

Props should help composition rather than become interactive clutter.

---

## 40. City Occupancy System

To make project addition safe, the city grid should understand building footprints.

Example:

```ts
interface BuildingPlacement {
  grid: [number, number]
  footprint: [number, number]
  rotation: 0 | 90 | 180 | 270
}
```

A development helper validates collisions.

This does not need to become a procedural layout engine.

A simple deterministic validator is enough.

Optional development-only debug mode:

- show grid lines;
- show lot coordinates;
- show building IDs;
- highlight occupied cells.

This will make AI-assisted iteration much easier.

Debug tools must not ship visibly in production.

---

## 41. Scene Development Mode

Provide a development query flag or environment toggle such as:

```text
?debugCity=1
```

Possible development features:

- grid overlay;
- camera coordinates;
- project IDs;
- bounding boxes;
- FPS display;
- clickable lot coordinates.

The implementation must keep debug code isolated.

This will help Codex/Claude make placement changes without guessing blindly.
