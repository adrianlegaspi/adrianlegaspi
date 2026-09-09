# 07 — Camera & Interaction

Part of the [legaspi.dev Master Spec](../legaspi_dev_master_spec.md). Covers original sections §14–§15.

---

## 14. Camera Model

The camera uses a fixed orientation.

Visitors cannot rotate it.

### Allowed user interaction

Desktop:

- drag to pan;
- mouse wheel / trackpad to zoom;
- click to select;
- hover to preview.

Mobile:

- one-finger drag to pan;
- pinch to zoom;
- tap to select.

### Camera constraints

Implement:

- minimum zoom;
- maximum zoom;
- X/Z pan boundaries;
- smoothing/damping;
- prevention of leaving the city;
- deterministic focus position for each project.

Do not expose orbit rotation controls.

### Building focus

When a project is selected:

1. record current camera state if useful;
2. calculate focus point from building bounds;
3. smoothly reposition the camera;
4. preserve the same viewing angle;
5. leave enough screen space for the project UI.

Desktop focus should bias the building toward the left side because the case-study panel opens on the right.

Mobile focus should bias the building toward the upper portion because the case-study bottom sheet occupies the lower area.

Closing the project can return to the previous camera location or retain the focused position. Prefer retaining position unless usability testing shows the reset feels better.

---

## 15. Interaction States

Every project building can be in:

```text
idle
hovered
selected
```

### Idle

Normal model.

### Hovered

Use one lightweight treatment:

- outline;
- slight emissive increase;
- subtle scale increase;
- floating HTML label.

Avoid combining all of them.

### Selected

The selected project must remain visually identifiable while the panel is open.

Do not rely on hover for any required information.

Mobile has no hover state.
