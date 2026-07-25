# Visual Direction Conformance Audit — First Draft

Audit date: 2026-07-25. Compares the current `frontend/` implementation against
every rule in [`docs/visual-direction.md`](./visual-direction.md). Scope: the
static UI layer (components, `tokens.css`, `global.css`, hero/section data).
Content is placeholder (per `CLAUDE.md`) — this audit checks **visual/layout
conformance**, not copy or real data.

Legend: ✅ conforms · ⚠️ deviation · 🔎 not statically verifiable (manual check).

---

## Summary table

| # | Decision | Status |
|---|---|---|
| 1 | Single column, no persistent sidebar | ✅ |
| 2 | Hero text-only, no photo | ✅ |
| 3 | Hero content & order | ⚠️ monogram missing from hero; CV omitted from contact row |
| 4 | Tech Stack: category-grouped icon+label | ⚠️ category set differs from the doc |
| 5 | Square corners, hairlines, no shadows | ✅ |
| 6 | Page sections & order | ✅ |
| 7 | Experience timeline: static rail | ⚠️ dates not placed *left* of the rail |
| 8 | Accent `#0F7C86` + ≥15px accent-text floor | ✅ |
| 9 | Spacing scale (hard-cap 64px) | ⚠️ section gaps double up (128px hero→experience) |
| 10 | Motion: near-zero | ✅ |
| 11 | Buttons outline→filled, ≥15px | ✅ |
| 12 | Responsive: single 768px breakpoint | ✅ |
| 13 | Header: no nav bar, transparent | ⚠️ header has an opaque `--color-base` bar |
| 13a | Monogram: single sticky element (inline→sticky) | ⚠️ permanently in header, never inline in hero |
| 14 | Badges: real images, grayscale→color | ✅ |
| 15 / 15a | Bilingual EN/PT + toggle | ✅ (visual); PT still re-exports EN (content) |
| 17 | Monogram typeface: Silkscreen | ✅ |
| 18 | Dark mode: one inverted variant | ⚠️ theme switch not fully instant (some transitions crossfade) |
| — | Typography / type scale / measure | ✅ |
| — | Palette base + no pure black/white | ✅ |

---

## Deviations (detail)

### D1 — Monogram is not inline in the hero (decisions 3 & 13a) — **High**

Decision 3 lists hero item 1 as **"Monogram + name"**, and decision 13a is
explicit: *"One monogram in the DOM — sits inline next to the name in the hero
at rest; becomes `position: sticky`, pinned top-left, once scrolled past the
hero."*

