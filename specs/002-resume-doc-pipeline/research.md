# Phase 0 Research: Resume Google Doc Parsing Pipeline

No `NEEDS CLARIFICATION` markers remain in the Technical Context — language,
tooling, and dependency posture are already fixed by the existing repo
(`docs/architecture-decisions.md`, `pipeline/package.json`,
`tsconfig.base.json`). This document resolves the feature-specific design
questions the spec left to planning: how to test real behavior (unlike 001,
this feature has actual logic to run), how to validate untrusted input
without a schema library, and how to keep the Google Docs API's shape out of
the parsing rules.

## 1. How to satisfy Test-Driven Development for behavior-bearing code

**Decision**: Use Node's built-in test runner (`node:test` +
`node:assert/strict`), invoked via a new `pipeline/tests/` directory and a new
`"test"` script in `pipeline/package.json`. Each domain parsing rule gets a
unit test against a committed synthetic fixture — no live Google Doc call in
any test.

**Rationale**: Unlike 001 (`schema`, types only, no function to run), this
feature's whole job is behavior: turning lines of text into structured data
or errors. That needs real, executable unit tests, not `tsc --noEmit`.
Node 20 ships a stable built-in test runner, so using it satisfies
Constitution Principle IV without adding a devDependency — consistent with
Principle V and with 001's precedent of preferring what's already available
over a new tool.

**Alternatives considered**:
- `vitest` / `jest`: capable, but adds a test-runner dependency the repo
  doesn't have anywhere yet, for no capability `node:test` doesn't already
  provide at this project's scale (a handful of pure functions).
- Testing only via a real Google Doc end-to-end run: rejected — slow,
  requires live credentials in CI/local dev to run any test, not
  deterministic (the author's real Doc content changes over time), and
  can't isolate individual parsing rules (a single failing rule would be
  indistinguishable from a whole-document failure).

## 2. Runtime validation strategy (fitting the `schema/` data model)

**Decision**: No schema-validation library (e.g. zod, ajv). The domain parse
functions validate by construction: they only build a `Role`/`EmployerEntry`
once they've collected the values the `schema/` types require (e.g. a
`Role` object is only constructed after its `achievements` array has been
confirmed non-empty), and use TypeScript's own tuple types
(`[string, ...string[]]`, `[Role, ...Role[]]`) so the compiler rejects any
attempt to build one from a possibly-empty array. Anything that can't be
built this way (missing achievements, unparseable date, missing title, empty
roles) becomes a `ParseError` collected into the function's `Result`, instead
of a thrown exception or a malformed object.

**Rationale**: `schema/`'s package deliberately has no runtime validator
(architecture decision 6) — it's plain TypeScript types. Adding a
schema-validation library here would mean maintaining a second, parallel
description of the same shape (the library's schema + the `schema/` package's
types), which is exactly the "intermediate schema format" decision 6 rejected
for the Python/TypeScript language boundary, and there's no such boundary
here either. Validating by construction gets the same guarantee — the
`schema/` types can't be violated because an invalid value is never
assembled — with zero new dependency and zero duplicated shape definition
(Principle V).

**Alternatives considered**:
- `zod` schemas mirroring `schema/`'s types, used to `.parse()` the
  assembled object before writing: rejected — duplicates the shape
  definition (drift risk between the two descriptions) for a project this
  small, and decision 6 already rejected the same tradeoff once.
