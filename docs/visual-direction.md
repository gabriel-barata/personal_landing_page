# Visual Direction — Personal Landing Page / Living Resume

Recorded 2026-07-24. Consolidates the visual direction for the site — palette,
typography, layout, components, and interaction rules — into a single spec
ready to hand to a frontend build and to a Claude Design prototype for
acceptance-checking. Supersedes the original `initial_visual_direction.md`
(now deleted); that file's fonts/palette/principles are folded in below,
several with revised decisions from a grill-me session that resolved every
"provisional" or open item.

## Revision history

- **2026-07-24 (after first Claude Design draft):** reviewed four deviations
  the prototype introduced against this spec. Amended: hero stack row now
  uses curated platform icons instead of text chips (decision 3); icon
  sourcing requirement made explicit/non-optional (decision 4); certification
  badges now use real credential images instead of text tags (decision 14,
  rewritten); monogram typeface fixed as Silkscreen, closing a gap where the
  original doc's "optional pixel moment" note was dropped during
  consolidation (decision 17, new).

## Context

Data engineer, focused on FSI (banks and insurers). The page acts as a living
résumé: recruiters/hiring managers need name, role, summary, stack, location,
experience, and contact info in a single glance, with a leaner, more sober
scroll experience below that for those who want more detail. Tone: sobriety,
serenity, a tech touch — explicitly **not** an extravagant dev portfolio.

Reference reactions that shaped the decisions below:

- **ai-2027.com** — liked the sobriety and the timeline sidebar; disliked the
  sheer amount of text.
- **andy-hk.com** — liked the clear, organized tech-stack presentation; disliked
  the large spacing between elements.
- **anirban-portfolio-delta.vercel.app** — liked surfacing all recruiter-relevant
  info (name, roles, summary, stack, location, experience, contacts) in one
  glance, plus the scroll-driven storytelling; disliked the messy element
  disposition.
- **GTC (Global Tech Council) artwork** — liked the sober-but-tech vibe; disliked
  excessive spacing and some out-of-place elements.

## Principles

- Minimalist and clean, résumé-like — not an extravagant dev portfolio.
- All essential information visible on first contact (no scroll required);
  the scroll experience below is additional depth, not a requirement.
- One neutral + one accent. ~90% neutral; accent used deliberately, not
  confined to a fixed list of elements — extend it to new components only
  when it signals something (interactive/high-value), never decoratively.
- Leaner than ai-2027.com, more organized than andy-hk.com, cleaner than the
  portfolio ref, less airy than all three.

## Decisions

### 1. Page architecture: single column, no persistent sidebar

Single centered column, top to bottom. No page-wide lateral sidebar/nav.

**Why:** ai-2027.com's sidebar was liked for its timeline concept, not for
being a persistent structural sidebar — and a page-wide sidebar would fight
the "leaner"/"résumé, not app" goal and complicate responsive layout for
little benefit on a short page.

**Timeline exception:** a slim vertical timeline rail is used, but scoped
*only* to the Experience section (see decision 7) — not as global chrome.

### 2. Hero: text-only, no photo

No headshot or profile photo anywhere on the page. The hero is pure
typography plus the monogram (decision 13a).

**Why:** keeps the page résumé-like rather than portfolio-like; avoids
fighting a photo for hero layout space; nothing in the original brief called
for a photo.

### 3. Hero content, in order

1. Monogram + name
2. Role/title line (e.g. "Data Engineer — FSI"), small-uppercase-label style
3. One-line professional summary (1–2 sentences max)
4. Metadata row: location + years of experience, inline, `tabular-nums`
   (e.g. `LISBON, PT · 6Y EXPERIENCE`)
5. Core stack row: 5 curated platform icons (Databricks, AWS, Claude, Azure,
   Snowflake), ink-colored at rest, each with a small uppercase accent-colored
   label *below* the icon
6. Contact row: 2–3 buttons/links (email, LinkedIn, CV download)

