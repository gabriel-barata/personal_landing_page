# Architecture Decisions — Personal Landing Page / Living Resume

Recorded 2026-07-24. Captures the repo structure and backend architecture decisions
made before any code was written, so future work (and future sessions) can proceed
from a shared understanding instead of re-litigating these choices.

## Revision history

- **2026-07-25 (feature 003 planning session):** resolved the "Frontend
  framework choice" open item (decision 10, new) — Astro was chosen while
  planning the first feature that needed a real frontend. Full rationale in
  `specs/003-ui-layout-static-content/research.md` #1.
- **2026-07-24 (later same day):** switched the pipeline from Python to pure
  TypeScript/Node.js. This superseded three decisions from the original session:
  repo tooling (decision 1), cross-language schema sharing (decision 6), and the
  language split (decision 9). Their entries below reflect the current,
  post-revision state; the original Python-based reasoning is preserved via git
  history on this file rather than left inline.

## Context

The site is a personal landing page that acts as a living resume, meant to give
recruiters/companies an easy way to reach and learn about the author. The source
of truth for resume content is a Google Doc. The core design question was how to
get that content from the Doc into the site's UI.

## Decisions

### 1. Repository structure: monorepo with pnpm workspaces

Single repository, pure TypeScript/Node.js, organized as pnpm workspace
packages:

- `frontend` — the site.
- `pipeline` — the Google Docs → JSON script.
- `schema` — the resume data schema, a real workspace package (`workspace:*`)
  depended on by both other packages.

One root `package.json`, one `pnpm-lock.yaml`, root-level scripts can
orchestrate both sides (e.g. `pnpm --filter pipeline generate`).

**Why:** The pipeline only exists to feed this one frontend — no independent
release cadence, no other consumers, no separate team. Splitting into a
polyrepo would add repo-management overhead without a corresponding benefit. A
single PR can change the schema and the component that renders it atomically.
With everything in TypeScript now (decision 9), pnpm workspaces are the
low-friction standard way to share the schema package between `frontend` and
`pipeline` — real dependency resolution, one install, no relative-path or
manual-copy hacks.

**Why pnpm over npm workspaces:** pnpm's stricter dependency resolution avoids
phantom dependencies (a package working only because something else hoisted a
transitive dep into scope), which otherwise surfaces as a subtle break later.
For a small, occasionally-revisited repo, catching that class of bug up front
is worth the one-time install of pnpm.

**Rejected:** Polyrepo (separate repo for the pipeline, consumed via published
artifact/API) — complexity not justified for a single-consumer, solo-maintained
project.

**Superseded:** an earlier version of this decision used flat, unlinked folders
with no workspace tooling, specifically because the pipeline was Python and
mixing it into a JS workspace tool bought little. That rationale no longer
applies now that the pipeline is TypeScript too (see decision 9).

### 2. Backend is a build-time pipeline, not a live service

There is no persistent server and no runtime API. The "backend" is a Python
script that fetches the Google Doc and regenerates a structured `resume.json`.
The frontend only ever reads the static, already-generated JSON — it never talks
to Google at runtime.

**Why:** Resume content changes infrequently and changes are author-controlled.
A live/on-demand backend would add hosting, security surface (an exposed
Google-fetching endpoint), and operational overhead for no real benefit over
"update doc → run pipeline → review → deploy."

**Rejected:** Persistent always-on API server. **Rejected:** On-demand
serverless function that fetches from Google per-request.

### 3. Pipeline trigger: manual GitHub Actions dispatch

The pipeline runs only when manually triggered via a GitHub Actions
`workflow_dispatch` — no polling/scheduled runs.

