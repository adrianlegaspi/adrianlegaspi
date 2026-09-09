// Import the rendercv function and all the refactored components
#import "@preview/rendercv:0.3.0": *

// Apply the rendercv template with custom configuration
#show: rendercv.with(
  name: "Adrian Legaspi",
  title: "Adrian Legaspi - Cover Letter - Confiz React III",
  footer: context { [#emph[Adrian Legaspi -- #str(here().page())\/#str(counter(page).final().first())]] },
  top-note: [ #emph[Last updated in Sept 2026] ],
  locale-catalog-language: "en",
  text-direction: ltr,
  page-size: "us-letter",
  page-top-margin: 0.6in,
  page-bottom-margin: 0.6in,
  page-left-margin: 0.6in,
  page-right-margin: 0.6in,
  page-show-footer: false,
  page-show-top-note: false,
  colors-body: rgb(0, 0, 0),
  colors-name: rgb(0, 0, 0),
  colors-headline: rgb(0, 0, 0),
  colors-connections: rgb(0, 0, 0),
  colors-section-titles: rgb(0, 0, 0),
  colors-links: rgb(0, 0, 0),
  colors-footer: rgb(128, 128, 128),
  colors-top-note: rgb(128, 128, 128),
  typography-line-spacing: 0.6em,
  typography-alignment: "justified",
  typography-date-and-location-column-alignment: right,
  typography-font-family-body: "XCharter",
  typography-font-family-name: "XCharter",
  typography-font-family-headline: "XCharter",
  typography-font-family-connections: "XCharter",
  typography-font-family-section-titles: "XCharter",
  typography-font-size-body: 10pt,
  typography-font-size-name: 21pt,
  typography-font-size-headline: 10pt,
  typography-font-size-connections: 10pt,
  typography-font-size-section-titles: 1.2em,
  typography-small-caps-name: false,
  typography-small-caps-headline: false,
  typography-small-caps-connections: false,
  typography-small-caps-section-titles: false,
  typography-bold-name: false,
  typography-bold-headline: false,
  typography-bold-connections: false,
  typography-bold-section-titles: true,
  links-underline: true,
  links-show-external-link-icon: false,
  header-alignment: center,
  header-photo-width: 3.5cm,
  header-space-below-name: 0.35cm,
  header-space-below-headline: 0.35cm,
  header-space-below-connections: 0.35cm,
  header-connections-hyperlink: true,
  header-connections-show-icons: false,
  header-connections-display-urls-instead-of-usernames: true,
  header-connections-separator: "|",
  header-connections-space-between-connections: 0.5cm,
  section-titles-type: "with_full_line",
  section-titles-line-thickness: 0.5pt,
  section-titles-space-above: 0.35cm,
  section-titles-space-below: 0.25cm,
  sections-allow-page-break: true,
  sections-space-between-text-based-entries: 0.3cm,
  sections-space-between-regular-entries: 0.42cm,
  entries-date-and-location-width: 4.15cm,
  entries-side-space: 0cm,
  entries-space-between-columns: 0.1cm,
  entries-allow-page-break: false,
  entries-short-second-row: false,
  entries-degree-width: 1cm,
  entries-summary-space-left: 0cm,
  entries-summary-space-above: 0.08cm,
  entries-highlights-bullet:  text(13pt, [•], baseline: -0.6pt) ,
  entries-highlights-nested-bullet:  text(13pt, [•], baseline: -0.6pt) ,
  entries-highlights-space-left: 0cm,
  entries-highlights-space-above: 0.08cm,
  entries-highlights-space-between-items: 0.08cm,
  entries-highlights-space-between-bullet-and-text: 0.3em,
  date: datetime(
    year: 2026,
    month: 9,
    day: 8,
  ),
)


= Adrian Legaspi

#connections(
  [Monterrey, Mexico],
  [#link("mailto:adrian.luball@gmail.com", icon: false, if-underline: false, if-color: false)[adrian.luball\@gmail.com]],
  [#link("tel:+52-664-780-9152", icon: false, if-underline: false, if-color: false)[664 780 9152]],
  [#link("https://legaspi.dev/", icon: false, if-underline: false, if-color: false)[legaspi.dev]],
  [#link("https://linkedin.com/in/adrian-legaspi", icon: false, if-underline: false, if-color: false)[linkedin.com\/in\/adrian-legaspi]],
  [#link("https://github.com/adrianlegaspi", icon: false, if-underline: false, if-color: false)[github.com\/adrianlegaspi]],
)


== Cover Letter

Dear Confiz Hiring Team,

I am applying for the Software Engineer Level III - React JS position. With more than nine years of experience building production software, I bring direct experience with React, TypeScript, JavaScript, SCSS, Node.js, AWS, and CI\/CD.

Most recently, I was the sole frontend engineer on a 15-person team, building a React and TypeScript dashboard that consolidates security findings across a Viasat platform used by 4,000+ internal users. I worked closely with backend engineers to turn complex requirements into a maintainable production application.

I have also led a five-engineer team building an AI-enabled ERP product and delivered full-stack applications for fintech, legal, and public-safety users. Across these projects, I have integrated frontend systems with APIs, improved delivery workflows, and owned features from requirements through production.

Confiz's focus on collaborative problem solving, application quality, and maintainable React systems fits how I work. I would welcome the opportunity to contribute to your team.

Adrian Legaspi
