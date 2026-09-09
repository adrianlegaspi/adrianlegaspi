# AGENTS.md — AI Agent Instructions for legaspi

This file is the contract for all AI coding agents (Claude Code and any other AI
assistant) working in this repository. Read it before starting any task.

---

## Mandatory reference: the master spec

`legaspi.dev` is an interactive 3D developer portfolio. The authoritative product
requirements live in the master spec:

**[`docs/specs/legaspi_dev_master_spec.md`](docs/specs/legaspi_dev_master_spec.md)**

That file is an **index**. The content is split into topic files under
[`docs/specs/master/`](docs/specs/master/). Read the topic file for the area you are
working on — do not load the whole spec, and do not implement from memory of it.

Two files are mandatory before any implementation work:

- [`master/14-ai-guardrails.md`](docs/specs/master/14-ai-guardrails.md) — 17 hard rules
  (§50). These are prohibitions, not suggestions.
- [`master/01-product.md`](docs/specs/master/01-product.md) — vision, goals, non-goals
  (§1–§4). Every decision is judged against these.

Consult by area:

| Area | Spec file |
|------|-----------|
| Scope — is this feature in or out? | [01](docs/specs/master/01-product.md) §4, [13](docs/specs/master/13-delivery.md) §45 |
| Stack, libraries, repo layout | [02](docs/specs/master/02-stack-and-structure.md) |
| Project content, `project.json`, i18n, validation | [03](docs/specs/master/03-content-system.md) |
| The seven projects, City Hall, construction site | [04](docs/specs/master/04-project-registry.md) |
| Case-study template, private/NDA policy | [05](docs/specs/master/05-case-studies.md) |
| City grid, assets, visual direction, debug mode | [06](docs/specs/master/06-city-world.md) |
| Camera, pan/zoom, hover/selection | [07](docs/specs/master/07-camera-and-interaction.md) |
| Panels, responsive behavior, header, UI copy | [08](docs/specs/master/08-ui.md) |
| Time-of-day presets | [09](docs/specs/master/09-environment.md) |
| State model, routing, SEO, analytics | [10](docs/specs/master/10-state-routing-seo.md) |
| Accessibility, reduced motion, fallbacks | [11](docs/specs/master/11-accessibility-and-fallback.md) |
| Performance targets, quality presets | [12](docs/specs/master/12-performance.md) |
| MVP definition, phase order, acceptance tests | [13](docs/specs/master/13-delivery.md) |

The spec is **product requirements, not permission to add adjacent features**. If a task
conflicts with the spec, flag the conflict and ask before proceeding — see §1 below.

The spec's own Definition of Done ([13](docs/specs/master/13-delivery.md) §48) applies in
addition to the one at the end of this file.

---

## Prime directives

### 1. Never assume — ask

If a fix, feature, or implementation is not **100% clear**, stop and ask the user
before writing code. Do not guess intent, do not pick "the likely option", do not
implement a plausible interpretation and call it done.

Ask when any of these is true:

- The requirement, acceptance criteria, or expected behavior is ambiguous or incomplete.
- The root cause of a bug is not confirmed. Never patch a symptom and report it fixed.
- Two readings of the request would produce materially different work.
- The task conflicts with an existing convention, an existing design, or this file.
- Scope is unclear — whether something belongs in this change or a later one.

One clarifying question before starting is always cheaper than reworking a finished
feature. When blocked on one part, finish everything that does not depend on the
answer, then ask.

### 2. Always use the `caveman` and `ponytail` skills

Both skills are active on **every** task in this repo, not only when requested:

- **`ponytail`** — the laziest solution that actually works. Question whether the task
  needs to exist at all (YAGNI). Standard library before custom code, native platform
  features before dependencies, one line before fifty. No speculative abstraction, no
  config for a single call site, no wrapper that only forwards.
- **`caveman`** — ultra-compressed communication. Terse output, full technical accuracy.
  No filler, no pleasantries, no hedging, no restating the request back. Code blocks and
  quoted errors stay verbatim.

Default intensity is `full` for both. They are off only if the user says so explicitly.