All six fit without scrolling on a standard laptop viewport.

**Why:** directly answers the anirban-portfolio reference — everything a
recruiter needs in <10 seconds — but in a deliberately ordered, non-messy
hierarchy instead of that reference's cluttered arrangement.

**Amended 2026-07-24:** item 5 originally specified plain-text chips for a
broader 5–8 tool list. The Claude Design prototype instead used 5 curated
platform icons with accent color on the icons themselves at rest. Revised
to: icons stay ink-colored at rest (consistent with the Tech Stack section,
decision 4), with accent applied only to the label text beneath each icon —
this keeps a single deliberate accent touch per item without turning the
hero into the page's most accent-heavy zone (see Principle 3).

### 4. Tech Stack section: category-grouped, icon + label

Grouped by category (`LANGUAGES`, `DATA & PIPELINES`, `CLOUD & INFRA`,
`FSI DOMAIN TOOLS`) as small uppercase mono labels. Each category lists items
as **monochrome icon + text label**, ink-colored at rest, accent-colored only
on hover. No filled badges, no logos in brand color. Category blocks stack
vertically at the section-internal spacing tokens (decision 9); items within
a category wrap horizontally with tight gaps.

**Why:** answers the andy-hk.com reference (organized, clear stack at a
glance) while fixing its main flaw (too much whitespace) via the spacing
scale, and keeping icons monochrome preserves the "~90% neutral" palette rule
that full-color brand logos would break.

**Icon sourcing (required, not optional):** all icons — Tech Stack section
and the hero platform row (decision 3) — are self-hosted: SVGs sourced from a
monochrome/single-path set (e.g. Simple Icons, Tabler), recolored via CSS
`fill`/`currentColor`, and committed into the repo (e.g.
`frontend/public/icons/` or as inlined components). No runtime CDN fetch to
Simple Icons/Tabler or any third party.

**Amended 2026-07-24:** the Claude Design prototype loaded icons live from a
CDN. Fine for a fast draft, but doesn't carry into the real build — matches
the existing self-hosted-fonts precedent (no external network dependency on
page load, no FOUC while a CDN request resolves, no risk of an icon set
changing or breaking under you).

### 5. Corners and borders: fully square, hairline, no shadows

`border-radius: 0` everywhere — buttons, chips, cards, dividers, timeline
ticks. 1px hairline borders using `--color-border`. No box-shadows anywhere.

**Why:** matches the GTC reference's hard-edged, high-contrast mono aesthetic
called out in the original doc; hairlines + squares read as "sober technical
document," shadows read as "soft app UI."

### 6. Page sections, in order

1. **Hero** (decision 3)
2. **Experience** — reverse-chronological, inline timeline rail (decision 7),
   each entry: role, company, dates (`tabular-nums`), 2–3 line impact summary
   max
3. **Tech Stack** (decision 4)
4. **Certifications / Education** — compact list, dates inline/right-aligned,
   certification badges (decision 14)
5. **Contact / footer** — repeats the contact CTA row from the hero

Explicitly excluded: long "About me" narrative, blog/writing section,
testimonials — anything risking a return to ai-2027.com's wall of text.

### 7. Experience timeline: static vertical rail

A single vertical hairline runs down the left edge of the Experience list.
Each entry gets a small **square** tick (per decision 5) at its vertical
position: the current/most recent role's tick is filled solid in the accent
color; all past roles are outline/support-gray. Dates sit left of the rail in
`tabular-nums` mono; role/company/summary sit right. Static — no
scroll-triggered fill or progress animation.

**Why:** delivers the timeline visual liked in the ai-2027.com reference,
scoped to where it's actually informative (work history), without borrowing
that reference's scroll-narrative motion, which would conflict with decision
10 (near-zero motion).

### 8. Accent color: `#1F3864` (deep navy)

Replaces the original doc's provisional rust/amber (`#A8500F`).

| Role | Hex | Contrast on `#FAF9F6` |
|---|---|---|
| Accent | `#1F3864` | ~11:1 (AA-safe with large margin) |

