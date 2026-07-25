# Phase 0 Research: Landing Page UI Layout & Static Content Sections

## 1. Frontend framework: Astro

**Decision**: Astro (`astro` + TypeScript), static output, no SSR adapter.

**Rationale**: `docs/architecture-decisions.md` listed "Frontend framework
choice" as the last open/deferred item — this is the first feature that
needs one. The spec and `docs/visual-direction.md` describe a page that is
almost entirely static markup with exactly two pieces of client interaction
(the `EN`/`PT` and `LIGHT`/`DARK` toggles) and an explicit near-zero-motion,
"sober document, not app" brief (FR-011, FR-016; visual-direction Principles
and decision 10). Astro's islands architecture ships zero JavaScript for
static content by default and only hydrates the two toggle components —
this is the framework whose default output shape already matches the
product brief, rather than one that requires disciplined restraint (e.g. a
full SPA framework) to avoid becoming more "app" than "document." It also
fits Constitution Principle V (Simplicity): no client-side router, no global
state library, no hydration decisions to make for the ~95% of the page that
never changes after load. Confirmed with the user this session (the
architecture decision was open, not something to infer silently).

**Alternatives considered**:
- **React + Vite**: most familiar/largest ecosystem, but ships a full
  component-runtime for a page that needs almost no client-side reactivity;
  every static section would still be React output, undercutting Simplicity.
- **Svelte + Vite**: compiles away at build time, but Astro achieves the
  same near-zero-runtime outcome while providing an even smaller
  interactive surface (only the two toggles hydrate at all, vs. a full
  Svelte app mounting for the whole page).
- **Vanilla TypeScript + Vite (no framework)**: the absolute leanest
  runtime, but pushes componentization of eight repeated Tech Stack
  categories, six certification badge slots, and a three-entry timeline
  onto hand-written DOM code — Astro's `.astro` component templates give
  the same static-first output with far less hand-rolled markup generation.

## 2. Testing approach: reuse `node:test`

**Decision**: Node's built-in test runner (`node:test` + `node:assert/strict`)
for `lib/theme.ts`, `lib/language.ts`, and the `data/*.ts` static content
modules. No new test framework dependency (e.g. Vitest, Astro's experimental
container API) is added for this feature.

**Rationale**: The testable behavior in this feature is confined to
framework-free TypeScript (resolution logic, static data shape/content) —
none of it requires rendering an `.astro` component to verify. `pipeline`
and `schema` already use `node:test` for the same kind of pure-logic
testing; reusing it keeps the whole monorepo on one test runner (Simplicity)
instead of introducing Vitest solely for this package. If a future feature
needs to assert on actual rendered Astro output, that decision can be made
then, scoped to that need.

**Alternatives considered**:
- **Vitest (+ `@astrojs/test`/container API)**: the more common Astro
  pairing and would be justified if this feature needed to assert on
  rendered component HTML — it doesn't, since Constitution Principle II
  keeps all decision logic out of the `.astro` templates. Revisit if a
  later feature needs component-level assertions.

## 3. Fonts: self-hosted via `@fontsource`

