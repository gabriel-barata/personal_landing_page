# Contract: the pipeline's run behavior (CLI)

This feature has no network-facing API — its "interface" is a command-line
run, invoked the same way today's fetch-only step already is
(`pipeline/README.md`). This document is the contract `index.ts`
(the composition root) and its consumers (a human running it locally, or the
`generate-resume.yml` GitHub Actions job) can rely on.

## Invocation

Unchanged from today:

```bash
pnpm --filter pipeline generate    # equivalently: pnpm generate, from the repo root
```

Requires `GOOGLE_SERVICE_ACCOUNT_KEY` and `GOOGLE_DOC_ID` in the environment
(`.env` locally, GitHub Actions secrets in CI) — unchanged, decision 4.

## On success (the Doc fits the `schema/` data model)

- Exit code `0`.
- `resume.json` at the repo root is created or overwritten with the
  validated `ResumeBody` (FR-012), matching `schema/`'s shape exactly — no
  extra fields.
- A short confirmation is printed (e.g. what was fetched and written) —
  informational only, not part of this contract's guarantees.

## On failure (the Doc does not fit the `schema/` data model)

- Exit code `1` (or any nonzero code) — a `pnpm --filter pipeline generate`
  failure, so the `generate-resume.yml` job's "Run pipeline" step fails and
  the subsequent "Open PR" step does not run, per that workflow's existing
  `if: success()`-implicit step ordering.
- `resume.json` is **not** created, and if it already exists at the repo
  root (from a previous successful run), it is left byte-for-byte unchanged
  (spec Assumptions) — a failed run is never partially applied.
- Every `ParseError` collected during the run (research.md #4) is printed to
  stderr, one per line, each showing its `path` and `message` (FR-011), e.g.:

  ```text
  Resume Doc does not fit the schema/ data model:
    EXPERIENCE > "ACME CORP" > role 2: role has no achievement bullets
    EXPERIENCE > "OTHER CO" > role 1: start date "March 2019" is not in MM/YYYY form
  ```

This is unchanged for the *existing* fetch failure mode (network/auth error
talking to the Docs API) — that already exits nonzero today and continues to
do so; this feature does not add validation on top of that case (spec Edge
Cases).

## Non-goals of this contract

- No machine-readable error format (e.g. JSON on stderr) — a human (the
  resume author) is the only consumer of failure output today; adding a
  structured format is unwarranted complexity (Principle V) until a second
  consumer needs one.
- No partial/best-effort output mode (e.g. writing whatever employers did
  parse and skipping the rest) — User Story 3 is explicitly "stop and tell
  me," not "publish what you could."
