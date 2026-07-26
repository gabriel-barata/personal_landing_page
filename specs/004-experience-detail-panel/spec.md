# Feature Specification: Experience Detail Panel (Terminal-Style Overlay)

**Feature Branch**: `004-experience-detail-panel`

**Created**: 2026-07-26

**Status**: Draft

**Input**: User description: Terminal-styled detail panel for Experience entries. Design was finalized in a prior "grill-me" review session (2026-07-26); the canonical decision record lives in `docs/visual-direction.md` (decision 21 and its revision-history entry). This spec is the standalone, implementation-facing restatement of that same decision.

## Clarifications

### Session 2026-07-26

- Q: The spec defines pointer-based close behavior (X icon, Escape) but not keyboard focus behavior while the panel is open. Should focus be trapped inside the panel and restored to the triggering "Details" button on close? → A: Yes — trap focus inside the panel while open (Tab/Shift+Tab cycle only through panel controls), and restore focus to the "Details" button that opened it when the panel closes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View extended role detail (Priority: P1)

A visitor reading the Experience section wants more depth on a specific role
than the collapsed card's 2–3 line summary offers — the specific position
title, industry, team size, whether it was a lead role, granular task
responsibilities, and measurable achievements — without leaving the page or
losing their place in the timeline.

**Why this priority**: This is the entire point of the feature. Without it,
there is no detail panel — just a button that does nothing.

**Independent Test**: Can be fully tested by clicking "Details" on any single
Experience entry and confirming a panel opens showing that entry's position,
industry, team size, lead status (when applicable), tasks, and achievements.

**Acceptance Scenarios**:

1. **Given** the Experience section is visible with its timeline of entries,
   **When** a visitor clicks the "Details" button on an entry, **Then** a
   terminal-styled panel opens instantly (no transition) below the chapter
   heading, covering the timeline list area, sized to a fixed viewport-relative
   height with the entry's title bar (`Role — Company`), a static command-line
   echo line, a metadata block, a TASKS list, and an ACHIEVEMENTS list.
2. **Given** the panel is open for an entry that was a lead position,
   **When** the visitor reads the metadata block, **Then** a `LEAD:` line is
   present alongside `POSITION`, `INDUSTRY`, and `TEAM SIZE`.
3. **Given** the panel is open for an entry that was *not* a lead position,
   **When** the visitor reads the metadata block, **Then** no `LEAD:` line is
   rendered at all (not shown with a "no" value).
4. **Given** an entry's TASKS or ACHIEVEMENTS content is long enough to
   exceed the panel's fixed height, **When** the visitor scrolls within the
   panel, **Then** the content scrolls internally while the panel itself stays
   a fixed size and the chapter heading above it remains visible and fixed in
   place.

---

### User Story 2 - Close the detail panel (Priority: P1)

Having read a role's details, the visitor wants to return to the full
Experience timeline to browse other entries.

**Why this priority**: A panel that can't be dismissed traps the visitor and
blocks the rest of the page; this is required for the feature to be usable at
all, so it ties with Story 1 for priority.

**Independent Test**: Can be fully tested by opening any entry's panel, then
closing it via the close icon and separately via the Escape key, confirming
both return the visitor to the full timeline list in its prior state.

**Acceptance Scenarios**:

1. **Given** a detail panel is open, **When** the visitor clicks the
   close (X) control in the panel's title bar, **Then** the panel closes
   instantly and the full timeline list reappears.
2. **Given** a detail panel is open, **When** the visitor presses the Escape
   key, **Then** the panel closes instantly, identically to clicking the
   close control.
3. **Given** a detail panel is open, **When** the visitor clicks anywhere
   outside the panel (but still within the page), **Then** nothing happens —
   the panel stays open.
4. **Given** a detail panel is open, **When** the visitor presses Tab
   repeatedly, **Then** focus cycles only through the panel's own controls
   and never reaches a covered entry or other page content behind the panel.
5. **Given** a detail panel is open and the visitor closes it (via either the
   close control or Escape), **When** the panel finishes closing, **Then**
   keyboard focus returns to the "Details" button that originally opened it.

---

### User Story 3 - Contact directly from a role's detail panel (Priority: P2)

