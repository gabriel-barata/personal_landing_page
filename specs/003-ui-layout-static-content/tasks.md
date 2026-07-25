---

description: "Task list for Landing Page UI Layout & Static Content Sections"
---

# Tasks: Landing Page UI Layout & Static Content Sections

**Input**: Design documents from `/specs/003-ui-layout-static-content/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Included for `lib/` (theme, language) and `data/` (tech-stack, certifications, education, experience-placeholder) per plan.md's Constitution Check (Principle IV) — every resolution rule and static content list gets a `node:test` case. Visual/CSS conformance is verified manually via `quickstart.md`, not by unit tests (plan.md Technical Context > Testing).

**Organization**: Tasks are grouped by user story (spec.md priorities P1–P3) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US6)
- All paths are relative to the repo root; the package is `frontend/`

## Path Conventions

Single existing workspace package, `frontend/`, inside the pnpm monorepo (plan.md Project Structure):

```text
frontend/
├── package.json / astro.config.mjs / tsconfig.test.json
├── public/{fonts,icons,badges}/
├── src/{pages,components,data,lib,styles}/
└── tests/{lib,data}/
```

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Turn the empty `frontend/` workspace placeholder into a buildable Astro project.

- [X] T001 Update `frontend/package.json`: add `astro`, `@fontsource-variable/space-grotesk`, `@fontsource/space-mono`, `@fontsource/silkscreen` dependencies, and `dev`/`build`/`preview`/`typecheck`/`test` scripts (`astro dev`/`astro build`/`astro preview`/`tsc -p tsconfig.test.json --noEmit`/`tsx --test tests/**/*.test.ts`, mirroring `pipeline/package.json`'s script pattern)
- [X] T002 Run `pnpm install` from the repo root so the new `frontend` dependencies from T001 are materialized in the workspace
- [X] T003 [P] Create `frontend/astro.config.mjs` — static output, no SSR adapter (research.md #1)
- [X] T004 [P] Create `frontend/tsconfig.test.json` — extends `../tsconfig.base.json`, `noEmit: true`, `include: ["src", "tests"]` (mirrors `pipeline/tsconfig.test.json`)

**Checkpoint**: `pnpm --filter frontend astro --version` runs; workspace installs cleanly.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared layers every user story depends on — design tokens, fonts, the i18n dictionary, the pure theme/language logic, and the page shell with its no-FOUC bootstrap script. No user story can be verified until this phase is done.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Create `frontend/src/data/i18n/en.ts` — typed UI string dictionary: hero `name`/`role`/`summary`/`location`/`yearsExperience`/`coreStack` labels (data-model.md `HeroContent`), the five section headings, and static microcopy (`Download CV`, `EN`/`PT`, `LIGHT`/`DARK`) (research.md #7)
- [X] T006 Create `frontend/src/data/i18n/pt.ts` — re-exports `en.ts`'s string values under the `pt` key; no new translated copy for this feature (spec Assumptions, contracts/content-data.md "Language")
- [X] T007 [P] Create `frontend/src/styles/tokens.css` — light-mode and dark-mode (`[data-theme="dark"]`) color custom properties (visual-direction decisions 8, 18), spacing scale tokens `4/8/12/16/24/32/48/64` (decision 9), type scale tokens `34/24/18/15/13` and letter-spacing tokens (Typography section)
- [X] T008 [P] Copy the self-hosted `latin`+`latin-ext` `woff2` files for Space Grotesk (variable), Space Mono, and Silkscreen from the installed `@fontsource*` packages (T001) into `frontend/public/fonts/` (research.md #3)
- [X] T009 Create `frontend/src/styles/global.css` — imports `tokens.css`; CSS reset; `@font-face` declarations for the T008 font files with `font-display: swap`; base typography (Space Mono body, Space Grotesk headings); global `border-radius: 0` / no-`box-shadow` baseline (visual-direction decision 5)
- [X] T010 [P] Write `frontend/tests/lib/theme.test.ts` — `node:test` cases: `resolveTheme(null, true/false)` → OS fallback; `resolveTheme('light'|'dark', ...)` → persisted value always wins; `readStoredTheme` returns `null` (not throw) when `getItem` throws (data-model.md validation rules)
- [X] T011 Implement `frontend/src/lib/theme.ts` — `resolveTheme`/`readStoredTheme`/`persistTheme` per `contracts/theme-language-state.md` and `data-model.md`, so T010 passes
- [X] T012 [P] Write `frontend/tests/lib/language.test.ts` — `node:test` cases: `resolveLanguage(null)` → `'en'`; `resolveLanguage('pt')` → `'pt'`; `readStoredLanguage` returns `null` (not throw) on a throwing `getItem`
- [X] T013 Implement `frontend/src/lib/language.ts` — `resolveLanguage`/`readStoredLanguage`/`persistLanguage` per `contracts/theme-language-state.md`, so T012 passes
- [X] T014 Create `frontend/src/pages/index.astro` — page shell: `<head>` imports `global.css`, preloads the T008 fonts, and contains a render-blocking inline bootstrap `<script>` that calls `readStoredTheme`/`resolveTheme` and `readStoredLanguage`/`resolveLanguage` (T011, T013) to set `data-theme`/`data-lang` on `<html>` before first paint (research.md #6); empty `<body>` for now

**Checkpoint**: `pnpm --filter frontend typecheck` and `pnpm --filter frontend test` pass; `pnpm --filter frontend dev` serves a blank page whose `<html>` tag already carries the correct `data-theme`/`data-lang` attributes with no flash.

---

## Phase 3: User Story 1 - See the whole résumé at a glance (Priority: P1) 🎯 MVP

**Goal**: The hero (name, role, summary, metadata, core stack, contact row) is fully visible with no scrolling; the header's monogram + "Download CV" button render correctly and the monogram goes sticky post-hero; the five sections exist in the correct top-to-bottom order.

**Independent Test**: Load the page at ≥768px — confirm monogram+name, role line, summary, location/experience metadata row, core stack row, and 2–3 contact links are all visible without scrolling, in a single centered column, with no rounded corners, no box shadows, and no photo. Scroll past the hero and confirm the monogram pins top-left and the section order is Hero → Experience → Tech Stack → Certifications/Education → Contact/footer.

- [X] T015 [P] [US1] Create `frontend/src/data/contact-links.ts` — 2–3 placeholder `ContactLink` entries (email, LinkedIn, CV) per `data-model.md`, used by both the hero and the footer
- [X] T016 [P] [US1] Copy self-hosted monochrome SVGs for the 5 hero core-stack items (Databricks, AWS, Claude, Azure, Snowflake) into `frontend/public/icons/` (research.md #4, visual-direction decision 3)
- [X] T017 [P] [US1] Create `frontend/src/components/Experience.astro` as a heading-only placeholder section (`<section>` + section title from `en.ts`) — real timeline content is added in US5
- [X] T018 [P] [US1] Create `frontend/src/components/TechStack.astro` as a heading-only placeholder section — real category/item content is added in US2
- [X] T019 [P] [US1] Create `frontend/src/components/CertificationsEducation.astro` as a heading-only placeholder section — real Certifications/Education content is added in US3/US4
- [X] T020 [US1] Create `frontend/src/components/Header.astro` — monogram (Silkscreen, sits inline next to the hero name at rest, `position: sticky` pinned top-left once scrolled past the hero) and an outline "Download CV" button (top-right, transparent background, no bar/container chrome) (FR-017, visual-direction decisions 13, 13a)
- [X] T021 [US1] Create `frontend/src/components/Hero.astro` — monogram+name, role line, 1–2 sentence summary, location + years-of-experience metadata row (`tabular-nums`), 5-icon core stack row (ink icons at rest, 15px accent-colored labels beneath — visual-direction decision 3's amended rule), and the contact row, all sourced from `en.ts`/`pt.ts` (T005/T006) and `contact-links.ts` (T015) (FR-002, FR-008)
- [X] T022 [US1] Create `frontend/src/components/ContactFooter.astro` — repeats the hero's contact row using `contact-links.ts` (visual-direction decision 6)
- [X] T023 [US1] Assemble `frontend/src/pages/index.astro` body (extends the T014 shell): `Header`, `Hero`, `Experience`, `TechStack`, `CertificationsEducation`, `ContactFooter` in that exact order (US1 acceptance scenario 3)
- [X] T024 [US1] Style `Header.astro`/`Hero.astro`/`ContactFooter.astro` per tokens from T007/T009: square corners, 1px hairlines, no shadows, no photo anywhere, 64px/48px section-gap cap between sections (FR-009, FR-010)

**Checkpoint**: `pnpm --filter frontend dev` — US1's Independent Test and acceptance scenarios 1–3 all pass manually (quickstart.md US1). This is the deployable MVP slice.

---

## Phase 4: User Story 2 - Browse the categorized technical skill set (Priority: P1)

**Goal**: The Tech Stack section lists all 8 categories and all 43 unique items exactly as specified, monochrome at rest, accent on hover.

**Independent Test**: Scroll to Tech Stack — every category listed, exact item counts/names, "Snowflake" appears once under "Data Tools" only, icon+label ink at rest / accent on hover, no filled badges or brand-colored logos.

- [X] T025 [P] [US2] Write `frontend/tests/data/tech-stack.test.ts` — `node:test`: exactly 8 categories with exact labels; each category's items exactly match `contracts/content-data.md`'s table (count + names); every `id` is globally unique (no cross-category duplicate, including Snowflake); total unique item count is 43 (SC-002)
- [X] T026 [US2] Implement `frontend/src/data/tech-stack.ts` — 8 `TechStackCategory` entries containing all 43 `TechStackItem`s per `contracts/content-data.md`, so T025 passes
- [X] T027 [P] [US2] Source and commit self-hosted monochrome SVGs for all 43 Tech Stack items into `frontend/public/icons/` (Simple Icons primary, Tabler fallback for non-brand concepts, research.md #4)
- [X] T028 [US2] Implement the Tech Stack content in `frontend/src/components/TechStack.astro` (replaces the T018 placeholder): one labeled block per category (13px uppercase header), items as icon+15px-label, ink at rest / accent on hover with a ~120–150ms color transition, items wrapping onto additional lines within a category rather than overflowing (FR-003, FR-004, Edge Cases: long category wrap)

**Checkpoint**: US1 + US2 both independently functional (quickstart.md US2).

---

## Phase 5: User Story 3 - Verify professional certifications (Priority: P1)

**Goal**: The Certifications sub-group (first sub-group of the combined Certifications/Education section) lists all 6 credentials with real badge images, grayscale at rest / full color on hover, uniform fixed-size hairline slots.

**Independent Test**: Scroll to the Certifications sub-group — all 6 entries with exact name + MM/YYYY match `contracts/content-data.md`; badges grayscale at rest, full color on hover; all slots share identical height/width regardless of native badge proportions.

- [X] T029 [P] [US3] Write `frontend/tests/data/certifications.test.ts` — `node:test`: exactly 6 entries; each `name`/`acquired` pair matches `contracts/content-data.md` exactly and in order (SC-003); every `badgeImagePath` is non-empty
- [X] T030 [US3] Implement `frontend/src/data/certifications.ts` — 6 `Certification` entries per `contracts/content-data.md`, so T029 passes
- [X] T031 [P] [US3] Acquire and commit real provider-issued badge images (Databricks ×3, AWS ×2, dbt ×1 — per spec Assumptions, publicly recognizable official artwork as a stand-in) into `frontend/public/badges/` (research.md #5, FR-019)
- [X] T032 [US3] Implement the Certifications sub-group in `frontend/src/components/CertificationsEducation.astro` (replaces part of the T019 placeholder, rendered first): fixed-size hairline-framed badge slots (uniform across all 6 regardless of native image proportions), `filter: grayscale(1)` at rest → `grayscale(0)` on hover (FR-005, visual-direction decision 14)

**Checkpoint**: US1–US3 all independently functional (quickstart.md US3).

---

## Phase 6: User Story 4 - Review educational background (Priority: P2)

**Goal**: The Education sub-group (second sub-group of the combined section) lists both entries with institution, degree, and completion status, including the MLOps project note.

**Independent Test**: Scroll past Certifications into Education — both entries match `contracts/content-data.md` exactly, including the MLOps pipeline note attributed to the Information Systems degree.

- [X] T033 [P] [US4] Write `frontend/tests/data/education.test.ts` — `node:test`: exactly 2 entries; each `institution`/`degree`/`completionStatus` matches `contracts/content-data.md` exactly (SC-004); the Information Systems entry's `note` is present and mentions the MLOps pipeline project (Python, MLflow, GitLab CI)
- [X] T034 [US4] Implement `frontend/src/data/education.ts` — 2 `EducationEntry` entries per `contracts/content-data.md`, so T033 passes
- [X] T035 [US4] Implement the Education sub-group in `frontend/src/components/CertificationsEducation.astro` (extends the T032 work, rendered as the second sub-group directly beneath Certifications, sharing one outer section-gap budget): institution, degree, completion-status text, and the optional note (FR-006)

**Checkpoint**: US1–US4 all independently functional (quickstart.md US4).

---

## Phase 7: User Story 5 - Scan work history in the expected visual shape (Priority: P2)

**Goal**: The Experience section renders exactly 3 placeholder entries with the full timeline visual shape (rail, ticks, tabular-nums dates), no animation.

**Independent Test**: Scroll to Experience — exactly 3 entries, most-recent-first, left hairline rail, solid accent tick on the current (first) entry only, outline ticks on the other two, dates left in tabular numerals, role/company/summary right, no scroll-triggered animation.

- [X] T036 [P] [US5] Write `frontend/tests/data/experience-placeholder.test.ts` — `node:test`: array length is exactly 3; ordered most-recent-first (each `startDate` ≥ the next entry's); exactly one entry has `isCurrent: true` and it is the first element (data-model.md, FR-007)
- [X] T037 [US5] Implement `frontend/src/data/experience-placeholder.ts` — 3 plausible-but-fictional entries (role/company/date range/2–3 line summary) per the structural contract in `contracts/content-data.md`, so T036 passes
- [X] T038 [US5] Implement the Experience content in `frontend/src/components/Experience.astro` (replaces the T017 placeholder): left vertical hairline rail, solid accent-filled square tick beside the current entry, outline ticks beside the other two, dates in tabular-nums to the left, role/company/summary to the right, most-recent-first, no scroll-triggered animation (FR-007, visual-direction decision 7)

**Checkpoint**: US1–US5 all independently functional (quickstart.md US5). All static real/placeholder content is now complete.

---

## Phase 8: User Story 6 - Switch language and theme (Priority: P3)

**Goal**: The top-right `EN`/`PT` and `LIGHT`/`DARK` toggles are live: language switches without a full reload, theme swaps instantly with no transition, and a manual theme choice persists across reloads instead of reverting to the OS default.

**Independent Test**: Toggle `EN`/`PT` — active/inactive states change without a full page reload. Toggle `LIGHT`/`DARK` — palette swaps instantly, no transition. Reload — the last manually chosen theme persists rather than reverting to OS default.

- [X] T039 [P] [US6] Create `frontend/src/components/ThemeToggle.astro` — plain-text `LIGHT`/`DARK` island; on click, calls `persistTheme` (T011) and sets `data-theme` on `<html>` directly (no re-resolution), with no transition on root color custom properties (FR-014, FR-015, FR-016, `contracts/theme-language-state.md`)
- [X] T040 [P] [US6] Create `frontend/src/components/LanguageToggle.astro` — plain-text `EN`/`PT` island; on click, calls `persistLanguage` (T013) and sets `data-lang` on `<html>` directly (FR-014)
- [X] T041 [US6] Wire `ThemeToggle` and `LanguageToggle` (T039, T040) into `frontend/src/components/Header.astro`'s top-right cluster, alongside "Download CV": hairline `/` separator between the two toggles, inactive option in support-gray, active option in ink (never accent), no flag/theme icons (visual-direction decisions 13, 15a, 18)

**Checkpoint**: All 6 user stories independently functional (quickstart.md US6).

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Responsive reflow, motion/contrast conformance, and final end-to-end validation across all stories.

- [X] T042 [P] Apply the 768px responsive reflow across components per visual-direction decision 12 / FR-013: Experience entries stack date-above-role, hero metadata row wraps to two lines instead of truncating, type scale steps down one notch, section-gap cap drops to 48px (SC-005)
- [X] T043 [P] Audit every accent-colored text usage (hero stack label, Tech Stack item hover, button/CTA labels) against visual-direction decision 8's standing rule: never below 15px, never on a tinted background
- [X] T044 Run `pnpm --filter frontend typecheck`, `pnpm --filter frontend test`, and `pnpm --filter frontend build` (quickstart.md Automated checks) — all three must pass
- [X] T045 Run the full `quickstart.md` manual validation checklist (US1–US6, Responsive, Motion sections) against `pnpm --filter frontend dev` and `pnpm --filter frontend preview`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories.
- **US1 (Phase 3)**: Depends on Foundational only. This is the MVP slice.
- **US2 (Phase 4)**: Depends on Foundational + the `TechStack.astro` placeholder created in US1 (T018).
- **US3 (Phase 5)**: Depends on Foundational + the `CertificationsEducation.astro` placeholder created in US1 (T019).
- **US4 (Phase 6)**: Depends on US3 (T032) — edits the same `CertificationsEducation.astro` file, adding the second sub-group beneath the one US3 renders first.
- **US5 (Phase 7)**: Depends on Foundational + the `Experience.astro` placeholder created in US1 (T017).
- **US6 (Phase 8)**: Depends on Foundational (`lib/theme.ts`, `lib/language.ts`) + `Header.astro` created in US1 (T020).
- **Polish (Phase 9)**: Depends on all desired user stories being complete.

### User Story Dependencies (content-level)

- US2, US3, US5 can proceed in parallel once US1's placeholders (T017–T019) exist — each owns a distinct component file.
- US4 must follow US3 (same file, second sub-group appended after the first).
- US6 must follow US1 (extends `Header.astro`) but is otherwise independent of US2–US5.

### Within Each User Story

- Data test before data implementation (TDD, Constitution Principle IV).
- Data implementation before the `.astro` component that consumes it.
- Placeholder component (US1) before that same component's real content (US2/US3/US4/US5).

### Parallel Opportunities

- Setup: T003, T004 in parallel.
- Foundational: T007, T008 in parallel with each other and with T010/T012 (test-writing); T010 before T011, T012 before T013 (same-file dependency, not parallel).
- US1: T015–T019 in parallel (5 distinct new files); T020–T024 sequential (Header/Hero/Footer consume T015/T016, then assembly, then styling).
- Once US1's placeholders exist: US2 (Phase 4), US3 (Phase 5), and US5 (Phase 7) can be staffed in parallel — distinct component files. US4 (Phase 6) waits on US3. US6 (Phase 8) waits on US1's Header only.

---

## Parallel Example: User Story 1

```bash
# Launch US1's independent data/asset/placeholder tasks together:
Task: "Create frontend/src/data/contact-links.ts"
Task: "Copy self-hosted monochrome SVGs for the 5 hero core-stack items into frontend/public/icons/"
Task: "Create frontend/src/components/Experience.astro as a heading-only placeholder section"
Task: "Create frontend/src/components/TechStack.astro as a heading-only placeholder section"
Task: "Create frontend/src/components/CertificationsEducation.astro as a heading-only placeholder section"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: run quickstart.md's US1 section independently
5. Deploy/demo if ready — this is a real, navigable page shell with a complete hero

