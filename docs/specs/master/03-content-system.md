# 03: Content System

Part of the [legaspi.dev Master Spec](../legaspi_dev_master_spec.md). Covers original sections §7, §8, §38, §39, §42, §43.

---

## 7. Data-Driven Project System

Adding a new project should not require editing the 3D scene directly.

A project is a content package:

```text
src/content/projects/{project-id}/
├── project.json
├── en.md
└── es.md
```

### Example `project.json`

```json
{
  "id": "depguard",
  "status": "published",
  "type": "personal",
  "featured": true,
  "confidential": false,
  "dates": {
    "start": "2026",
    "end": "2026"
  },
  "building": {
    "model": "commercial-small-02",
    "grid": [7, 4],
    "rotation": 0,
    "scale": 1,
    "footprint": [1, 1]
  },
  "technologies": ["React", "TypeScript"],
  "links": {
    "website": null,
    "github": null
  }
}
```

### Why configuration and Markdown are separated

`project.json` contains non-localized system metadata:

- identifier;
- project type;
- confidentiality;
- building model;
- grid coordinates;
- scale;
- links;
- technology IDs;
- dates;
- visibility.

`en.md` and `es.md` contain localized human-readable content.

This prevents building coordinates, project IDs, asset keys, URLs, and other technical values from being duplicated between languages.

### Content loading

Use Vite `import.meta.glob` to discover project folders at build time.

The registry should:

1. find every `project.json`;
2. validate it with Zod;
3. find matching `en.md` and `es.md`;
4. create a typed project registry;
5. automatically create interactive buildings for published projects;
6. expose project data to routing and UI.

Adding a project should normally require only:

1. create folder;
2. add `project.json`;
3. add `en.md`;
4. add `es.md`;
5. assign a valid building asset and grid location.

No project-specific React component should be necessary.

---

## 8. Localized Markdown Format

English and Spanish are first-class languages.

Example:

```text
projects/viasat/
├── project.json
├── en.md
└── es.md
```

### `en.md`

```md
---
title: Viasat
role: Software Engineer
label: Professional Experience
summary: Work on internal security-focused software at Viasat.
---

## Context

Sanitized public description goes here.

## What I worked on

- Contribution one.
- Contribution two.
- Contribution three.

## Technical highlights

Publicly disclosable technical information.

## Outcome

Publicly disclosable results.

## Confidentiality

This is an internal project. Screenshots, proprietary implementation details,
internal architecture and confidential data are intentionally not published.
```

### `es.md`

Contains the same semantic structure translated naturally into Spanish.

Do not use automatic runtime translation for project case studies.

Each language must be intentionally authored.

### Language behavior

Initial language:

1. honor an existing user preference if stored;
2. otherwise inspect browser language;
3. use Spanish when browser locale begins with `es`;
4. otherwise use English.

The visitor can switch languages manually.

Store only the language preference locally.

Changing language must not reset:

- camera location;
- selected building;
- open project;
- theme/time selection.

Project URLs remain language-independent unless SEO requirements later justify localized URL prefixes.

---

## 38. Content Placeholders

The MVP may initially use placeholders for:

- project copy;
- public links;
- GitHub URLs;
- LinkedIn URL;
- email;
- résumé path;
- screenshots;
- exact project dates;
- exact confidentiality-safe Viasat wording.

Placeholder status must remain tracked in source during review, but must not appear as a
visitor-facing case-study banner. It should fail a production-content validation check if
possible.

Recommended:

```ts
if (import.meta.env.PROD && project.hasPlaceholderContent) {
  console.warn(...)
}
```

Do not accidentally publish Lorem Ipsum as Adrian's description of enterprise architecture. Software has suffered enough.

---

## 39. Content Validation

At build/development time, validate:

- unique project IDs;
- referenced building asset exists;
- valid grid coordinates;
- no duplicate occupied grid footprint unless explicitly allowed;
- English Markdown exists;
- Spanish Markdown exists;
- published projects contain title;
- published projects contain summary;
- valid external link formats;
- confidentiality field is explicit.

A bad content entry should fail loudly during development rather than generate a broken invisible building.

---

## 42. Content Authoring Workflow

To add a project:

### Step 1

Create:

```text
src/content/projects/new-project/
```

### Step 2

Add `project.json`.

Choose:

- ID;
- model;
- grid location;
- footprint;
- type;
- links;
- confidentiality;
- technologies.

### Step 3

Write `en.md`.

### Step 4

Write equivalent `es.md`.

### Step 5

Run development server.

The project appears automatically.

### Step 6

Use city debug mode to adjust grid coordinates/model.

### Step 7

Run content/schema validation.

No scene component edits should be required.

---

## 43. Internationalization Scope

Translate:

- navigation;
- project case studies;
- About;
- Contact;
- badges;
- UI labels;
- loading/error states;
- time selector labels;
- accessibility text.

Do not translate:

- technology names;
- product names;
- company names;
- URLs;
- source repository names.

Language switching must be instant and client-side.
