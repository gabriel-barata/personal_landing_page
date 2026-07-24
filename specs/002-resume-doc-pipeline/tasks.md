---

description: "Task list for Resume Google Doc Parsing Pipeline"
---

# Tasks: Resume Google Doc Parsing Pipeline

**Input**: Design documents from `/specs/002-resume-doc-pipeline/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/doc-convention.md](./contracts/doc-convention.md), [contracts/pipeline-cli.md](./contracts/pipeline-cli.md), [quickstart.md](./quickstart.md)

**Tests**: Per Constitution Principle IV and research.md #1, this feature has real runtime behavior (unlike 001's types-only package), so its test suite is `node:test` unit tests run via `tsx --test` against committed synthetic `DocLine[]`/raw-response JSON fixtures — no network calls, no new devDependency. Test tasks below are listed first within each story and must be written (and seen failing where applicable) before their implementation task, per Principle IV.

**Organization**: Tasks are grouped by user story (spec.md) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3); Setup/Foundational/Polish tasks carry no story label
- File paths are relative to the repository root

## Path Conventions

Single existing workspace package, scoped entirely to `pipeline/` (per plan.md Project Structure):

```text
pipeline/
├── package.json                       (adds "test" script)
├── tsconfig.json
├── tsconfig.test.json                 (NEW)
├── src/
│   ├── index.ts                       (rewritten — composition root)
│   ├── infrastructure/
│   │   ├── google-docs-client.ts      (NEW)
│   │   ├── doc-lines.ts               (NEW)
│   │   └── resume-writer.ts           (NEW)
│   └── domain/
│       ├── doc-line.ts                (NEW)
│       ├── result.ts                  (NEW)
│       ├── parse-error.ts             (NEW)
│       ├── parse-about.ts             (NEW)
│       ├── parse-experience.ts        (NEW)
│       └── parse-resume.ts            (NEW)
└── tests/
    ├── fixtures/                      (NEW — one JSON file per scenario)
    ├── parse-about.test.ts            (NEW)
    ├── parse-experience.test.ts       (NEW)
    ├── doc-lines.test.ts              (NEW)
    └── parse-resume.test.ts           (NEW)

