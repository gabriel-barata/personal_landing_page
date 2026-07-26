# Implementation Plan: Experience Detail Panel (Terminal-Style Overlay)

**Branch**: `004-experience-detail-panel` | **Date**: 2026-07-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-experience-detail-panel/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Each Experience entry gets a "Details" trigger that opens a fixed-height,
terminal-styled, fully opaque overlay (position title, industry, team size,
lead status, task/achievement bullets, and a contact CTA) covering the
timeline area, per `docs/visual-direction.md` decision 21. Technical
approach: all panel content is server-rendered per entry (Astro `.map()`,
same pattern as the timeline itself) and toggled purely by `hidden`/`inert`
attribute changes in a small inline script — no new dependency, no client
templating, no schema/pipeline changes. Focus is trapped in the open panel
and restored to its trigger on close via a hand-written keydown handler,
with the wrap-around index math extracted to a unit-tested pure function
(`lib/experience-panel.ts`), matching the existing `lib/theme.ts` split
between tested logic and thin DOM glue.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js >= 22.13 (existing `frontend` package — unchanged)

**Primary Dependencies**: Astro 5 (existing, static output). No new runtime or dev dependency is added by this feature.

**Storage**: N/A — panel open/closed state is transient, in-memory script state only; not persisted to `localStorage` (contrast with `resume:theme`/`resume:lang`, which are — `contracts/panel-interaction.md`).

**Testing**: `node:test` via `tsx --test` (existing `frontend` test runner) — pure logic in `lib/experience-panel.ts` and the extended `data/experience-placeholder.ts` fields.

**Target Platform**: Static site, evergreen browsers — this feature's use of the `inert` attribute (`research.md` #2) is supported by all current evergreen browsers; no legacy-browser support is targeted anywhere else in this codebase either.

**Project Type**: Web — frontend-only change within the existing `frontend/` Astro package. No `schema` or `pipeline` package changes (spec Assumptions, Out of Scope).

**Performance Goals**: Instant open/close with no perceptible delay or transition (SC-001, FR-004); zero added JS payload beyond a small inline script (no new dependency).

**Constraints**: No drop shadow or dimming scrim (FR-008); no fade/slide/scale transition (FR-004); anchored to the existing 900px content column (FR-005); reuses the single existing 768px breakpoint, no new breakpoints (FR-016); no `schema`/`pipeline` changes (spec Assumptions).

**Scale/Scope**: 3 Experience entries (fixed count, unchanged from feature 003); one new sub-component (`ExperienceDetailPanel.astro`), one extended component (`Experience.astro`, inline script), one new `lib` module, one extended data file, one new icon asset (`close.svg`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Layered Architecture** — PASS. The one piece of decidable logic this
  feature has (focus-index wrap-around math) is isolated in
  `lib/experience-panel.ts`, imported by the Astro component's script; the
  component itself only wires DOM events to it and to plain attribute
  toggles. Nothing in `frontend/src` imports from `pipeline` or vice versa
  — unaffected by this feature.
- **II. Isolated Business Logic** — PASS. The only "what should happen"
  question in this feature (which focus index comes next on Tab/Shift+Tab)
  lives in `lib/experience-panel.ts`, not inline in the `.astro` script.
  Which fields render and in what order is fixed, static markup (a "how do
  I show this" concern), matching how `Experience.astro` already renders
  the timeline.
- **III. Error as Value** — PASS (trivially — no fallible I/O is introduced;
  no network calls, no storage reads/writes, no parsing of untrusted input).
  DOM queries for focusable elements either find elements (static markup
  guarantees they exist) or the query is scoped to a panel that is, by
  construction, the one just made visible — no exception-prone path to
  translate into a `Result`.
- **IV. Test-Driven Development** — PASS, planned: `lib/experience-panel.ts`
  gets `tests/lib/experience-panel.test.ts` (index-wrap cases,
  `data-model.md`) written alongside it; the extended `ExperienceEntry`
  fields get assertions added to
  `tests/data/experience-placeholder.test.ts` (`contracts/content-data.md`).
  Both are Tasks-phase work items, not deferred.
- **V. Simplicity** — PASS. No new dependency (no focus-trap library, no
  modal library); reuses the native `inert` attribute instead of hand-built
  subtree-disabling bookkeeping (`research.md` #2); reuses the existing
  `Icon.astro` inlining mechanism for the new close icon (`research.md`
  #5); adds fields directly to the existing `ExperienceEntry` type instead
  of a second lookup entity (`research.md` #6).
- **VI. Technology Agnosticism** — PASS (N/A at Plan level by design — this
  section records Plan-level tech choices, which the Constitution
  explicitly delegates here rather than mandating itself).

No violations. Complexity Tracking table below is empty.

## Project Structure

### Documentation (this feature)

```text
specs/004-experience-detail-panel/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md          # Phase 1 output (/speckit-plan command)
├── contracts/
│   ├── content-data.md      # Literal content contract for the new detail fields
│   └── panel-interaction.md  # DOM/state contract for open/close/focus-trap behavior
├── checklists/            # Already exists (requirements checklist)
└── tasks.md               # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Experience.astro            # extended: renders "Details" buttons + panels, owns the open/close/focus-trap/inert script
│   │   ├── ExperienceDetailPanel.astro  # new: static markup for one entry's panel (title bar, echo line, metadata, TASKS, ACHIEVEMENTS, contact button)
│   │   └── Icon.astro                   # existing, unchanged — reused for the new close icon
│   ├── data/
│   │   └── experience-placeholder.ts    # extended: industry, teamSize, isLead, tasks, achievements per entry
│   └── lib/
│       └── experience-panel.ts          # new: nextFocusIndex (pure, unit-tested)
├── public/
│   └── icons/
│       └── close.svg                    # new: hand-built pixel-art X glyph
└── tests/
    ├── data/
    │   └── experience-placeholder.test.ts  # extended: new-field assertions (contracts/content-data.md)
    └── lib/
        └── experience-panel.test.ts        # new: nextFocusIndex cases (data-model.md)
```

**Structure Decision**: Single existing project (`frontend/`, the only
package this feature touches — no `schema`/`pipeline` changes). Follows the
established component/data/lib split already used by feature 003's
Experience section and theme/language toggles: static Astro markup in
`src/components`, a small extension to the existing placeholder data module
in `src/data`, and one new pure/unit-tested helper in `src/lib`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally left empty.