**Why:** the original accent was explicitly flagged "provisional, will
change." A cool navy against the warm-paper neutral base is a deliberate,
legible contrast; navy also reads as FSI/financial-trustworthy, which a
warm rust does not. Named `--color-accent` in CSS, not by hue, so it can
still move in one line if needed later.

### 9. Spacing scale

Tokens: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64` (px).

- Within a component (icon-to-label, date-to-role): `4–8px`
- Between related list items (stack items, experience entries): `16–24px`
- Between distinct page sections: `48–64px`, **hard-capped at 64px** —
  never scales up further on large viewports
- On mobile (< 768px, decision 12): section-gap cap drops to `48px`

**Why:** "too much space between elements" was your complaint about *both*
the andy-hk.com and GTC references. Without a hard cap, a prototype defaults
toward the airy spacing that's typical of "clean minimal" templates — this
makes "leaner" an enforceable rule, not a vibe.

### 10. Motion: near-zero

- No scroll-triggered reveals/fade-ins — content is present, not "revealed"
- Only short (~120–150ms, ease-out) color transitions on hover/focus (links,
  buttons, stack-icon hover)
- No parallax, no hover-lift, no shadow-on-hover, no animated timeline fill
- No page-load intro animation

**Why:** most of the animation patterns above are the current default for
portfolio-builder templates, and would undercut every other "sober document,
not app" decision made here (square corners, hairlines, no shadows, capped
spacing). ai-2027.com's scroll-driven storytelling is itself a heavily
animated pattern — appropriate for that project, not for this one.

### 11. Buttons/CTAs: outline at rest, filled on hover

Square (decision 5), 1px accent border, accent-colored text, transparent
background at rest. On hover: inverts to filled accent background with
paper-colored text.

**Why:** keeps the accent's "used deliberately, not everywhere" restraint at
rest, while giving buttons enough presence to read as actionable — a plain
text link risks disappearing into a mono-heavy page; a filled-at-rest button
would be too assertive for the sober tone.

### 12. Responsive: single 768px breakpoint

- **≥768px:** layout as designed above.
- **<768px:** experience entries stack (date moves above role/company instead
  of beside it); stack-section items wrap tighter; hero metadata row wraps to
  two lines rather than truncating; type scale steps down one notch (e.g. the
  34px heading becomes ~28px) to preserve the 60–75ch measure rule; section
  gaps cap at 48px instead of 64px.

**Why:** the page's single-column layout has little to reflow beyond spacing
and type scale, so one breakpoint covers the real needs (the timeline's
side-by-side date/content split is the one thing that genuinely breaks on
narrow screens).

### 13. Header: no nav bar

No traditional nav bar, no section jump-links. Persistent elements: the
monogram (top-left) and an outline "Download CV" button (top-right), both on
transparent background — no bar/container chrome around them. The `EN / PT`
language toggle (decision 15a) sits in the same top-right cluster.

**Why:** the page is short (4 sections after the hero) and single-scroll, so
jump-link navigation adds app-like chrome without real navigational value; a
full nav bar (as in the GTC reference) would work against the "résumé, not
app" goal.

### 13a. Monogram: single sticky element

One monogram in the DOM — sits inline next to the name in the hero at rest;
becomes `position: sticky`, pinned top-left, once scrolled past the hero.

**Why:** the original doc calls for the pixel-font monogram moment to be "a
single point on the page" — this satisfies that literally (one instance) while
still giving a persistent back-to-top affordance.

### 14. Badges: real credential images, certifications only

Badges = certification credentials in the Certifications section only. Not
used in the Stack section or anywhere else.

**Amended 2026-07-24:** originally specified as square accent-outline text
tags (e.g. `AWS CERTIFIED`). The Claude Design prototype used placeholders
for real credential badge images instead — the actual provider-issued
graphics (AWS, Databricks, Snowflake, etc.), which are full-color and
brand-specific, unlike the ink/monochrome treatment used for Tech Stack
icons (decision 4). Revised to:

- Real credential badge images, one per certification.
- Each sits in a fixed-size square slot (uniform height/width across all
  badges, regardless of each provider's native badge shape/proportions) with
  a thin `--color-border` hairline frame — no accent border.
- **Grayscale at rest, full color on hover** (a `filter: grayscale(1)` /
  `grayscale(0)` swap on the short hover transition from decision 10) — keeps
  the section sober by default while rewarding a closer look with the real
  branding, and avoids five unrelated brand palettes competing with the
  page's own palette at rest.

**Why:** certification badges are third-party-issued credentials, not a
stylistic choice like a tool icon — recruiters recognize the actual badge
graphic as a signal of "real, verified," which recoloring to ink/accent would
undermine. Bounding size and framing keeps them from reading as decoration
despite being full-color.

### 15. Language: bilingual EN/PT

Full bilingual support, English and Portuguese.

**15a. Toggle:** plain-text `EN / PT`, top-right, in the same persistent
cluster as the monogram/CV-download button (decision 13). Inactive language
in support-gray, active language in ink/text color — **not** accent (accent
stays reserved for links/CTA/timeline/badges). Hairline `/` separator. No
flag icons.

**Why:** the original doc's `latin-ext` font subsetting implied Portuguese
content was expected; a plain-text toggle avoids the "generic template" feel
of flag icons and fits the existing persistent top-right cluster rather than
requiring new UI surface.

### 16. Deliverable location

This document lives at `docs/visual-direction.md`, alongside
`docs/architecture-decisions.md`. `initial_visual_direction.md` (the original
scratch notes) is deleted now that its content is fully consolidated here.

### 17. Monogram typeface: Silkscreen

The monogram (decision 13a) is set in **Silkscreen**, a pixel font.

**Why:** the original doc's principles listed "optional pixel moment
(Silkscreen/Departure Mono) only for the monogram — a single point on the
page," but this line was dropped when consolidating fonts into this
document's Typography section, which only declared Space Grotesk and Space
Mono. The Claude Design prototype used Silkscreen for the monogram,
surfacing the gap. Closing it here: Silkscreen is the one-off third
typeface, used *only* for the monogram, self-hosted/subset like the other
two fonts (see Typography below).

## Carried over unchanged from the original draft

- **Typography:** Space Grotesk (medium 500) for headings/name; Space Mono
  (400) for body, metadata, dates; Silkscreen for the monogram only (decision
  17). Short text blocks (2–3 lines) — mono tires in long paragraphs, use a
  proportional font if a long passage is ever needed.
- **Type scale:** contained scale ~1.2 ratio: 34 / 24 / 18 / 15 / 13. Two
  weights (regular + medium). Body 17–18px, line-height 1.6–1.7; headings
  line-height ~1.2. Line measure 60–75 characters (`max-width: 65ch`).
- **Numerals:** `tabular-nums` on dates, metrics, and the timeline.
- **Letter-spacing:** `-0.02em` on large headings, `+0.06em` on small
  uppercase labels, none in body copy.
- **Fonts:** self-hosted, subset `latin` + `latin-ext` (ã õ ç ê),
  `font-display: swap`.
- **Palette base:**

  | Role | Hex | Use |
  |---|---|---|
  | Background | `#FAF9F6` | page |
  | Border | `#E6E2DA` | hairlines, dividers |
  | Support | `#6E6A62` | secondary text |
  | Text | `#171614` | body (near-black, never `#000`) |
  | Accent | `#1F3864` | links, CTA, active timeline marker, badges, and (per decision 1) any new component where it signals something interactive/high-value |

- Named by function in CSS (`--color-accent`, not `--color-navy`).
- No pure black/white. Minimum AA contrast (4.5:1), including secondary text.
- Categorical chart colors: still deferred until charts exist; must not
  compete with the accent.
- Dark mode: still a future toggle; light remains the default for now.
