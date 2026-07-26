# Phase 0 Research: Experience Detail Panel (Terminal-Style Overlay)

The spec has no open `NEEDS CLARIFICATION` markers (its one clarification —
focus trap + focus restoration — is already resolved in spec.md's
Clarifications session). This phase records the implementation-mechanism
decisions needed to turn the spec + `docs/visual-direction.md` decision 21
into a concrete design, all within the existing Astro frontend
(`docs/architecture-decisions.md` decision 10 — not reopened here).

## 1. Panels are server-rendered per entry, toggled by visibility — not one dynamic panel filled by client-side JS

**Decision**: `Experience.astro`'s existing `.map()` over
`experiencePlaceholder` also renders one `ExperienceDetailPanel.astro`
instance per entry, each carrying that entry's data as static markup and
starting `hidden`. A wrapping `<div class="timeline-wrap">` around the
existing `<ol class="timeline">` becomes `position: relative`; each panel is
`position: absolute; inset: 0` inside it, so a visible panel covers the full
timeline area (all entries, not just its own), matching FR-003/FR-006. A
single inline `<script>` in `Experience.astro` opens a panel by removing
`hidden` from the target and adding it back to whichever panel was
previously open (mutual exclusivity is structural, not just convention).

**Rationale**: Every other content section on this site (timeline entries,
tech stack categories, certifications) is static Astro-templated markup with
a thin interactive layer bolted on (Constitution Principle II — interface
code only presents, it doesn't decide). Rendering all panel content
server-side keeps that pattern intact and needs no client-side templating,
JSON payload, or DOM-building code — the script's only job is toggling
`hidden`/`inert` on elements that already exist. This also means
`contracts/content-data.md`-style literal-content contracts apply the same
way they do for the rest of the site's data.

**Alternatives considered**:
- **One shared panel element, populated from a JSON payload on click**:
  would need a client-side lookup + DOM-patching step for content Astro can
  already render for free at build time — more code for the same visible
  result, and it would put "what does this entry's panel say" logic in the
  client script rather than in data + template (Principle II).
- **One shared panel element, populated by re-reading the clicked entry's
  own DOM node**: avoids JSON but still needs template-shaped write logic in
  JS to reconstruct the metadata block/lists; server-rendering the same
  markup directly is strictly less code.

## 2. Covered entries are made unreachable via the native `inert` attribute, not manual `tabindex` bookkeeping

**Decision**: While a panel is open, the script sets `inert` on the
`<ol class="timeline">` (all evergreen browsers support it) and clears it on
close. No per-button `tabindex="-1"`/`aria-hidden` toggling across the 3
entries' "Details" buttons is written by hand.

**Rationale**: `inert` removes a whole subtree from both the tab order and
the accessibility tree in one attribute, which is exactly FR-003's
requirement ("other entries' trigger buttons unreachable") and half of
FR-019's focus-trap requirement (focus can't land *behind* the panel).
Achieving the same result by hand would mean iterating every focusable
descendant of the timeline on every open/close — more code, another place to
introduce a bug, for a problem one platform primitive already solves
(Constitution Principle V).

**Alternatives considered**:
- **Manual `tabindex="-1"` + `aria-hidden="true"` toggling per entry**: works
  but is exactly the kind of hand-rolled bookkeeping `inert` exists to
  replace; also easy to leave stale if an entry's markup grows more
  focusable children later.
