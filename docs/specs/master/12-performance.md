# 12: Performance & Quality Presets

Part of the [legaspi.dev Master Spec](../legaspi_dev_master_spec.md). Covers original sections §31–§32.

---

## 31. Performance

Performance matters more than fancy effects.

### Initial targets

Aim for:

- quick first meaningful UI;
- progressive model loading where helpful;
- smooth interaction on typical modern phones and laptops;
- approximately 60 FPS on reasonable desktop hardware;
- graceful reduced quality on weaker mobile devices.

Do not block first render on every decorative city asset.

### Asset optimizations

Use when beneficial:

- GLB;
- Meshopt;
- Draco only if it meaningfully helps the chosen pipeline;
- texture compression;
- instancing for repeated props;
- shared geometry/materials;
- lazy loading of non-critical models;
- small texture sizes.

### Rendering

Potential techniques:

- instanced meshes for repeated trees/lights;
- limited shadow-casting objects;
- baked-looking/simple lighting;
- capped device pixel ratio;
- simplified mobile shadow settings.

Avoid expensive post-processing in MVP.

---

## 32. Quality Presets

Optionally determine a lightweight quality level from device capability.

Example:

```text
high
standard
low
```

Differences may include:

- shadow resolution;
- number of shadow-casting lights;
- DPR cap;
- decorative prop density;
- antialiasing settings.

Do not expose a complicated graphics settings menu.

The visitor came to inspect a résumé, not configure Crysis.
