# Visual Direction — Personal Landing Page / Living Resume

Recorded 2026-07-24. Consolidates the visual direction for the site — palette,
typography, layout, components, and interaction rules — into a single spec
ready to hand to a frontend build and to a Claude Design prototype for
acceptance-checking. Supersedes the original `initial_visual_direction.md`
(now deleted); that file's fonts/palette/principles are folded in below,
several with revised decisions from a grill-me session that resolved every
"provisional" or open item.

## Revision history

- **2026-07-25 (Education & Certifications restructure, grill-me session):**
  decision 19 amended. Chapter `03` was "Certifications" with "Education" as
  an unnumbered sub-heading, which read as two unrelated sections rather than
  one. Retitled the chapter "Education & Certifications," with
  "Certifications" and "College" (renamed from "Education") as two equal
  sub-sections beneath it, both styled with Tech Stack's category-label
  treatment instead of a bespoke heading style.
- **2026-07-25 (chapter headings, grill-me session):** new decision 19 —
  Experience, Tech Stack, and Certifications/Education headings become
  numbered chapter headings (`01/03`, Silkscreen + Space Grotesk, 24px) with
  a static hairline-and-tick seam divider replacing the bare whitespace
  before each, addressing a "looks like a document, nothing marks a new
  section" complaint. A page-wide scroll-tracked progress rail was
  considered and explicitly rejected in favor of this static device, to
  avoid reopening decisions 1, 7, and 10 (no persistent global chrome,
  near-zero motion) without a compelling reason. Cascading: decision 17
  amended (Silkscreen now also used for the chapter number, not monogram-only).
- **2026-07-25 (hero viewport containment, grill-me session):** decision 3
  amended. The hero was shipping at natural content height with no lower
  bound, so on a standard laptop viewport the Experience heading and first
  entries were visible in the same first view — violating this decision's
  "all six fit without scrolling" intent by under-delivering it (nothing
  *enforced* that only the hero showed). Hero is now a strict first-viewport
  section on desktop: `min-height: calc(100vh - header height)`, content
  centered as one block to absorb slack on tall viewports, allowed to grow
  taller than that floor (never clipped) on unusually short windows. Scoped
  to desktop (≥768px) only — mobile keeps today's natural-flow behavior, since
  decision 3's "standard laptop viewport" language was already desktop-scoped
  and mobile hero content is proportionally taller relative to viewport
  height. No scroll-affordance element (chevron/label) added — decision 10's
  motion restraint plus the "sober document" principle argue against new
  chrome not already in the spec; the fold line itself is the only cue. Also:
  the role line (decision 3, item 2) now carries two roles —
  `DATA ENGINEER / FORWARD DEPLOYED ENGINEER — FSI` — same single-line,
  small-uppercase-label treatment, no layout change.
- **2026-07-25 (visual conformance audit):** one amendment from reconciling
  this doc against the shipped frontend. Tech Stack categories (decision 4)
  updated to match the 8-category/43-item taxonomy fixed by spec.md's
  Clarifications session and `contracts/content-data.md` (FR-003), which
  supersedes this doc's earlier illustrative 4-category list — the content
  contract is tested (`tests/data/tech-stack.test.ts`) and is the source of
  truth for exact categories/items.
- **2026-07-25 (grill-me session):** three changes from a palette/scope
  review. Neutrals shift warm → cool across base/border/support/ink (decision
  8 rationale and Palette base table); accent changes navy → teal (decision
  8, rewritten, including a new standing minimum-size/no-tinted-background
  rule and explicit acknowledgment of the FSI-trust-for-tech-signal
  trade-off); dark mode moves from a deferred footnote to a fully specified,
  in-scope decision (decision 18, new). Cascading fixes from the accent
  change: hero stack label (decision 3) gets a scoped 15px exception to stay
  accent-colored and AA-compliant; Tech Stack item labels (decision 4) and
  button/CTA labels (decision 11) get an explicit ≥15px floor to close gaps
  the doc previously left unspecified.
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
2. Role/title line (e.g. "Data Engineer / Forward Deployed Engineer — FSI"),
   small-uppercase-label style — multiple roles slash-separated, single line
3. One-line professional summary (1–2 sentences max)
4. Metadata row: location + years of experience, inline, `tabular-nums`
   (e.g. `LISBON, PT · 6Y EXPERIENCE`)
5. Core stack row: 5 curated platform icons (Databricks, AWS, Claude, Azure,
   Snowflake), ink-colored at rest, each with a small uppercase accent-colored
   label *below* the icon
