# 05: Case Studies, Confidentiality & Positioning

Part of the [legaspi.dev Master Spec](../legaspi_dev_master_spec.md). Covers original sections §24–§28.

---

## 24. Project Case-Study Template

All project case studies follow a shared semantic template.

### Header

- title;
- company, when public;
- role;
- date/range;
- project category;
- confidentiality badge when applicable.

### Summary

One short paragraph explaining what the product/project was.

### The problem

Explain the meaningful problem.

Avoid marketing filler.

### What I did

Focus explicitly on Adrian's contribution.

Use concise bullets or short paragraphs.

### Technical highlights

Explain architecture, stack, decisions or interesting technical work.

Do not merely list technology logos.

### Outcome

Use measurable results when legitimately available.

Otherwise describe real operational/product outcomes.

### Games

Games use promotional copy: premise, play loop, highlights and availability.

Do not force product case-study headings such as The problem or What I did onto games.

### Media

For public projects:

- screenshots;
- videos;
- architecture diagrams;
- GitHub;
- live demo.

For private projects:

- no proprietary screenshots;
- no recreated proprietary screens pretending to be real;
- no confidential diagrams.

### Links

Possible:

- Live project
- GitHub
- Related public material

---

## 25. Private / NDA Project Policy

Private work must be represented as a **sanitized case study**, not as censored confidential material.

### Allowed pattern

Explain publicly safe information such as:

- organization, if disclosure is allowed;
- role;
- broad business context;
- responsibilities;
- publicly safe technologies;
- engineering problems in sufficiently abstract terms;
- public or approved outcomes.

### Do not publish

- internal screenshots;
- internal source code;
- internal URLs;
- private datasets;
- sensitive system architecture;
- proprietary workflows;
- names of internal systems unless public disclosure is known to be acceptable;
- numbers or metrics that are confidential.

### UI treatment

Use a clean label such as:

```text
Internal Project
```

or:

```text
Private / Confidential Work
```

Recommended disclosure:

> This is an internal product. Screenshots, proprietary implementation details, internal architecture and confidential data are intentionally not published.

The tone should be professional.

A small amount of humor elsewhere in the portfolio is fine, but confidentiality should not be presented as a joke about almost leaking information.

---

## 26. Project Media Strategy

Project media is optional per project.

The content model should support:

```json
{
  "media": [
    {
      "type": "image",
      "src": "...",
      "alt": "..."
    }
  ]
}
```

MVP does not require media for every project.

Private project cards must still look complete without screenshots.

The city building itself serves as the project's primary visual anchor.

This is a feature of the concept, not a workaround.

---

## 27. About / Professional Positioning

Primary identity:

# Adrian Legaspi

## Senior Software Engineer

The copy should establish:

- senior-level software engineering experience;
- full-stack web engineering capability;
- strong Node.js/backend experience;
- React/TypeScript frontend capability;
- architecture and technical leadership experience;
- modern AI integration/automation experience.

Avoid trying to fit every technology Adrian has ever touched into the hero.

The case studies provide evidence.

---

## 28. Contact Experience

Primary CTA:

> **Let's build something together.**

The construction site is the interactive representation.

Contact UI must support placeholders for:

- email;
- LinkedIn;
- GitHub;
- résumé.

The CTA should work both for:

- hiring;
- consulting/freelance conversations.

Do not split the experience into separate "recruiter" and "client" funnels for MVP.
