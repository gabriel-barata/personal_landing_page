# Visual Direction — Personal Landing Page / Living Resume

Recorded 2026-07-24. Consolidates the visual direction for the site — palette,
typography, layout, components, and interaction rules — into a single spec
ready to hand to a frontend build and to a Claude Design prototype for
acceptance-checking. Supersedes the original `initial_visual_direction.md`
(now deleted); that file's fonts/palette/principles are folded in below,
several with revised decisions from a grill-me session that resolved every
"provisional" or open item.

## Revision history

- **2026-07-26 (Certifications/Education split + closing copyright footer,
  grill-me session):** two changes from a review of the chapter structure and
  page ending. First, chapter `03` ("Education & Certifications," decision 19)
  is split into two standalone chapters — **Certifications** (`03/04`) and
  **Education & Projects** (`04/04`) — reordered as Certifications first,
  Education & Projects second (unchanged from the prior combined chapter's
  content order). Certifications drops its now-redundant "Certifications"
  sub-heading (the chapter title already says it); its list starts directly
  under the chapter heading/divider. Education & Projects keeps two equal
  sub-sections styled with the existing category-label treatment: **College**
  (unchanged content, renamed from "Education" in the prior restructure) and
  a new **Projects** sub-section — entries are name + 1–2 sentence description
  + a small tech-tag list, mirroring the tag styling already used for Tech
  Stack items (decision 4). Project content is frontend placeholder data only
  (`frontend/src/data/projects.ts`), per CLAUDE.md's existing placeholder-data
  scope note for Experience — not wired to `resume.json`. All chapter numbers
  update from `/03` to `/04` totals (Experience `01/04`, Tech Stack `02/04`).
  Splitting into two chapters means decision 20's per-chapter full-viewport
  `min-height` mechanism now applies to both individually — the page grows by
  one additional full screen of scroll, an accepted trade-off of treating them
  as two real chapters rather than one crowded one.

  Second, a new trailing **copyright line** is added at the very end of the
  page, after the existing Contact/footer section (decision 6 item 6, renamed
  from item 5 to make room for the new Education & Projects chapter at item
  5). Unlike Contact/footer, this is a thin strip with natural content height
  only — no full-viewport treatment, no new "chapter." It reads `© {year}
  Emanuel Barata`, year computed at build time, identical in both EN and PT
  (no translation needed for a copyright notice). Styled per the page's
  existing small-uppercase-label convention: 13px, `--color-support`, centered
  within the 900px column, with a 1px `--color-border` hairline top rule
  separating it from Contact/footer above — no new colors, no shadow, no
  `border-radius` exception. Implemented as a separate component from
  `ContactFooter.astro` (kept untouched) but deliberately *not* itself a
  second `<footer>` landmark element (which would create two competing
  `contentinfo` landmarks on the page) — a plain non-landmark wrapper instead.
  This chapter/footer restructuring was implemented directly (no new
  `specs/NNN-name` feature) since it's a content/structure change following
  patterns this doc already establishes, not a new architectural decision.
