# schema

Shared TypeScript types for the resume data model, imported by both
`pipeline` and `frontend` as a workspace dependency (`workspace:*`).

## Exported types

- `About` — the professional-summary narrative (a plain `string`).
- `Month`, `DatePart` — a 1–12 literal-union month paired with a numeric year.
- `Role` — a single position/engagement (`title`, optional `client`,
  `startDate`, optional `endDate` — absent means ongoing — and one or more
  `achievements`).
- `EmployerEntry` — an employer (`name`, `location`) and its one-or-more
  `roles`, most recent first.
- `Experience` — the non-empty, reverse-chronological collection of
  `EmployerEntry` values.
- `ResumeBody` — `{ about?: About; experience?: Experience }`; each field is
  independent and optional.

Only the About and Experience sections are modelled so far — the rest of
the resume (contact details, Education, Certifications, Personal Projects,
Technical Skills) is out of scope for now. See
[docs/architecture-decisions.md](../docs/architecture-decisions.md) and
`specs/001-resume-schema-about-experience/` for the full rationale.

## Scripts

- `pnpm --filter schema build` — compiles `src/` to `dist/`.
- `pnpm --filter schema typecheck` — type-checks `src/` only (no emit).
- `pnpm --filter schema test` — type-checks `src/` + `tests/`; the compile-time
  fixtures in `tests/resume-body.fixtures.ts` are this package's test suite
  (positive fixtures must compile, `// @ts-expect-error` negative fixtures
  must fail as expected). No test-runner dependency is used — see
  `specs/001-resume-schema-about-experience/research.md` #1.