Current implementation:
- The monogram lives only in [Header.astro](../frontend/src/components/Header.astro#L13),
  inside a **permanently sticky** header (`position: sticky; top: 0`).
- The hero's `<h1>` in [Hero.astro](../frontend/src/components/Hero.astro#L10)
  is the name **only** — no monogram beside it.

So the intended "starts inline beside the name → becomes sticky after the hero"
behaviour is not present; instead the monogram is a fixed top-left element at
all scroll positions, and the hero's first item (monogram+name) is incomplete.

### D2 — Header is an opaque bar, not transparent (decision 13) — **Medium**

Decision 13: *"both on transparent background — no bar/container chrome around
them."*

[Header.astro:35](../frontend/src/components/Header.astro#L35) sets
`background: var(--color-base)` on `.site-header`, giving it a solid,
full-width bar appearance — the "bar/container chrome" the decision explicitly
rules out. (This is a side-effect of making the whole header persistently
sticky; decision 13a's inline-then-sticky monogram avoids needing an opaque
bar.)

### D3 — Experience dates are not left of the rail (decision 7) — **High**

Decision 7: *"A single vertical hairline runs down the **left edge**… Dates sit
**left of the rail** in tabular-nums mono; role/company/summary sit right."*

Current layout in [Experience.astro](../frontend/src/components/Experience.astro#L54-L69):
- `.rail` is absolutely positioned at `left: 0` (far left edge of the entry).
- `.entry` is a `96px 1fr` grid with `padding-left: var(--space-24)`, so **both**
  the dates column and the content column sit to the **right** of the rail.

Intended zoning is `[ dates ] [ rail ] [ role/company/summary ]`. The rail
currently sits outside the dates rather than between the dates and the content.
(Ticks, square shape, accent-for-current vs. support-gray-for-past, and the
static/no-animation rule are all correct.)

### D4 — Section gaps double up past the 64px hard cap (decision 9) — **High**

Decision 9: section-to-section gap is `48–64px`, **hard-capped at 64px** — *"never
scales up further."*

The section components each add `padding-top: var(--section-gap)`, while the
hero also adds `padding-bottom: var(--section-gap)`. Because paddings don't
collapse, adjacent section paddings **stack**:

- Hero → Experience: hero `padding-bottom: 64` + experience `padding-top: 64`
  = **~128px** (2× the cap). See [Hero.astro:54](../frontend/src/components/Hero.astro#L54)
  and [Experience.astro:37](../frontend/src/components/Experience.astro#L37).
- Certifications/Education → Footer: certedu `padding-bottom: 64` + footer
  `padding: 24` = **~88px**.

(Experience → Tech Stack and Tech Stack → Cert/Edu are a correct 64px because
those sections use `padding-bottom: 0`.) Recommend a single owner of the gap
per boundary so no boundary exceeds 64px (48px on mobile).

### D5 — Tech Stack categories differ from the doc's named groups (decision 4) — **Medium**

Decision 4 names the categories `LANGUAGES`, `DATA & PIPELINES`,
`CLOUD & INFRA`, `FSI DOMAIN TOOLS`.

[tech-stack.ts](../frontend/src/data/tech-stack.ts) instead defines **8**
categories: Programming Languages, Databases & Storage, Data Tools,
Visualization Tools, Cloud, ML Frameworks & Tools, Programming Frameworks,
Others. Notably there is **no `FSI DOMAIN TOOLS` group**, which is the one
domain-specific bucket the doc calls out.

The rendering treatment (monochrome icon + label, ink at rest, accent on hover,
13px mono category headers, 15px item labels, wrapping items) all conforms — the
deviation is the **grouping/taxonomy**. This may be intentional if the feature's
`contracts/content-data.md` superseded the doc's illustrative list; flagged here
because it diverges from the visual-direction text as written.

### D6 — Hero contact row omits the CV button (decision 3, item 6) — **Low**

Decision 3 item 6: hero contact row = *"2–3 buttons/links (email, LinkedIn, CV
download)."*

[contact-links.ts:33](../frontend/src/data/contact-links.ts#L33) filters CV out
of `contactRowLinks`, so the hero shows only Email + LinkedIn. There is a
rationale in the code (the header already carries a standalone Download CV
button, decision 13). It stays within the "2–3" range, but the doc explicitly
names CV download as a hero contact item — flagged as a conscious minor
divergence to confirm.

### D7 — Theme switch is not fully instant (decision 18) — **Low/Medium**

Decision 18: *"the theme switch itself is instant, with no transition… A
page-wide crossfade on every element is a more noticeable, more 'app-like'
flourish."*

Several elements carry standing `transition` declarations on `color` /
`background-color` / `filter` (e.g. `.item` in
[TechStack.astro:69](../frontend/src/components/TechStack.astro#L69), the
`.contact-button`/`.cv-button` hover transitions, `.badge-image` filter). These
are correct for hover, but they are **not suppressed during a theme toggle**, so
flipping LIGHT/DARK will animate those properties as the CSS variables change —
producing exactly the partial crossfade decision 18 wants to avoid. Consider
gating transitions behind a "user is hovering/focusing" state, or disabling
transitions on the `data-theme` change.

---

## Verified conforming (spot-checks worth recording)

- **Squares/hairlines/no shadows (5):** `global.css` forces
  `border-radius: 0 !important` and `box-shadow: none !important` globally; all
  borders are `1px var(--color-border)`.
- **Accent value + ≥15px accent-text floor (8):** `--color-accent: #0f7c86`
  (light), `#4fa3ac` (dark). Every accent-on-text usage is ≥15px on the base
  background — hero stack labels (15px), tech item labels (15px), button labels
  (15px). No accent text below 15px or on a tinted background.
- **Buttons (11):** outline accent at rest / filled accent on hover, base-colored
  text on fill; dark-mode hover uses `#4fa3ac` fill with `#101416` text (avoids
  the flagged low-contrast pairing).
- **Palette + type (carried-over):** base `#F6F8F8`, border `#DFE4E5`, support
  `#68706F`, ink `#131817` all match; type scale `34/24/18/15/13`; body 17px /
  line-height 1.65; headings line-height 1.2; `max-width: 65ch` on text blocks;
  `tabular-nums` on dates/meta/timeline; Space Grotesk 500 headings, Space Mono
  body, Silkscreen monogram, all self-hosted with `font-display: swap`. No pure
  `#000`/`#fff` found.
- **Dark mode palette (18):** all five dark tokens match the doc; OS-preference
  default with `localStorage` override in the render-blocking bootstrap; badge
  light backing plate present.

## Manual checks still required (🔎)

- **Hero fits without scrolling** on a standard laptop viewport (decision 3) —
  not statically verifiable; verify in-browser at ~1440×900 and ~1280×800.
- **60–75ch measure holds** after real (longer) content replaces placeholders.
- **Badge grayscale→color** and **language/theme toggles** behave correctly at
  runtime (logic present; needs a live smoke test).
