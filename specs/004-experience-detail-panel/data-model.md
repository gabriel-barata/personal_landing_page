# Phase 1 Data Model: Experience Detail Panel

All types below are framework-free TypeScript
(`frontend/src/data/experience-placeholder.ts`,
`frontend/src/lib/experience-panel.ts`) — no Astro or DOM types — per
Constitution Principle I. This extends the `ExperienceEntry` shape from
feature 003's `data-model.md`; exact placeholder content quality bar is
fixed by `contracts/content-data.md`.

## ExperienceEntry (extended)

Spec Key Entity: *Experience Detail*, modeled as new fields directly on the
existing entry (`research.md` #6) rather than a separate lookup collection.

```ts
interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string | "Present";
  summary: string;
  isCurrent: boolean;

  // New fields (this feature):
  industry: string;      // metadata "INDUSTRY" line
  teamSize: string;      // metadata "TEAM SIZE" line — display string, e.g. "6 engineers"
  isLead: boolean;       // when true, metadata renders a "LEAD" line; when false, the line is omitted entirely (FR-013)
  tasks: string[];       // TASKS bullet list — detailed responsibilities
  achievements: string[]; // ACHIEVEMENTS bullet list — metrics/impact
}

type ExperiencePlaceholder = ExperienceEntry[]; // still exactly 3 (feature 003), unchanged order/isCurrent rules
```

The metadata block's `POSITION` line reuses `entry.role` — no separate
`position` field (`research.md` #6). The panel's static command-line echo
line is derived from `entry.id` at render time — no separate field
(`research.md` #7).

**Validation rules** (extends `tests/data/experience-placeholder.test.ts`):
- Every entry has a non-empty `industry` and `teamSize`.
- Every entry has `tasks.length >= 1` and `achievements.length >= 1`.
- At least one entry has `isLead: true` and at least one has `isLead: false`
  — both metadata-block variants (FR-013's "LEAD line present" vs. "LEAD
  line omitted") must be exercised somewhere in the placeholder data (spec
  Acceptance Scenarios 2 and 3).

## Panel focus-trap state (`lib/experience-panel.ts`)

Not a spec Key Entity, but the state shape the focus trap's DOM wiring reads
(`research.md` #4), formalized in `contracts/panel-interaction.md`:

```ts
type FocusDirection = 1 | -1; // Tab = 1, Shift+Tab = -1

// Pure index-wrapping arithmetic — the only trap logic that's meaningfully
// unit-testable without a DOM (Constitution Principle II).
declare function nextFocusIndex(
  current: number,
  count: number,
  direction: FocusDirection,
): number;
```

**Validation rules** (`tests/lib/experience-panel.test.ts`):
- `nextFocusIndex(0, 3, -1)` → `2` (Shift+Tab from the first control wraps
  to the last).
- `nextFocusIndex(2, 3, 1)` → `0` (Tab from the last control wraps to the
  first).
- `nextFocusIndex(1, 3, 1)` → `2`; `nextFocusIndex(1, 3, -1)` → `0` (no
  wrap needed mid-list).
- `nextFocusIndex(0, 1, 1)` → `0` (single-control panel: Tab stays put
  rather than throwing or going out of range).
