---

description: "Task list for Resume Schema — About & Experience"
---

# Tasks: Resume Schema — About & Experience

**Input**: Design documents from `/specs/001-resume-schema-about-experience/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/resume-body.md](./contracts/resume-body.md), [quickstart.md](./quickstart.md)

**Tests**: Per Constitution Principle IV (research.md #1), this feature's test suite is compile-time TypeScript fixtures (`tsc --noEmit` over `schema/tests/`), not a test-runner. Fixture tasks below are the tests — write/extend them alongside each story's type definitions, not after.

**Organization**: Tasks are grouped by user story (spec.md) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2); Setup/Foundational/Polish tasks carry no story label
- File paths are relative to the repository root

## Path Conventions

Single existing workspace package, scoped entirely to `schema/` (per plan.md Project Structure):

```text
schema/
├── package.json
├── tsconfig.json
├── tsconfig.test.json   (NEW)
├── src/
│   ├── index.ts
│   ├── date.ts          (NEW)
│   ├── about.ts         (NEW)
│   ├── experience.ts    (NEW)
│   └── resume-body.ts   (NEW)
└── tests/
    └── resume-body.fixtures.ts   (NEW)
```

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Wire up the compile-time test config and script this feature's TDD approach relies on (research.md #1)

- [X] T001 Create `schema/tsconfig.test.json` extending `../tsconfig.base.json`, with `"include": ["src", "tests"]` and `noEmit: true`, so fixtures type-check without affecting the shipped `dist/` build (plan.md Project Structure)
- [X] T002 [P] Add a `"test": "tsc -p tsconfig.test.json --noEmit"` script to `schema/package.json` (alongside the existing `build`/`typecheck` scripts), per quickstart.md's `pnpm --filter schema test` command

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared scaffolding both user stories extend

**⚠️ CRITICAL**: No user story fixture work can begin until this phase is complete

- [X] T003 Create `schema/tests/resume-body.fixtures.ts` as an empty scaffold file (header comment referencing research.md #1 and quickstart.md) — depends on T001 (must fall under `tsconfig.test.json`'s `include`)

**Checkpoint**: Foundation ready — User Story 1 and User Story 2 implementation can now begin (independently; they touch disjoint `src/` files but share this one fixtures file, so story fixture-writing tasks below must run in the stated order rather than in parallel)

---

## Phase 3: User Story 1 - Represent an employer with one or more roles (Priority: P1) 🎯 MVP

**Goal**: `Experience`/`EmployerEntry`/`Role` (and their shared `Month`/`DatePart`) fully represent a single employer with one or many roles, an ongoing role, and a role performed for a named client — per data-model.md and contracts/resume-body.md.

**Independent Test**: Construct fixture data for a single-role employer and a multi-role employer (mirroring `pipeline/tmp/raw-doc.json`) and confirm both compile against the schema, with no `ResumeBody`/`About` involvement required.

### Tests for User Story 1 (write first — Constitution Principle IV) ⚠️

- [X] T004 [US1] Add positive fixtures to `schema/tests/resume-body.fixtures.ts`: single-role employer (`BANCO INTER`, quickstart.md #1), multi-role employer with one ongoing role (`INDICIUM AI` with three roles, quickstart.md #2), and a role whose `client` differs from the employer name (quickstart.md #3) — depends on T003
- [X] T005 [US1] Add negative fixtures (`// @ts-expect-error`) to `schema/tests/resume-body.fixtures.ts`: empty `achievements` array, empty `roles` array, and `month: 13` (quickstart.md negative fixtures) — depends on T004 (same file)

### Implementation for User Story 1

- [X] T006 [P] [US1] Define `Month` (literal union `1 | 2 | ... | 12`) and `DatePart { month: Month; year: number }` in `schema/src/date.ts` (data-model.md `Month`/`DatePart`)
- [X] T007 [US1] Define `Role { title; client?; startDate: DatePart; endDate?: DatePart; achievements: [string, ...string[]] }` and `EmployerEntry { name; location; roles: [Role, ...Role[]] }` and `Experience = [EmployerEntry, ...EmployerEntry[]]` in `schema/src/experience.ts`, importing `DatePart` from `./date` (data-model.md `Role`/`EmployerEntry`/`Experience`) — depends on T006
- [X] T008 [US1] Re-export `Month`, `DatePart`, `Role`, `EmployerEntry`, `Experience` from `schema/src/index.ts` (contracts/resume-body.md exported symbols) — depends on T007

