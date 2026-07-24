# Contract: `schema` package public API (About & Experience)

This feature's only "interface" is the TypeScript type surface the `schema`
workspace package exports for its two consumers, `pipeline` and `frontend`
(per architecture decision 6 — native TS types, no codegen, no runtime
validation layer). This document is the contract those consumers, and the
implementation task, must conform to. Field-level rationale lives in
`../research.md`; full shape detail lives in `../data-model.md`.

## Exported symbols (from `schema/src/index.ts`, or re-exported from it)

```ts
export type Month =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface DatePart {
  month: Month;
  year: number;
}

export interface Role {
  title: string;
  client?: string;
  startDate: DatePart;
  endDate?: DatePart;
  achievements: [string, ...string[]];
}

export interface EmployerEntry {
  name: string;
  location: string;
  roles: [Role, ...Role[]];
}

export type About = string;

export type Experience = [EmployerEntry, ...EmployerEntry[]];

export interface ResumeBody {
  about?: About;
  experience?: Experience;
}
```

## Consumer guarantees

- **Import path**: consumers depend on the `schema` workspace package
  (`"schema": "workspace:*"`, already wired for `pipeline` in
  `pipeline/package.json`; `frontend` will add the same dependency when it
  starts consuming this shape) and import these symbols by name — no default
  export, no namespace wrapper.
- **Optionality contract**: `ResumeBody.about` and `ResumeBody.experience`
  are each optional and independent (FR-010) — a consumer MUST NOT assume
  both are present; a consumer populating only one of them is valid.
- **Non-empty collections**: wherever a consumer constructs `Experience`,
  `EmployerEntry.roles`, or `Role.achievements`, the tuple type
  (`[T, ...T[]]`) rejects an empty array at compile time — a consumer never
  needs to runtime-check "is this list empty."
- **Ordering contract**: `Experience` and `EmployerEntry.roles` are
  documented (JSDoc on the type) to be reverse-chronological, most-recent
  first. This package does not enforce that at compile or runtime — a
  producer (e.g. a future pipeline mapping step) is responsible for
  populating them in that order; a consumer (e.g. frontend rendering) is
  entitled to rely on that order without re-sorting.
- **Ongoing-role contract**: a consumer determines "is this role ongoing?"
  solely via `role.endDate === undefined`. No other field carries that
  meaning (research.md #2).
- **No runtime validation**: this package performs no runtime parsing or
  validation of untrusted data (e.g. the raw Google Doc API response). Any
  consumer that needs to validate/convert untrusted input into this shape
  does so itself (out of scope here — see spec Assumptions).

## Stability

Per Success Criterion SC-002, adding new resume *content* (a new employer, a
new role, a new achievement bullet) must never require a change to this
contract. A change to this contract is only warranted by a change in
*structure* (e.g. a new field on `Role`), which is a schema-versioning
decision for a future feature, not an implicit side effect of content growth.