- **2026-07-26 (Experience panel retro reversal, grill-me session):** the
  previous two same-day sessions (below) pushed the Experience detail panel
  toward a *modern* terminal-window read — macOS traffic-light dots, a smooth
  scale+fade open animation. On review this was judged the wrong direction
  entirely: the panel's whole point is a **tech-but-old** feel (the reason
  decisions 5's square-corners/no-shadow rules exist in the first place), and
  a polished macOS-style window reads as the opposite of that. This session
  reverses both amendments and replaces them with a Windows 3.1/95-flavored
  treatment — bevel vocabulary and pixel icons borrowed, not a literal OS
  dialog reconstruction (no fake minimize/maximize, no dotted focus rect).
  Scoped narrowly to the panel's own controls (Details trigger, Contact-me
  CTA, close button) — decision 11's flat outline/fill style is untouched
  everywhere else on the page. Specifics: the close button reverts to a
  single square button with a hand-built pixel-art X glyph (undoing both
  macOS-dot amendments), moved to the title bar's **top-right** (the
  Windows convention, now that nothing dictates a left-aligned control), with
  the title text reverting to **left-aligned** — the earlier centering was
  justified purely by the dots occupying the left slot, which no longer
  applies. Decision 5's circular `border-radius` exception is rescinded;
  the page returns to zero exceptions. The title bar itself now gets a solid
  `--color-accent` fill with `--color-accent-ink` text (a new, deliberate
  accent usage per decision 8/Principle 3), replacing the previous plain-base
  background plus separate 3px accent top rule — the two are now the same
  thing. The panel's own outer frame stays flat 1px hairline; the bevel is
  reserved for interactive controls, not the whole window, so it still reads
  as "this is clickable" rather than decorating the frame. Buttons (close,
  Details, Contact me) get: a resting bevel face derived from existing
  neutral tokens (`--bevel-face`/`--bevel-highlight`/`--bevel-shadow` in
  `tokens.css`, reusing `--color-border`/`--color-base`/`--color-ink` rather
  than adding new named colors — highlight/shadow swap which token they
  point at per theme, since `--color-base` and `--color-ink` swap which
  extreme is lighter between light and dark mode); an accent-tinted hover
  (text and the top/left bevel edge shift to `--color-accent`, bevel shape
  unchanged) so accent still signals interactivity site-wide; and a pressed
  `:active` state that inverts the bevel edges and nudges the button 1px via
  `transform: translate(1px, 1px)`, giving real click feedback the flat
  decision-11 buttons don't have. The open animation drops the scale+fade
  entirely (scale/transform is itself a modern-UI motion primitive) in favor
  of an **opacity-only hard-step flicker** (`steps(4, end)`, 160ms, no easing
  curve) — reads as a screen snapping on rather than a window animating in.
  Close stays instant, as before. Everything else about decision 21 is
  unaffected: fixed-height/internally-scrollable sizing, partial-coverage
  depth cue (no scrim/shadow), single-panel-at-a-time, the fake command-line
  echo, metadata/tasks/achievements structure, the centered "Contact me"
  label, the blinking `> |` cursor, and mobile's full-width/vertical-depth
  behavior.
- **2026-07-26 (Terminal panel window chrome, grill-me session):** a follow-up
  session after the previous terminal-panel amendment still didn't read as a
  terminal *window* — the title bar had no window-manager furniture, and the
  wipe-open animation read as generic content-reveal rather than "a window
  opening." Decision 21 amended again: the pixel-art X close icon is replaced
  with three small circular monochrome dots (macOS traffic-light convention),
  top-left of the title bar — leftmost dot is the functional close control,
  the other two purely decorative. Colors stay support-gray outline, not
  literal red/yellow/green, to preserve the one-neutral-plus-one-accent
  palette rule (decision 8); the accent-on-hover/focus treatment applies to
  the functional dot like every other interactive control. The title text
  moves from left-aligned to centered, matching the authentic convention now
  that dots occupy the left slot. The opening animation is replaced entirely:
  the prior `clip-path` wipe is swapped for a scale+fade (92%→100% scale,
  0%→100% opacity, transform-origin top-center, same 200ms ease-out timing,
  still open-only/reduced-motion-respecting) — closer to how real desktop
  windows actually animate open. **New scoped exception to decision 5:** the
  traffic-light dots are circular (`border-radius: 50%`), the first exception
  to the page's blanket `border-radius: 0` rule (enforced globally in
  `global.css` via `*, *::before, *::after`) — carved out narrowly for `.dot`
  only, because the macOS window-chrome convention this evokes depends on
  being round; squaring it off was considered and rejected as defeating the
  point of the reference.
- **2026-07-26 (Terminal panel motion + chrome, grill-me session):** decision
  21 amended with a **narrow, scoped exception** to decision 10's near-zero-
  motion rule — the only such exception on the page besides decision 3's
  15px accent-text carve-out. The panel now gets: an opening "snap/wipe"
  animation (a `clip-path` reveal, ~200ms ease-out, panel unfurls top-to-
  bottom on open only — closing stays instant, per decision 21's original
  precedent); an accent-teal top rule replacing the panel's plain hairline
  top border, uniform across all entries (deliberately *not* reusing decision
  7's current-vs-past-role accent semantic, to keep it a pure chrome cue, not
  an information-bearing one); and a blinking `> |` cursor line (hard-step
  opacity, ~530ms per phase, matching decision 5's hard-edged/no-gradients
  aesthetic) placed after the achievements section as an idle "ready for
  input" bookend to the existing `> cat experience/...` echo line at the top.
  Both new animations respect `prefers-reduced-motion` (instant open, solid
  non-blinking cursor). Also from this session: the contact button is
  relabeled "Contact me" and recentered (auto-width, not full-bleed) within
  the panel body, echoing decision 20's Contact/footer section being
  centered as a "closing bookend" rather than top-aligned like the other
  chapter sections.
