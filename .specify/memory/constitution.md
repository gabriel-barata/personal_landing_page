<!--
Sync Impact Report
==================
Version change: (unratified template) → 1.0.0
Rationale for MAJOR (initial ratification): first concrete adoption of the
constitution for this project — all six placeholder principles filled with
substantive, normative content for the first time.

Modified principles (template placeholder → concrete title):
- [PRINCIPLE_1_NAME] → I. Layered Architecture
- [PRINCIPLE_2_NAME] → II. Isolated Business Logic
- [PRINCIPLE_3_NAME] → III. Error as Value
- [PRINCIPLE_4_NAME] → IV. Test-Driven Development
- [PRINCIPLE_5_NAME] → V. Simplicity
- (new) → VI. Technology Agnosticism (template only had 5 principle slots;
  a sixth was added per project requirements)

Added sections:
- Engineering Standards (replaces [SECTION_2_NAME]/[SECTION_2_CONTENT])
- Workflow (replaces [SECTION_3_NAME]/[SECTION_3_CONTENT])

Removed sections: none

Templates requiring updates:
- .specify/templates/plan-template.md ................ ✅ no changes needed
  (Constitution Check gate is already generic; references no specific tech)
- .specify/templates/spec-template.md ................. ✅ no changes needed
  (already technology-agnostic, requirement-focused)
- .specify/templates/tasks-template.md ................ ✅ no changes needed
  (already generic path/story conventions, no conflicting mandates)
- .specify/templates/checklist-template.md ............ ✅ no changes needed

Follow-up TODOs: none — no placeholders left undefined.
-->

# Personal Landing Page Constitution

## Core Principles

### I. Layered Architecture

The application MUST be organized into distinct layers with clearly separated
responsibilities. Dependencies between layers MUST point in a single
direction: outer layers (interface, infrastructure) depend on inner layers
(application domain), and dependencies MUST NOT point outward. The application domain MUST
NOT import from or reference the user interface or infrastructure layers.
Composition of concrete dependencies (wiring implementations to the
abstractions the domain depends on) MUST happen only at the application's
entry point / boundary, never inside the domain itself. This principle
governs the shape and direction of dependencies only; it MUST NOT be read as
mandating any specific framework, state management pattern, or dependency
injection mechanism — those are Plan-level decisions.

**Rationale**: Unconstrained dependency direction is what turns small changes
into wide-reaching rewrites. Fixing the direction of dependencies keeps the
domain reusable, testable in isolation, and insulated from churn in the UI or
infrastructure it happens to run on today.

### II. Isolated Business Logic

All business rules, decisions, and domain calculations MUST live in a
dedicated application/domain layer, independent of the user interface and
infrastructure. The interface layer's only responsibilities are collecting
user input and presenting results; it MUST NOT contain conditional business
logic, validation rules that encode domain policy, or decisions about what
the data means. If a piece of UI code is answering a "what should happen"
question rather than a "how do I show this" question, it belongs in the
domain layer instead.

**Rationale**: Business logic embedded in the UI is duplicated the moment a
second entry point (a new page, a CLI, a future API) needs the same rule, and
it cannot be tested without rendering the interface. Isolating it keeps the
rule defined once and verifiable on its own.

### III. Error as Value

Predictable, expected failure conditions (invalid input, missing data, a
failed lookup, a violated business rule) MUST be represented as explicit
success-or-error result values returned from functions, not as exceptions
thrown and caught across layers. Exceptions MUST be restricted to the
infrastructure boundary, used only for truly unexpected/unrecoverable
conditions (e.g., a failed I/O call), and MUST be translated into an explicit
result value before crossing back into the domain or interface layers.

**Rationale**: Exceptions crossing layer boundaries make failure paths
invisible at the call site and turn error handling into action at a
distance. Representing predictable failure as a value forces every caller to
consciously handle both outcomes, keeping control flow explicit and
traceable.

### IV. Test-Driven Development

Every new unit of behavior MUST be specified by an automated test written
before or alongside its implementation; behavior MUST NOT be considered done
until a test demonstrates it. Development MUST proceed in small, verifiable
increments — write or extend a test, make it pass, refactor with the test
suite as a safety net — rather than large batches of untested change. A
change MUST NOT be merged if it lacks test coverage for the behavior it
introduces or modifies.

**Rationale**: Without tests written close to the change, correctness rests
on manual inspection, which does not scale and does not survive refactoring.
Small, test-covered increments make it safe to change the code later without
re-verifying the whole system by hand.