Having reviewed a role's details and decided they want to reach out, the
visitor wants a fast way to start an email without hunting for the site's
contact link elsewhere.

**Why this priority**: Valuable conversion path but the panel is still fully
useful for reading detail without it; this refines the feature rather than
defining it.

**Independent Test**: Can be fully tested by opening any entry's panel and
clicking the large contact button, confirming it triggers the same direct
email action as the hero section's contact CTA.

**Acceptance Scenarios**:

1. **Given** a detail panel is open, **When** the visitor clicks the large
   contact button at the bottom of the panel body, **Then** their email
   client opens a new message addressed to the same contact address used by
   the hero section's CTA.

---

### User Story 4 - Switch focus between different entries' details (Priority: P3)

A visitor wants to compare details across two or more roles by viewing one
entry's panel, closing it, and opening another entry's panel.

**Why this priority**: A natural but secondary usage pattern — it composes
Story 1 and Story 2 rather than adding new panel behavior of its own.

**Independent Test**: Can be fully tested by opening entry A's panel, closing
it, then opening entry B's panel, and confirming B's panel shows only B's
data with no leftover state from A.

**Acceptance Scenarios**:

1. **Given** entry A's panel is open, **When** the visitor closes it and then
   clicks "Details" on entry B, **Then** entry B's panel opens showing only
   entry B's title, metadata, tasks, and achievements.
2. **Given** entry A's panel is open, **When** the visitor looks at the
   timeline entries covered by the panel, **Then** those entries' own
   "Details" buttons are not reachable until the open panel is closed.

### Edge Cases

- An entry with very short task/achievement lists still renders a panel at
  the same fixed height as every other entry (no shrink-to-fit).
- Pressing Escape when no panel is open has no effect.
- On a viewport narrower than 768px, the panel renders full-width with the
  depth cue limited to visible page content above/below (not at the sides),
  and still supports internal scroll and both close methods.
- An entry that was not a lead position never shows a `LEAD:` line, in list
  view or detail view.
- Only one entry's panel can be open at any time; the trigger buttons on
  other entries are covered and unreachable while a panel is open, so no
  second panel can be triggered without closing the first.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each Experience entry MUST display a "Details" trigger button
  after its summary paragraph, styled per the site's existing button
  convention (outlined at rest, filled accent on hover, ≥15px label), with no
  terminal-flavored wording.
- **FR-002**: Clicking an entry's "Details" button MUST open a terminal-styled,
  fully opaque panel scoped to that entry's data.
- **FR-003**: At most one entry's panel MUST be open at a time; the panel
  layout MUST cover the other entries so their trigger buttons are
  unreachable until the open panel is closed.
- **FR-004**: Opening and closing the panel MUST be instantaneous, with no
  fade, slide, or scale transition.
- **FR-005**: The panel MUST be anchored to the same left/right edges as the
  page's existing content column, rather than floating independently of it.
- **FR-006**: The panel MUST open below the Experience section's chapter
  heading and divider, both of which MUST remain visible while the panel is
  open; the panel covers only the timeline list area.
- **FR-007**: The panel MUST render at a fixed, viewport-relative height
  regardless of the entry's content length, with internal scrolling when
  content exceeds that height.
- **FR-008**: The panel's depth relative to the page MUST be conveyed only
  through partial coverage (page content visibly exposed around it); the
  panel MUST NOT use a drop shadow or a dimming scrim/backdrop.
- **FR-009**: The panel MUST display a title bar with plain text in the form
  `Role — Company`, with no fake shell-prompt styling.
- **FR-010**: The panel's title bar MUST include a close control in the
  top-right, rendered as a small pixel-art icon (not the site's display
  typeface).
- **FR-011**: The panel MUST close when the visitor activates the close
  control or presses the Escape key, and MUST NOT close on a click outside the
  panel.
- **FR-019**: While the panel is open, keyboard focus MUST be trapped within
  it — Tab and Shift+Tab MUST cycle only through the panel's own focusable
  controls (close control, contact button, and any other focusable elements
  inside the panel) and MUST NOT reach the covered entries or any other page
  content behind it. When the panel closes (via either close method), focus
  MUST return to the "Details" button that opened it.
