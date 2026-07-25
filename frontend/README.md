# frontend

The site itself: a single static résumé page (hero, experience, tech stack,
certifications/education, contact) plus a language (EN/PT) and theme
(light/dark) toggle. Built with Astro (static output, no SSR adapter) — see
decision 10 of [docs/architecture-decisions.md](../docs/architecture-decisions.md)
and `specs/003-ui-layout-static-content/research.md` for the rationale.

Astro ships zero JavaScript for the static markup; the only client-side code
is the two toggle islands (`ThemeToggle.astro`, `LanguageToggle.astro`) and a
small render-blocking inline script that sets the theme/language before first
paint (no flash of the wrong theme). Fonts and icons are self-hosted — no
third-party CDN at runtime.

This feature does **not** yet read the pipeline-generated `resume.json` at
the repo root: Experience and the hero summary are local placeholder content,
and the `schema` workspace dependency is unused for now (see the spec's
Assumptions in `specs/003-ui-layout-static-content/spec.md`). Wiring the page
up to real resume data is future work.

## Setup

From the repo root:

```bash
corepack enable
pnpm install
```

Requires Node >= 22.13 (see root `package.json` `engines`).

## Scripts

Run from the repo root with `pnpm --filter frontend <script>`, or `cd
frontend` first and drop the `--filter frontend`:

- `dev` — start the local dev server (`astro dev`), with hot reload.
- `build` — produce the static production build in `frontend/dist/`.
- `preview` — serve the built `dist/` output locally, as a real static host
  would. Some things (no CDN calls, real asset resolution) only show up
  against this, not `dev` — see the quickstart doc below.
- `typecheck` — `tsc --noEmit` over `src/` and `tests/`.
- `test` — `node:test` over `tests/**/*.test.ts` (theme/language resolution
  logic and the static content data modules — no browser needed).

## Running locally

```bash
pnpm install
pnpm --filter frontend dev
```

Open the printed local URL (defaults to `http://localhost:4321`).

## Deploying

`pnpm --filter frontend build` outputs a fully static site to
`frontend/dist/` — plain HTML/CSS plus two tiny JS bundles for the toggles.
It has no server-side runtime, so it can be deployed to any static host
(Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 + CloudFront, etc.) by
pointing it at `frontend/dist/` after running the build. The actual hosting
platform hasn't been chosen yet — see "Open / deferred" in
[docs/architecture-decisions.md](../docs/architecture-decisions.md). No
environment variables or secrets are required to build or serve this
package.

Before deploying, sanity-check the production build locally:

```bash
pnpm --filter frontend build
pnpm --filter frontend preview
```

## Structure

```text
src/
├── pages/index.astro        # assembles the page; owns the no-FOUC bootstrap script
├── components/              # Header, Hero, Experience, TechStack,
│                             # CertificationsEducation, ContactFooter,
│                             # ThemeToggle/LanguageToggle (the only islands)
├── data/                    # typed static content (tech-stack, certifications,
│                             # education, experience placeholder, contact links,
│                             # i18n/en.ts + i18n/pt.ts)
├── lib/                     # framework-free theme.ts / language.ts resolution logic
└── styles/                  # tokens.css (design tokens) + global.css (reset, fonts)
public/
├── fonts/                   # self-hosted Space Grotesk/Space Mono/Silkscreen (woff2)
├── icons/                   # self-hosted monochrome SVGs (Tech Stack + hero stack)
└── badges/                  # certification badge images — currently placeholders,
                              # see "Known gaps" below
```

## Tests

```bash
pnpm --filter frontend typecheck
pnpm --filter frontend test
pnpm --filter frontend build
```

All three should pass before relying on a change. `test` covers
`lib/theme.ts`/`lib/language.ts`'s resolution rules and the exact
counts/content of the static data modules; visual/CSS conformance (spacing,
contrast, hover-only motion, etc.) is checked manually — see
[`specs/003-ui-layout-static-content/quickstart.md`](../specs/003-ui-layout-static-content/quickstart.md)
for the full checklist.

## Known gaps

- **Certification badges** (`public/badges/*.svg`): placeholders, not the
  real provider-issued images FR-019 calls for. `src/data/certifications.ts`
  already has the final id/path/alt-text contract, so swapping in real
  images later is a content-only change — drop the real files in under the
  same paths.
- **Experience entries and the hero summary** are plausible-but-fictional
  placeholder content by design (spec Assumptions), not real work history.
- **Portuguese copy**: `src/data/i18n/pt.ts` currently re-exports `en.ts`'s
  strings — the toggle is fully functional, but there's no real translation
  yet.
