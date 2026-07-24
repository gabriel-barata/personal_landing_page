# Phase 1 Data Model: Resume Google Doc Parsing Pipeline

This feature's final output shape (`ResumeBody`, `About`, `Experience`,
`EmployerEntry`, `Role`, `DatePart`) is **not redefined here** — it is already
fully specified in `schema/src/` and documented in
`specs/001-resume-schema-about-experience/data-model.md`. This document
covers only the new, pipeline-internal entities this feature introduces to
get from a raw Google Doc to that shape (or to a list of errors). See
`research.md` for the rationale behind each choice below.

## Pipeline data flow

```text
raw Google Docs API response          (infrastructure, Google's shape)
        │  infrastructure/doc-lines.ts
        ▼
DocLine[]                              (neutral, domain-facing)
        │  domain/parse-resume.ts
        ▼
Result<ResumeBody, ParseError>       (domain output)
        │  index.ts (on ok only)        infrastructure/resume-writer.ts
        ▼
resume.json at repo root               (schema/'s ResumeBody, unchanged)
```

## `DocLine` (NEW)

The neutral, Google-agnostic representation the domain parses. One entry per
paragraph in the Doc, in document order.

| Field         | Type                | Notes |
|---------------|---------------------|-------|
| text          | `string`            | The paragraph's plain text, with the Doc's own trailing newline removed. |
| headingLevel  | `0 \| 1 \| 2`        | `0` = body text (`NORMAL_TEXT`); `1` = a top-level section heading (e.g. "ABOUT", "EXPERIENCE"); `2` = an employer heading within a section. Heading levels below `HEADING_2` are out of scope — a Doc's `HEADING_3`/`HEADING_4` content only ever occurs inside sections this feature ignores (contracts/doc-convention.md). |
| bullet        | `boolean`           | `true` for a bulleted list item (an achievement line); `false` otherwise. |

```ts
interface DocLine {
  text: string;
  headingLevel: 0 | 1 | 2;
  bullet: boolean;
}
```

**Produced by**: `infrastructure/doc-lines.ts`, from the raw Docs API
response's `body.content` (FR-001–FR-004 all operate on this, not on the raw
response).

## `ParseError` (NEW)

One reason the assembled data doesn't fit the `schema/` data model, tied to
where in the Doc it came from (FR-011).

| Field   | Type     | Notes |
|---------|----------|-------|
| path    | `string` | Human-readable location, e.g. `EXPERIENCE > "INDICIUM AI" > role 2`, or `ABOUT`. |
| message | `string` | What's wrong, e.g. `"role has no achievement bullets"`, `"end date \"Aug 2025\" is not in MM/YYYY or \"Present\" form"`. |

```ts
interface ParseError {
  path: string;
  message: string;
}
```

**Produced by**: `domain/parse-experience.ts` (the only function that can
fail — see below) whenever a required part of the `schema/` shape (a role's
title/start date/achievements, an employer's roles) can't be assembled from
the `DocLine[]` it was given.

## `Result<T, E>` (NEW)

A minimal local discriminated union — not a third-party library (research.md
#4).

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; errors: E[] };
```

## Parsing entity relationships

```text
DocLine[]
├── domain/parse-about.ts        → About | undefined                          (FR-001; cannot fail)
├── domain/parse-experience.ts   → Result<Experience | undefined, ParseError> (FR-002–FR-007, FR-010)
└── domain/parse-resume.ts        → Result<ResumeBody, ParseError>            (FR-009, FR-010, FR-013)
        combines the two above; ResumeBody's shape and optionality come
        entirely from schema/'s ResumeBody — see specs/001.../data-model.md
```

`parse-resume.ts`'s `Result` is `ok: false` whenever
`parse-experience.ts`'s is (About alone can never fail, per FR-001's
"extract the narrative text that follows it" having no rejection condition
in scope) — so the overall run fails exactly when the Experience section, if
present, doesn't fit `schema/`'s `Experience` shape (FR-009, FR-010).

## Validation rules (runtime — enforced by construction, research.md #2)

- A `Role` is only constructed once it has a `title`, a `startDate`, and a
  non-empty `achievements` array — matching `schema/`'s
  `achievements: [string, ...string[]]` (FR-006, FR-010).
- An `EmployerEntry` is only constructed once it has at least one `Role` —
  matching `schema/`'s `roles: [Role, ...Role[]]` (FR-003, FR-004, FR-010).
- A role's end date is omitted (not defaulted to any value) when the Doc
  reads "Present" or the end date is otherwise absent — never a placeholder
  `DatePart` (FR-005).
- `Experience` is only constructed non-empty; an "EXPERIENCE" heading with no
  employers beneath it yields `experience: undefined`, not an empty array
  (spec Edge Cases, matching `schema/`'s non-empty `Experience` tuple type).
- `ResumeBody.about` and `ResumeBody.experience` are populated independently
  — one may be present without the other (FR-013, unchanged from
  `schema/`'s FR-010).
- Content outside the "ABOUT"/"EXPERIENCE" sections never reaches any of
  these constructors (FR-008) — `doc-lines.ts` and `parse-resume.ts` only
  ever look at `DocLine`s between a recognized section heading and the next
  one.

## Out of scope for this data model

Everything already out of scope for `schema/`'s `ResumeBody` (contact
details, Education, Certifications, Personal Projects, Technical Skills) —
this feature's parsing rules never produce fields for them, matching FR-008.
