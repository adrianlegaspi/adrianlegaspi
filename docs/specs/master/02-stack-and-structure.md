# 02 — Technology Stack & Repository Structure

Part of the [legaspi.dev Master Spec](../legaspi_dev_master_spec.md). Covers original sections §5–§6.

---

## 5. Technology Stack

### Application

- React
- TypeScript
- Vite

### 3D

- Three.js
- React Three Fiber
- Drei

### UI

- Tailwind CSS
- shadcn/ui
- Base UI primitives

Use shadcn/ui selectively. The portfolio should not visually resemble a generic dashboard. Components are starting points for accessible behavior and interaction, not a visual identity.

Likely useful components:

- Sheet / Drawer
- Button
- Badge
- Tooltip
- Separator
- Select or Dropdown Menu
- Scroll Area
- Dialog only where genuinely needed

### Content

- Markdown project case studies
- JSON configuration for project/building metadata
- React Markdown for rendering localized project content
- Zod for validating content/configuration schemas

### Routing

Use React Router or another minimal SPA router.

Required route model:

```text
/
/projects/:projectId
/about
/contact
```

Project URLs must be directly shareable.

Opening `/projects/depguard`, for example, must:

1. load the city;
2. identify the DepGuard building;
3. frame/select that building;
4. open the DepGuard case-study panel.

Browser back/forward navigation must behave correctly.

### Deployment

- Vercel
- production domain: `legaspi.dev`

No application backend is required for MVP.

---

## 6. Repository Structure

Recommended structure:

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers/
│
├── city/
│   ├── CityCanvas.tsx
│   ├── CityScene.tsx
│   ├── camera/
│   │   ├── CityCamera.tsx
│   │   ├── cameraBounds.ts
│   │   └── cameraTransitions.ts
│   │
│   ├── buildings/
│   │   ├── ProjectBuilding.tsx
│   │   ├── DecorativeBuilding.tsx
│   │   └── BuildingHighlight.tsx
│   │
│   ├── environment/
│   │   ├── Environment.tsx
│   │   ├── Lighting.tsx
│   │   ├── Sky.tsx
│   │   └── TimeOfDay.ts
│   │
│   ├── world/
│   │   ├── Roads.tsx
│   │   ├── Ground.tsx
│   │   ├── Props.tsx
│   │   └── CityGrid.ts
│   │
│   └── interaction/
│       ├── useBuildingSelection.ts
│       ├── useCityPan.ts
│       └── useCityZoom.ts
│
├── components/
│   ├── project/
│   │   ├── ProjectPanel.tsx
│   │   ├── ProjectHeader.tsx
│   │   ├── ProjectLinks.tsx
│   │   └── ConfidentialProjectNotice.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── MobileBottomSheet.tsx
│   │   └── DesktopSidePanel.tsx
│   │
│   ├── navigation/
│   │   ├── MainNavigation.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── TimeThemeSelector.tsx
│   │
│   └── ui/
│       └── shadcn components
│
├── content/
│   ├── projects/
│   │   ├── viasat/
│   │   │   ├── project.json
│   │   │   ├── en.md
│   │   │   └── es.md
│   │   ├── erp/
│   │   ├── ai-automation/
│   │   ├── casa-del-bombero/
│   │   ├── fixed-ai/
│   │   ├── depguard/
│   │   └── fire-app/
│   │
│   ├── about/
│   │   ├── en.md
│   │   └── es.md
│   │
│   └── contact/
│       ├── en.md
│       └── es.md
│
├── data/
│   ├── decorative-buildings.json
│   └── city-layout.json
│
├── i18n/
│   ├── index.ts
│   ├── en.ts
│   └── es.ts
│
├── assets/
│   ├── models/
│   ├── textures/
│   └── icons/
│
└── styles/
```

The exact folder names can change. The important architectural rule is to keep:

1. **project content**;
2. **city/building configuration**;
3. **3D rendering**;
4. **UI presentation**

separate from one another.
