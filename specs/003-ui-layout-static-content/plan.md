# Implementation Plan: Landing Page UI Layout & Static Content Sections

**Branch**: `003-ui-layout-static-content` | **Date**: 2026-07-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-ui-layout-static-content/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Build the frontend package's first real page: a single static-content résumé
page (Hero, Experience placeholder, Tech Stack, combined
Certifications/Education, Contact/footer) laid out per
`docs/visual-direction.md`, with two client-side toggles (theme, language)
whose interaction rules are read-model-simple (persisted choice > OS
preference > default) and must survive a page reload with no flash of the
wrong theme. The page is built with Astro (chosen this session — see
`research.md` #1), which by default emits zero JavaScript for static markup
and only ships small islands for the two toggles, matching the spec's
near-zero-motion, "sober document, not app" requirements (FR-011, FR-016)
with the least runtime weight. All content required to be real (Tech Stack,
Certifications, Education) and all content required to be placeholder
(Experience, hero summary) is authored as typed static data modules — never
sourced from `resume.json` in this feature (spec Assumptions), keeping the
`schema`/`pipeline` packages untouched. Theme/language resolution and the
static content itself are the only "business logic" this feature has; both
are isolated in framework-free `lib/`/`data/` modules per Constitution
Principles I–II, with `node:test` covering their rules (Principle IV),
consistent with `pipeline`'s and `schema`'s existing testing approach.

## Technical Context

**Language/Version**: TypeScript 5.7 (`strict`, `NodeNext`, per the existing
`tsconfig.base.json`, unchanged), Node.js >= 22.13 (per root `package.json`
`engines`, unchanged).

**Primary Dependencies**: `astro` (new — the chosen framework/build tool,
`research.md` #1) for static-first page rendering and the two interactive
islands (theme/language toggles). `@fontsource`/`@fontsource-variable`
packages (new — self-hosted Space Grotesk, Space Mono, Silkscreen, per
`research.md` #3) so the "no third-party CDN" requirement (FR-018,
visual-direction decision 17) is met without a manual font-subsetting
pipeline. The existing `schema` workspace dependency (already listed in
`frontend/package.json`) is **not** imported by this feature — Experience and
the hero summary use local placeholder data (spec Assumptions), not
`resume.json`; `schema` stays a dormant dependency until the future
real-data feature.

**Storage**: N/A for content — all Tech Stack/Certifications/Education/
Experience-placeholder content is authored as typed TypeScript data modules
committed in `frontend/src/data/`, not fetched or read from any file/API at
build or run time. Browser `localStorage` is used client-side, read/written
only through the wrapped, failure-tolerant helpers in `lib/theme.ts` and
`lib/language.ts` (FR-015, SC-006; Edge Cases' "storage disabled/cleared"
case).

**Testing**: Node's built-in test runner (`node:test` + `node:assert/strict`)
— the same choice already made in `pipeline` and `schema` (`research.md` #2)
— covering the two resolution-logic modules (`lib/theme.ts`,
`lib/language.ts`: persisted-value / OS-preference / default precedence, and
graceful fallback when storage access throws) and the static content data
modules (exact item/category counts and names for Tech Stack, exact
certification names/dates, exact education text, exactly-three placeholder
Experience entries with one current tick) — i.e., every rule from spec
FR-003, FR-005, FR-006, FR-007, FR-014, FR-015 that is expressible as a pure
assertion. Visual/CSS conformance (square corners, hairlines, no shadows,
spacing caps, contrast, hover-only accent) is not unit-testable behavior
under Constitution Principle IV's "unit of behavior" scope — it is verified
manually via `quickstart.md`, consistent with how the spec itself frames
these as acceptance scenarios, not measurable-outcome logic.

**Target Platform**: Static site — Astro's static output (HTML/CSS + two
small island `<script>` bundles), built via `astro build`, served from any
static host. The specific hosting platform remains the repo's own
"Open/deferred" item (`docs/architecture-decisions.md`) and is out of scope
here; this feature's validation target is `astro dev` / `astro build` +
`astro preview` run locally.

**Project Type**: Web application — single existing workspace package
(`frontend/`) inside the pnpm monorepo (`docs/architecture-decisions.md`
decision 1). No new workspace package is added.

**Performance Goals**: N/A beyond what Astro's zero-JS-by-default output
already guarantees for a page this size (SC-001's "visible without
scrolling" is a layout requirement, not a load-time budget); the spec sets
no numeric performance target.

**Constraints**: No third-party runtime CDN for icons or fonts (FR-018;
visual-direction decisions 4, 17) — icons and fonts are committed,
self-hosted assets. No `border-radius`, no `box-shadow`, no scroll-triggered
or parallax motion anywhere (FR-009, FR-011) — only ~120–150ms hover/focus
color transitions, and the theme swap itself is instant with no transition
(FR-016). Section-to-section gaps hard-capped at 64px (≥768px) / 48px
(<768px) (FR-010, FR-013). Accent-colored text never below 15px and never on
a tinted background (visual-direction decision 8) — enforced as authored CSS,
not runtime logic.

**Scale/Scope**: One page, five sections, 43 unique Tech Stack items across 8
categories, 6 certification badges, 2 education entries, exactly 3 placeholder
Experience entries (clarified this session), 2 languages (EN/PT — PT reuses
EN strings for now per spec Assumptions) × 2 themes (light/dark).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Result |
|---|---|---|
| I. Layered Architecture | `lib/theme.ts` and `lib/language.ts` expose pure resolution functions that take explicit inputs (stored value, OS-preference signal) and return a resolved value — no direct `window`/`document`/`localStorage` reference inside the pure logic. Astro components and the two tiny island `<script>`s are the only places that touch the DOM/`localStorage`/`matchMedia`, and they depend inward on `lib/`'s and `data/`'s types, never the reverse. | PASS |
| II. Isolated Business Logic | The only two "what should happen" decisions in this feature — theme/language resolution precedence, and what the static content actually contains — live in `lib/` and `data/`. `.astro` components only map that data to markup; no conditional content logic is written inline in a template. | PASS |
| III. Error as Value | `lib/theme.ts`/`lib/language.ts` wrap every `localStorage`/`matchMedia` access and return an explicit fallback (OS preference, or the default language) instead of letting a `SecurityError`/thrown exception (storage disabled/cleared, spec Edge Cases) propagate into the island script or the page. | PASS |
| IV. Test-Driven Development | Every resolution rule and every static content list gets a `node:test` case (see Technical Context > Testing) written alongside its implementation task. | PASS (enforced during Tasks/Implementation) |
| V. Simplicity | Astro chosen specifically because it ships ~zero JS for the ~all-static page this spec describes, avoiding a full SPA framework's runtime/state-management weight for two toggles; `node:test` reused instead of adding Vitest/Jest; `@fontsource` packages reused instead of a hand-rolled subsetting pipeline; no state-management library — two toggles are plain `localStorage` reads/writes behind pure functions. | PASS |
| VI. Technology Agnosticism | Governs the Constitution document itself, not this Plan — unaffected by this Plan's technology choices. | PASS (N/A to Plan content) |

No violations — Complexity Tracking is not needed.

**Post-design re-check (after Phase 1)**: `data-model.md` and `contracts/`
introduce exactly the layering described above — typed static data modules,
two pure resolution functions, and a documented `localStorage`
key/`<html>`-attribute contract shared by the bootstrap script, the two
island components, and the CSS token layer — with no additional dependency,
cross-layer coupling, or untested behavior. Gates still PASS unchanged.

## Project Structure

### Documentation (this feature)

```text
specs/003-ui-layout-static-content/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── content-data.md
│   └── theme-language-state.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

This feature builds out the previously-empty `frontend/` workspace package
(`docs/architecture-decisions.md` decision 1) inside the existing pnpm
monorepo. No new workspace package is added; `schema/` and `pipeline/` are
untouched.

```text
frontend/
├── package.json                  # UPDATED — adds astro, @fontsource(-variable) packages, dev/build/preview/test scripts
├── astro.config.mjs               # NEW — Astro project config (static output, no SSR adapter)
├── tsconfig.json                   # existing — Astro's own base config extended, unchanged intent
├── tsconfig.test.json               # NEW — extends tsconfig.base.json for tests/, mirrors schema's/pipeline's pattern
├── public/
│   ├── fonts/                        # NEW — self-hosted Space Grotesk/Space Mono/Silkscreen (via @fontsource)
│   ├── icons/                         # NEW — self-hosted monochrome SVGs (tech stack + hero core-stack + monogram-adjacent), recolored via currentColor
│   └── badges/                        # NEW — real provider certification badge images (AWS, Databricks, dbt)
├── src/
│   ├── pages/
│   │   └── index.astro                 # NEW — assembles the five sections in order (US1 scenario 3)
│   ├── components/
│   │   ├── Header.astro                 # NEW — monogram (sticky post-hero) + outline "Download CV" (FR-017)
│   │   ├── Hero.astro                    # NEW — FR-002
│   │   ├── Experience.astro               # NEW — 3 placeholder entries, timeline rail (FR-007)
│   │   ├── TechStack.astro                 # NEW — 8 categories, 43 items (FR-003, FR-004)
│   │   ├── CertificationsEducation.astro    # NEW — one combined section, Certifications sub-group then Education sub-group (FR-005, FR-006)
│   │   ├── ContactFooter.astro               # NEW — repeats hero contact row (visual-direction decision 6)
│   │   ├── ThemeToggle.astro                  # NEW — island: LIGHT/DARK (FR-014, FR-015, FR-016)
│   │   └── LanguageToggle.astro                # NEW — island: EN/PT (FR-014)
│   ├── data/
│   │   ├── tech-stack.ts                        # NEW — 8 categories × exactly-listed items (FR-003)
│   │   ├── certifications.ts                     # NEW — 6 entries (FR-005)
│   │   ├── education.ts                           # NEW — 2 entries (FR-006)
│   │   ├── experience-placeholder.ts               # NEW — exactly 3 fictional entries (FR-007, spec Assumptions)
│   │   ├── contact-links.ts                        # NEW — 2–3 placeholder contact links (spec Assumptions)
│   │   └── i18n/
│   │       ├── en.ts                                # NEW
│   │       └── pt.ts                                 # NEW — reuses `en.ts` string values (spec Assumptions)
│   ├── lib/
│   │   ├── theme.ts                                  # NEW — pure resolve/persist functions (FR-015)
│   │   └── language.ts                                # NEW — pure resolve/persist functions (FR-014)
│   └── styles/
│       ├── tokens.css                                  # NEW — color (light/dark), spacing scale, type scale custom properties (visual-direction decisions 5, 8, 9, 18)
│       └── global.css                                   # NEW — resets, font-face declarations, base typography
└── tests/
    ├── lib/
    │   ├── theme.test.ts                                 # NEW
    │   └── language.test.ts                               # NEW
    └── data/
        ├── tech-stack.test.ts                              # NEW
        ├── certifications.test.ts                           # NEW
        ├── education.test.ts                                 # NEW
        └── experience-placeholder.test.ts                     # NEW
```

**Structure Decision**: Single-package change within the existing monorepo,
scoped entirely to `frontend/` (mirrors how 002 scoped entirely to
`pipeline/`). Within the package, `data/` and `lib/` are the framework-free
domain layer (Constitution Principle I: no Astro/DOM imports), `components/`
and `pages/` are the interface layer that consumes them, and `public/`
holds the self-hosted binary assets (fonts, icons, badges) referenced by
both layers. No new workspace package; `schema/` and `pipeline/` unchanged.

## Complexity Tracking

*No entries — Constitution Check reported no violations.*
