# 01: Product

Part of the [legaspi.dev Master Spec](../legaspi_dev_master_spec.md). Covers original sections §1–§4 and §52.

---

## 1. Product Vision

`legaspi.dev` is an interactive portfolio presented as a small colorful low-poly 3D city.

Each major project is represented by a building. Visitors explore the city by panning and zooming from a fixed angled camera, then select buildings to open native HTML case studies.

The 3D city exists to make the portfolio memorable and to create a coherent metaphor around Adrian's career: **software projects are things that were built**.

The actual portfolio content remains ordinary accessible HTML rendered with React. The 3D layer is the navigation and visual identity, not the content renderer.

The experience should end naturally at an unfinished construction site representing the next project, with the call to action:

> **Let's build something together.**

The site must feel playful and distinctive without becoming a game that recruiters have to learn.

---

## 2. Product Goals

Priority order:

1. **Get hired** for Senior Software Engineer / Tech Lead-capable roles.
2. **Attract freelance or consulting work.**
3. **Build a memorable personal brand.**

Every product decision should be evaluated against these priorities.

### Success criteria

A visitor should be able to determine within roughly 10–15 seconds:

- Adrian is a Senior Software Engineer.
- Adrian has substantial real-world professional experience.
- The city contains clickable project case studies.
- Some work is private/internal and is represented through sanitized case studies.
- Contact information and résumé access are easy to find.

A recruiter who does not care about the 3D interaction must still be able to navigate the portfolio efficiently.

---

## 3. Core Experience

The website opens directly into a small 3D city diorama.

The city uses:

- colorful low-poly visuals;
- Kenney city assets as the primary asset library;
- a fixed perspective/isometric-style camera angle;
- panning;
- zooming;
- no user-controlled camera rotation;
- native HTML overlays for all meaningful written content.

The city is organized on a grid. Interactive buildings are mixed with decorative buildings, roads, trees, street furniture, and other lightweight props so the environment reads as an actual small city rather than a collection of isolated project models.

### Core interaction loop

1. Visitor arrives at `legaspi.dev`.
2. City is immediately understandable and usable.
3. Visitor pans or zooms around the grid.
4. Hovering a project building on pointer devices highlights it and reveals its name.
5. Tapping or clicking selects the building.
6. Camera subtly repositions to frame the selected building.
7. A native HTML project panel opens.
8. Visitor reads the case study.
9. Visitor closes the panel or selects another project.
10. Visitor eventually discovers the construction site and the "Let's build something together" contact CTA.

---

## 4. Non-Goals

The MVP is **not** a game.

Do not implement:

- player characters;
- WASD navigation;
- camera rotation controls;
- building interiors;
- pedestrians;
- traffic simulation;
- procedural city generation;
- physics;
- weather systems;
- multiplayer;
- free-flight cameras;
- complex shaders;
- dynamic construction animations;
- a real-time day/night simulation;
- a backend solely to serve portfolio content;
- a CMS;
- a custom 3D modeling pipeline;
- unnecessary loading cinematics.

Decorative static cars, street props, trees, signs, cranes, and similar low-cost assets are allowed.

The test for every proposed feature is:

> Does this help a recruiter, potential client, or memorable presentation of Adrian's work?

If not, it belongs after MVP.

---

## 52. Final Product Principle

The portfolio should communicate one idea without explaining it excessively:

> **Adrian builds things. This is the city made from them. There is room for the next one.**

The 3D scene earns attention.

The case studies earn credibility.

The construction site converts that attention into a conversation.
