# personal_landing_page

Personal landing page / living resume. Source of truth for the resume
content is a Google Doc; a build-time pipeline turns it into `resume.json`,
which the frontend reads at build time. There is no live backend — see
[docs/architecture-decisions.md](docs/architecture-decisions.md) for the
full reasoning behind every choice below.

## Structure

pnpm workspace, pure TypeScript/Node.js:

- [`frontend/`](frontend) — the site. Framework not chosen yet.
- [`pipeline/`](pipeline) — Google Docs → `resume.json` script, run via a
  manually triggered GitHub Actions workflow.
- [`schema/`](schema) — shared resume data types, imported by both. Field
  shape not defined yet.

## Setup

```
corepack enable
pnpm install
```

Requires Node >= 20. Package manager version is pinned via `packageManager`
in the root `package.json`; `corepack` reads it automatically.

## Scripts

- `pnpm generate` — run the pipeline locally (see
  [pipeline/README.md](pipeline/README.md) for required env vars).
- `pnpm build` — build all packages that define a `build` script.
- `pnpm typecheck` — typecheck all packages that define a `typecheck` script.

## Status

This is the initial scaffold only. Nothing here implements resume parsing,
renders a page, or is deployed. See "Open / deferred" in
[docs/architecture-decisions.md](docs/architecture-decisions.md) for what's
still undecided.

## Ideas
1. footnote - moving data since or something like that
2. footnote/moving - add the current time at my location
3. something that interact with the page scrolling - need think about this
4. section with what I'm studying at the moment