### V. Simplicity

The project MUST remain deliberately simple. Because this is a
single-author, single-user application with a small, known scope, any
functionality, abstraction, or configurability not required by that scope
MUST be avoided (YAGNI) — features are not added speculatively for
hypothetical future needs. Among equivalent solutions, the one with fewer
moving parts, lower coupling, and clearer readability MUST be preferred over
one that is more general or more "flexible." Complexity introduced to solve a
problem that does not yet exist MUST be rejected.

**Rationale**: Every added abstraction, configuration option, or generalized
mechanism is a maintenance cost paid by a single maintainer. For a project of
this scope, the accumulation of unused flexibility is a bigger risk than
under-engineering, since there is no larger team to absorb the resulting
complexity.

### VI. Technology Agnosticism

This Constitution MUST NOT name or mandate any programming language,
framework, library, database, UI architecture, state management pattern, or
other implementation technology. Such choices are made exclusively in the
Plan for each feature, informed by these principles, and MAY change over time
without requiring a Constitution amendment. Any proposal to add a specific
technology mandate to this document MUST be rejected unless it is reframed as
a durable architectural principle independent of any concrete tool.

**Rationale**: Principles here are meant to outlive any particular
technology choice. Binding the Constitution to specific tools would force a
governance amendment every time a tool is swapped, even when the underlying
architectural intent has not changed.

## Engineering Standards

The following general engineering principles underpin and are consolidated by
the Core Principles above:

- **SOLID**: Components should have a single responsibility, be open for
  extension but closed for modification, honor substitutability of their
  abstractions, expose small role-specific interfaces, and depend on
  abstractions rather than concrete details.
- **Clean Architecture**: Dependencies point inward toward the domain;
  outer layers (UI, infrastructure) are replaceable details, and the domain
  is the stable core (see Principle I).
- **Test-Driven Development**: Behavior is specified by tests before or
  alongside implementation (see Principle IV).
- **Error as Value**: Predictable failure is explicit, typed data, not
  control flow via exceptions across layers (see Principle III).
- **Separation of Concerns**: Each layer, module, or function addresses one
  concern; presentation, business rules, and infrastructure access are never
  mixed in the same unit of code (see Principles I and II).

## Workflow

Feature development follows this sequence; each stage's output is the input
to the next, and stages MUST NOT be skipped or reordered:

1. **Constitution** — the durable principles governing all work (this
   document).
2. **Spec** — what the feature must do and why, technology-agnostic.
3. **Plan** — how it will be built: technology choices, architecture within
   these principles, design artifacts.
4. **Tasks** — the plan broken into small, ordered, independently verifiable
   units of work.
5. **Implementation** — writing the code and tests for each task.
6. **Testing** — running and validating the automated test suite against the
   spec's requirements.
7. **Review** — checking the completed work against the Spec, Plan, and this
   Constitution before it is considered done.

## Governance

This Constitution supersedes any other stated practice or convention when the
two conflict. All Plans, Tasks, and code review MUST verify compliance with
the Core Principles above; any deviation MUST be justified in writing (e.g.,
in a Plan's Complexity Tracking section) or the simpler, compliant approach
MUST be used instead.

**Amendment process**: A change to this Constitution MUST be proposed as an
explicit diff to the affected principle(s) or section(s), state the reason
for the change, and identify any dependent templates or documents that need
to be updated to stay consistent. Once accepted, the amendment is applied in
the same update that revises the version and dates below.

**Versioning policy**: This Constitution is versioned using semantic
versioning (MAJOR.MINOR.PATCH):

- **MAJOR** — backward-incompatible changes: a principle is removed or
  redefined such that previously compliant work would no longer comply.
- **MINOR** — a new principle or section is added, or existing guidance is
  materially expanded.
- **PATCH** — clarifications, wording, or typo fixes that do not change the
  meaning or scope of a principle.

**Compatibility rule**: Work planned or completed under a given Constitution
version remains valid under later PATCH and MINOR versions of the same
MAJOR version. A MAJOR version bump requires re-reviewing in-flight Plans
against the revised principles before continuing implementation.

**Mandatory review**: Any change that permanently alters the project's
architecture (e.g., introducing a new persistent layer, changing the
direction of a dependency, or removing a layer boundary) MUST trigger a
review of this Constitution to confirm it still accurately governs the
project, even if no textual amendment turns out to be needed.

**Version**: 1.0.0 | **Ratified**: 2026-07-24 | **Last Amended**: 2026-07-24