- **A JS focus-trap library (e.g. `focus-trap`)**: rejected outright — no
  third-party runtime dependency is added anywhere else in this frontend
  (CLAUDE.md's no-CDN-at-runtime stance, `docs/architecture-decisions.md`
  decision 9's "pure TypeScript/Node.js" preference), and the trap needed
  here is small enough to hand-write (see #4 below).

## 3. Panel semantics: plain `role="dialog"` div, not the native `<dialog>` element

**Decision**: Each panel is a plain `<div role="dialog" aria-modal="true"
aria-labelledby="panel-title-{id}">`, absolutely positioned within the
content column as described in #1 — not a native `<dialog>` shown via
`.showModal()`.

**Rationale**: Native `<dialog>.showModal()` renders in the browser's top
layer with its own `::backdrop`, is viewport-centered by default, and sits
above *all* page content — fighting three explicit constraints at once:
FR-008 (no scrim — the `::backdrop` would need to be suppressed and its
absence re-verified on every browser), FR-005 (anchored to the 900px content
column, not the viewport), and FR-006 (the chapter heading above the panel
must stay visibly on top, not be covered by top-layer stacking). A plain div
gives direct control over position and stacking with nothing built-in to
override, at the cost of wiring `role`/`aria-modal`/focus-trap/Escape by
hand — which FR-019's focus trap already requires writing regardless (#2,
#4), so it isn't marginal extra cost.

**Alternatives considered**:
- **Native `<dialog>` with `.show()` (non-modal)**: avoids the top-layer
  backdrop but also doesn't trap focus or block background interaction on
  its own — still needs the same manual `inert` + focus-trap + Escape
  wiring as the plain-div approach, so it buys nothing over a div here.

## 4. Focus trap: hand-written `keydown` cycling, pure index math extracted and unit-tested

**Decision**: On open, the script queries the visible panel's focusable
elements (`button, a[href], [tabindex]:not([tabindex="-1"])`, in DOM order)
and moves focus to the first one (the close control). A `keydown` listener
on the panel intercepts `Tab`/`Shift+Tab` and wraps focus at the ends of
that list; a document-level `keydown` listener closes the open panel on
`Escape` (no-op if none is open — spec Edge Cases). The index-wrapping
arithmetic (`nextFocusIndex(current, count, direction)`) is a pure function
in `frontend/src/lib/experience-panel.ts`, unit-tested the same way
`lib/theme.ts`'s `resolveTheme` is (`research.md` precedent, feature 003)
via `node:test`. The DOM query/listener wiring itself stays untested inline
script, matching the existing split between `lib/theme.ts` (tested) and
`ThemeToggle.astro`'s `<script>` (not unit-tested) — Constitution Principle
II keeps the decidable logic (index math) out of the DOM glue.

**Rationale**: This is the smallest possible hand-written trap for a panel
with a fixed, small set of focusable controls (close icon, contact button,
and any inline links) — no generalized "trap any subtree" utility is built,
since nothing else on the site needs one (Simplicity/YAGNI).

## 5. Close icon: new pixel-art SVG, reusing the existing `Icon.astro` inlining convention

**Decision**: Add `frontend/public/icons/close.svg` (hand-built pixel-art X,
single-path, no `fill` baked in) and render it via the existing
`Icon.astro` component (`id="close"`), the same mechanism already used for
`aws.svg`/`databricks.svg`/etc. — no new icon-loading code.

**Rationale**: `Icon.astro` already inlines self-hosted SVGs and recolors
them via `currentColor`; visual-direction decision 21 explicitly calls for
"a hand-built SVG glyph, not the Silkscreen typeface" for this control, which
is exactly what the existing component was built for. Reusing it needs zero
new infrastructure.

## 6. Detail fields are added directly onto `ExperienceEntry`, not a second lookup entity

**Decision**: `industry`, `teamSize`, `isLead`, `tasks`, and `achievements`
are added as new fields on the existing `ExperienceEntry` interface in
`experience-placeholder.ts`, populated for all 3 entries — not a separate
`ExperienceDetail[]` collection keyed by `id`. The metadata block's
`POSITION` line re-renders the entry's existing `role` field; no new,
separate "position" field is added.

**Rationale**: Spec's Key Entities section describes the detail data as
living "alongside" the existing entry — every entry has exactly one detail
set, always, with no case where one exists without the other. A second
collection plus an id-based lookup would be indirection for data that's
always read together (Constitution Principle V). `role` already carries the
"specific position title" the metadata block needs — introducing a second
field with an unspecified difference from `role` would be speculative.

**Alternatives considered**:
- **Separate `ExperienceDetail` entity + lookup by `id`**: matches the
  spec's prose most literally but adds a join step (find-by-id) for data
  that's 1:1 and always co-rendered — no scenario in the spec ever needs an
  entry without its detail, or a detail without its entry.

## 7. The command-line echo text is derived, not stored

**Decision**: The panel body's static echo line (FR-012, e.g.
`> cat experience/senior-data-engineer.md`) is computed at render time as
`` `> cat experience/${entry.id}.md` ``, not stored as its own data field.

**Rationale**: `id` is already required to be a unique, slug-like string
(existing convention, unchanged by this feature) — the echo text is fully
determined by it. Storing a second, separately-authored field whose value
must always match `id` would just be a duplicate the data could drift out of
sync with (Simplicity).

## Architecture-decisions.md follow-up

None — this feature stays entirely within the existing Astro frontend
(`docs/architecture-decisions.md` decision 10) and the existing
frontend-placeholder-data scope (CLAUDE.md, spec Assumptions/Out of Scope:
no `schema`/`pipeline` changes). No repo-wide architecture decision is being
made or reopened.