**Checkpoint**: `pnpm --filter schema test` passes for all US1 fixtures (T004 compiles clean, T005's `@ts-expect-error` lines are satisfied) — User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Represent the About narrative (Priority: P2)

**Goal**: `About` represents the full professional-summary paragraph as a single, unsplit block of text.

**Independent Test**: Assign the About paragraph from `pipeline/tmp/raw-doc.json` to a single `About` value and confirm it compiles, with no `Experience`/`ResumeBody` involvement required.

### Tests for User Story 2 (write first — Constitution Principle IV) ⚠️

- [X] T009 [US2] Add a positive fixture to `schema/tests/resume-body.fixtures.ts`: the full `ABOUT` paragraph from `pipeline/tmp/raw-doc.json` assigned to a single `About` value, unsplit (quickstart.md #4) — depends on T005 (same file)

### Implementation for User Story 2

- [X] T010 [P] [US2] Define `type About = string` in `schema/src/about.ts` (data-model.md `About`)
- [X] T011 [US2] Re-export `About` from `schema/src/index.ts` — depends on T010 and T008 (same file)

**Checkpoint**: `pnpm --filter schema test` passes for all US1 + US2 fixtures — User Story 2 is independently functional and testable, and both stories now coexist without conflict.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: `ResumeBody` is the integration point over both stories (FR-009, FR-010) and isn't required by either story's independent test, so it lands last, together with final validation.

- [X] T012 Define `interface ResumeBody { about?: About; experience?: Experience }` in `schema/src/resume-body.ts`, importing `About` from `./about` and `Experience` from `./experience` (data-model.md `ResumeBody`) — depends on T007, T010
- [X] T013 Re-export `ResumeBody` from `schema/src/index.ts` (contracts/resume-body.md exported symbols) — depends on T012 and T011 (same file)
- [X] T014 Add remaining fixtures to `schema/tests/resume-body.fixtures.ts`: `ResumeBody` independence (one fixture with only `about` set, one with only `experience` set — FR-010, quickstart.md #6), full `Experience` reverse-chronological ordering across all employers from `pipeline/tmp/raw-doc.json` (FR-011, quickstart.md #5), and a negative fixture (`// @ts-expect-error`) for an out-of-scope field such as `education` on `ResumeBody` (FR-009) — depends on T013 and T009 (same file)
- [X] T015 Run `pnpm --filter schema typecheck` and `pnpm --filter schema test` (quickstart.md "Run the validation") and confirm both exit `0` — depends on T014
- [X] T016 [P] Update `schema/README.md` to document the exported `About`/`Experience`/`ResumeBody` API surface and the two validation commands

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001 (tsconfig `include`) — BLOCKS both user stories' fixture tasks
- **User Story 1 (Phase 3)**: Depends on Foundational completion — no dependency on User Story 2
- **User Story 2 (Phase 4)**: Depends on Foundational completion; T009 depends on T005 only because both edit the same shared fixtures file, not on US1's types
- **Polish (Phase 5)**: Depends on both User Story 1 and User Story 2 being complete (`ResumeBody` imports both `About` and `Experience`)

### User Story Dependencies

- **User Story 1 (P1)**: Independent — introduces `schema/src/date.ts` and `schema/src/experience.ts`, files US2 never touches
- **User Story 2 (P2)**: Independent — introduces `schema/src/about.ts` only; shares `schema/src/index.ts` and `schema/tests/resume-body.fixtures.ts` with US1 as edit points, not logic dependencies

### Within Each User Story

- Fixtures (tests) before/alongside implementation, per Constitution Principle IV
- `date.ts` before `experience.ts` (import dependency)
- `src/*.ts` files before their `index.ts` re-export
- Story complete (checkpoint passes) before starting Polish

### Parallel Opportunities

- T002 (package.json) can run in parallel with T001 (tsconfig.test.json)
- T006 (`date.ts`) has no same-story dependency and can start as soon as Foundational (T003) is done, in parallel with T004/T005 (fixture writing) since they're different files
- T010 (`about.ts`) can run in parallel with any US1 task — different file, no shared dependency
- T016 (README) can run in parallel with T015 (validation run) — different files

---

## Parallel Example: Phase 1 + across User Stories

```bash
# Setup — run together:
Task: "Create schema/tsconfig.test.json extending ../tsconfig.base.json with include [src, tests]"
Task: "Add \"test\" script to schema/package.json"

# Once Foundational (T003) is done, these can run together (different files):
Task: "Define Month and DatePart in schema/src/date.ts"
Task: "Define About in schema/src/about.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003)
3. Complete Phase 3: User Story 1 (T004–T008)
4. **STOP and VALIDATE**: `pnpm --filter schema test` passes for US1 fixtures only
5. This is the MVP — `Experience`/`EmployerEntry`/`Role` are usable by `pipeline`/`frontend` even before About exists

### Incremental Delivery

1. Setup + Foundational → shared scaffolding ready
2. Add User Story 1 (T004–T008) → validate independently → MVP
3. Add User Story 2 (T009–T011) → validate independently → About now available
4. Add Polish (T012–T016) → `ResumeBody` ties both together, full quickstart.md validation passes

### Notes

- [P] tasks touch different files with no unmet dependency
- Same-file edits (shared `index.ts` and the single fixtures file) are intentionally sequential, not [P], even across stories
- Commit after each task or logical group
- Stop at each checkpoint to validate that story independently before proceeding