6. Contact row: 2–3 buttons/links (email, LinkedIn, CV download)

All six fit without scrolling on a standard laptop viewport.

**Amended 2026-07-25 (hero viewport containment):** "fits without scrolling"
is now an enforced layout rule, not just a content-budget target. On desktop
(≥768px), the hero section is `min-height: calc(100vh - header-height)`
(`header-height` a fixed px value derived from the header's own tokens, not
runtime-measured — decision 13), with its content vertically centered as one
block via flexbox. This absorbs leftover space on tall viewports without
adding to inter-element gaps (decision 9's spacing cap is unaffected — this is
outer whitespace, not spacing *between* elements). The section is allowed to
grow past that floor (never clipped/scrollable-within-hero) if content
doesn't fit an unusually short window — the trade is that the next section
may then peek in slightly on those rare viewports, which is preferable to
hiding hero content. Scoped to desktop only; mobile (<768px) keeps natural
content-height flow as today, since mobile hero content runs proportionally
taller relative to viewport height (wrapped metadata, stacked stack icons)
and decision 3's "standard laptop viewport" framing was already desktop-only.
No added scroll-affordance UI (chevron/label) — see decision 10.

**Amended 2026-07-25 (audit):** item 6 is implemented as **email + LinkedIn
only** (2 buttons), not email + LinkedIn + CV. The header (decision 13)
already carries a standalone, persistent "Download CV" button — repeating it
in the hero contact row (and its footer echo, decision 6) would be a
redundant second CTA for the same action. Still within the "2–3" range this
decision specifies; the CV-specific item is intentionally covered by the
header instead.

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

**Amended 2026-07-25:** this label uses the same "small uppercase label"
style as the rest of the page (13px per the type scale), which falls below
the ≥15px floor now required for accent-colored text (decision 8). Rather
than dropping the accent color here — the hero's one deliberate accent
touch — this specific label is a scoped exception set at 15px; every other
small-uppercase-label instance on the page (role/title line, category
headers, etc.) stays at 13px, since only this one is accent-colored.

### 4. Tech Stack section: category-grouped, icon + label

Grouped by category as small uppercase mono labels. Each category lists items
as **monochrome icon + text label**, ink-colored at rest, accent-colored only
on hover. No filled badges, no logos in brand color. Category blocks stack
vertically at the section-internal spacing tokens (decision 9); items within
a category wrap horizontally with tight gaps.

**Amended 2026-07-25 (audit):** this decision originally named four
illustrative categories (`LANGUAGES`, `DATA & PIPELINES`, `CLOUD & INFRA`,
`FSI DOMAIN TOOLS`). Spec.md's Clarifications session (2026-07-25) and its
`contracts/content-data.md` (FR-003) fixed a more granular, tested taxonomy —
**8 categories, 43 unique items** — as the actual content contract:
Programming Languages, Databases & Storage, Data Tools, Visualization Tools,
Cloud, ML Frameworks & Tools, Programming Frameworks, Others. This supersedes
the four-category illustration above; `frontend/src/data/tech-stack.ts` and
`tests/data/tech-stack.test.ts` are the source of truth for exact categories
and items going forward. The rendering treatment described below (monochrome
icon + label, accent-on-hover, spacing) is unaffected — only the taxonomy
changed.

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

**Amended 2026-07-25:** item labels (e.g. "Databricks", "Python") were never
given an explicit size — only the category headers were pinned to the 13px
small-uppercase style. Since item labels turn accent-colored on hover
(decision 8's ≥15px floor applies), item labels are now explicitly set at
15px, distinct from the 13px category headers above them.

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

### 8. Accent color: `#0F7C86` (teal)

Replaces the original doc's provisional rust/amber (`#A8500F`) and, as of
2026-07-25, the deep navy (`#1F3864`) that superseded it.

| Role | Hex | Contrast on `#F6F8F8` |
|---|---|---|
| Accent | `#0F7C86` | ~4.9:1 (AA for text and buttons, no longer a large margin) |

**Why:** the navy accent read as more "letterpress finance document" than
the "sober, tech-touch" tone this page is aiming for. Teal is the deliberate
"more tech" move — but it's a real trade-off, not a free upgrade: navy's
rationale explicitly leaned on reading as FSI/financial-trustworthy, which
teal does not carry the same way. This page is choosing to signal "modern
data/tech practitioner" over "traditional banking," on the view that the
audience (FSI hiring managers evaluating a data engineer) responds more to
technical credibility than to visual conservatism. That's a conscious trade,
not an oversight.

The other cost is headroom: contrast drops from ~11:1 to ~4.9:1. Still AA
for text and buttons, but with nowhere near navy's margin. This constrains
where accent-as-text can be used:

**Standing rule — applies to any accent-on-text usage, present or future:**
accent-colored text must never be smaller than **15px**, and must never sit
on a tinted/non-base background. Below 15px or on a tinted background, the
already-tight ~4.9:1 margin isn't reliable. (This rule doesn't apply to
non-text uses of accent — e.g. the timeline tick, decision 7 — where WCAG's
non-text contrast threshold is a more forgiving 3:1.) Every current
accent-on-text usage has been checked against this rule as part of this
revision: hero stack label (decision 3, scoped 15px exception), Tech Stack
item labels on hover (decision 4, pinned to 15px), and button/CTA labels
(decision 11, pinned to ≥15px).

