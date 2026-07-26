# Quickstart: Experience Detail Panel (Terminal-Style Overlay)

Validates this feature end-to-end against spec.md's User Stories and Success
Criteria. Run after the tasks in `tasks.md` are implemented.

## Prerequisites

- Node.js >= 22.13, pnpm (per root `package.json`).
- From repo root: `pnpm install`.

## Automated checks

```bash
pnpm --filter frontend typecheck   # tsc --noEmit
pnpm --filter frontend test        # node:test — lib/experience-panel.ts, data/experience-placeholder.ts
pnpm --filter frontend build       # astro build — proves the new panel markup compiles clean statically
```

All three MUST pass before manual validation below. This feature makes no
`schema`/`pipeline` changes (spec Assumptions), so those packages' checks
are unaffected.

## Manual validation

Run `pnpm --filter frontend dev` and open the printed local URL. Also run
`pnpm --filter frontend preview` against the `build` output at least once.

### US1 — View extended role detail (SC-001, SC-002, SC-003)

1. Scroll to Experience. Confirm each of the 3 entries shows its existing
   2–3 line summary unchanged, followed by a "Details" button styled like
   every other button on the site (outline at rest, filled accent on
   hover, ≥15px label) — no terminal-flavored wording on the button itself.
2. Click "Details" on the current (top) entry. Confirm: the panel appears
   **instantly** (no fade/slide), below the "01/03 Experience" chapter
   heading and divider (both still visible), covering the timeline list
   area, at a fixed height that does not depend on this entry's content
   length.
3. Confirm the panel's title bar reads `Role — Company` in plain text (no
   fake shell prompt), a static `> cat experience/{id}.md` line appears at
   the top of the body (not animated/typing), then a metadata block
   (POSITION, INDUSTRY, TEAM SIZE, and — only for a lead entry — LEAD),
   then labeled TASKS and ACHIEVEMENTS bullet lists.
4. Repeat for an entry where `isLead: false` (`contracts/content-data.md`):
   confirm the metadata block has no LEAD line at all — not a "LEAD: No"
   line.
5. If any entry's TASKS/ACHIEVEMENTS content is long enough, confirm the
   list scrolls **inside** the panel while the panel's outer box and the
   chapter heading above it stay fixed in place.

### US2 — Close the detail panel (SC-004, SC-007)

1. With a panel open, click the pixel-art X icon in the title bar: confirm
   the panel closes instantly and the full timeline reappears.
2. Open another entry's panel, press **Escape**: confirm identical instant
   closing.
3. Open a panel, click on visible page content outside it (e.g. the chapter
   heading or page background): confirm nothing happens — the panel stays
   open (no click-outside-to-dismiss, FR-011).
4. Open a panel, press **Tab** repeatedly: confirm focus cycles only
   through the panel's own controls (close icon, contact button, any other
   focusable element inside) and wraps around — it never reaches a covered
   entry's "Details" button or any other page content behind the panel.
   Confirm **Shift+Tab** wraps the other direction.
5. With no panel open, press **Escape**: confirm nothing happens (no
   error, no visible change).
6. Open a panel via its "Details" button, close it (either method): confirm
   keyboard focus lands back on that same "Details" button (visible focus
   ring), not the page top or another element.

### US3 — Contact directly from a role's detail panel (SC-005)

1. Open any entry's panel, scroll to the bottom, click the large contact
   button. Confirm it opens the visitor's email client addressed to the
   same address as the hero section's contact CTA
   (`contracts/content-data.md`).

### US4 — Switch focus between different entries' details

1. Open entry A's panel, close it, then open entry B's panel. Confirm B's
   panel shows only B's title/metadata/tasks/achievements — no leftover
   text or scroll position from A.
2. With entry A's panel open, confirm entry B's (and C's) "Details" buttons
   are not reachable by mouse click or by Tab — they only become clickable
   again once A's panel is closed.

### Edge Cases

- Open the entry with the shortest TASKS/ACHIEVEMENTS lists: confirm its
  panel is still the same fixed height as every other entry (no
  shrink-to-fit).
- At a viewport narrower than 768px: confirm the panel renders full-width,
  the depth cue (exposed page content) is visible above/below the panel but
  not beside it, and both close methods plus internal scroll still work.

### Responsive / visual conformance (manual, per CLAUDE.md — not automated)

Resize from 320px up through desktop width with a panel open at each
checkpoint: confirm no horizontal scroll, no clipped content, panel stays
anchored to the same left/right edges as the rest of the content column
above 768px, and switches to full-width below it. Confirm no drop shadow
and no dimming scrim anywhere around the panel at any width (FR-008).
