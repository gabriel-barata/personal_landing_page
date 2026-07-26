# Tasks: Experience Detail Panel (Terminal-Style Overlay)

**Input**: Design documents from `/specs/004-experience-detail-panel/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/content-data.md, contracts/panel-interaction.md, quickstart.md

**Tests**: Included — plan.md commits to TDD (Constitution Principle IV) for the two pure/data modules touched by this feature (`lib/experience-panel.ts`, `data/experience-placeholder.ts`). DOM glue (`Experience.astro`'s inline script) stays untested inline script, matching the existing `theme.ts`/`ThemeToggle.astro` split — no test tasks are generated for it.

**Organization**: Tasks are grouped by user story (spec.md priorities P1–P3) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)

## Path Conventions

Single project, frontend-only (plan.md Structure Decision — no `schema`/`pipeline` changes):

- `frontend/src/components/`, `frontend/src/data/`, `frontend/src/lib/`
- `frontend/public/icons/`
- `frontend/tests/data/`, `frontend/tests/lib/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: New assets this feature needs before any entry/content/behavior work begins

- [X] T001 Create `frontend/public/icons/close.svg` — hand-built pixel-art X glyph, single `<path>`, no baked-in `fill` (so `Icon.astro`'s `currentColor` injection applies), matching the existing self-hosted icons' viewBox convention (`research.md` #5, FR-010)

**Checkpoint**: Close icon asset exists and is renderable via `<Icon id="close" />`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Data model and pure logic that every user story's markup/behavior task depends on — MUST complete before Phase 3+

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Extend `ExperienceEntry` interface in `frontend/src/data/experience-placeholder.ts` with `industry: string`, `teamSize: string`, `isLead: boolean`, `tasks: string[]`, `achievements: string[]` (`data-model.md`)
- [X] T003 Populate the 5 new fields on all 3 existing entries (`senior-data-engineer`, `data-engineer`, `junior-data-engineer`) in `frontend/src/data/experience-placeholder.ts` with plausible-but-fictional content — each `tasks`/`achievements` array non-empty, achievements carrying a concrete metric per bullet, at least one entry `isLead: true` and at least one `isLead: false` (`contracts/content-data.md`, depends on T002)
- [X] T004 [P] Extend `frontend/tests/data/experience-placeholder.test.ts` with assertions for the new fields: every entry has non-empty `industry`/`teamSize`, every entry has `tasks.length >= 1` and `achievements.length >= 1`, at least one entry `isLead === true` and at least one `isLead === false` (`data-model.md` Validation rules, depends on T002 for types to compile)
- [X] T005 [P] Create `frontend/src/lib/experience-panel.ts` exporting `type FocusDirection = 1 | -1` and `function nextFocusIndex(current: number, count: number, direction: FocusDirection): number`, wrapping at both ends of `[0, count)` (`data-model.md`)
- [X] T006 [P] Create `frontend/tests/lib/experience-panel.test.ts` with the four cases from `data-model.md`: `nextFocusIndex(0, 3, -1) === 2`, `nextFocusIndex(2, 3, 1) === 0`, `nextFocusIndex(1, 3, 1) === 2` and `nextFocusIndex(1, 3, -1) === 0`, `nextFocusIndex(0, 1, 1) === 0` (depends on T005)

**Checkpoint**: `pnpm --filter frontend typecheck` and `pnpm --filter frontend test` pass with the extended data shape and `nextFocusIndex` fully covered — user story implementation can now begin

---

## Phase 3: User Story 1 - View extended role detail (Priority: P1) 🎯 MVP

**Goal**: Each Experience entry gets a "Details" trigger that opens a fixed-height, terminal-styled panel showing that entry's title bar, echo line, metadata block (POSITION/INDUSTRY/TEAM SIZE/optional LEAD), TASKS list, and ACHIEVEMENTS list, covering the timeline area below the still-visible chapter heading.

**Independent Test**: Click "Details" on any single Experience entry; confirm a panel opens instantly showing that entry's position, industry, team size, lead status (when applicable), tasks, and achievements, with internal scroll for long content and the chapter heading staying fixed above it.

### Implementation for User Story 1

- [X] T007 [US1] Create `frontend/src/components/ExperienceDetailPanel.astro` accepting an `entry: ExperienceEntry` prop, rendering: root `<div data-panel="{entry.id}" id="panel-{entry.id}" role="dialog" aria-modal="true" aria-labelledby="panel-title-{entry.id}" hidden>`; a title bar with `<span id="panel-title-{entry.id}">{entry.role} — {entry.company}</span>` (FR-009) and a close `<button type="button" data-panel-close aria-label="Close">` containing `<Icon id="close" />` (FR-010); a body starting with the static echo line `> cat experience/{entry.id}.md` (FR-012, `contracts/content-data.md`); a metadata block with labeled `POSITION` (`entry.role`), `INDUSTRY`, `TEAM SIZE` lines and a `LEAD` line rendered only when `entry.isLead` is true (FR-013, `contracts/content-data.md`); a labeled `TASKS` bullet list from `entry.tasks` and a labeled `ACHIEVEMENTS` bullet list from `entry.achievements` (FR-014); and a large contact `<a>` at the end of the body using the `kind: "email"` entry's `href` from `frontend/src/data/contact-links.ts` (FR-015, `contracts/content-data.md`) — no fade/slide/scale styling anywhere (FR-004)
- [X] T008 [US1] Style `ExperienceDetailPanel.astro`'s `<style>` block per `docs/visual-direction.md` decision 21: fully opaque background (no scrim, FR-008), no `box-shadow` (FR-008), fixed viewport-relative height with `overflow-y: auto` on the scrollable content region (FR-007), terminal typography (`Space Mono`) for the echo line/metadata/lists, existing design tokens from `frontend/src/styles/tokens.css` for color/spacing (hard-capped spacing scale, square corners, hairlines)
- [X] T009 [US1] In `frontend/src/components/Experience.astro`: wrap the existing `<ol class="timeline">` in `<div class="timeline-wrap">` (`position: relative`, per `research.md` #1); inside the existing `.map()`, add a "Details" `<button type="button" data-panel-open="{entry.id}" aria-controls="panel-{entry.id}">` after each entry's `.summary` paragraph (FR-001, FR-017) styled per the site's existing button convention (outlined at rest, filled accent on hover, ≥15px label — same pattern as `.contact-button` in `frontend/src/components/Hero.astro`), with plain non-terminal wording (e.g. "Details"); render one `<ExperienceDetailPanel entry={entry} />` per entry, absolutely positioned (`position: absolute; inset: 0`) inside `.timeline-wrap` (`research.md` #1, FR-003/FR-006)
- [X] T010 [US1] Add CSS to `Experience.astro`'s `<style>` block for `.timeline-wrap { position: relative; }` and the "Details" button's outline/filled-hover states, matching existing button styling conventions in the codebase (no new tokens)

**Checkpoint**: A visitor can click any entry's "Details" button and see that entry's full detail panel, at a fixed height with internal scroll, covering the timeline below the still-visible chapter heading — closing is not yet wired (Phase 4), so this checkpoint is markup/visual-only per quickstart.md's US1 steps 1–3 and 5 (step 4's LEAD-line-omitted check needs T003's data)

---

## Phase 4: User Story 2 - Close the detail panel (Priority: P1)

**Goal**: An open panel can be closed via its close icon or the Escape key (but not click-outside), with focus trapped inside the panel while open and restored to the triggering "Details" button on close.

**Independent Test**: Open any entry's panel, close it via the close icon, reopen it, close it via Escape — both return the visitor to the full timeline list with focus back on the "Details" button that opened it; Tab/Shift+Tab while open never reaches covered entries.

### Implementation for User Story 2

- [X] T011 [US2] Add an inline `<script>` to `frontend/src/components/Experience.astro` implementing the Open sequence from `contracts/panel-interaction.md`: on a `data-panel-open` button click — hide any other currently-open panel (`hidden = true`) and clear the timeline's `inert`, show the target panel (`hidden = false`), set `inert` on `<ol class="timeline">` (`research.md` #2, FR-003), store the clicked button in module-scope script state (not a DOM attribute) as the panel's trigger, and move focus to the panel's close button — no `requestAnimationFrame`/timeout staging anywhere (FR-004, depends on T009 for the buttons/panels to exist)
- [X] T012 [US2] In the same inline `<script>`, implement the Close sequence from `contracts/panel-interaction.md`: on a `data-panel-close` button click or a document-level `Escape` `keydown` (no-op if no panel is open, spec Edge Cases) — hide the open panel (`hidden = true`), clear `inert` from `<ol class="timeline">`, and return focus to the stored trigger button (FR-011, FR-019, SC-007) — explicitly do NOT attach any click-outside/backdrop listener (FR-011, Out of Scope)
- [X] T013 [US2] In the same inline `<script>`, implement the focus trap from `contracts/panel-interaction.md` / `research.md` #4: a `keydown` listener scoped to the currently-open panel that intercepts `Tab`/`Shift+Tab`, queries the panel's focusable elements fresh (`button, a[href], [tabindex]:not([tabindex="-1"])` in DOM order) on each keypress, calls `nextFocusIndex` (from `frontend/src/lib/experience-panel.ts`, T005) with the currently-focused element's index and `1`/`-1` for Tab/Shift+Tab, calls `preventDefault()`, and moves focus to the resulting index explicitly (FR-019)

**Checkpoint**: US1 + US2 together are fully usable end-to-end per quickstart.md's US1 and US2 sections — a visitor can open, read, and close any entry's panel by either method, with focus trapped and restored correctly

---

## Phase 5: User Story 3 - Contact directly from a role's detail panel (Priority: P2)

**Goal**: The panel's contact button opens the visitor's email client addressed to the same address as the hero section's contact CTA.

**Independent Test**: Open any entry's panel and click the large contact button; confirm it triggers the same `mailto:` action as the hero section's contact CTA.

### Implementation for User Story 3

- [X] T014 [US3] Verify the contact `<a>` added in T007 uses the exact `href` of the `kind: "email"` entry in `frontend/src/data/contact-links.ts` (already wired by T007 via a shared data import, not a duplicated literal) — if T007 hard-coded the address instead of importing `contactLinks`, fix `frontend/src/components/ExperienceDetailPanel.astro` to import and filter `contactLinks` for `kind === "email"` (FR-015, `contracts/content-data.md`, depends on T007)

**Checkpoint**: US1 + US2 + US3 together satisfy quickstart.md's US3 section — the contact button is one click from an open panel to a composed email

---

## Phase 6: User Story 4 - Switch focus between different entries' details (Priority: P3)

**Goal**: Closing one entry's panel and opening another's shows only the new entry's data, with no leftover state, and covered entries' triggers stay unreachable while any panel is open.

**Independent Test**: Open entry A's panel, close it, open entry B's panel; confirm B's panel shows only B's data and that entry C's "Details" button was unreachable (by click and by Tab) while A's panel was open.

### Implementation for User Story 4

- [X] T015 [US4] Review `Experience.astro`'s inline script (T011–T013) to confirm mutual exclusivity is structural, not incidental: at most one `[data-panel]` is ever visible at once because Open's step 1 always hides any other open panel before showing the target (`contracts/panel-interaction.md` Mutual exclusivity) — since each panel's markup is fully server-rendered per entry (T007) with no shared/reused DOM node, no additional code is needed for "no leftover state from A" (content is structurally per-entry, not overwritten); this task is a verification pass, not new implementation, and should only produce a code change if the review finds the exclusivity is *not* already structural

**Checkpoint**: All 4 user stories are independently functional and composable — this is the full feature per spec.md

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Full-feature verification against spec.md's edge cases, success criteria, and responsive requirements

- [X] T016 [P] Verify the panel's fixed height is identical across all 3 entries regardless of content length (spec Edge Cases, SC-003) — adjust `ExperienceDetailPanel.astro`'s CSS (T008) if any entry's content forces a size difference
- [X] T017 [P] Verify sub-768px behavior in `Experience.astro`/`ExperienceDetailPanel.astro`'s CSS: panel renders full-width, depth cue limited to page content above/below (not beside), fixed height/internal scroll/title bar all still work (FR-016, spec Edge Cases) — reuse the existing single 768px breakpoint, no new breakpoint
- [X] T018 Run `pnpm --filter frontend typecheck`, `pnpm --filter frontend test`, and `pnpm --filter frontend build` — all three MUST pass (quickstart.md Automated checks)
- [X] T019 Run the full manual validation checklist in `specs/004-experience-detail-panel/quickstart.md` (US1–US4, Edge Cases, Responsive/visual conformance) against `pnpm --filter frontend dev` and `pnpm --filter frontend preview`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: No dependency on Phase 1 (different files) but conventionally done first — BLOCKS all user stories (T002–T006 define the data shape and pure logic every story's markup/script depends on)
- **User Story 1 (Phase 3)**: Depends on Phase 2 (needs extended `ExperienceEntry` fields and Phase 1's `close.svg` for the panel's close icon)
- **User Story 2 (Phase 4)**: Depends on Phase 3 (needs the buttons/panels T009 renders, and `nextFocusIndex` from Phase 2)
- **User Story 3 (Phase 5)**: Depends on Phase 3 (T007's contact button markup) — independent of Phase 4
- **User Story 4 (Phase 6)**: Depends on Phase 4 (verifies the open/close sequence's structural exclusivity)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Foundational only — the MVP slice
- **US2 (P1)**: Requires US1's markup (buttons/panels must exist to be opened/closed) — ties with US1 for priority but is sequenced after it structurally
- **US3 (P2)**: Requires US1's markup (contact button) — independent of US2
- **US4 (P3)**: Requires US2's open/close sequence — composes US1 + US2, adds no new markup

### Within Each User Story

- US1: T007 (panel markup) → T008 (panel styling) → T009 (trigger button + wiring into Experience.astro) → T010 (button/wrap CSS)
- US2: T011 (open) → T012 (close) → T013 (focus trap) — all three edit the same inline `<script>`, so sequential by file, not parallel
- US3: T014 depends on T007
- US4: T015 depends on T011–T013

### Parallel Opportunities

- T004 and T005/T006 can run in parallel with each other (different files: test file for data vs. new lib module + its test)
- T005 and T006 within Phase 2 are sequential in practice (test needs the module to exist) despite both being marked [P] relative to T004
- T016 and T017 (Polish) can run in parallel (different CSS concerns, though possibly the same files — verify no edit conflicts before parallelizing)

---

## Parallel Example: Phase 2 (Foundational)

```bash
# After T002/T003 (data fields + content) land, in parallel:
Task: "Extend frontend/tests/data/experience-placeholder.test.ts with new-field assertions"
Task: "Create frontend/src/lib/experience-panel.ts with nextFocusIndex"
# T006 (experience-panel.test.ts) follows T005 immediately after (same-file dependency on the module existing)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001 — close icon asset)
2. Complete Phase 2: Foundational (T002–T006 — data fields + pure focus-index logic, both test-covered)
3. Complete Phase 3: User Story 1 (T007–T010 — panel renders and looks right; no close behavior yet)
4. **STOP and VALIDATE**: Manually open a panel per quickstart.md US1 steps 1–3, 5; confirm typecheck/test/build pass
5. Note: without US2, an opened panel cannot yet be closed by the visitor — treat US1+US2 together as the realistic minimum demoable increment even though they're separate phases

### Incremental Delivery

1. Setup + Foundational → data/logic ready, no visible change yet
2. US1 → panel opens, shows correct content, but can't be closed (visual-only demo)
3. US2 → panel can be closed both ways, focus trap + restoration work → **first fully usable increment**
4. US3 → contact button live
5. US4 → verification pass confirming multi-entry switching has no leftover state
6. Polish → responsive/edge-case verification + full automated + manual validation

### Parallel Team Strategy

With multiple developers, after Phase 2 (Foundational) completes:

- Developer A: US1 (T007–T010) then US3 (T014, depends on A's own T007)
- Developer B: waits for A's T009 (buttons/panels must exist) before starting US2 (T011–T013), then US4 (T015)
- Realistically low parallelism here — US2/US3/US4 all structurally depend on US1's markup existing first, so a single-developer sequential path (Setup → Foundational → US1 → US2 → US3 → US4 → Polish) is the natural execution order for this feature's scope (3 entries, one page section)

---

## Notes

- [P] tasks touch different files with no dependency on an incomplete task
- [Story] label maps each task to its spec.md user story for traceability
- This feature makes no `schema`/`pipeline` changes — `pnpm build`/`pnpm typecheck` at the repo root will touch those packages too, but only `frontend`'s three checks (quickstart.md) are expected to see any diff
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently before continuing
