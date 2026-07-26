# Feature spec: Experience detail panel (terminal-style overlay)

Status: design finalized (grill-me session, 2026-07-26). Not yet implemented.
Cross-reference: `docs/visual-direction.md`, decision 21 (and its
2026-07-26 revision-history entry) is the canonical record of this decision;
this file is a standalone, implementation-facing restatement of the same
spec for convenience.

## Summary

Each entry in the Experience section gains a "Details" button. Clicking it
opens a terminal-styled, opaque panel layered over the entry list, showing
extended detail on that role (position/industry/team size/lead status,
detailed task bullets, achievement/metric bullets, and a contact CTA)
without navigating away from the page.

## Collapsed card (list view) — unchanged except one addition

- Layout, rail/tick, dates, role/company: unchanged from today's
  `Experience.astro`.
- Summary stays a **2–3 line paragraph** (decision 6's existing rule —
  considered switching to 2 bullet points during this session, reverted back
  to prose as the final call).
- A plain-text **"Details"** button is appended after the summary, styled
  per decision 11 (outline at rest, filled accent on hover, ≥15px label). No
  terminal-flavored wording on this button — plain "Details".

## Trigger & scope rules

- One panel open at a time. To view a different entry's panel, the current
  one must be closed first (the covered entries sit behind the open panel
  and are not reachable while it's open).
- Opening/closing is **instant** — no fade, slide, or scale transition
  (matches decision 18's dark-mode-toggle precedent; explicitly not treated
  as an extension of decision 10's short hover-transition allowance).

## Panel structure & positioning

- **Terminal-styled, 100% opaque square**, layered on top of the page — not
  a full-screen modal, no dimming scrim/backdrop.
- **Anchored to the existing 900px content column** (same left/right edges
  as the rest of the page) — does not float independently of that column.
- Opens **below the "01/03 Experience" chapter heading + seam divider**,
  which stays visible while the panel is open. The panel covers/replaces
  only the timeline list area, not the whole section.
- **Fixed height** (viewport-relative, e.g. `~80vh`), **internal scroll** if
  content overflows — consistent size across all entries regardless of
  content length.
- **Depth cue:** conveyed purely by **partial coverage** — the panel is
  smaller than the viewport, so page content (chapter heading above, and
  page content below if the panel is shorter than the remaining section) is
  visibly exposed around it. No shadow (banned by decision 5), no scrim.

## Panel chrome

- **Title bar**: plain text, `Role — Company` (e.g. "Senior Data Engineer —
  Meridian Financial Group"). No fake shell-prompt styling in the title bar.
- **Close control**: a small **pixel-art X icon** (hand-built SVG glyph, not
  the Silkscreen typeface) in the top-right of the title bar. Does **not**
  extend decision 17's Silkscreen scope, which stays at exactly two uses
  (monogram, chapter index numbers).
- **Closes via**: the X button, or the **Escape** key. No
  click-outside-to-dismiss.

## Panel body content, top to bottom

1. **Fake command-line echo** (static, no typing animation), e.g.:
   ```
   > cat experience/senior-data-engineer.md
   ```
   This is the panel's one deliberate "terminal flavor" moment — intentionally
   kept out of the title bar and the trigger button so it isn't diluted
   across multiple places.

2. **Metadata block** — stacked `LABEL: value` lines (small-uppercase
   support-gray label, ink value):
   - `POSITION: <role title>`
   - `INDUSTRY: <industry>`
   - `TEAM SIZE: <size>`
   - `LEAD: <value>` — **only rendered when the role was a lead position**;
     omitted entirely otherwise (not shown as "NO").

3. **Two labeled bullet sub-sections**, each with its own small-uppercase
   label (reusing the existing Tech Stack / Education & Certifications
   sub-heading pattern):
   - `TASKS` — detailed responsibilities (more granular than the collapsed
     card's 2–3 line summary).
   - `ACHIEVEMENTS` — metrics/impact bullets.

4. **Big contact button** — larger size only, same outline-at-rest /
   filled-on-hover style as every other button on the page (decision 11 is
   not broken here). Triggers the same direct `mailto:` action as the hero's
   email CTA. Not a scroll-to-footer link, not a two-button (email +
   LinkedIn) pattern.

## Responsive (mobile, <768px)

- Same terminal concept, adapted rather than replaced:
  - Panel becomes **full-width** (matching mobile's existing layout).
  - Keeps fixed-height + internal scroll + title bar.
  - Depth cue becomes **vertical-only** (page content visible above/below,
    not at the sides) — no full-screen takeover.

## Data model scope

- New fields required: `industry`, `teamSize`, `isLead` (boolean, controls
  whether the `LEAD:` line renders), `tasks` (bullet list), `achievements`
  (bullet list).
- **Scoped to frontend placeholder data only** — added to
  `frontend/src/data/experience-placeholder.ts`'s shape (or equivalent).
- **No changes to `schema/`** (`schema/src/experience.ts`'s `Role` /
  `EmployerEntry` types are left untouched) and no changes to the
  `pipeline/` package. Real `resume.json` wiring — including how these
  fields would eventually be authored from the source Google Doc — remains
  out of scope, per `CLAUDE.md`'s existing note that the frontend isn't yet
  wired to real resume data.

## Explicitly decided against (for reference)

- Full-screen modal overlay with dimming scrim — rejected; introduces a new
  UI primitive (scrim, focus trap in the "cover everything" sense) not used
  elsewhere on the page.
- Inline accordion expansion (entry grows in place, others pushed down) —
  rejected as visually awkward for this much content.
- Whole-experience-list swap (list disappears entirely, replaced by one
  panel) — rejected in favor of the layered/floating terminal-window read.
- Fake path/prompt as the title bar text — rejected in favor of a plain
  legible title bar, with the prompt idea relocated to a single static line
  inside the panel body instead.
- Literal Silkscreen-font "X" for the close control — rejected in favor of a
  separate pixel-art icon, to avoid a third use of the Silkscreen typeface.
- Always-visible `LEAD: NO` line — rejected in favor of omitting the line
  entirely when not applicable.
- Filled-at-rest contact button (breaking decision 11's outline convention
  as a one-off) — rejected in favor of "bigger, same style."
- Short fade/slide transition on open/close — rejected in favor of instant,
  per the dark-mode-toggle precedent.
- Click-outside-to-dismiss — rejected; the exposed page area is small enough
  that accidental dismissal was judged more costly than useful.
- Terminal-flavored trigger button label (`> details`, `$ open`) — rejected
  in favor of a plain "Details" label, keeping the terminal personality
  confined to the opened panel.
- Two bullet points for the collapsed card's summary (in place of the
  existing paragraph) — considered, then reverted: summary stays a 2–3 line
  paragraph as decision 6 already specifies.
