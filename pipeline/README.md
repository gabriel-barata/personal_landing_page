# pipeline

Build-time script that fetches the resume Google Doc and regenerates
`resume.json` at the repo root. Not a live service — see
[docs/architecture-decisions.md](../docs/architecture-decisions.md),
decision 2.

## Setup

1. Create a Google Cloud service account and share the resume Google Doc
   with its email address (decision 4).
2. Copy `.env.example` to `.env` and fill in `GOOGLE_SERVICE_ACCOUNT_KEY`
   and `GOOGLE_DOC_ID`.
3. `pnpm --filter pipeline generate`

In CI, the same two values are read from GitHub Actions secrets by the
`generate-resume` workflow (`.github/workflows/generate-resume.yml`),
triggered manually via `workflow_dispatch` (decision 3).

## What it does

The Doc is expected to follow a fixed convention — an `ABOUT` heading with a
narrative paragraph, and an `EXPERIENCE` heading containing one sub-heading
per employer, each with one or more role lines and their bulleted
achievements. See
[`specs/002-resume-doc-pipeline/contracts/doc-convention.md`](../specs/002-resume-doc-pipeline/contracts/doc-convention.md)
for the full grammar.

- **On success**: `resume.json` at the repo root is created or overwritten
  with the parsed, validated resume data, and the process exits `0`.
- **On failure** (the Doc doesn't fit the `schema` package's data model —
  e.g. an employer with no roles, a role with no achievements, an
  unparseable date): the process exits non-zero, prints every problem found
  (not just the first) to stderr with its location in the Doc, and leaves
  `resume.json` untouched. See
  [`specs/002-resume-doc-pipeline/contracts/pipeline-cli.md`](../specs/002-resume-doc-pipeline/contracts/pipeline-cli.md)
  for the full contract.

## Tests

```bash
pnpm --filter pipeline test        # node:test over tests/*.test.ts, no credentials or network needed
pnpm --filter pipeline typecheck   # tsc --noEmit over src/
```

Tests run against small, synthetic `DocLine[]`/raw-response fixtures
committed under `tests/fixtures/` — never against a real Google Doc.