**Why:** The author doesn't update the resume often enough to justify a
scheduled job; a manual trigger avoids that cost while still not requiring a
local dev environment to publish an update (can be run from anywhere via
GitHub's UI).

### 4. Google auth: service account

A Google Cloud service account is created; the Google Doc is shared with the
service account's email (like sharing with a person). The service account's key
is stored as a GitHub Actions secret. The pipeline reads the Doc via the Docs
API using this credential.

**Why:** Keeps the Doc private (vs. "publish to web" which makes it publicly
fetchable) and gives access to the Docs API's structured document model
(headings, paragraphs, lists as real objects) rather than scraping an HTML
export.

**Rejected:** "Publish to web" + fetch the public export URL — no credentials
needed, but the doc becomes technically public, and HTML export is messier to
parse than the Docs API's structured model.

### 5. Data schema: fixed, opinionated — not a generic doc mirror

The pipeline parses the Doc into a predefined schema (e.g. `contact`, `summary`,
`experience[]` with `{company, title, startDate, endDate, bullets[]}`,
`education[]`, `skills[]`, `projects[]`), requiring the Doc to follow a
convention (specific heading names/order) that maps to these fields. This is in
contrast to generically mirroring the Doc's heading/paragraph structure into a
generic tree.

**Why:** The goal is a purpose-built UI (timelines, skill badges, filterable
project cards) rather than "your Google Doc rendered as a webpage." That
requires the pipeline to know the semantic meaning of each chunk, which requires
committing to a schema.

*(Exact field-level schema still to be defined in a follow-up session.)*

### 6. Schema shared as native TypeScript types

The resume schema (decision 5) is defined once as plain TypeScript
types/interfaces in the `schema` workspace package, imported directly by both
`pipeline` and `frontend`. No codegen step, no intermediate schema format — the
TypeScript compiler enforces consistency across both consumers directly.

**Why:** With the pipeline and frontend now both TypeScript (decision 9), there
is no language boundary left to bridge. A JSON-Schema-plus-codegen layer only
earns its cost when it's crossing runtimes; here it would just be extra
tooling and a build step with no remaining payoff over importing a shared
`interface`.

**Superseded:** the original decision used JSON Schema (generated from a
Pydantic model) as the source of truth, with TypeScript types generated from
it, specifically to bridge the Python pipeline / TypeScript frontend boundary.
That boundary no longer exists (see decision 9), so this reverted to native TS
types.

### 7. Generated JSON is committed to the repo (may be revisited)

The pipeline writes `resume.json` and commits it into the repo rather than
treating it as an ephemeral build artifact regenerated on every deploy.

**Why:** Decouples "update my data" from "how the site happens to be hosted" —
any standard git-triggered deploy picks up the change with no special
integration. Also yields a free version history of resume content over time via
`git log`.

**Note:** Author flagged this may change in the future (e.g. if a combined
fetch+build+deploy job turns out to be preferable).

### 8. Pipeline opens a PR rather than pushing directly to `main`

The GitHub Actions run commits the regenerated `resume.json` to a branch and
opens a PR showing the diff, rather than pushing straight to `main`.

**Why:** Since runs are infrequent (manual trigger, decision 3), the review
step costs little but catches any Docs-API parsing misfires (e.g. an oddly
nested bullet list) in the diff before it goes live on a page recruiters see.

**Rejected:** Direct push to `main` on every pipeline run.

### 9. Pure TypeScript/Node.js across the repo

Both the pipeline and the frontend are TypeScript/Node.js. The pipeline uses
Node's `googleapis` client library to talk to the Docs API instead of Python's
`google-api-python-client`.

**Why:** Author's explicit preference, after reconsidering — a single-language
repo was judged cleaner overall for this project than splitting by concern.
This is what unlocked decisions 1 (pnpm workspaces) and 6 (native TS types for
the schema), both of which only make sense once there's no language boundary
to manage.

**Superseded:** the original decision split languages by concern — Python for
the pipeline/script, TypeScript for the frontend — reasoning that Python suited
scripting/Google-API work well. The author revisited this and preferred a pure
TypeScript repo instead.

### 10. Frontend framework: Astro

The `frontend` package uses Astro (static output, no SSR adapter) as its
build tool/framework.

**Why:** The page is described (`docs/visual-direction.md`) as an
almost-entirely-static "living résumé" with near-zero motion and exactly two
pieces of client interaction (language and theme toggles). Astro's islands
architecture ships zero JavaScript for static content by default and only
hydrates the two toggle components, so the framework's default output shape
already matches that brief rather than requiring discipline (as a full SPA
framework would) to avoid becoming more "app" than "document." It also keeps
the frontend on the Simplicity principle: no client-side router, no global
state library, no hydration decisions for the ~95% of the page that never
changes after load.

**Rejected:** React + Vite (full component runtime for a page needing almost
no client-side reactivity). Svelte + Vite (compiles away too, but still
mounts a runtime for the whole page vs. Astro's per-island hydration).
Vanilla TypeScript + Vite, no framework (leanest runtime, but pushes
componentizing eight repeated Tech Stack categories, six badge slots, and a
three-entry timeline onto hand-written DOM code).

**Decided:** 2026-07-25, while planning feature
`003-ui-layout-static-content` (first feature needing a real frontend). Full
rationale: `specs/003-ui-layout-static-content/research.md` #1.

## Open / deferred (not yet decided)

- Exact field-level resume schema (what goes in `experience[]`, `skills[]`, etc.)
- Hosting platform for the frontend
- Domain
- Additional page features (contact form, PDF download, analytics, i18n)
- Whether decision 7 (commit JSON to repo) gets revisited in favor of a combined
  fetch+build+deploy job