Named `--color-accent` in CSS, not by hue, so it can still move in one line
if needed later.

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
base-colored text. Label text is set at ≥15px (decision 8's standing
minimum for any accent-on-text usage — applies here both to the outline
state's accent-colored text and the hover state's accent-colored fill).

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

**Amended 2026-07-25 (chapter headings, grill-me session):** Silkscreen gains
a second, still-controlled use — the section-index number in each chapter
heading (decision 19). "A single point on the page" is no longer literally
true, but the spirit holds: Silkscreen is still not a general-purpose
typeface (never used for body text or arbitrary headings), just a
now-two-instance pixel-font accent confined to the monogram and this one
numbering device.

### 18. Dark mode: in scope, one inverted variant

Dark mode moves from "future toggle" to a fully specified, in-scope
feature — one inverted variant (not a separate theme system).

**Palette:**

| Role | Hex | Contrast on dark base |
|---|---|---|
| Base | `#101416` | — |
| Border | `#262D2F` | ~1.3:1 (hairline only, mirrors light mode's barely-there border relationship — not meant to meet text contrast) |
| Support | `#8B9394` | ~5.9:1 (secondary text) |
| Ink | `#E8EBEC` | ~15.5:1 (body text) |
| Accent | `#4FA3AC` | ~6.3:1 (lifted from `#0F7C86` for legibility against a dark base) |

**Default:** respects OS `prefers-color-scheme`, falling back to light if
undetectable. A manual toggle overrides this, and the override persists
across visits (e.g. `localStorage`) rather than resetting to OS preference
on every page load.

**Toggle:** plain-text `LIGHT / DARK`, same convention, placement, and color
rule as the `EN / PT` toggle (decision 15a) — same top-right persistent
cluster, inactive state in support-gray, active state in ink, never accent,
hairline `/` separator, no icons.

**Motion:** the theme switch itself is instant, with no transition — this is
deliberately *not* treated as an extension of decision 10's short
hover/focus color-transition allowance. A page-wide crossfade on every
element is a more noticeable, more "app-like" flourish than the small hover
transitions decision 10 permits, and risks reading as a template gimmick.

**Component carry-through:** icons and the monogram already use
`currentColor`/CSS custom properties (decision 4, decision 17), so they
adapt automatically via the ink variable — no separate dark-mode icon set.
Buttons (decision 11) follow the same outline-at-rest/filled-on-hover
pattern with dark-mode tokens: hover fill uses the dark accent
(`#4FA3AC`) with dark base-colored (`#101416`) text, which is the pairing
that clears contrast (`#E8EBEC` ink text on `#4FA3AC` accent is only
~2.45:1 and must not be used).

**Certification badges (decision 14):** each badge slot gets a light
backing plate (`#F6F8F8`, the light-mode base) behind the image, in addition
to the existing hairline frame. Real provider-issued badges (AWS,
Databricks, Snowflake, etc.) commonly ship as flat images with a baked-in
white or transparent background, not designed to sit on a dark surface — a
bare dark slot risks a stray white box or a badge that loses its
dark-colored elements the moment a real credential image is dropped in.

**Why:** the page is a résumé that recruiters may open on a system already
set to dark, and respecting that preference (rather than forcing light or
dark) costs nothing beyond a standard media query. Everything else here
follows patterns already established elsewhere in this doc (the `EN / PT`
toggle convention, decision 10's motion restraint, decision 14's
third-party-asset handling) rather than introducing new UI patterns for
dark mode specifically.

### 19. Section transitions: numbered chapter heading + seam divider

Added because the plain 64px whitespace gap between sections (decision 9)
read as inert document flow — recruiters scrolling past Hero into Experience
got no sense that a new "chapter" had started. A **static** (no scroll-linked
motion — see decision 10, unchanged) transition device was added instead of
the page-wide scroll-tracked roadmap/progress indicator originally proposed;
that idea was rejected because it would have required reopening decision 1
(no persistent global chrome — the timeline rail stays scoped to Experience
only) and decision 10/decision 7 (near-zero motion, no scroll-triggered
progress fill) with no compelling reason to override either.

**Scope:** applies to the three real content chapters — Experience (`01`),
Tech Stack (`02`), and **Education & Certifications** (`03`, one combined
chapter per decision 6). Does **not** apply to the Contact/footer section,
which stays an unnumbered CTA repeat with only a visually-hidden heading, as
today.

**Amended 2026-07-25 (Education & Certifications restructure):** the `03`
chapter was originally titled "Certifications," with "Education" demoted to
an unnumbered sub-heading beneath it — this read as if Education were an
unrelated, lesser afterthought rather than a peer topic. Retitled to
**"Education & Certifications"** as the chapter heading; "Certifications"
and "College" (renamed from "Education," to avoid repeating that word right
under the chapter title, and to read more concretely as the specific
degree/institution entry) are now two equal sub-sections beneath it, each
using **Tech Stack's category-label treatment** (13px Space Mono uppercase,
support-gray, `.label`) rather than a bespoke heading style — matching how
Tech Stack's own category groups (Programming Languages, Cloud, etc.) are
sub-headings within its single numbered chapter. Content order is unchanged
(Certifications first, then College).