- **2026-07-26 (Experience detail panel, grill-me session):** new decision 21
  — each Experience entry (decision 7) gains a "Details" button that opens a
  terminal-styled, opaque, non-full-screen panel layered over the entry list,
  showing Position/Industry/Team Size/Lead metadata plus detailed
  tasks/achievements bullets and a contact CTA. Resolves how to add this depth
  without reopening decision 5 (no shadows), decision 10 (near-zero motion),
  or decision 1 (single column, no floating chrome) — depth is conveyed by
  partial coverage alone (page visibly peeking around the panel), not a
  shadow or scrim; open/close is instant, matching decision 18's dark-mode-
  toggle precedent rather than introducing a new transition; the panel stays
  anchored to the existing 900px column rather than floating independently.
  Cascading: decision 17's Silkscreen scope is explicitly *not* extended —
  the panel's close control is a separate pixel-art icon, not a third
  Silkscreen usage. Decision 6's "2–3 line impact summary max" per entry is
  unchanged (a paragraph, not bullets — considered and reverted back to
  prose during this session) and now also gets the new "Details" button
  appended after it. Data model for the new panel fields (Industry, Team
  Size, Lead flag, detailed tasks, achievements) is scoped to frontend
  placeholder data only for now, per CLAUDE.md's existing note that
  `resume.json` wiring is deferred future work.
- **2026-07-26 (full-viewport section containment, grill-me session):** new
  decision 20 — decision 3's hero-viewport-containment mechanism
  (`min-height: calc(100vh - header-height)`, desktop-only) is generalized to
  every section: Experience, Tech Stack, Certifications/Education, and
  Contact/footer. Each now occupies at least one full viewport on desktop, so
  scrolling reveals one section at a time instead of several partial sections
  stacked in the same view. Experience/Tech Stack/Cert-Edu stay top-aligned
  (content starts at the chapter heading, slack pools at the bottom);
  Contact/footer is centered like Hero, making it a closing bookend. Sections
  taller than one viewport grow past the floor, the same fallback decision 3
  already accepts for Hero. Mobile is unchanged (natural flow, decision 3's
  existing precedent). The seam divider (decision 19) is unchanged in size
  and spacing — it now lands at the top of each fresh screen instead of
  mid-scroll.
- **2026-07-25 (Tech Stack reorganization, grill-me session):** decision 4
  rewritten — icons dropped from the Tech Stack section entirely (plaintext
  item labels only; the icon-sourcing requirement now scopes to the hero's
  5-icon row only, decision 3). Categories are now individually boxed
  (hairline border, square corners, no shadow, `--color-base` fill — no tint,
  since the retained hover-accent item text must not sit on a tinted
  background per decision 8) and laid out as a 2-column CSS multi-column flow
  on desktop, replacing the previous whitespace-only category separation.
  Item hover-to-accent color-shift is retained even though items aren't
  links, as a deliberate scanning cue. Cascading: decision 3 gets a
  correcting note — its 2026-07-24 amendment's claim that hero icon styling
  is "consistent with the Tech Stack section" no longer holds now that Tech
  Stack has no icons.
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

**Amended 2026-07-25 (Tech Stack reorg, grill-me session):** this section's
2026-07-24 amendment described the hero icon treatment as "consistent with
the Tech Stack section, decision 4." That's no longer accurate — decision 4
dropped icons from Tech Stack entirely (see its 2026-07-25 amendment). The
hero's 5-icon row is unchanged and is now the page's only icon usage outside
the monogram; the two sections are no longer stylistically aligned on this
point, an accepted trade-off given their different scope (5 curated,
universally-recognized brand marks here vs. 43 mixed-recognizability tools
there).

### 4. Tech Stack section: category-grouped boxes, plaintext labels

Grouped by category as small uppercase mono labels. Each category is wrapped
in its own hairline-bordered box (decision 5: square corners, 1px
`--color-border`, no shadow, `--color-base` fill — no tint) containing the
category label and its item list. Items are **plaintext labels only** (no
icons) — ink-colored at rest, accent-colored on hover/focus as a scanning
cue. Category boxes lay out as a 2-column CSS multi-column flow on desktop
(`column-count: 2`), each box sized to its own natural height rather than
paired row-by-row, collapsing to a single column under the 768px breakpoint
(decision 12). Items within a box wrap horizontally as discrete tokens at the
section-internal spacing tokens (decision 9) — no separator, no icon.

**Amended 2026-07-25 (Tech Stack reorg, grill-me session):** the icon+label
treatment previously described here (and referenced as "unaffected" by the
2026-07-25 audit amendment below) is superseded — icons are dropped from
this section entirely; plaintext-only labels are now the standing treatment.
Icon sourcing (below) is scoped to the hero row only.