**Decision**: Use `@fontsource`/`@fontsource-variable` npm packages for
Space Grotesk, Space Mono, and Silkscreen, copying their `latin`+`latin-ext`
subset `woff2` files into `frontend/public/fonts/` (or referencing the
package's own files directly, whichever keeps the build simplest) and
declaring `@font-face` in `src/styles/global.css` with `font-display: swap`.

**Rationale**: `docs/visual-direction.md`'s "Fonts" section already commits
to self-hosted, `latin`+`latin-ext`-subset fonts with `font-display: swap` —
`@fontsource` packages ship pre-subset, self-hostable font files under this
exact convention with no manual subsetting pipeline (no external tool
dependency, no license-compliance research needed per font, all three
typefaces are already published as `@fontsource` packages). This satisfies
FR-018/decision 17's "no third-party CDN at runtime" with the least tooling.

**Alternatives considered**:
- **Google Fonts CDN `<link>`**: rejected outright — direct violation of
  FR-018 and the explicit "no external network dependency on page load" call
  in visual-direction decision 4 (which the doc applies to icons and, by the
  same rationale in the Typography section, fonts).
- **Manually download + subset with a tool (e.g. `fonttools`)**: works, but
  is an extra one-off pipeline this project doesn't need when
  `@fontsource` already publishes the same output.

## 4. Icons: self-hosted monochrome SVGs, sourced per-item at implementation time

**Decision**: Source each Tech Stack / hero core-stack icon as a single-path
monochrome SVG (Simple Icons for branded tools/platforms; Tabler Icons as a
fallback for generic, non-brand concepts with no Simple Icons entry — e.g.
generic "database"/"cloud" glyphs where a specific list item has no brand
mark), commit the raw SVG files under `frontend/public/icons/`, and recolor
via CSS (`fill: currentColor` on the inline `<svg>` or `mask`-based
recoloring for `<img>`-embedded SVGs) rather than shipping brand-colored
originals. Which exact icon backs each of the 43 Tech Stack items and the 5
hero core-stack items is a content-acquisition detail resolved per-item
during Implementation (Tasks phase), not an architectural decision — the
mechanism (self-hosted, single source library preference, `currentColor`
recoloring) is fixed here so every task follows the same pattern.

**Rationale**: Directly matches visual-direction decision 4's "Icon sourcing
(required, not optional)" paragraph, which already names Simple Icons/Tabler
as the reference sets and mandates commit-into-repo, CSS-recolored SVGs with
no runtime CDN fetch.

**Alternatives considered**:
- **Icon font (e.g. a custom icon font build)**: adds a font-build step for
  no benefit over individually committed SVGs at this scale (43 items).
- **React/Astro icon-library package that fetches at runtime**: rejected —
  violates the no-CDN-fetch requirement outright.

## 5. Certification badge images: real assets acquired at implementation time

**Decision**: Each of the 6 certification badges is a real, provider-issued
badge/logo graphic (per spec Assumptions: "each provider's publicly
recognizable official badge/logo artwork" as a stand-in for an
account-specific credential image), committed as a static image file under
`frontend/public/badges/`, referenced by a stable per-certification slug
defined in `data/certifications.ts` (see `data-model.md`). Sourcing the
actual image files is a content-acquisition task, not a design decision, and
happens during Implementation.

**Rationale**: Matches FR-019 ("real provider-issued graphics, not generic
text tags or recolored icons") and visual-direction decision 14 exactly; the
Plan only needs to fix the contract each badge slot expects (a real image
file at a known path, grayscale-at-rest/full-color-on-hover via CSS
`filter`), which `contracts/content-data.md` and `data-model.md` define.

## 6. Theme/language bootstrap: synchronous inline script, no FOUC

**Decision**: A small, render-blocking inline `<script>` in `<head>` (before
any stylesheet that depends on it) reads `localStorage` (via the same
failure-tolerant helper as the toggle islands) and `matchMedia
('(prefers-color-scheme: dark)')`, resolves the theme using the precedence
persisted-value → OS-preference → light default (FR-015), and sets
`document.documentElement.dataset.theme` synchronously — before first paint
— so CSS custom properties keyed off `[data-theme="dark"]` apply
immediately. The `LIGHT`/`DARK` island (`ThemeToggle.astro`) only needs to
flip that same attribute + persist the override; it never has to "animate
in" a correct theme after an initial wrong-theme flash.

**Rationale**: FR-016 requires the theme switch itself to be instant with no
transition — the harder failure mode to avoid is a flash of the *wrong*
theme on initial load (OS in dark mode, page briefly paints light before JS
runs), which an inline blocking script — a standard, well-established
pattern for OS-preference-aware theming — eliminates. The same
resolve-with-precedence function is reused by `lib/theme.ts` for both the
bootstrap script and the toggle island, so the precedence rule is defined
exactly once (Constitution Principle II).

**Alternatives considered**:
- **CSS-only `prefers-color-scheme` media query, no `localStorage`
  override**: fails FR-015's persistence-across-reloads requirement outright
  (SC-006) — a manual choice must survive a reload without reverting to OS
  default.
- **Resolve theme only after hydration (no inline bootstrap script)**:
  reintroduces the wrong-theme-flash problem the inline script exists to
  avoid.

## 7. Language content mechanism: dictionary keyed by language, PT mirrors EN for now

**Decision**: `src/data/i18n/en.ts` holds every user-facing string as a typed
dictionary; `src/data/i18n/pt.ts` imports the same values (re-exporting
`en`'s strings under the `pt` key) rather than leaving Portuguese
unimplemented. Components read strings through a single lookup keyed by the
resolved language (`lib/language.ts`), so the `EN`/`PT` toggle is fully
functional end-to-end (FR-014, US6) even though the actual Portuguese
translations aren't supplied yet (spec Assumptions).

**Rationale**: Building the lookup mechanism now — with `pt` intentionally
equal to `en` — means the future follow-up that supplies real Portuguese
copy is a content-only change to `pt.ts` (no component or logic changes),
consistent with how the spec's Assumptions section frames both PT copy and
real Experience/About content as pure follow-up content swaps.

## Architecture-decisions.md follow-up

`docs/architecture-decisions.md`'s "Open / deferred" list included "Frontend
framework choice." That item is now resolved (decision #1 above) and is
being recorded back into that document as part of this Plan, consistent with
how every other repo-wide architecture decision there is tracked (see the
doc's own revision-history convention).
