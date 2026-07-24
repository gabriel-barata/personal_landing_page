# Quickstart: Validating the Resume Google Doc Parsing Pipeline

This is a run guide, not an implementation guide — it proves the design in
`data-model.md` / `contracts/` satisfies the spec's acceptance scenarios and
success criteria, once implemented in `pipeline/src/`. It assumes the
testing approach chosen in `research.md` #1 and #5: `node:test` over
committed synthetic fixtures, no live Google Doc call in any test.

## Prerequisites

- Node.js >= 20, pnpm (already pinned by the repo's `packageManager` field).
- Dependencies installed: `pnpm install` from the repo root.
- The `domain/`/`infrastructure/` modules from `plan.md`'s Project Structure
  implemented, along with `pipeline/tests/fixtures/` and a `"test"` script in
  `pipeline/package.json` (implementation tasks — not part of this plan).

## Run the automated tests (no credentials needed)

```bash
pnpm --filter pipeline test        # runs node:test over tests/*.test.ts against tests/fixtures/
pnpm --filter pipeline typecheck   # unchanged — tsc --noEmit over src/
```

A non-zero exit from `test` is a failing test; a clean exit is passing. No
`.env` or network access is required for this command (research.md #5).

## Run the pipeline for real (requires credentials)

```bash
pnpm --filter pipeline generate    # fetches the real Doc, writes resume.json at the repo root
```

Requires `GOOGLE_SERVICE_ACCOUNT_KEY` and `GOOGLE_DOC_ID` in
`pipeline/.env` (see `pipeline/README.md`, unchanged). Expected outcome per
`contracts/pipeline-cli.md`: exit `0` and an updated `resume.json`, or a
nonzero exit with no file change and a printed list of every part of the Doc
that doesn't fit `schema/`'s shape.

## Fixture scenarios to cover (maps to spec Acceptance Scenarios)

Each bullet is one fixture under `pipeline/tests/fixtures/`, built as generic
`DocLine[]` data following `contracts/doc-convention.md` (not the author's
real resume content):

**User Story 1 — Experience → structured data**

1. **Single-role employer** (US1 Scenario 1) — one employer heading, one
   role line with a full date range, 2+ achievement bullets. Expect one
   `EmployerEntry` with one `Role`, fields populated exactly, achievements in
   bullet order.
2. **Multi-role employer** (US1 Scenario 2) — one employer heading, two role
   lines (each with a different `client`), each with its own bullets. Expect
   one `EmployerEntry` with two `Role`s in Doc order, each with its own
   `client` and `achievements`.
3. **Ongoing role** (US1 Scenario 3) — a role line ending in `Present`.
   Expect that `Role.endDate` is `undefined`, every other field populated.
4. **Employer order** (US1 Scenario 4) — three employer headings in a row.
   Expect `Experience` in the same top-to-bottom order.

**User Story 2 — About → narrative text**

5. **About narrative** (US2 Scenario 1) — an `ABOUT` heading followed by one
   paragraph. Expect `About` equal to that paragraph's text, unsplit.
6. **No About heading** (US2 Scenario 2) — no `ABOUT` heading at all in the
   fixture. Expect `ResumeBody.about` is `undefined`, no error.

**User Story 3 — reject data that doesn't fit the model**

7. **Employer with no roles** (US3 Scenario 1) — an employer heading
   immediately followed by the next employer heading (or end of section).
   Expect `Result.ok === false` with one `ParseError` naming that employer;
   no `resume.json` write attempted.
8. **Role with no achievements** (US3 Scenario 2) — a role line immediately
   followed by another role line (or end of employer), no bullets between.
   Expect one `ParseError` naming that role.
9. **Unparseable date** (US3 Scenario 3) — a role line with a date like
   `"March 2019"` instead of `MM/YYYY`. Expect one `ParseError` naming that
   role and quoting the bad value.
10. **Fully valid document** (US3 Scenario 4) — a fixture combining #1, #2,
    #3, #5 with no defects. Expect `Result.ok === true` with the fully
    populated `ResumeBody`.
11. **Multiple simultaneous errors** (research.md #4) — a fixture combining
    #7, #8, and #9 in one document. Expect all three `ParseError`s in the
    same `Result`, not just the first.

**Edge cases** (spec Edge Cases section)

12. A section other than `ABOUT`/`EXPERIENCE` present (e.g. `EDUCATION`)
    with content that would otherwise fail validation (e.g. a heading with
    no body) — expect no error and no trace of it in the output (FR-008).
13. `ABOUT`/`EXPERIENCE` in reversed order, or with an ignored section
    between them — expect identical output to the in-order case.

## Expected outcome

- `pnpm --filter pipeline test` passes only when every fixture above
  produces the `Result` described.
- This is the executable form of Success Criteria SC-001–SC-004: fixtures
  #1–#4 and #10 demonstrate SC-001/SC-004 (a matching Doc produces complete,
  schema-fitting output); #7–#9 and #11 demonstrate SC-003 (an invalid Doc
  always fails loudly, never partially); re-running #1–#6 after tweaking a
  single field in the fixture (adding a bullet, changing an end date) without
  touching `pipeline/src/domain/` demonstrates SC-002.