- **FR-012**: The panel body MUST begin with one static line of fake
  command-line-echo text (no typing animation) unique to that entry.
- **FR-013**: The panel body MUST include a metadata block with labeled
  lines for position, industry, and team size; a labeled lead-status line
  MUST appear only when the entry was a lead position and MUST be omitted
  entirely otherwise.
- **FR-014**: The panel body MUST include two independently labeled bullet
  lists: detailed task responsibilities, and measurable achievements/impact.
- **FR-015**: The panel body MUST end with a large contact button that, when
  activated, opens the visitor's email client addressed to the same contact
  address used by the site's existing hero contact action.
- **FR-016**: On viewports narrower than 768px, the panel MUST render
  full-width and MUST limit its depth cue to visible page content above and
  below it (not beside it), while keeping its fixed height, internal scroll,
  and title bar.
- **FR-017**: The collapsed (list-view) entry card's summary MUST remain
  unchanged as a 2–3 line paragraph; only the "Details" trigger is added to
  it.
- **FR-018**: The underlying content data for each entry MUST support an
  industry label, a team size value, a lead-position flag, a list of task
  bullets, and a list of achievement bullets, sourced from the site's
  existing frontend placeholder content (no backend or schema changes).

### Key Entities *(include if feature involves data)*

- **Experience Detail**: Extended, panel-only information attached to an
  existing Experience entry — industry the role was in, team size, whether
  it was a lead position, a list of detailed task bullets, and a list of
  achievement/impact bullets. Lives alongside each entry's existing
  role/company/dates/summary data as placeholder content; not sourced from
  the live résumé data pipeline.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: From any point in the Experience section, a visitor can reach
  full task/achievement detail for a given role in a single click, with the
  panel visible with no perceptible delay (instant open, no loading state).
- **SC-002**: Every entry in the Experience section has a working "Details"
  trigger and a corresponding detail panel populated with that entry's own
  data — 100% coverage, no entry silently missing the feature.
- **SC-003**: Detail content of any length remains fully readable through
  scrolling, with the panel's outer size staying visually consistent across
  every entry (visitors never see a panel resize itself to fit content).
- **SC-004**: A visitor can close an open panel through two independent
  actions (a visible close control and the Escape key) without ever
  navigating away from the page.
- **SC-005**: A visitor can go from an open detail panel to a composed email
  addressed to the site owner in one click.
- **SC-006**: On mobile viewports, the panel is fully usable without
  triggering horizontal scrolling or a full-screen takeover of the page.
- **SC-007**: A keyboard-only visitor can operate the panel end-to-end —
  reach the "Details" button, have focus land and stay confined inside the
  open panel, and land back on the same "Details" button after closing —
  without ever tabbing into a covered or background element.

## Assumptions

- Placeholder detail content (industry, team size, lead flag, tasks,
  achievements) will be authored per entry as fictional-but-plausible data in
  the frontend's existing placeholder data source, consistent with how the
  rest of the Experience section's placeholder content is handled today.
- The panel's contact action reuses the same email address as the hero
  section's existing contact CTA; no second contact channel (e.g. a link to
  a professional network profile) is included.
- The existing single 768px responsive breakpoint is reused for the panel's
  mobile adaptation; no additional breakpoints are introduced.
- This feature is scoped entirely to the frontend's placeholder data layer:
  no changes to the shared `schema` package's types and no changes to the
  `pipeline` package. Wiring these fields to the real résumé data source
  remains future work, tracked separately from this feature.

## Out of Scope

The following alternatives were considered during design and explicitly
rejected; they are recorded here so they are not proposed again during
implementation:

- A full-screen modal with a dimming scrim/backdrop.
- Inline accordion expansion of the entry card in place.
- Replacing the entire timeline list with the open panel.
- A fake file-path/prompt string as the title bar text.
- Using the site's display typeface for the close control instead of a
  dedicated pixel-art icon.
- Always showing a "not a lead" state in the metadata block.
- A filled-at-rest style for the contact button (it stays outline-at-rest
  like every other button, just larger).
- Any fade/slide/scale transition on open or close.
- Click-outside-to-dismiss.
- Terminal-flavored wording on the list-view trigger button.
- Replacing the collapsed card's paragraph summary with bullet points.
