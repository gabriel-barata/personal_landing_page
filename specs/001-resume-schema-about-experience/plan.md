# Implementation Plan: Resume Schema — About & Experience

**Branch**: `001-resume-schema-about-experience` | **Date**: 2026-07-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-resume-schema-about-experience/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Define the About and Experience portion of the shared resume data shape as
plain TypeScript types/interfaces in the existing `schema` workspace package,
so `pipeline` and `frontend` have a common contract to eventually populate
and render. No mapping or rendering logic is added — this feature is the
data shape only (see spec Assumptions). The design (`ResumeBody { about?,
experience? }`, non-empty tuple types for roles/achievements, a `Month`
literal union, and absence-of-`endDate` = ongoing) is detailed in
`data-model.md` and `contracts/resume-body.md`; the rationale for each
choice, including how the constitution's TDD gate is met with zero new
dependencies, is in `research.md`.

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js >= 20 (ESM, `NodeNext` module resolution — per `tsconfig.base.json` / root `package.json`)

**Primary Dependencies**: None at runtime. `schema/package.json` has a single devDependency (`typescript`) today and this feature adds none — the type definitions are the entire package (per architecture decision 6: plain TS types/interfaces, no codegen, no runtime validation layer).

**Storage**: N/A — pure type definitions, no data persistence in this feature.

**Testing**: `tsc --noEmit` over TypeScript fixture files (positive fixtures assigning literal data to the exported types; negative fixtures using `// @ts-expect-error`) — no test-runner dependency added. See `research.md` #1 for why this satisfies Constitution Principle IV without new tooling.

**Target Platform**: Node.js library package (`schema`), consumed by the `pipeline` and `frontend` workspace packages within the existing pnpm monorepo — not deployed on its own.

**Project Type**: Single library package inside an existing pnpm-workspace monorepo (`schema/`, alongside sibling `pipeline/` and `frontend/` packages already in the repo).

**Performance Goals**: N/A — no runtime computation; compile-time-only artifact.

**Constraints**: Zero non-dev runtime dependencies (architecture decision 6); must compile cleanly under the shared strict `tsconfig.base.json`; must not require any field for resume content outside About/Experience (FR-009).

**Scale/Scope**: Small — one `ResumeBody` type reachable graph: `About` (string) and `Experience` (a handful of `EmployerEntry`, each with a handful of `Role`s, each with a handful of `achievements`). Confirmed against the real source document (`pipeline/tmp/raw-doc.json`): 6 employers, up to 3 roles under one employer.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment | Result |
|---|---|---|
| I. Layered Architecture | `schema` is the shared inner/domain-level data shape; it has no dependency on `frontend` (interface) or `pipeline`'s infrastructure code, and both of those depend on it, not the reverse. | PASS |
| II. Isolated Business Logic | This feature adds no business rules or decisions — it is a data shape only. There is no UI/infra code in scope to isolate against. | PASS (N/A: no logic introduced) |
| III. Error as Value | No functions are introduced, so there is no error path to represent as a value or as an exception. Applies to a later feature (pipeline mapping) instead. | PASS (N/A: no functions in scope) |
| IV. Test-Driven Development | Satisfied via compile-time fixtures (positive + `@ts-expect-error` negative) written alongside the type definitions, run via `tsc --noEmit`; see research.md #1 and quickstart.md. Each acceptance scenario maps to a named fixture before/alongside implementation. | PASS |
| V. Simplicity | No new dependencies; reuses the existing `schema` package and existing `tsconfig.base.json`; uses the TS compiler itself instead of adding a test framework; no speculative wrapper types (e.g. `About` stays a plain `string`, not `{ text: string }`). | PASS |
| VI. Technology Agnosticism | This gate concerns the Constitution document itself, not this Plan; the Constitution names no technology. Confirmed unaffected by this Plan's choices. | PASS (N/A to Plan content) |

No violations — Complexity Tracking is not needed.

**Post-design re-check (after Phase 1)**: `data-model.md` and
`contracts/resume-body.md` introduce no dependency, no cross-layer coupling,
and no untested behavior beyond what's covered above. Gates still PASS
unchanged.

## Project Structure

### Documentation (this feature)

```text
specs/001-resume-schema-about-experience/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── resume-body.md
├── checklists/
│   └── requirements.md
└── tasks.md              # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

This feature touches exactly one existing workspace package —
`schema/` — inside the already-established pnpm monorepo
(`frontend/`, `pipeline/`, `schema/`; see `docs/architecture-decisions.md`
decision 1). No new package, no changes to `frontend/` or `pipeline/` are
part of this feature.

```text
schema/
├── package.json          # existing — no new dependencies added
├── tsconfig.json          # existing — builds src/ only (unchanged; ships dist/)
├── tsconfig.test.json      # NEW — extends tsconfig.base.json; include: ["src", "tests"]; noEmit test/typecheck config
├── src/
│   ├── index.ts            # existing entry point — re-exports the types below
│   ├── date.ts              # NEW — Month, DatePart
│   ├── experience.ts        # NEW — Role, EmployerEntry, Experience
│   ├── about.ts             # NEW — About
│   └── resume-body.ts       # NEW — ResumeBody
└── tests/
    └── resume-body.fixtures.ts   # NEW — positive + @ts-expect-error negative fixtures (research.md #1, quickstart.md)
```

**Structure Decision**: Single-project change within the existing monorepo,
scoped entirely to the `schema` package. Type definitions are split into
small files by concept (`date.ts`, `about.ts`, `experience.ts`,
`resume-body.ts`) rather than one flat file, matching Simplicity (each file
readable on its own) without introducing subdirectories/modules the small
scope doesn't need. A single `tests/` directory holds the compile-time
fixtures described in `research.md` and `quickstart.md`; `tsconfig.test.json`
keeps them out of the shipped `dist/` build (`tsconfig.json` still targets
`src` only), so `pnpm --filter schema build`/`typecheck` (consumed by
`pipeline`/`frontend`) is unaffected by test-only files.

## Complexity Tracking

*No entries — Constitution Check reported no violations.*