### Incremental Delivery

1. Setup + Foundational → foundation ready (tokens, fonts, i18n, theme/language logic, bootstrap script)
2. US1 → hero + header + section shell → validate → MVP demo
3. US2 → Tech Stack real content → validate
4. US3 → Certifications real content → validate
5. US4 → Education real content (extends US3's section) → validate
6. US5 → Experience real content → validate — all required real/placeholder content now complete
7. US6 → language/theme toggles → validate
8. Polish → responsive reflow, contrast audit, full quickstart pass

### Parallel Team Strategy

With multiple developers, after Foundational is done:

- Developer A: US1 (must land first — creates the placeholders US2/US3/US5 build on)
- Once US1 lands: Developer A → US2, Developer B → US3 → US4, Developer C → US5, Developer D → US6

---

## Notes

- [P] tasks touch different files with no unmet dependency.
- [Story] labels map every user-story-phase task to spec.md's US1–US6 for traceability.
- Tests are included for `lib/` and `data/` (Constitution Principle IV); `.astro`/CSS conformance is verified manually via `quickstart.md`, consistent with plan.md's Technical Context > Testing rationale.
- `TechStack.astro`, `CertificationsEducation.astro`, and `Experience.astro` are each created once (as placeholders, in US1) and then edited — not recreated — by the story that owns their real content (US2, US3+US4, US5 respectively). Two stories editing the same file (US3 then US4) are listed sequentially, not marked [P].
- Commit after each task or logical group; stop at any phase checkpoint to validate that story independently.