Motivated by two compounding problems: the self-hosted icon set (Simple
Icons-sourced) had inconsistent stroke weight/style across the 43 items,
reading as visually noisy; and several items (e.g. "RAG," a technique rather
than a product) have no real brand mark, making an icon there decorative
filler rather than a recognizable signal. Rather than curating a better icon
set, plaintext removes the recognizability problem outright and better
matches the page's "résumé, not portfolio" principle — real skills lists are
plaintext, and the hero's 5-icon row (decision 3) already carries the page's
one deliberate icon moment, reserved for genuinely famous, universally
recognized brand marks (AWS, Databricks, Azure, Snowflake, Claude), a bar
none of Tech Stack's 43 items uniformly clears.

Per-category boxes (hairline border, decision 5) address a separate "messy"
complaint: categories were previously separated only by a support-gray label
and whitespace, reading as ambiguous grouping — especially for short
categories (e.g. Cloud, 2 items) sitting flush against neighbors. A literal
container makes each category's boundary unambiguous. Boxes lay out via CSS
multi-column rather than a row-paired grid because category sizes range from
2 to 9 items — a strict grid would leave visible dead space under short boxes
paired with tall ones in the same row; multi-column lets each box flow to its
natural height instead.

Item hover-to-accent is kept despite items not being links — a deliberate
exception to decision 8's "accent signals interactivity" framing, treated
here as a scanning/engagement cue rather than an interactivity signal.
Because of this, box fill must stay `--color-base` (no tint), so hovered item
text never sits on a tinted background, per decision 8's standing rule.

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
icon + label, accent-on-hover, spacing) was unaffected *at the time of this
amendment* — the icon+label treatment itself was later superseded by the
2026-07-25 "Tech Stack reorg" amendment above (plaintext + boxes); only the
taxonomy fixed by this amendment (8 categories, 43 items) still stands.

**Why:** answers the andy-hk.com reference (organized, clear stack at a
glance) while fixing its main flaw (too much whitespace) via the spacing
scale and per-category boxes; dropping icons (per the reorg amendment above)
preserves the "~90% neutral" palette rule even more directly than the
originally-monochrome icons did.

**Icon sourcing (required, not optional):** following the Tech Stack reorg
amendment above, the hero platform row (decision 3) is now the only surviving
usage this rule applies to. Icons there are self-hosted: SVGs sourced from a
monochrome/single-path set (e.g. Simple Icons, Tabler), recolored via CSS
`fill`/`currentColor`, and committed into the repo
(`frontend/public/icons/`). No runtime CDN fetch to any third party.

**Amended 2026-07-24:** the Claude Design prototype loaded icons live from a
CDN. Fine for a fast draft, but doesn't carry into the real build — matches
the existing self-hosted-fonts precedent (no external network dependency on
page load, no FOUC while a CDN request resolves, no risk of an icon set
changing or breaking under you). (Historical note: applied to Tech Stack
icons at the time; now relevant to the hero row only per the reorg above.)

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

**Amended 2026-07-26 (terminal panel window chrome, grill-me session):** one
scoped exception — decision 21's Experience detail panel gets three small
circular "traffic-light" window-control dots, `border-radius: 50%`. The
macOS terminal-window convention they evoke depends on being round; the
alternative (squaring them off) was considered and rejected as defeating the
point of using the reference at all. This is the only `border-radius`
exception on the page.

**Amended 2026-07-26 (Experience panel retro reversal, grill-me session):**
the circular exception above is **rescinded**. The macOS traffic-light dots
it existed for were themselves reverted (decision 21's close control is a
square beveled button again, per the retro-reversal amendment) — the page
returns to `border-radius: 0` with **zero exceptions**.

### 6. Page sections, in order

1. **Hero** (decision 3)
2. **Experience** — reverse-chronological, inline timeline rail (decision 7),
   each entry: role, company, dates (`tabular-nums`), 2–3 line impact summary
   max
3. **Tech Stack** (decision 4)
4. **Certifications** — compact list, dates inline/right-aligned, certification
   badges (decision 14)
5. **Education & Projects** — two sub-sections, College then Projects
6. **Contact / footer** — repeats the contact CTA row from the hero
7. **Copyright line** — trailing, unnumbered, not a chapter (see below)

Explicitly excluded: long "About me" narrative, blog/writing section,
testimonials — anything risking a return to ai-2027.com's wall of text.

