# Implementation Plan: Resume Google Doc Parsing Pipeline

**Branch**: `002-resume-doc-pipeline` | **Date**: 2026-07-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-resume-doc-pipeline/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Turn the already-fetched raw Google Docs API response (`pipeline/src/index.ts`'s
existing fetch step) into a validated `ResumeBody` (the shape defined in the
`schema` workspace package) and write it to `resume.json` at the repo root, or
fail the run with no output when the Doc doesn't fit that shape. The design
splits the work into a Google-Docs-specific adapter that flattens the raw API
response into a neutral line-based representation, and a pure, dependency-free
domain layer that turns those lines into `ResumeBody` (or a list of errors),
so the parsing/validation rules stay testable and isolated from both the
Google API shape and file I/O (Constitution Principles I–III). Full rationale
in `research.md`; concrete shapes in `data-model.md` and `contracts/`.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js >= 20 (ESM, `NodeNext` module resolution — per `tsconfig.base.json`, unchanged from 001).

**Primary Dependencies**: `googleapis` (existing, unchanged — used only by the infrastructure fetch step already in `pipeline/src/index.ts`) and the `schema` workspace package (existing dependency, `workspace:*`) for the `ResumeBody`/`EmployerEntry`/`Role`/`DatePart`/`About` types. No new runtime dependency is added: parsing and validation are hand-written domain code, not a schema-validation library (see research.md #2).

**Storage**: Filesystem only. Input is the Google Doc, read via the Docs API (decision 4, unchanged). Output is a single JSON file, `resume.json`, written at the repo root (decision 7) — the same path the existing `generate-resume.yml` workflow already stages into a PR.

**Testing**: Node's built-in test runner (`node:test` + `node:assert/strict`) exercising the domain parsing/validation functions against committed synthetic Doc-line fixtures — no network calls and no new devDependency (research.md #1).

**Target Platform**: Node.js CLI script — run locally via `pnpm --filter pipeline generate`, or in CI via the existing `workflow_dispatch` GitHub Actions job (decision 3, unchanged).

**Project Type**: Single package (`pipeline/`) within the existing pnpm workspace monorepo; this feature adds internal structure to that package but no new workspace package.

**Performance Goals**: N/A beyond "a single run completes well within the manual-trigger flow" (SC-004) — resume-sized documents (single-digit employers/roles, a paragraph of About text), no throughput target.

**Constraints**: No new runtime dependency (Simplicity; extends decision 6's "no runtime validation/codegen layer" stance now that real untrusted input exists to validate). The domain parsing/validation code MUST NOT import `googleapis` or `node:fs` (Layered Architecture). A failed run MUST leave any existing `resume.json` untouched (spec Assumptions).

**Scale/Scope**: Same small scale confirmed in 001's plan — ~6 employers, up to 3 roles each, a handful of bullets per role; About is a single paragraph.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Result |
|---|---|---|
| I. Layered Architecture | Domain parsing/validation (`pipeline/src/domain/`) has zero dependency on `googleapis` or `node:fs`; infrastructure (Google fetch, the raw-response-to-lines adapter, the JSON writer) depends inward on the domain's neutral `DocLine`/`Result`/`ParseError` types, never the reverse; `index.ts` composes them only at the entry point. | PASS |
| II. Isolated Business Logic | Every decision about what counts as a valid employer/role/About (heading recognition, title/client/date splitting, achievement collection, the "must have ≥1 role/achievement" rules) lives in `domain/parse-*.ts`. `index.ts` and the infrastructure modules only fetch, flatten, and write — no resume-semantic decisions. | PASS |
| III. Error as Value | Domain parse functions return `Result<T, ParseError>` and never throw for predictable issues (missing achievements, unparseable dates, missing required fields — FR-010). Only the existing Google-fetch call may throw, for genuine I/O failure (unchanged existing behavior, spec Edge Cases) — `index.ts` is the sole place that turns a failed `Result` into a nonzero exit and a printed error list (FR-011). | PASS |
| IV. Test-Driven Development | Every parsing/validation rule gets a `node:test` case, written alongside its implementation task, against committed fixtures covering each acceptance scenario in all three user stories (see quickstart.md). | PASS (enforced during Tasks/Implementation) |
| V. Simplicity | No new runtime dependency; hand-written validation-by-construction instead of a schema-validation library; Node's built-in test runner instead of adding one; the Google-response-to-lines adapter is the only new "translation" layer, and it exists because Layered Architecture (Principle I) requires the domain to stay free of `googleapis` types — not speculative generality. | PASS |
| VI. Technology Agnosticism | Governs the Constitution document itself, not this Plan; the Constitution names no technology. Unaffected by this Plan's choices. | PASS (N/A to Plan content) |

No violations — Complexity Tracking is not needed.

**Post-design re-check (after Phase 1)**: `data-model.md` and `contracts/`
introduce exactly the layering described above (one neutral intermediate type,
one Result/error type, one CLI-level contract) and no additional dependency,
cross-layer coupling, or untested behavior. Gates still PASS unchanged.

## Project Structure

### Documentation (this feature)

```text
specs/002-resume-doc-pipeline/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── doc-convention.md
│   └── pipeline-cli.md
├── checklists/
│   └── requirements.md
└── tasks.md              # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

This feature touches exactly one existing workspace package — `pipeline/` —
inside the already-established pnpm monorepo (`frontend/`, `pipeline/`,
`schema/`; see `docs/architecture-decisions.md` decision 1). It reads from
`schema/` (existing dependency, unchanged) and writes one new generated file
at the repo root. No new workspace package, no changes to `frontend/` or
`schema/` are part of this feature.

```text
pipeline/
├── package.json              # existing — adds a "test" script; no new dependencies
├── tsconfig.json              # existing — builds src/ only, unchanged
├── tsconfig.test.json          # NEW — extends tsconfig.base.json; include: ["src", "tests"], mirroring schema's pattern
├── src/
│   ├── index.ts                # existing — becomes the composition root: fetch → flatten → parse → write, wiring only
│   ├── infrastructure/
│   │   ├── google-docs-client.ts   # NEW — the existing fetch-the-raw-Doc logic, extracted unchanged from index.ts
│   │   ├── doc-lines.ts             # NEW — adapter: raw Docs API response → domain's neutral DocLine[]
│   │   └── resume-writer.ts         # NEW — writes a validated ResumeBody to resume.json at the repo root
│   └── domain/
│       ├── doc-line.ts               # NEW — the DocLine type (neutral: text, headingLevel, bullet)
│       ├── result.ts                  # NEW — minimal local Result<T, E> helper type (no dependency)
│       ├── parse-error.ts              # NEW — ParseError type (FR-011: identifies section/employer/role + reason)
│       ├── parse-about.ts               # NEW — DocLine[] → About | undefined (US2, FR-001)
│       ├── parse-experience.ts           # NEW — DocLine[] → Result<Experience | undefined, ParseError> (US1, FR-002–FR-007)
│       └── parse-resume.ts                # NEW — orchestrates the two above → Result<ResumeBody, ParseError> (US3, FR-009–FR-013)
└── tests/
    ├── fixtures/                    # NEW — synthetic DocLine[]/raw-response JSON fixtures, one per acceptance scenario
    ├── parse-about.test.ts           # NEW
    ├── parse-experience.test.ts       # NEW
    └── parse-resume.test.ts            # NEW

resume.json                     # NEW generated artifact at the repo root (decision 7) — not authored by hand, produced by `pnpm generate`
```

**Structure Decision**: Single-project change within the existing monorepo,
scoped to the `pipeline` package. `infrastructure/` and `domain/` are split
per Constitution Principle I (dependencies point inward: `domain/` imports
nothing from `infrastructure/` or `googleapis`/`node:fs`; `infrastructure/`
imports `domain/`'s neutral types; `index.ts` is the only place both are
imported together). This mirrors 001's per-concept file split inside a single
package rather than introducing new workspace packages, matching Simplicity.

## Complexity Tracking

*No entries — Constitution Check reported no violations.*
