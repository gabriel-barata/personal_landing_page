# Quickstart: Validating the Resume Schema (About & Experience)

This is a run guide, not an implementation guide — it proves the schema
defined in `data-model.md` / `contracts/resume-body.md` actually satisfies
the spec's acceptance scenarios and success criteria, once implemented in
`schema/src/`. It assumes the fixture-based testing approach chosen in
`research.md` #1 (no test-runner dependency; `tsc --noEmit` over source +
fixture files).

## Prerequisites

- Node.js >= 20, pnpm (already pinned by the repo's `packageManager` field).
- Dependencies installed: `pnpm install` from the repo root.
- The type definitions from `data-model.md` implemented and exported from
  `schema/src/index.ts` (implementation task — not part of this plan).
- Fixture files added under `schema/tests/` (or equivalent), included by a
  dedicated `tsconfig` used only for the type-check/test step (kept separate
  from the package's build `tsconfig.json` so fixtures never ship in `dist`).

## Run the validation

```bash
pnpm --filter schema typecheck   # compiles src/ only — the shipped package
pnpm --filter schema test        # compiles src/ + tests/ (fixtures) — the "test suite"
```

Both commands are `tsc --noEmit` runs. A non-zero exit code is a failing
test; a clean exit is passing.

## Fixture scenarios to cover (maps to spec Acceptance Scenarios)

Each bullet is one positive fixture (a literal value assigned to the type,
built from the real content in `pipeline/tmp/raw-doc.json` so the check
doubles as evidence for SC-001):

1. **Single-role employer** (US1 Scenario 1) — e.g. `BANCO INTER`, location
   `"Remote"`, one `Role` with title `"Data Engineer"`, `startDate { month:
   5, year: 2024 }`, `endDate { month: 3, year: 2025 }`, and its bullet list.
2. **Multi-role employer, one role ongoing** (US1 Scenario 2) — `INDICIUM
   AI`, location `"London, UK"`, three roles (`Aviva`, `Audantic`,
   `Indimesh` as `client` values) ordered most-recent first, where the
   `Aviva` role has no `endDate` (still `"Present"` in the source doc).
3. **Role with a named client distinct from the employer** (US1 Scenario 3)
   — same `INDICIUM AI` fixture: each role's `client` (e.g. `"Aviva"`)
   differs from the employer name (`"INDICIUM AI"`).
4. **About narrative as one block** (US2 Scenario 1) — the full `ABOUT`
   paragraph from the source doc assigned to a single `About` value, with no
   splitting.
5. **Full `Experience` ordering** — a fixture listing all employers from the
   source doc (`INDICIUM AI`, `BANCO INTER`, `VIZENTEC S/A`, `COSMEFAR`, …)
   in the same reverse-chronological order they appear in the doc, satisfying
   FR-011.
6. **`ResumeBody` independence** (FR-010) — one fixture with only `about`
   set, one with only `experience` set; both must compile.

Negative fixtures (each one `// @ts-expect-error` line, per research.md #1):

- `Role.achievements: []` (empty — must fail; FR-005 requires one or more).
- `EmployerEntry.roles: []` (empty — must fail; FR-004 requires one or more).
- `DatePart.month: 13` (out of range — must fail).
- A `ResumeBody` field for out-of-scope content (e.g. `education`) — must
  fail, since `ResumeBody` has no such property (FR-009).

## Expected outcome

- `pnpm --filter schema test` passes only when every fixture above compiles
  (or, for negative fixtures, fails to compile) as specified.
- This is the executable form of Success Criteria SC-001–SC-003: if a
  reviewer can build fixtures #1–#5 without contradiction or workaround
  fields, SC-001 and SC-003 hold; if adding a new bullet/role/employer to an
  existing fixture never requires touching `schema/src/`, SC-002 holds.
