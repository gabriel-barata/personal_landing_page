# Contract: Experience Detail Content Data

The literal content contract that the new fields on
`frontend/src/data/experience-placeholder.ts`'s `ExperienceEntry` entries
MUST match, and that `tests/data/experience-placeholder.test.ts` asserts
against. Reproduced from spec.md's Requirements (FR-013, FR-014, FR-018)
and Key Entities section — exists so implementation and tests share one
unambiguous source, without re-reading the full spec prose each time.

## Per-entry new fields (FR-018) — all 3 existing entries, 100% coverage (SC-002)

Every one of the 3 entries from feature 003's `experiencePlaceholder`
(`senior-data-engineer`, `data-engineer`, `junior-data-engineer`) gains:

| Field | Type | Rule |
|---|---|---|
| `industry` | `string` | Non-empty, plausible-but-fictional (spec Assumptions) — consistent tone with the entry's existing `summary`. |
| `teamSize` | `string` | Non-empty display string (e.g. `"6 engineers"`, `"3-person team"`) — free text, not constrained to a bare number. |
| `isLead` | `boolean` | At least one entry `true`, at least one `false` — both metadata-block variants must be exercised (Acceptance Scenarios 2 & 3, `data-model.md`). |
| `tasks` | `string[]` | At least 1 bullet, each a concrete responsibility (not a restatement of `summary`). |
| `achievements` | `string[]` | At least 1 bullet, each a measurable outcome (a number, percentage, or concrete metric per bullet, consistent with the existing `summary` fields' style — e.g. "cutting nightly batch runtime by 60%"). |

No field is left empty/placeholder-text-free for any entry — an entry
missing any of these fields would silently break that entry's panel
(SC-002's "no entry silently missing the feature").

## Metadata block composition (FR-013) — derived, not stored

The panel's metadata block renders, in order:

1. `POSITION` — reuses `entry.role` (no separate field, `data-model.md`).
2. `INDUSTRY` — `entry.industry`.
3. `TEAM SIZE` — `entry.teamSize`.
4. `LEAD` — rendered **only** when `entry.isLead === true`; the line is
   absent from the DOM entirely when `false` (not rendered with a "No"
   value) — spec Edge Cases, Out of Scope ("Always showing a 'not a lead'
   state" was explicitly rejected).

## Command-line echo text (FR-012) — derived, not stored

`` `> cat experience/${entry.id}.md` `` — computed at render time from the
existing `id` field (`research.md` #7), unique per entry because `id` is
already required to be unique.

## Title bar text (FR-009)

`` `${entry.role} — ${entry.company}` `` — plain text, no fake shell-prompt
styling, reusing the same two fields already shown on the collapsed card.

## Contact action (FR-015)

The panel's contact button reuses the same `href` as the hero/footer's
existing email contact link (`frontend/src/data/contact-links.ts`, the
`kind: "email"` entry) — no new contact data is introduced by this feature.