- Generating a JSON Schema from `schema/`'s TypeScript types (e.g. via
  `ts-json-schema-generator`) and validating with `ajv`: rejected — real
  tooling weight (a generation step, a new dependency, a build order
  dependency on `schema/`'s `dist/`) for a document with a handful of
  employers; validate-by-construction gives the same safety without it.

## 3. Isolating the domain from the Google Docs API shape

**Decision**: Introduce one small neutral type, `DocLine` (text, heading
level 0/1/2, bullet flag), produced by a single infrastructure adapter
(`infrastructure/doc-lines.ts`) from the raw Docs API response. Every domain
parsing function (`parse-about.ts`, `parse-experience.ts`, `parse-resume.ts`)
takes `DocLine[]` as input and never imports `googleapis` or references its
types.

**Rationale**: Constitution Principle I requires the domain to have no
dependency on infrastructure/interface concerns, and Principle II requires
resume-semantic decisions (what's a heading, what's a bullet, what "ABOUT"
means) to live outside the interface/infrastructure code. The raw Docs API
response (`body.content[].paragraph.paragraphStyle.namedStyleType`,
`.bullet`, `.elements[].textRun.content`, as seen in
`pipeline/tmp/raw-doc.json`) is Google's shape, not a resume concept — a
domain function written directly against it would be untestable without a
real (or hand-built) Docs API response object, and would break if Google
changed its response shape for reasons unrelated to resume parsing. A single
adapter absorbs that shape once; the domain and its tests only ever deal with
`DocLine[]`, which is trivial to construct by hand in a fixture.

**Alternatives considered**:
- Parsing the raw Docs API response directly inside the domain functions:
  rejected — couples every parsing rule to Google's JSON shape, and makes
  every unit test need a full (or heavily trimmed) copy of that shape instead
  of a two-field `DocLine`.
- A generic "Doc tree mirror" adapter that preserves the full nested
  structure instead of flattening to lines: rejected — architecture decision
  5 already rejected generically mirroring the Doc's structure in favor of a
  purpose-built shape; a flat, ordered `DocLine[]` is the minimum structure
  the domain's heading/bullet-based rules actually need.

## 4. Error representation (Error as Value)

**Decision**: `domain/result.ts` defines a minimal local
`Result<T, E> = { ok: true; value: T } | { ok: false; errors: E[] }`. The two
content-bearing domain functions return
`Result<Experience | undefined, ParseError>` (Experience) and plain
`About | undefined` (About — nothing about extracting a narrative paragraph
can fail in a way the schema forbids, so no `Result` is needed there).
`parse-resume.ts` combines both into the run's overall
`Result<ResumeBody, ParseError>`. `ParseError` carries a human-readable
`path` (e.g. `EXPERIENCE > "INDICIUM AI" > role 2`) and `message`, per FR-011.
Errors are **collected**, not stopped at the first one: a single run reports
every offending employer/role/date it finds, not just the first.

**Rationale**: Directly implements Constitution Principle III — invalid Doc
content is a predictable, expected failure, not an exceptional one, so it
must be a value the caller (`index.ts`) is forced to handle, not a thrown
exception crossing a layer boundary. Collecting all errors (vs. failing on
the first) directly serves FR-011 and SC-003: since a pipeline run is
manually triggered and infrequent (decision 3), an author fixing a Doc issue
benefits far more from seeing every problem at once than from an
edit-run-fail loop repeated once per mistake.

**Alternatives considered**:
- Throwing a custom `ParseError` exception per issue, caught once in
  `index.ts`: rejected — Principle III explicitly restricts exceptions to
  the infrastructure boundary (genuine I/O failure); using them for expected
  validation failures is the exact anti-pattern the principle calls out.
- Fail on the first error only (`Result<T, E>` with a single `E`, not
  `E[]`): rejected — simpler, but directly worse for FR-011's "identifies
  which part of the document failed" when more than one part is wrong, and
  costs nothing extra to collect (all parsing here is a single, non-streaming
  pass over a small array).

## 5. Test fixtures: synthetic, committed — not the real Doc

**Decision**: Unit tests use small, hand-written `DocLine[]` (or minimal raw
Docs-API-shaped JSON, for the one adapter test) fixtures committed under
`pipeline/tests/fixtures/`, one per acceptance scenario named in
`quickstart.md`. Tests never read `pipeline/tmp/raw-doc.json` (gitignored,
local-only, and populated by a real network call) and never call the Docs
API.

**Rationale**: `tmp/` is gitignored (`.gitignore`) specifically because it's
a local debugging artifact of the fetch step, not a committed fixture —
relying on it would make tests non-reproducible (missing entirely on a clean
checkout or in CI without credentials) and would silently change whenever the
author edits their real resume. Small synthetic fixtures, one per scenario,
also make each test's intent legible on its own (matching Principle V) and
let edge cases (empty achievements, unparseable date) be expressed directly
without hunting for or fabricating a matching passage in the real document.

**Alternatives considered**:
- Fetching the real Doc in a CI-only integration test: rejected — reintroduces
  live network/credential dependence into the test suite (this feature's
  Assumptions explicitly scope Doc-fetching as already-implemented,
  unchanged infrastructure, not something this feature's tests should
  re-verify), and ties test outcomes to content the author may edit at any
  time.
- Committing a scrubbed copy of the real `raw-doc.json` as the one fixture:
  rejected — one large fixture covering everything at once makes it hard to
  tell which acceptance scenario a failing test actually broke, versus
  several small, purpose-named fixtures.

## 6. Output location

**Decision**: The pipeline writes to `resume.json` at the repository root
(one level above the `pipeline/` package directory), overwriting any existing
file only on a fully successful, validated run.

**Rationale**: Matches architecture decision 7 (generated JSON is committed
to the repo) and the already-existing `generate-resume.yml` workflow, which
stages exactly that path (`add-paths: resume.json`) into its PR. Choosing any
other path would silently break that existing, unchanged workflow.

**Alternatives considered**: Writing under `pipeline/` (e.g.
`pipeline/resume.json`) — rejected, contradicts the already-committed
workflow file's `add-paths: resume.json`, which is repo-root-relative.
