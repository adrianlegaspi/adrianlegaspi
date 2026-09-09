# 09 — Time-of-Day Environment System

Part of the [legaspi.dev Master Spec](../legaspi_dev_master_spec.md). Covers original section §19.

---

## 19. Time-of-Day Environment System

The visual environment follows the visitor's browser-local time by default.

No geolocation permission is required.

Recommended automatic mapping:

```text
05:00–08:00  dawn
08:00–17:00  day
17:00–20:00  sunset
20:00–05:00  night
```

The implementation should define named environment presets:

```ts
type TimeTheme = "dawn" | "day" | "sunset" | "night"
```

Each preset controls:

- sky/background;
- ambient light intensity;
- directional light intensity;
- directional light angle;
- environment tone;
- streetlight visibility;
- emissive building windows;
- optional UI surface adjustments.

### Manual selector

Expose:

```text
AUTO
DAY
SUNSET
NIGHT
```

Dawn can remain automatic-only for MVP unless the final UI benefits from showing all four.

Selecting `AUTO` returns to local-time behavior.

Store manual preference locally.

### Important rule

Do not create four separate scenes.

The geometry is identical.

Only visual environment properties change.