resume.json                            (NEW generated artifact at the repo root)
```

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Wire up the test config and script this feature's TDD approach relies on (research.md #1)

- [X] T001 Create `pipeline/tsconfig.test.json` extending `../tsconfig.base.json`, with `"include": ["src", "tests"]` and `noEmit: true`, mirroring `schema/tsconfig.test.json` (plan.md Project Structure)
- [X] T002 [P] Add a `"test": "tsx --test tests/**/*.test.ts"` script to `pipeline/package.json`, using the existing `tsx` devDependency — no new dependency (research.md #1, quickstart.md `pnpm --filter pipeline test`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The neutral, dependency-free domain types every story's parsing code builds on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Define `DocLine { text: string; headingLevel: 0 | 1 | 2; bullet: boolean }` in `pipeline/src/domain/doc-line.ts` (data-model.md `DocLine`)
- [X] T004 [P] Define `Result<T, E> = { ok: true; value: T } | { ok: false; errors: E[] }` in `pipeline/src/domain/result.ts` (data-model.md `Result`, research.md #4)
- [X] T005 [P] Define `ParseError { path: string; message: string }` in `pipeline/src/domain/parse-error.ts` (data-model.md `ParseError`, FR-011)

**Checkpoint**: Foundation ready — User Story 1, 2, and 3 domain work can now begin

---

## Phase 3: User Story 1 - Turn the Experience section into structured data (Priority: P1) 🎯 MVP

**Goal**: `parseExperience()` turns well-formed `DocLine[]` Experience content into a schema-conforming `Experience` value — employers and roles in Doc order, ongoing roles represented by an absent `endDate` (FR-002–FR-007).

**Independent Test**: Feed `parseExperience()` fixtures for a single-role employer, a multi-role employer (one role ongoing), and three employers in sequence; confirm the returned `Experience` matches Doc order and content exactly, with no `About`/`ResumeBody` involvement required (quickstart.md #1–#4).

### Tests for User Story 1 (write first — Constitution Principle IV) ⚠️

- [X] T006 [P] [US1] Add fixture `pipeline/tests/fixtures/experience-single-role.json`: one employer heading (name + location) followed by one role line (title, full date range) and 2+ achievement bullets (contracts/doc-convention.md, quickstart.md #1)
- [X] T007 [P] [US1] Add fixture `pipeline/tests/fixtures/experience-multi-role.json`: one employer heading followed by two role lines, each with its own `client` and achievements, one ending in `Present` (quickstart.md #2, #3)
- [X] T008 [P] [US1] Add fixture `pipeline/tests/fixtures/experience-employer-order.json`: three employer headings in sequence, each with one role and achievements (quickstart.md #4)
- [X] T009 [US1] Write `pipeline/tests/parse-experience.test.ts` asserting `parseExperience()` returns `{ ok: true }` with the exact `Experience` value (Doc order preserved, ongoing role has no `endDate`) for fixtures T006–T008 — depends on T006, T007, T008, T003, T004, T005

### Implementation for User Story 1

- [X] T010 [US1] Implement `parseExperience(lines: DocLine[]): Result<Experience | undefined, ParseError>` in `pipeline/src/domain/parse-experience.ts`: recognizes the `EXPERIENCE` heading (FR-002), employer headings, role lines (title/client/dates), and bulleted achievements (FR-003–FR-006) per contracts/doc-convention.md; builds each `Role`/`EmployerEntry` only once its required fields are present, validation-by-construction (research.md #2); collects one `ParseError` per employer with no roles, role with no achievements, or unparseable date instead of throwing (FR-010, research.md #4) — depends on T009 (must fail before this task), T003, T004, T005

**Checkpoint**: `pnpm --filter pipeline test` passes T009 — User Story 1 is independently functional (well-formed Experience content parses correctly end-to-end at the domain level).

---

## Phase 4: User Story 3 - Reject output that doesn't fit the data model (Priority: P1)

**Goal**: The same `parseExperience()` from User Story 1 reports every way a Doc's Experience content fails to fit the `schema/` model, instead of guessing or silently dropping data (FR-010, FR-011).

**Independent Test**: Feed `parseExperience()` fixtures that each violate the model in one isolated way (employer with no roles, role with no achievements, unparseable date), and one fixture combining all three; confirm each returns `{ ok: false }` with a `ParseError` correctly identifying the offending employer/role, and that the combined fixture reports all three at once, not just the first (quickstart.md #7–#9, #11).

### Tests for User Story 3 (write first — Constitution Principle IV) ⚠️

- [X] T011 [P] [US3] Add fixture `pipeline/tests/fixtures/experience-employer-no-roles.json`: an employer heading immediately followed by another employer heading, with no role line between them (quickstart.md #7)
- [X] T012 [P] [US3] Add fixture `pipeline/tests/fixtures/experience-role-no-achievements.json`: a role line immediately followed by another role line, with no bulleted achievements between them (quickstart.md #8)
- [X] T013 [P] [US3] Add fixture `pipeline/tests/fixtures/experience-bad-date.json`: a role line whose date reads `"March 2019"` instead of `MM/YYYY` (quickstart.md #9)
- [X] T014 [P] [US3] Add fixture `pipeline/tests/fixtures/experience-multiple-errors.json`: combines the three defects from T011–T013 in one document (quickstart.md #11)
- [X] T015 [US3] Extend `pipeline/tests/parse-experience.test.ts` asserting `parseExperience()` returns `{ ok: false }` with one correctly-targeted `ParseError` for each of T011–T013, and all three simultaneously (not just the first) for T014 (FR-010, FR-011) — depends on T011, T012, T013, T014, T010 (same file as T009; must fail before T010 already satisfies it)

**Checkpoint**: `pnpm --filter pipeline test` passes T015 — User Story 3's failure contract is verified independently of User Story 2 (no `About` involvement).

---

## Phase 5: User Story 2 - Turn the About section into narrative text (Priority: P2)

**Goal**: `parseAbout()` returns the Doc's `ABOUT` narrative paragraph unsplit, or `undefined` when there's no `ABOUT` section (FR-001).

**Independent Test**: Feed `parseAbout()` a fixture with an `ABOUT` heading and one paragraph, and a fixture with no `ABOUT` heading at all; confirm the first returns that paragraph's text and the second returns `undefined`, with no `Experience`/`ResumeBody` involvement required (quickstart.md #5, #6).

### Tests for User Story 2 (write first — Constitution Principle IV) ⚠️

- [X] T016 [P] [US2] Add fixture `pipeline/tests/fixtures/about-narrative.json`: an `ABOUT` heading followed by one narrative paragraph (quickstart.md #5)
- [X] T017 [P] [US2] Add fixture `pipeline/tests/fixtures/about-missing.json`: no `ABOUT` heading anywhere in the fixture (quickstart.md #6)
- [X] T018 [US2] Write `pipeline/tests/parse-about.test.ts` asserting `parseAbout()` returns the paragraph text unsplit for T016 and `undefined` for T017 — depends on T016, T017, T003

### Implementation for User Story 2

- [X] T019 [US2] Implement `parseAbout(lines: DocLine[]): About | undefined` in `pipeline/src/domain/parse-about.ts`: finds the `ABOUT` heading and returns the text of the lines following it up to the next top-level heading, or `undefined` when no `ABOUT` heading exists or nothing follows it (FR-001, contracts/doc-convention.md) — depends on T018 (must fail before this task), T003

**Checkpoint**: `pnpm --filter pipeline test` passes T018 — User Story 2 is independently functional; all three user stories now coexist without conflict.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Wire the three independently-tested domain functions into the actual CLI (fetch → adapt → parse → write-or-report), matching contracts/pipeline-cli.md. This is the integration point over all three stories, so it lands last — same reasoning 001 used to defer `ResumeBody` to its own Polish phase.

- [X] T020 [P] Extract the existing Google Docs fetch logic from `pipeline/src/index.ts` into `pipeline/src/infrastructure/google-docs-client.ts`, unchanged in behavior (plan.md Project Structure; pure move, no new logic, no new test — same guarantees as today)
- [X] T021 [P] Add fixture `pipeline/tests/fixtures/raw-doc-response-sample.json`: a minimal Google Docs API response shape (`body.content`) covering a `HEADING_1`, a `HEADING_2`, a plain paragraph, and a bulleted paragraph, for exercising heading-level/bullet detection
- [X] T022 Write `pipeline/tests/doc-lines.test.ts` asserting the adapter turns T021's fixture into the expected `DocLine[]` (correct `headingLevel`, `bullet`, and `text` with the Doc's trailing newline stripped) — depends on T021
- [X] T023 Implement `pipeline/src/infrastructure/doc-lines.ts`: adapter turning a raw Google Docs API response's `body.content` into `DocLine[]` (data-model.md "Pipeline data flow") — depends on T022 (must fail before this task), T003
- [X] T024 Implement `parseResume(lines: DocLine[]): Result<ResumeBody, ParseError>` in `pipeline/src/domain/parse-resume.ts`, combining `parseAbout()` and `parseExperience()` (`ok: false` iff `parseExperience()` is — data-model.md) — depends on T010, T019
- [X] T025 [P] Add fixtures `pipeline/tests/fixtures/ignored-section.json` (an `EDUCATION` section with malformed content between `ABOUT` and `EXPERIENCE`) and `pipeline/tests/fixtures/section-order.json` (`EXPERIENCE` before `ABOUT`) for the spec's Edge Cases (FR-008, FR-013; quickstart.md #12, #13)
- [X] T026 Write `pipeline/tests/parse-resume.test.ts` covering: a fully valid combined document (quickstart.md #10) and the two edge-case fixtures from T025 (ignored sections never cause failure or leak into output; section order doesn't matter) — depends on T024, T025
- [X] T027 Implement `pipeline/src/infrastructure/resume-writer.ts`: writes a `ResumeBody` to `resume.json` at the repo root; the function is only ever called on a successful `Result`, so a failed run leaves any existing file untouched (contracts/pipeline-cli.md) — depends on T004
- [X] T028 Rewrite `pipeline/src/index.ts` as the composition root: fetch (T020) → adapt (T023) → `parseResume()` (T024) → on `{ ok: true }` write via T027 and exit `0`; on `{ ok: false }` print every `ParseError`'s `path` and `message` to stderr and exit non-zero, writing nothing (contracts/pipeline-cli.md, FR-011, FR-012) — depends on T020, T023, T024, T027
- [X] T029 Run `pnpm --filter pipeline typecheck` and `pnpm --filter pipeline test` (quickstart.md "Run the automated tests") and confirm both exit `0` — depends on T026, T028
- [X] T030 [P] Update `pipeline/README.md` to document the implemented parsing/validation behavior, the `pnpm --filter pipeline test` command, and the failure contract (no write, printed errors, nonzero exit) from contracts/pipeline-cli.md — depends on T028

**Note**: A full real-Doc run (`pnpm --filter pipeline generate`, quickstart.md "Run the pipeline for real") requires live `GOOGLE_SERVICE_ACCOUNT_KEY`/`GOOGLE_DOC_ID` credentials and is a manual validation step, not an automated task — perform it once T029 passes.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: No dependency on Setup's contents, but conventionally follows it — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion — no dependency on User Story 2 or 3
- **User Story 3 (Phase 4)**: Depends on User Story 1's `parse-experience.ts` (T010) existing, since it tests that same function's error paths — no dependency on User Story 2
- **User Story 2 (Phase 5)**: Depends on Foundational completion only — independent of User Story 1 and 3
- **Polish (Phase 6)**: Depends on User Story 1, 2, and 3 all being complete (`parse-resume.ts` combines US1+US2's functions; the CLI wiring exercises US3's failure contract end-to-end)

### User Story Dependencies

- **User Story 1 (P1)**: Independent — introduces `parse-experience.ts`; nothing here requires `About` or the CLI wiring
- **User Story 3 (P1)**: Structurally follows User Story 1 because it verifies the error-reporting paths of the *same* `parse-experience.ts` function (validation-by-construction unifies both — research.md #2), but is fully testable without User Story 2 or the CLI
- **User Story 2 (P2)**: Independent — introduces `parse-about.ts` only, a file neither US1 nor US3 touches

### Within Each User Story

- Fixtures and the test file precede the implementation task, per Constitution Principle IV
- Story complete (checkpoint passes) before starting the next phase
- Same-file edits (`tests/parse-experience.test.ts` extended by both US1's T009 and US3's T015) are intentionally sequential, not [P]

### Parallel Opportunities

- T001/T002 (Setup) can run together
- T003/T004/T005 (Foundational) can run together — three unrelated type files
- T006/T007/T008 (US1 fixtures) can run together; T011–T014 (US3 fixtures) can run together
- T016/T017 (US2 fixtures) can run together, and — since US2 touches no file US1/US3 touch — Phase 5 can be worked in parallel with Phase 3/4 by a second contributor, even though it's listed after them for priority ordering
- In Polish: T020 (client extraction) and T021 (raw-response fixture) can run together; T025 (edge-case fixtures) can run in parallel with T020–T024

---

## Parallel Example: Phase 2 + across User Stories

```bash
# Foundational — run together:
Task: "Define DocLine in pipeline/src/domain/doc-line.ts"
Task: "Define Result<T, E> in pipeline/src/domain/result.ts"
Task: "Define ParseError in pipeline/src/domain/parse-error.ts"