**Amended 2026-07-26 (Certifications/Education split, grill-me session):**
items 4–5 were originally one combined chapter, "Certifications / Education"
(see decision 19's 2026-07-25 restructure amendment, and its 2026-07-26 split
amendment below). Split into two standalone chapters, reordered as
Certifications first, Education & Projects second — same content order as
before. Item 7 (copyright line) is new, added after Contact/footer as an
unnumbered trailing element, not a "chapter" in decision 19's sense.

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

**Amended 2026-07-26 (Experience panel retro reversal, grill-me session):** a
new non-text accent usage — the Experience detail panel's title bar (decision
21) is now a solid `--color-accent` fill, with `--color-accent-ink` text on
top (the same base-colored-text-on-accent pairing decision 18 already
established for button hover states). This is a bigger, more decorative
accent surface than anywhere else on the page, but it's deliberate: it's the
one place the page borrows a literal old-OS convention (a colored title-bar
band), and the text-on-accent contrast pairing is already proven elsewhere.

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

**Scope:** applies to the four real content chapters — Experience (`01`),
Tech Stack (`02`), **Certifications** (`03`), and **Education & Projects**
(`04`) — per decision 6. Does **not** apply to the Contact/footer section or
the trailing copyright line, which stay unnumbered, as today.

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

**Amended 2026-07-26 (Certifications/Education split, grill-me session):**
this restructure is itself superseded — the combined chapter is split back
into two standalone chapters, **Certifications** (`03`) and **Education &
Projects** (`04`), per decision 6's amendment above. Certifications drops its
sub-heading (now redundant with the chapter title) and goes back to a plain
list. Education & Projects keeps two equal sub-sections in the same
category-label treatment: **College** (unchanged) and a new **Projects**
sub-section. This isn't a reversal of the underlying complaint the 2026-07-25
restructure fixed (Education reading as a lesser afterthought) — giving
Education its own full chapter, paired with new Projects content, resolves
that even more directly than a shared sub-heading did.

**Chapter heading:** `<index>/<total>` (e.g. `01/04`) in **Silkscreen**
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

### 20. Full-viewport section containment

Extends decision 3's hero-viewport mechanism to every section, closing the
gap between Hero's "one full screen" feel and the thinner, document-like
`--section-gap` transitions used for Experience/Tech Stack/Certifications/
Education & Projects/Contact (decision 9). Motivated by wanting the whole
page, not just the Hero→Experience transition, to read as "one section at a
time" rather than several partial sections visible in the same view.

**Mechanism:** on desktop (≥768px) only, every section — Experience, Tech
Stack, Certifications, Education & Projects, and Contact/footer — gets
`min-height: calc(100vh - header-height)`, the same formula decision 3
already uses for Hero. Natural scroll only; no CSS scroll-snap. A section
taller than one viewport simply grows past that floor (never clipped or
independently scrollable) — the same fallback decision 3 already accepts for
Hero.

**Amended 2026-07-26 (Certifications/Education split, grill-me session):**
Certifications and Education & Projects were previously one combined section
sharing a single viewport floor; now split into two standalone chapters
(decision 6/19), each gets its own `min-height` under this mechanism — the
page grows by one additional full screen of scroll on desktop. The trailing
copyright line (decision 6 item 7) is explicitly **not** covered by this
mechanism — natural height only, no viewport floor, since it isn't a chapter.

**Alignment:** Experience, Tech Stack, Certifications, and Education &
Projects stay top-aligned — the chapter heading (decision 19) sits right
after the seam divider, and any leftover space when content is shorter than
one viewport collects at the bottom of the section, before the next
section's divider.
This differs from Hero, which centers its content; these sections have a
heading to anchor to, Hero doesn't. Contact/footer, however, is centered
like Hero — with no chapter heading of its own, it functions as the page's
closing bookend rather than another "chapter," so it gets Hero's treatment,
not the chapter sections'.

**Divider unaffected:** decision 19's seam divider (hairline + tick,
`calc(section-gap/2)` split) is unchanged in size, style, and spacing. It
now sits at the very top of each fresh viewport rather than partway down a
continuous scroll, but the "why" (a static, non-scroll-linked arrival
marker, decision 10) still holds — the mark itself doesn't need to change to
signal a bigger transition, since the transition itself (a full viewport of
scroll) now does that work.

**Mobile:** unchanged — natural content-height flow, no `min-height`
applied, same as decision 3's existing desktop-only scoping. Mobile content
already runs proportionally taller relative to viewport height, and forcing
full-viewport sections there would mean scrolling past large empty areas on
already-cramped screens.

