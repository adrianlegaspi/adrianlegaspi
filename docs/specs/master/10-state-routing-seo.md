# 10 — State, Routing, SEO & Analytics

Part of the [legaspi.dev Master Spec](../legaspi_dev_master_spec.md). Covers original sections §30, §35–§37.

---

## 35. State Model

Application state should include:

```ts
interface PortfolioState {
  locale: "en" | "es"
  timeMode: "auto" | "day" | "sunset" | "night"
  selectedProjectId: string | null
  hoveredProjectId: string | null
}
```

Camera state should stay within the city/camera subsystem.

Do not put every camera coordinate into global React state.

Selection changes should synchronize with routing.

---

## 36. URL Behavior

Examples:

```text
https://legaspi.dev/
https://legaspi.dev/projects/viasat
https://legaspi.dev/projects/depguard
https://legaspi.dev/about
https://legaspi.dev/contact
```

Navigating directly to a project URL should produce the same visual selection state as clicking the building.

Closing the case-study panel from a project route returns to `/`.

Selecting another building navigates to that building's route.

Use normal browser history.

---

## 30. SEO

The website is visually 3D but semantically a portfolio website.

Required:

- meaningful `<title>`;
- meta description;
- canonical URL;
- Open Graph metadata;
- structured headings;
- indexable project copy;
- project-specific metadata where practical;
- sitemap;
- robots configuration.

The page must not consist of a canvas with invisible career information hidden from crawlers.

Project content should exist in HTML when selected and may additionally be made available in crawlable route structure.

If later SEO requirements justify prerendering/static generation, the architecture must permit adding it without changing project content format.

---

## 37. Analytics

Analytics are optional for the first deployment but architecture should allow them.

Recommended events:

```text
project_selected
project_link_clicked
resume_downloaded
contact_clicked
language_changed
```

Do not track meaningless 3D interactions like every pan gesture.

If analytics are added, prefer a privacy-conscious solution.

No analytics implementation is required to block MVP release.
