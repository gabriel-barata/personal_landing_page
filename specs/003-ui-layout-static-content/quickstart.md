# Quickstart: Landing Page UI Layout & Static Content Sections

Validates this feature end-to-end against spec.md's User Stories and Success
Criteria. Run after the tasks in `tasks.md` are implemented.

## Prerequisites

- Node.js >= 22.13, pnpm (per root `package.json`).
- From repo root: `pnpm install`.

## Automated checks

```bash
pnpm --filter frontend typecheck   # tsc --noEmit
pnpm --filter frontend test        # node:test — lib/ and data/ (data-model.md, contracts/)
pnpm --filter frontend build       # astro build — also proves no runtime CDN dependency compiles clean
```

All three MUST pass before manual validation below.

## Manual validation

Run `pnpm --filter frontend dev` and open the printed local URL. Also run
`pnpm --filter frontend preview` against the `build` output at least once —
some of what's being checked (no CDN calls, real static asset resolution)
only shows up against the built output, not the dev server.

### US1 — Résumé at a glance (SC-001)

1. At a viewport ≥768px wide, confirm — with **no scrolling** — you can see:
   monogram + name, role line, summary, location/experience metadata row,
   core stack row, and 2–3 contact links.
2. Confirm no rounded corners, no box shadows, no photo anywhere on the
   page (FR-009).
3. Scroll down: the monogram becomes pinned top-left (sticky). Confirm
   section order top-to-bottom: Hero, Experience, Tech Stack,
   Certifications/Education (one combined section), Contact/footer.

### US2 — Tech Stack (SC-002)

1. Open browser devtools, count every item under every Tech Stack category
   against `contracts/content-data.md`'s table — 8 categories, 43 unique
   items total, "Snowflake" appearing only once (under Data Tools).
2. Hover an item: icon+label turn accent-colored; unhover: back to ink.
3. Confirm no filled badges, no brand-colored logos at rest (monochrome
   only).
4. Resize to trigger the "Databases & Storage" (9 items) category wrapping
   — confirm items wrap onto additional lines, no truncation/overflow.

### US3 — Certifications (SC-003)

1. Scroll to the Certifications sub-group (first sub-group of the combined
   Certifications/Education section). Confirm all 6 entries from
   `contracts/content-data.md`, names and MM/YYYY dates exact.
2. Confirm badges render grayscale at rest, full color on hover, in
   uniform fixed-size hairline-framed slots regardless of native badge
   proportions.
3. Temporarily rename/break one badge image path and reload: confirm the
   slot still holds its fixed size/frame with no layout collapse (Edge
   Cases).

### US4 — Education (SC-004)

1. Scroll past Certifications into the Education sub-group (same combined
   section). Confirm both entries match `contracts/content-data.md` exactly,
   including the MLOps pipeline note on the Information Systems entry.

### US5 — Experience placeholder shape

1. Scroll to Experience: confirm exactly 3 placeholder entries, most-recent
   first, each with role/company/dates/2–3 line summary.
2. Confirm only the first (current) entry has a solid accent-filled square
   tick; the other two have outline ticks.
3. Confirm no fade-in/slide-in/progress-fill animation while scrolling past
   this section.

### US6 — Language/theme toggles (SC-006, SC-007)

1. In the top-right cluster, click the inactive language label: it becomes
   ink-colored/active, the previous one becomes support-gray, with no full
   page reload. (Copy will read identically in EN/PT per spec Assumptions —
   confirm the *toggle mechanism* works, not translated content.)
2. Click the inactive theme label: palette swaps **instantly**, no
   crossfade (open devtools' Performance/rendering tools if you want to
   confirm no transition is applied to root-level color custom properties).
3. Set OS to dark mode with no manual choice ever made on this page (clear
   `localStorage` first): reload, confirm the page opens in dark mode.
4. Manually pick a theme, reload the page (or close/reopen the tab):
   confirm the manual choice persists rather than reverting to the OS
   setting.
5. Disable/clear storage (e.g. devtools → Application → Clear storage, or a
   private/incognito window with storage blocked) and reload: confirm the
   page still renders, following OS preference for theme and defaulting to
   English for language (Edge Cases).

### Responsive (SC-005)

Resize the viewport from 320px up through a standard desktop width (or use
devtools device toolbar) and confirm at every width: no horizontal scroll,
no clipped/overlapping content. Crossing 768px: Experience entries switch
from side-by-side to date-above-role/company; hero metadata row wraps to two
lines instead of truncating; section gaps drop from 64px to 48px cap.

### Motion (SC-007)

Scroll through the whole page once, watching for any scroll-triggered
reveal/fade-in, parallax, hover-lift, shadow-on-hover, or animated timeline
fill — none should occur anywhere. The only motion allowed is the short
(~120–150ms) hover/focus color transitions on interactive elements.