For commit messages, use the **`caveman-commit`** skill to generate the text (terse,
Conventional Commits, why-over-what, no AI attribution). It only produces the message —
it does not stage files or run `git commit`.

### 3. Tests: not by default

Do **not** create unit tests as part of routine work. Write tests only when:

- Fixing a confirmed bug — ship a regression test that fails before the fix and passes
  after it.
- Building an implementation from scratch, where there is no existing behavior to lean on.
- The user explicitly asks for tests.

When tests are warranted, keep them **minimal and readable**: one behavior per test,
descriptive names, no shared mutable fixtures, no mock scaffolding larger than the code
under test. Prefer three sharp tests over thirty generated ones.

Do not proactively run the full suite, formatters, or linters "to be safe" — run them
when asked or when the change requires it.

### 4. File size limit: 1000 lines

No file may exceed **1000 lines**. Approaching that limit is a design signal, not a
formatting problem: split along real seams — one responsibility per file — rather than
cutting arbitrarily at line 1000 or spilling leftovers into a `utils` dump.

Before splitting a file you did not write, confirm the seam with the user if it is not
obvious. Do not split a file as a drive-by while doing unrelated work.

### 5. Read before you edit

Inspect the existing file, module, or scene and match its conventions — naming, comment
density, error handling, idiom — before changing it. Code you add should read like the
code already there. Do not reformat, reorder, or "modernize" untouched lines.

### 6. Reuse before you add

Search the repo for an existing helper, type, or pattern before writing a new one.
Duplicated logic and a second way to do the same thing are both defects.

Adding a dependency is a decision for the user, not a default. Justify it (what it
replaces, its size, its maintenance status) and ask before installing.

### 7. Stay inside the request

Deliver the requested scope — do not quietly narrow it, widen it, or transform it.
Unrelated improvements you spot get mentioned, not committed. If part of the scope turns
out to be blocked, complete every other part and say plainly what was left out and why.

### 8. Report faithfully

If tests fail, say so and include the output. If a step was skipped, say it was skipped.
If something is unverified, label it unverified. When work is done and checked, state it
plainly without hedging. Never describe an outcome you did not observe.

---

## Working conventions

| Rule | Detail |
|------|--------|
| One logical change per commit | Conventional Commits format, message from `caveman-commit` |
| No secrets in the repo | Credentials, tokens, and keys live in `.env` (gitignored); commit `.env.example` |
| No generated artifacts committed | Build output, caches, and lockfile churn stay out of diffs unless the toolchain requires them |
| No commented-out code | Delete it; git history is the archive |
| Config files are not hand-edited | If a tool owns a file, change it through the tool |
| Commit and push only when asked | Never push to the default branch; branch first |
| Destructive commands need confirmation | Inspect the target before deleting or overwriting |
| Git hooks are never bypassed | No `--no-verify`. If a hook fails, fix the cause |

---

## Git hooks

Hooks live in [`.githooks/`](.githooks/) as plain shell scripts — no dependencies. Enable
them once per clone:

```sh
git config core.hooksPath .githooks
```

| Hook | What it enforces |
|------|------------------|
| [`commit-msg`](.githooks/commit-msg) | Conventional Commits header; lowercase subject; no trailing period; warns over 72 chars. Merge/revert/fixup commits pass through |
| [`pre-commit`](.githooks/pre-commit) | No merge-conflict markers; no `.env` committed; warns on large non-asset files; then `prettier`, `eslint`, `tsc --noEmit` on staged files |

Toolchain steps are **skipped, not failed**, when a tool is not in `node_modules/.bin` — so
the hooks work before `npm install` and tighten automatically once the stack is installed.

Never bypass a hook with `--no-verify`. Fix what it reports.

---

## Definition of done

A change is done when:

1. It matches the agreed intent — with no unresolved ambiguity silently assumed away.
2. `caveman` and `ponytail` were applied: the solution is the smallest one that works.
3. No file exceeds 1000 lines.
4. Tests exist only where §3 requires them, and they pass.
5. The commit message came from `caveman-commit` and passes the `commit-msg` hook.
6. What was done, skipped, or left unverified is stated plainly to the user.
