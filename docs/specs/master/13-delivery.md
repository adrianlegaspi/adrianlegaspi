# 13: Delivery: MVP, Order, Acceptance & Roadmap

Part of the [legaspi.dev Master Spec](../legaspi_dev_master_spec.md). Covers original sections §45–§49 and §51.

---

## 45. MVP Definition

The MVP is complete when all of the following work.

### Foundation

- Vite + React + TypeScript application.
- React Three Fiber canvas.
- Vercel-compatible build.
- `legaspi.dev` deployment configuration.

### City

- deterministic city grid;
- contained ground/platform;
- roads;
- decorative buildings;
- simple props;
- initial project buildings;
- City Hall;
- Next Project construction site.

### Interaction

- fixed camera orientation;
- desktop pan;
- mobile pan;
- zoom;
- bounded camera;
- building hover on compatible devices;
- building selection;
- selected building highlight;
- smooth focus transition;
- project route synchronization.

### UI

- desktop side panel;
- mobile bottom sheet;
- normal project navigation fallback;
- About;
- Contact;
- résumé placeholder;
- language selector;
- time/theme selector.

### Content

- data-driven project registry;
- JSON project metadata;
- English Markdown;
- Spanish Markdown;
- private-project case-study support;
- placeholders for incomplete real content.

### Environment

- automatic local-time theme;
- Dawn;
- Day;
- Sunset;
- Night;
- manual Auto/Day/Sunset/Night control;
- night window/streetlight treatment.

### Quality

- responsive;
- keyboard-accessible navigation;
- reduced-motion handling;
- WebGL fallback;
- acceptable mobile performance;
- basic SEO metadata;
- no obvious console errors.

Anything beyond this list should require a concrete reason before being added to MVP.

---

## 46. Implementation Order

The project should be implemented vertically rather than spending days creating infrastructure before anything visible exists.

### Phase 1: Walking skeleton

Build:

- Vite/React/TypeScript;
- R3F canvas;
- one ground plane;
- one Kenney building;
- fixed camera;
- pan/zoom;
- click building;
- open HTML panel.

When this works, the fundamental architecture is proven.

### Phase 2: Data-driven buildings

Implement:

- project schema;
- asset registry;
- Markdown loading;
- bilingual content loading;
- automatic project registry;
- grid placement.

Move the first project into the content system.

### Phase 3: City composition

Add:

- roads;
- decorative buildings;
- initial project buildings;
- City Hall;
- construction site;
- trees/props.

Do not polish individual props yet.

### Phase 4: Responsive UI

Implement:

- desktop side panel;
- mobile bottom sheet;
- normal project navigation;
- focus behavior;
- touch interactions.

### Phase 5: Environment

Implement:

- local-time detection;
- dawn/day/sunset/night presets;
- selector;
- window/streetlight treatment.

### Phase 6: Routing

Implement:

- project deep links;
- About;
- Contact;
- browser back/forward;
- direct-load building focus.

### Phase 7: Accessibility / fallback

Implement:

- keyboard project navigation;
- reduced motion;
- WebGL fallback;
- semantic controls;
- focus management.

### Phase 8: Optimization

Profile before optimizing.

Then address:

- GLB size;
- repeated props;
- shadow cost;
- DPR;
- mobile GPU load;
- lazy loading.

### Phase 9: Content

Replace placeholders with real case studies and links.

Private-work content gets an explicit confidentiality review before publication.

### Phase 10: Deploy

- Vercel;
- `legaspi.dev`;
- SEO metadata;
- production smoke test;
- mobile smoke test.

---

## 47. Acceptance Tests

### Core navigation

**Given** the homepage has loaded  
**When** the visitor clicks a project building  
**Then** the building becomes selected  
**And** the camera frames it  
**And** the correct case-study UI opens  
**And** the URL changes to the project's route.

### Deep link

**Given** the visitor opens `/projects/depguard` directly  
**When** the app initializes  
**Then** the city loads  
**And** DepGuard is selected  
**And** its building is framed  
**And** its case study is visible.

### Mobile

**Given** the viewport is a phone  
**When** a building is tapped  
**Then** its case study opens as a bottom sheet  
**And** the user can scroll the case study without moving the city.

### Language

**Given** a project is selected  
**When** the visitor changes from English to Spanish  
**Then** the same project remains selected  
**And** the camera does not reset  
**And** the localized content is displayed.

### Time theme

**Given** time mode is Auto  
**When** the application initializes  
**Then** the environment preset reflects the visitor's local browser time.

### Manual theme

**Given** Auto is active  
**When** the visitor selects Night  
**Then** night visual settings are applied  
**And** the selected project remains unchanged.

### Private project

**Given** a confidential project is selected  
**Then** its sanitized case study is displayed  
**And** no proprietary screenshots are required  
**And** a confidentiality notice is visible.

### Accessibility fallback

**Given** the visitor does not interact with the 3D scene  
**Then** every project remains reachable from HTML navigation.

---

## 48. Definition of Done

A feature is done only when:

- desktop works;
- mobile works;
- keyboard behavior is reasonable where applicable;
- EN and ES strings/content exist;
- no project-specific hacks were introduced when the generic system could handle it;
- direct routes continue to work;
- no confidential information has been added;
- visual performance remains acceptable.

---

## 49. Future Enhancements

Not MVP.

Potential later additions:

- subtle moving cars;
- animated construction crane;
- tiny easter eggs;
- project-specific environmental props;
- city growth as new projects are added;
- animated windows;
- richer project media galleries;
- static prerendering of project routes;
- analytics;
- optional project filtering;
- small street names;
- custom landmark models;
- additional time-of-day control;
- seasonal decoration;
- content editor/CMS only if maintaining Markdown genuinely becomes painful.

The architecture should permit these without requiring them now.

---

## 51. First Implementation Milestone

The first milestone should deliberately be tiny.

It is successful when the repository can show:

- the React app;
- one Kenney building in R3F;
- colorful ground;
- fixed angled camera;
- pan;
- zoom;
- click/tap building;
- desktop HTML panel;
- mobile bottom sheet;
- one English Markdown case study;
- one Spanish Markdown case study;
- language switching;
- `/projects/example` deep link.

Do **not** build the whole city before this milestone is working.

Once this vertical slice works, duplicating the system across the remaining projects should be straightforward.
