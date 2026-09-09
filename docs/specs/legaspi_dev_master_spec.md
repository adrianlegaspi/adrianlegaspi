# legaspi.dev — Master Project Specification (Index)

**Product:** Interactive 3D developer portfolio  
**Owner:** Adrian Legaspi  
**Public title:** Adrian Legaspi — Senior Software Engineer  
**Primary domain:** `https://legaspi.dev`  
**Deployment target:** Vercel  
**Primary language:** English  
**Secondary language:** Spanish  
**Status:** MVP specification  
**Implementation bias:** Ship quickly. Prefer simple, robust systems over technically impressive abstractions that do not improve the visitor experience.

---

## How to use this spec

This file is an **index only**. The specification content lives in the topic files under
[`master/`](master/). Read the file that covers the area you are working on rather than loading
the whole spec.

Original section numbers (`§1`–`§52`) are preserved inside the topic files, so any existing
reference to a section number still resolves.

Two files are mandatory reading before any implementation work:

- [`master/14-ai-guardrails.md`](master/14-ai-guardrails.md) — hard rules for AI implementation.
- [`master/01-product.md`](master/01-product.md) — vision, goals and non-goals that every decision is judged against.

---

## Index

| File | Sections | Covers |
|------|----------|--------|
| [01 — Product](master/01-product.md) | §1–§4, §52 | Vision, goals, success criteria, core experience, non-goals, final product principle |
| [02 — Stack & Structure](master/02-stack-and-structure.md) | §5–§6 | React/TS/Vite, Three.js/R3F/Drei, Tailwind + shadcn, content tooling, routing, deployment, repo layout |
| [03 — Content System](master/03-content-system.md) | §7–§8, §38–§39, §42–§43 | Data-driven project packages, `project.json`, localized Markdown, language behavior, placeholders, validation, authoring workflow, i18n scope |
| [04 — Project Registry](master/04-project-registry.md) | §9–§10, §12 | The seven initial projects, City Hall, construction site, building visual hierarchy |
| [05 — Case Studies](master/05-case-studies.md) | §24–§28 | Case-study template, private/NDA policy, media strategy, About positioning, contact experience |
| [06 — City World](master/06-city-world.md) | §11, §13, §20, §40–§41 | Grid layout, asset strategy and manifest, visual direction, occupancy validation, scene debug mode |
| [07 — Camera & Interaction](master/07-camera-and-interaction.md) | §14–§15 | Fixed camera, pan/zoom constraints, building focus, idle/hovered/selected states |
| [08 — UI](master/08-ui.md) | §16–§18, §21–§23, §33, §44 | Desktop panel, mobile bottom sheet, responsive behavior, UI visual system, header, HTML navigation fallback, loading, suggested copy |
| [09 — Environment](master/09-environment.md) | §19 | Time-of-day presets, automatic local-time mapping, manual selector |
| [10 — State, Routing & SEO](master/10-state-routing-seo.md) | §30, §35–§37 | State model, URL behavior, SEO requirements, analytics events |
| [11 — Accessibility & Fallback](master/11-accessibility-and-fallback.md) | §29, §34 | Accessibility requirements, reduced motion, WebGL/asset/content failure behavior |
| [12 — Performance](master/12-performance.md) | §31–§32 | Performance targets, asset and rendering optimizations, quality presets |
| [13 — Delivery](master/13-delivery.md) | §45–§49, §51 | MVP definition, 10-phase implementation order, acceptance tests, definition of done, future enhancements, first milestone |
| [14 — AI Guardrails](master/14-ai-guardrails.md) | §50 | The 17 hard rules for AI-assisted implementation |

---

## Quick lookup

| Question | File |
|----------|------|
| Is this feature in scope? | [01](master/01-product.md) (§4 non-goals), [13](master/13-delivery.md) (§45 MVP definition) |
| Which library/version do I use? | [02](master/02-stack-and-structure.md) |
| Where does this new file go? | [02](master/02-stack-and-structure.md) (§6) |
| How do I add a project? | [03](master/03-content-system.md) (§42) |
| What goes in a case study? | [05](master/05-case-studies.md) (§24) |
| Can I publish this detail about private work? | [05](master/05-case-studies.md) (§25) |
| Where does this building go on the grid? | [06](master/06-city-world.md) (§11) |
| How should the camera behave? | [07](master/07-camera-and-interaction.md) |
| What does the panel/sheet look like? | [08](master/08-ui.md) |
| What is the exact UI copy? | [08](master/08-ui.md) (§44) |
| What state is global vs. local? | [10](master/10-state-routing-seo.md) (§35) |
| What happens when WebGL fails? | [11](master/11-accessibility-and-fallback.md) (§34) |
| Is this change done? | [13](master/13-delivery.md) (§48) |
| What am I forbidden from doing? | [14](master/14-ai-guardrails.md) |
