# Phase 0 Research: Resume Schema — About & Experience

No `NEEDS CLARIFICATION` markers remain in the Technical Context — the existing
repo (`docs/architecture-decisions.md`, `schema/package.json`,
`tsconfig.base.json`, `pnpm-workspace.yaml`) already fixes language, tooling,
and dependency posture for the `schema` package. This document instead
resolves the feature-specific design questions the spec deliberately left to
planning (data shape and how to satisfy the constitution's TDD gate for a
package with no runtime behavior).

## 1. How to satisfy Test-Driven Development for a types-only package

**Decision**: No test-runner dependency is added. Behavior is demonstrated by
TypeScript source fixtures compiled with `tsc --noEmit`:
- Positive fixtures: literal values assigned to the exported types, one per
  acceptance scenario (e.g. an employer with one role, an employer with three
  roles including an ongoing one, a role with a separate client name, the
  About text). A fixture that fails to compile is a failing test.
- Negative fixtures: use TypeScript's `// @ts-expect-error` directive on a
  line that violates a requirement (e.g. a role with no achievements, a
  month of `13`, an employer with zero roles). `tsc` fails the build if the
  expected error does *not* occur, and fails it if an *unexpected* error
  occurs elsewhere — so these are real, automated, red/green tests.

**Rationale**: The `schema` package's only behavior, per architecture
decision 6, is the shape of plain TypeScript types/interfaces — there is no
function to unit test. The type checker is the correctness oracle for that
kind of behavior, so using it directly as the test runner satisfies
Constitution Principle IV (a test demonstrates each behavior, written
alongside the implementation) without violating Principle V (Simplicity) or
decision 6 (no runtime validation/codegen layer, zero non-dev dependencies).

**Alternatives considered**:
- `vitest` + `expectTypeOf`: would work, but adds a test-runner dependency to
  a package that currently has none, for no capability `tsc --noEmit` +
  `@ts-expect-error` doesn't already provide here.
- `tsd`: purpose-built for this, but is a second, redundant way to do what
  plain `tsc` already does for a package this small — an unjustified moving
  part under Principle V.
- `zod` (or similar) runtime schemas: would give real runtime-testable
  validation, but reintroduces exactly the kind of validation/codegen layer
  decision 6 deliberately moved away from, and there is no untrusted input in
  this feature's scope to validate against (mapping the raw Google Doc JSON
  into this shape is explicitly out of scope — see spec Assumptions).

## 2. Ongoing vs. concluded role

**Decision**: `Role.endDate` is optional (`endDate?: DatePart`); its absence
*is* "ongoing." No separate boolean/enum/status field.

**Rationale**: Directly matches the spec's clarification answer and
Assumptions ("An ongoing/current role is represented by the absence of the
end-date fields rather than a placeholder value").

**Alternatives considered**: A `status: 'ongoing' | 'concluded'` discriminant
— rejected as a second source of truth that could drift from the actual
presence/absence of `endDate` (FR-006 already treats absence as sufficient).

## 3. Date representation

**Decision**: A shared `DatePart { month: Month; year: number }` type, reused
for both `startDate` and `endDate`, where `Month` is the literal union
`1 | 2 | ... | 12` rather than plain `number`.

**Rationale**: Matches the clarification answer (separate numeric
`month`/`year` fields, not a combined string). Using a 1–12 literal union for
`month` lets the compiler itself enforce the "numeric month (1-12)" part of
FR-005/FR-006, which is otherwise unenforceable in a package with no runtime
validation — and gives a natural negative fixture (`month: 13` must fail to
compile).

**Alternatives considered**: `month: number` with a code comment saying
"1-12" — rejected; an unenforced comment is not a test-demonstrable
guarantee, and the literal-union costs nothing extra.

## 4. Non-empty collections (roles, achievements)

**Decision**: Use TypeScript tuple-with-rest types to require at least one
element: `roles: [Role, ...Role[]]` and `achievements: [string, ...string[]]`.

**Rationale**: FR-004 requires "one or more roles" per employer and FR-005
requires "one or more" achievement entries per role. A plain `Role[]` allows
an empty array, which would silently violate those requirements with no
automated way to catch it. The tuple-with-rest form is standard TypeScript
and enforced entirely at compile time — again giving a clean negative
fixture (`roles: []` must fail to compile).

**Alternatives considered**: Plain `T[]` with a JSDoc comment — rejected for
the same reason as #3 (unenforced, untestable).

## 5. Array ordering guarantee (FR-011)

**Decision**: Reverse-chronological order (employers, and roles within an
employer) is documented on the type itself via JSDoc, and demonstrated by a
positive fixture whose literal array order mirrors the source document. It
is **not** enforced by a runtime sort — this package defines shape only.

**Rationale**: The spec's own Assumptions section scopes this feature to the
data shape, explicitly excluding "mapping the raw Google Doc API response
into this shape" (pipeline's job, a later feature). Ordering is a population
concern, not a shape concern — there is no field whose *type* could encode
"is this array sorted." Enforcement belongs to whatever later feature
populates `Experience` from the raw document.

**Alternatives considered**: A branded/opaque array type requiring a
"sort" constructor function — rejected as introducing runtime behavior this
feature's scope (and decision 6) doesn't call for.

## 6. Shape of `About` and `Experience` within `ResumeBody`

**Decision**:
- `About` is `type About = string` — a single block of narrative text, no
  wrapper object.
- `Experience` is `type Experience = [EmployerEntry, ...EmployerEntry[]]` —
  directly the (non-empty) employer collection FR-002 describes; not wrapped
  in an extra object, since the spec's Key Entities list does not name a
  separate "Experience" entity beyond "a collection of employer entries."

  Note: `Experience` is defined as non-empty (`[EmployerEntry, ...]`) for
  internal consistency with the "one or more" pattern used elsewhere (#4).
  Whether `ResumeBody.experience` itself may be entirely *absent* is governed
  by decision below (FR-010), independent of this.
- `ResumeBody { about?: About; experience?: Experience }` — both optional, so
  either can be populated independently (FR-010).

**Rationale**: Matches FR-001/FR-002/FR-010 without adding structure the spec
doesn't ask for (Principle V / YAGNI) — e.g. no wrapper object around the
About string, since "single block of text with no further internal
structure" is exactly what `string` already is.

**Alternatives considered**: Wrapping About as `{ text: string }` for
speculative future extensibility — rejected under Principle V (no
requirement calls for it today).
