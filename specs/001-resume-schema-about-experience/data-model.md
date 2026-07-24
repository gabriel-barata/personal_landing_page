# Phase 1 Data Model: Resume Schema — About & Experience

Field-level shape for the `schema` package's About/Experience portion of the
shared resume body. This is the source of truth `contracts/resume-body.md`
and the implementation task in a later phase must match exactly. See
`research.md` for the rationale behind each choice below.

## `Month`

Literal union, not a plain `number`, so the compiler enforces the 1–12 range.

```ts
type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
```

## `DatePart`

Reused for both a role's start and end date.

| Field | Type    | Required | Notes                        |
|-------|---------|----------|-------------------------------|
| month | `Month` | yes      | 1–12, enforced by the type    |
| year  | `number`| yes      | e.g. `2023`                   |

```ts
interface DatePart {
  month: Month;
  year: number;
}
```

## `Role`

A single position (or client engagement) held within one `EmployerEntry`.

| Field        | Type                        | Required | Notes |
|--------------|-----------------------------|----------|-------|
| title        | `string`                    | yes      | Job title (FR-005) |
| client       | `string`                    | no       | Named client/engagement, distinct from the employer (FR-007) |
| startDate    | `DatePart`                  | yes      | FR-005 |
| endDate      | `DatePart`                  | no       | Absent = still ongoing (FR-006); present = concluded |
| achievements | `[string, ...string[]]`     | yes      | One or more plain-text bullets (FR-005, FR-008); non-empty enforced by the tuple type |

```ts
interface Role {
  title: string;
  client?: string;
  startDate: DatePart;
  endDate?: DatePart;
  achievements: [string, ...string[]];
}
```

**State**: "ongoing" vs. "concluded" is not a stored field — it is derived
entirely from whether `endDate` is present (FR-006, research.md #2).

## `EmployerEntry`

A single organization the candidate worked for.

| Field    | Type                    | Required | Notes |
|----------|-------------------------|----------|-------|
| name     | `string`                | yes      | Employer name (FR-003) |
| location | `string`                | yes      | Single free-text string, e.g. `"London, UK"`, `"Remote"` (FR-003, clarification) |
| roles    | `[Role, ...Role[]]`     | yes      | One or more roles (FR-004); ordered reverse-chronologically, most recent first (FR-011); non-empty enforced by the tuple type |

```ts
interface EmployerEntry {
  name: string;
  location: string;
  /** Reverse-chronological: most recent role first (FR-011). */
  roles: [Role, ...Role[]];
}
```

## `About`

The resume's professional-summary narrative.

```ts
/** Single block of narrative text; no internal structure (FR-001). */
type About = string;
```

## `Experience`

The Experience section: a non-empty, reverse-chronologically ordered
collection of employer entries (FR-002, FR-011).

```ts
/** Reverse-chronological: most recent employer first (FR-011). */
type Experience = [EmployerEntry, ...EmployerEntry[]];
```

## `ResumeBody`

The in-scope portion of the shared resume object for this feature. `about`
and `experience` are independent and each optional, so one can be present
without the other (FR-010).

```ts
interface ResumeBody {
  about?: About;
  experience?: Experience;
}
```

## Relationships

```text
ResumeBody
├── about?: About                         (string, standalone)
└── experience?: Experience               (non-empty EmployerEntry[])
        └── EmployerEntry                 (name, location)
                └── roles: [Role, ...]     (non-empty, reverse-chronological)
                        └── Role           (title, client?, startDate, endDate?, achievements)
```

## Validation rules (compile-time only — see research.md #1)

- `Month` rejects any numeric literal outside 1–12.
- `EmployerEntry.roles` and `Role.achievements` reject an empty array literal.
- `Role` has no field requiring `client` — it is optional (FR-007).
- `Role` has no field requiring `endDate` — it is optional (FR-006).
- `ResumeBody.about` and `ResumeBody.experience` are each independently
  optional (FR-010) — no cross-field requirement ties them together.
- Nothing outside `about`/`experience` is required by `ResumeBody` (FR-009).

## Out of scope for this data model

Anything not reachable from `ResumeBody` above — contact details, Education,
Certifications, Personal Projects, Technical Skills — per spec Assumptions.
Populating this shape from `pipeline/tmp/raw-doc.json` is also out of scope
(a later, separate feature).