# Once Foundational is done, these can run together (different files, different stories):
Task: "Add fixture pipeline/tests/fixtures/experience-single-role.json (US1)"
Task: "Add fixture pipeline/tests/fixtures/about-narrative.json (US2)"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 3)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T005)
3. Complete Phase 3: User Story 1 (T006–T010)
4. Complete Phase 4: User Story 3 (T011–T015)
5. **STOP and VALIDATE**: `pnpm --filter pipeline test` passes for all Experience fixtures, both happy and failure paths
6. This is the MVP — the two P1 stories together mean Experience parsing works *and* never silently publishes bad data, even before `About` exists

### Incremental Delivery

1. Setup + Foundational → shared domain types ready
2. Add User Story 1 (T006–T010) → validate independently → Experience parsing works
3. Add User Story 3 (T011–T015) → validate independently → Experience parsing never lies about bad input
4. Add User Story 2 (T016–T019) → validate independently → About parsing works
5. Add Polish (T020–T030) → real Doc → `resume.json`, end to end, matching contracts/pipeline-cli.md

### Notes

- [P] tasks touch different files with no unmet dependency
- `tests/parse-experience.test.ts` is intentionally edited by both US1 (T009) and US3 (T015) — sequential, not parallel
- Commit after each task or logical group
- Stop at each checkpoint to validate that story independently before proceeding
