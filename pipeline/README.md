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

The parsing logic (Docs API response → `schema` package's resume shape)
is not implemented yet.