**Scope note (decision 19):** decision 19's "Does not apply to the
Contact/footer section" language refers only to the *numbered chapter
heading and seam divider* — that's unchanged, Contact/footer still has no
chapter number. This decision's viewport-containment mechanism is a
separate, additional layer that now does apply to Contact/footer.

**Why:** for the user, an uncluttered interface where only one section is
ever in view at a time is the priority — partial sections stacking in the
same screen reads as "polluted." Reusing decision 3's exact mechanism
(rather than inventing a new one, e.g. CSS scroll-snap) keeps the page's
scroll feel uniform and avoids the added complexity/edge cases (fighting OS
scroll gestures, sticky header interaction, variable content height) that
scroll-snap would introduce for comparatively little benefit over natural
min-height flow.

### 21. Experience detail panel: terminal-style overlay

Each Experience entry (decision 7) gains a **"Details"** button, plain-text
labeled and styled per decision 11 (outline at rest, filled on hover, ≥15px),
appended after its 2–3 line summary. Clicking it opens a panel with more
depth on that role — Position, Industry, Team Size, detailed tasks, and
achievements/metrics — without leaving the page or breaking this doc's
existing restraint on shadows, motion, or floating chrome.

**Trigger & scope:** only one panel open at a time. Opening a different
entry's panel requires closing the current one first — the covered entries
sit behind the open panel and aren't independently reachable while it's open.

**Structure & positioning:** the panel is a **terminal-styled, opaque
square**, layered on top of the page — not a full-screen modal, no dimming
scrim. It's anchored to the existing **900px content column** (same
left/right edges as everything else on the page — decision 1's single-column
discipline is unaffected, nothing floats independently of that column), and
opens **below the "01/03 Experience" chapter heading and seam divider**
(decision 19), which stays visible while the panel is open — the panel
replaces/covers the timeline list area only, not the section's identity.

**Sizing:** **fixed height** (viewport-relative, e.g. `~80vh`), **internally
scrollable** if content overflows — a real terminal has fixed bounds and
scrollback, and this keeps page content visible above/below the panel
regardless of how much content a given entry has.

**Depth cue without shadows:** decision 5 bans box-shadows and decision 10
bans new motion/dimming flourishes, so the panel signals "this is layered on
top of something" purely through **partial coverage** — it's smaller than the
viewport, so the page (chapter heading above, and page content below when the
panel is shorter than the remaining section) is visibly exposed around it.
No scrim, no darkening of the page behind it.

**Motion:** closing is **instant** — no fade, slide, or scale transition,
following decision 18's dark-mode-toggle precedent (an even bigger visual
change, deliberately kept instant rather than treated as a decision-10-style
short-transition exception).

**Amended 2026-07-26 (terminal panel motion + chrome, grill-me session):**
*opening* the panel is no longer instant — a narrow, scoped exception to
decision 10's near-zero-motion rule (the only such exception besides decision
3's 15px accent-text carve-out). The panel unfurls top-to-bottom via a
`clip-path` reveal, ~200ms ease-out, on open only; closing remains instant as
originally specified above. This is deliberately asymmetric rather than a
mirrored open/close transition, to keep the exception as narrow as possible
and keep closing (X button or Escape) snappy when a user is moving between
entries. Respects `prefers-reduced-motion: reduce` (falls back to instant
open, matching the un-amended behavior). Chosen over a scanline-sweep or
typewriter-reveal variant considered in the same session — those were judged
bigger, more CRT-specific effects than the ask called for; a plain unfurl
keeps the panel feeling like "a terminal window opening," not a themed
set-piece.

**Amended 2026-07-26 (terminal panel window chrome, grill-me session):** the
`clip-path` wipe above didn't survive contact — a follow-up review judged it
"generic content-reveal," not specifically terminal. Replaced with a
**scale+fade**: the panel animates from 92% to 100% scale while fading 0% to
100% opacity, `transform-origin: top center` (so it reads as dropping in from
just below the chapter heading above it, consistent with decision 20's
top-aligned section convention). Same 200ms ease-out timing, still open-only
(close stays instant), still respects `prefers-reduced-motion: reduce`. This
better mimics how real desktop windows actually animate open, and pairs with
the new traffic-light chrome below to sell "a real window just opened" rather
than "content sliding into view."