**Chapter heading:** `<index>/<total>` (e.g. `01/03`) in **Silkscreen**
(decision 17), support-gray, 24px — followed by a 1px vertical hairline rule,
then the chapter title in **Space Grotesk medium, 24px, ink-colored, normal
title case** (e.g. "Experience", not "EXPERIENCE"). This replaces the
previous 13px Space Mono uppercase small-caps label treatment for these three
headings specifically — that treatment (`.label`) is otherwise unchanged and
still used for category labels, metadata, and the role/title line. The
number stays support-gray rather than ink or accent: it's an index/marker
(same convention as dates-vs-role-name in the Experience entries, decision
7), not the primary content, and accent is reserved for
interactive/high-value elements (Principle 3) — a static position marker is
neither.

**Seam divider:** a 1px hairline (`--color-border`) spanning the same
900px content column as everything else (not full-bleed — decision 1's
single-column restraint means nothing else on the page runs edge-to-edge, so
this doesn't become an exception), with a small centered square tick (9×9px,
outline, support-gray, `--color-base` fill — identical styling to the
Experience timeline's "past role" tick, decision 7) sitting on the line. It
appears immediately before each of the three chapter headings.

**Spacing:** the divider sits *inside* the existing section-gap budget
(decision 9), split evenly — `calc(var(--section-gap) / 2)` above and below
it — rather than adding new space on top. Total section-to-section distance
is unchanged (still hard-capped at 64px desktop / 48px mobile); decision 9
required no amendment.

**Scope (viewport):** applies at all breakpoints, desktop and mobile — unlike
decision 3's hero-viewport-containment amendment, this device has no
viewport-height dependency, so there's no reason to withhold it on mobile.

**Why static, not scroll-linked:** a scroll-position-tracked indicator
("progress fill", a persistent rail with a moving marker) is the more
"appy," more animated pattern the original brief's references already
pushed back against (see Context), and duplicates exactly what decisions 1,
7, and 10 already ruled out for good reason. A fixed, always-fully-rendered
numbered heading and divider gives the "something happens here" moment the
page was missing, without reopening near-zero-motion or introducing
persistent global chrome.

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
- **Palette base (light, default):**

  | Role | Hex | Use |
  |---|---|---|
  | Background | `#F6F8F8` | page |
  | Border | `#DFE4E5` | hairlines, dividers |
  | Support | `#68706F` | secondary text |
  | Text | `#131817` | body (near-black, never `#000`) |
  | Accent | `#0F7C86` | links, CTA, active timeline marker, badges, and (per decision 1) any new component where it signals something interactive/high-value — subject to decision 8's ≥15px / no-tinted-background rule |

  See decision 18 for the dark-mode palette.

- Named by function in CSS (`--color-accent`, not `--color-navy`).
- No pure black/white. Minimum AA contrast (4.5:1), including secondary text.
- Categorical chart colors: still deferred until charts exist; must not
  compete with the accent.
