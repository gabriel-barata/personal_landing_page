# Contract: Detail Panel Interaction State

Three pieces of code must agree on this contract without importing each
other's internals: `Experience.astro`'s inline `<script>` (the only place
DOM state is mutated), `ExperienceDetailPanel.astro`'s static markup (what
exists to mutate), and `lib/experience-panel.ts` (the one piece of pure,
unit-tested logic — `research.md` #4).

## DOM state (owned by `Experience.astro`'s inline `<script>`)

| Element | Attribute | Meaning |
|---|---|---|
| `<ol class="timeline">` | `inert` (present/absent) | Present while any panel is open — removes all entries' "Details" buttons from the tab order and accessibility tree in one step (`research.md` #2, FR-003). |
| Each `[data-panel="{entryId}"]` | `hidden` (present/absent) | Absent on exactly one panel at a time (the open one), present on all others and on page load (no panel open initially). |
| Each `[data-panel="{entryId}"]` | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="panel-title-{entryId}"` | Static, always present (not toggled) — identifies the element as a dialog whenever it becomes visible (`research.md` #3). |
| Each "Details" `<button>` | `aria-controls="panel-{entryId}"` | Static, always present — associates the trigger with the panel it opens. |

No attribute or state lives in `localStorage`/`sessionStorage` — which
panel (if any) is open is not persisted across reloads (spec has no
requirement that it survive one; contrast with `resume:theme`/`resume:lang`
in feature 003's `contracts/theme-language-state.md`, which explicitly do
persist).

## Open sequence (Details button click, FR-002, FR-003)

1. If a different panel is currently open, hide it (`hidden = true`) and
   clear the timeline's `inert`.
2. Show the target panel (`hidden = false`).
3. Set `inert` on `<ol class="timeline">`.
4. Store a reference to the clicked button (for step 4 of Close, below) —
   in module-scope script state, not a DOM attribute.
5. Move focus to the panel's first focusable control (its close icon).

No fade/slide/scale transition anywhere in this sequence (FR-004) — every
attribute change above takes effect on the same tick as the click handler,
no `requestAnimationFrame`/timeout staging (contrast with feature 003's
theme toggle, which *does* stage a class add/remove across two
`requestAnimationFrame`s for an unrelated CSS-transition-suppression reason
that doesn't apply here — there is no transition to suppress in this
feature).

## Close sequence (close icon, Escape key, FR-011)

1. Hide the open panel (`hidden = true`).
2. Clear `inert` from `<ol class="timeline">`.
3. Clear the stored trigger-button reference's use as a focus target *after*
   using it in step 4 (order matters: read then clear).
4. Return focus to the stored trigger button (FR-019, SC-007).

Clicking anywhere outside the panel does **not** run this sequence — no
click-outside listener is attached at all (FR-011, Out of Scope). Escape is
a no-op (does not throw, does not run any of the above) when no panel is
open (spec Edge Cases) — the document-level Escape listener checks for an
open panel before doing anything.

## Focus trap (open panel only, FR-019)

- A `keydown` listener scoped to the currently-open panel intercepts `Tab`
  and `Shift+Tab`.
- On each intercepted keypress, the panel's focusable-elements list is
  queried fresh (not cached across opens, since which panel is open
  changes which element set applies) and `nextFocusIndex` (`data-model.md`)
  computes the next index from the currently-focused element's position in
  that list, wrapping at both ends.
- `preventDefault()` is called on the intercepted key event and focus is
  moved explicitly — the trap does not rely on `inert`/DOM order alone to
  achieve wrapping, since native Tab order does not wrap by itself.
- Because the timeline is `inert` for the whole duration the panel is open
  (previous section), the browser's native Tab order already excludes it —
  the trap only needs to handle wrapping *within* the panel's own controls,
  not exclusion of outside content.

## Mutual exclusivity (FR-003, Edge Cases)

At most one `[data-panel]` element is ever visible (`hidden` absent) at
once — enforced structurally by the Open sequence's step 1, not by a
separate "close all others" scan. Switching from entry A's panel to entry
B's panel is Close(A) followed by Open(B), run back-to-back within the same
click handler when the visitor closes A and then separately clicks a new
Details button for B (US4) — there is no direct "swap" path, since B's
Details button is unreachable (`inert`) while A's panel is open in the
first place (spec Edge Cases: closing is required before a second panel can
be triggered).
