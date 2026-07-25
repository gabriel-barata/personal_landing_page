# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal landing page / living résumé. The source of truth for résumé content is a Google Doc; a build-time pipeline turns it into `resume.json`, which the frontend reads at build time. There is **no live backend and no runtime API** — the frontend only ever reads static, already-generated JSON.

## Commands

Uses **pnpm workspaces** (three packages: `frontend`, `pipeline`, `schema`). Requires Node >= 22.13; the pnpm version is pinned via `packageManager` in the root `package.json` and read automatically by `corepack`.

```bash
corepack enable && pnpm install     # first-time setup
pnpm build          # build every package that defines a build script (recursive)
pnpm typecheck      # typecheck every package (recursive)
pnpm generate       # run the pipeline locally (needs pipeline/.env — see below)
```

Per-package (run from repo root; drop `--filter <pkg>` if you `cd` in first):

```bash
# frontend
pnpm --filter frontend dev          # astro dev server (http://localhost:4321)
pnpm --filter frontend build        # static build to frontend/dist/
pnpm --filter frontend preview      # serve the built dist/ as a real static host would
pnpm --filter frontend typecheck    # tsc --noEmit over src/ + tests/
pnpm --filter frontend test         # tsx --test over tests/**/*.test.ts

# pipeline
pnpm --filter pipeline test         # node:test over fixtures — no credentials or network
pnpm --filter pipeline typecheck

# schema — its "test" IS a typecheck: positive fixtures must compile,
# // @ts-expect-error negative fixtures must fail. No test runner.
pnpm --filter schema test
```

Run a single test file: `pnpm --filter frontend exec tsx --test tests/lib/theme.test.ts`

Before relying on any change, the relevant package's `typecheck` + `test` (+ `build` for frontend) should all pass.

## Architecture

The data flow is one direction, all at build time:

```
Google Doc ──(pipeline, manual GH Action)──> resume.json ──(build time)──> frontend/dist (static)
     schema/ types are imported by both pipeline and frontend
```

- **`schema/`** — shared TypeScript types for the résumé data model (`About`, `Experience`, `EmployerEntry`, `Role`, `ResumeBody`, …), consumed by both other packages as `workspace:*`. No codegen — the TS compiler enforces consistency directly. Only About + Experience are modelled so far. Its `dist/` is what other packages import (`main`/`types` point at `dist/`), so **run `pnpm --filter schema build` after changing schema types** or downstream typechecks see stale definitions.
- **`pipeline/`** — Google Docs → `resume.json` script. Runs only via a manually-triggered GitHub Actions `workflow_dispatch` (`.github/workflows/generate-resume.yml`), which opens a PR with the regenerated JSON rather than pushing to `main`. Generated `resume.json` **is committed** to the repo root (gives free version history). Auth is a Google Cloud service account (the Doc is shared with its email); credentials come from `GOOGLE_SERVICE_ACCOUNT_KEY` + `GOOGLE_DOC_ID` (GH secrets in CI, `pipeline/.env` locally — copy from `.env.example`).
- **`frontend/`** — the site, built with **Astro** (static output, no SSR adapter). Ships zero JS for static markup; the only client-side code is two "island" toggles (`ThemeToggle.astro`, `LanguageToggle.astro`) plus a small render-blocking inline script in `index.astro` that sets theme/language before first paint (no flash of wrong theme). Fonts and icons are **self-hosted** (`public/fonts`, `public/icons`) — no third-party CDN at runtime.

### Important: the frontend does not yet read `resume.json`

Feature 003 built the layout with **local placeholder content** in `frontend/src/data/`. Experience entries and the hero summary are plausible-but-fictional, `i18n/pt.ts` currently re-exports `en.ts` (no real translation), and certification badges under `public/badges/` are placeholders. The `schema` dependency is present but unused by the frontend for now. Wiring the page to real `resume.json` data is future work — don't assume it's connected.

## Constitution — binding architectural rules

`.specify/memory/constitution.md` governs how code is structured across the repo. The load-bearing principles (visible in the pipeline's `domain/` vs `infrastructure/` split):

1. **Layered architecture** — dependencies point inward. The domain layer MUST NOT import from UI or infrastructure. Concrete dependencies are wired only at the entry point (see `pipeline/src/index.ts`, the composition root).
2. **Isolated business logic** — all domain rules live in the domain layer; UI/interface code only collects input and presents results, never encodes "what should happen".
3. **Error as value** — predictable failures are returned as a `Result<T, E>` (`{ ok: true, value } | { ok: false, errors }`), *not* thrown. Exceptions are restricted to the infrastructure boundary and translated to a `Result` before crossing back in. The pipeline reports *every* problem found, not just the first.
4. **TDD** — write/extend a test before or alongside the behavior; a change isn't done until a test demonstrates it.
5. **Simplicity / YAGNI** — single-author, single-user scope. Don't add abstraction or configurability for hypothetical future needs; prefer fewer moving parts.
6. **Technology agnosticism** — the constitution names no specific tech; tool choices live in each feature's Plan and are recorded in `docs/architecture-decisions.md`.

## Before making decisions

Two docs record decisions already made *with their rationale* — read them before re-deciding or contradicting them:

- **`docs/architecture-decisions.md`** — repo structure, pipeline, schema, framework choices (numbered decisions, some marked superseded/revisited).
- **`docs/visual-direction.md`** — the full visual spec: palette (one neutral + teal accent `#0F7C86`, dark-mode variant), typography (Space Grotesk / Space Mono / Silkscreen monogram), spacing scale (hard-capped at 64px), square corners + hairlines + no shadows, near-zero motion, single 768px breakpoint, per-section layout. The frontend CSS lives in `src/styles/tokens.css` (design tokens) + `global.css`.

## Spec-driven workflow (Spec Kit)

Features are developed under `specs/NNN-name/` (spec.md → plan.md → tasks.md, plus research/data-model/contracts/quickstart). `.specify/feature.json` points at the current feature directory. The `speckit-*` skills drive this workflow (specify, plan, tasks, implement, analyze, etc.). Each feature's `quickstart.md` holds its manual acceptance checklist (visual/CSS conformance is checked manually, not by automated tests).