**Chrome:** a **title bar** at the top, plain text `Role — Company` (no fake
shell-prompt styling here — see body content below for where that idea
lives), hairline-bordered, square-cornered per decision 5. Top-right of the
title bar carries a small **pixel-art X icon** — a hand-built SVG glyph, not
the Silkscreen typeface — that closes the panel. Decision 17's Silkscreen
scope stays at exactly two uses (monogram, chapter numbers); this is a
deliberate choice not to add a third.

**Amended 2026-07-26 (terminal panel motion + chrome, grill-me session):** the
panel's outer top border is now a 3px accent-teal rule, replacing the plain
1px hairline top border used on the other three edges — a "terminal chrome"
cue that the previous plain-hairline frame didn't carry. It's uniform across
every entry's panel, deliberately *not* reusing decision 7's current-vs-past-
role accent semantic (accent tick for the current role, gray outline for past
ones) — this rule is chrome, not an information-bearing status signal, so
tying it to recency would risk it being misread as one. The title bar's
background and text color are unchanged (still `--color-base` / `--color-ink`
respectively) — only the panel's own top edge changes.

**Amended 2026-07-26 (terminal panel window chrome, grill-me session):** the
pixel-art X icon is replaced with **three small circular dots**, top-left of
the title bar (the macOS traffic-light convention) — the title bar previously
had no window-manager furniture at all, which was judged the main reason the
panel still didn't read as a terminal *window* rather than a styled content
box. The leftmost dot is the **functional close control**; the other two are
purely decorative (`aria-hidden`), since this panel has no minimize/maximize
equivalent to map them to. All three are **monochrome, support-gray outline**
— not literal red/yellow/green — to preserve decision 8's one-neutral-plus-
one-accent palette rule; the functional dot gets the same accent-on-hover/
focus treatment as every other interactive control on the page. With dots now
occupying the title bar's left slot, the `Role — Company` title text moves
from left-aligned to **centered**, matching the authentic convention.
**New scoped exception to decision 5:** the dots are circular
(`border-radius: 50%`), carved out of the page's blanket `border-radius: 0
!important` rule (`global.css`, `*, *::before, *::after`) via an explicit
`*:not(.dot)` exclusion — the only such exception on the page. Considered and
rejected: squaring the dots off to keep decision 5 fully unbroken — this was
judged to defeat the point of the reference, since roundness is exactly what
makes the convention recognizable.

**Amended 2026-07-26 (Experience panel retro reversal, grill-me session):**
the two amendments directly above (dots, scale+fade open animation) are
**reversed**. On review, the macOS-flavored polish they introduced was the
wrong direction — the panel is supposed to read as **old** tech, not sleek
modern tech, which is the entire reason decision 5 bans shadows/rounded
corners in the first place. Replaced with a Windows 3.1/95-flavored
treatment: bevel and pixel-icon vocabulary borrowed, not a literal OS dialog
rebuild (no fake minimize/maximize, no dotted focus rectangle), and scoped
only to this panel's own controls — decision 11 is untouched everywhere
else on the page.

- **Close control:** back to a single square button holding a hand-built
  pixel-art X glyph (undoing the dots), now positioned **top-right** of the
  title bar (the Windows convention) instead of top-left. The `Role —
  Company` title text reverts to **left-aligned** — centering was only ever
  justified by the dots occupying the left slot, which no longer applies.
  Decision 5's circular exception above is rescinded; the page returns to
  zero `border-radius` exceptions.
- **Title bar fill:** the title bar background becomes a solid
  `--color-accent` fill with `--color-accent-ink` text — a literal colored
  title-bar band, the one place on the page borrowing that old-OS convention
  directly (decision 8 amended accordingly). This replaces the previous
  plain-base background *and* the separate 3px accent top rule from the
  motion+chrome amendment above — the two are now the same edge.
- **Buttons get a beveled 3D face:** the close control, the Details trigger,
  and the Contact-me CTA all get a resting bevel — highlight/shadow edges
  derived from the existing neutral ramp (`--bevel-highlight`/
  `--bevel-shadow`/`--bevel-face` in `tokens.css`, mapped onto
  `--color-base`/`--color-ink`/`--color-border` respectively, no new named
  colors) — plus an accent-tinted hover (text and the top/left edge shift to
  `--color-accent`, bevel shape unchanged, so accent still signals
  interactivity per Principle 3) and a pressed `:active` state that inverts
  the bevel and nudges the button 1px (`transform: translate(1px, 1px)`) for
  tactile click feedback the flat decision-11 style doesn't have.
- **Open motion:** the scale+fade is dropped — scale/transform is itself a
  modern-UI motion primitive. Replaced with an **opacity-only hard-step
  flicker** (`steps(4, end)`, 160ms, no easing curve), reading as a screen
  snapping on rather than a window animating in. Close remains instant, as
  before. Still respects `prefers-reduced-motion: reduce` (falls back to an
  instant, fully-opaque open).
- **Unaffected:** everything else in this decision — fixed-height/
  internal-scroll sizing, partial-coverage depth cue, single-panel-at-a-time,
  the fake command-line echo, metadata/tasks/achievements structure, the
  centered "Contact me" label, the blinking `> |` cursor, decision 17's
  Silkscreen scope (still capped at two uses), and mobile behavior.

**Closing:** the close button (now top-right) or the **Escape key**. No
click-outside-to-dismiss
— the exposed page area around the panel is small enough that accidental
outside clicks while interacting with the panel would too easily lose the
user's place.

**Body content, top to bottom:**

1. A single **static, non-animated fake command line** — e.g.
   `> cat experience/senior-data-engineer.md` — the panel's one "terminal
   flavor" moment, deliberately kept out of the title bar (which stays plain
   for legibility) and out of the trigger button (which stays a plain
   "Details" label) so it doesn't dilute across multiple places.
2. A **metadata block**: stacked `LABEL: value` lines (support-gray label,
   ink value, matching the small-uppercase label convention used elsewhere —
   decision 4's category labels, decision 19's chapter number) for Position,
   Industry, Team Size, and **Lead** — the Lead line is **omitted entirely**
   for roles where it doesn't apply, not shown as an explicit "NO".
3. Two **labeled bullet sub-sections** — `TASKS` (detailed responsibilities)
   and `ACHIEVEMENTS` (metrics/impact) — each with its own small-uppercase
   label, reusing the sub-section label pattern from Tech Stack categories
   and decision 19's Education & Certifications restructure, rather than one
   undifferentiated bullet list.
4. **Added 2026-07-26 (terminal panel motion + chrome, grill-me session):** a
   blinking cursor line, `> |`, sitting after the achievements section and
   before the contact button. Reuses the `>` prompt prefix from item 1's echo
   line, so the two lines bookend the terminal metaphor — a command typed in
   at the top, an idle prompt waiting at the bottom. The `|` blinks via a
   hard opacity step (not a smooth fade, matching decision 5's hard-edged/
   no-gradients aesthetic), ~530ms per phase. Respects
   `prefers-reduced-motion: reduce` — falls back to a solid, always-visible
   `|`. This is part of the same narrow decision-10 exception as the panel's
   open animation (see Motion, above) — no other page element blinks.
5. A **big contact button**, relabeled **"Contact me"** and **centered**
   (auto-width, not full-bleed) within the panel body — larger size only,
   same outline-at-rest / filled-on-hover style as every other button on the
   page (decision 11 is not broken for this one case) — triggers the same
   direct `mailto:` action as the hero's email CTA (decision 3, item 6).
   **Amended 2026-07-26 (terminal panel motion + chrome, grill-me session):**
   originally left-aligned with the "Email" label inherited directly from
   `contactLinks`; recentered and relabeled to read as a deliberate closing
   CTA rather than just another left-aligned content block, echoing decision
   20's Contact/footer section being centered as the page's own "closing
   bookend." The label is a panel-local override, not a change to the shared
   `contactLinks` data (the hero and footer contact rows keep "Email").

**Mobile (<768px, decision 12):** the terminal concept is kept, adapted
rather than replaced with a different pattern — the panel becomes full-width
(matching mobile's existing layout) but keeps its fixed-height/internal-
scroll/title-bar behavior, so the depth cue becomes **vertical-only** (page
content visible above/below, not at the sides) instead of disappearing
entirely into a plain full-screen takeover.

**Data scope:** the new fields this panel needs (Industry, Team Size, Lead
flag, detailed tasks, achievements) are added to the **frontend placeholder
data only** (`experience-placeholder.ts`) — no changes to `schema/` or the
pipeline. Real `resume.json` wiring, and how these fields would actually be
authored in the source Google Doc, stays deferred per CLAUDE.md's existing
scope note.

**Why:** the brief asked for "something different" for Experience without
turning the page into a portfolio-app pattern this doc has consistently
pushed back on (decisions 1, 10, 13). A terminal-window metaphor gives a
distinct, tech-flavored interaction while every constraint that makes it
*feel* restrained instead of app-like — no shadow, no scrim, no fade, no
floating-outside-the-column — is satisfied by rules this doc already
established for other components, rather than by carving out exceptions.

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
