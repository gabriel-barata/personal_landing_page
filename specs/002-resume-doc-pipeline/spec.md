# Feature Specification: Resume Google Doc Parsing Pipeline

**Feature Branch**: `002-resume-doc-pipeline`

**Created**: 2026-07-24

**Status**: Draft

**Input**: User description: "to implement the pipeline that loads the resume from Google Docs. The resume data MUST fit in the data model defined in schema/."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Turn the Experience section into structured data (Priority: P1)

As the resume author, when I run the pipeline against my resume Google Doc, I want every employer, role, and achievement bullet in the Doc's "EXPERIENCE" section converted into structured resume data, so that the site's Experience content always reflects what's currently in the Doc without me hand-editing any output file.

**Why this priority**: Work history is the core value of a living resume. Without correct, structured Experience data, the pipeline delivers nothing the site can render.

**Independent Test**: Point the pipeline at a Doc containing only an "EXPERIENCE" section (one employer with two roles, one employer with one role, one role still ongoing) and confirm the output contains one entry per employer, in the same order as the Doc, each with its roles in the same order, each role carrying its title, optional client, start date, end date (or none, for the ongoing role), and achievement bullets.

**Acceptance Scenarios**:

1. **Given** a Doc with an employer that held a single role, **When** the pipeline runs, **Then** the output contains that employer with exactly one role carrying its title, dates, and all of its achievement bullets in Doc order.
2. **Given** a Doc with an employer that held multiple roles (e.g. multiple client engagements), **When** the pipeline runs, **Then** the output contains that employer with all of its roles, most recent first, each with its own client name and achievements.
3. **Given** a Doc where an employer's most recent role has no end date (shown as "Present" in the Doc), **When** the pipeline runs, **Then** that role's output has no end date and is otherwise fully populated.
4. **Given** a Doc listing several employers, **When** the pipeline runs, **Then** the employers appear in the output in the same top-to-bottom order they appear in the Doc.

---

### User Story 2 - Turn the About section into narrative text (Priority: P2)

As the resume author, when I run the pipeline, I want the narrative paragraph under the Doc's "ABOUT" heading converted into the resume's About text, so that the site's summary blurb stays in sync with the Doc.

**Why this priority**: Valuable and simple, but the site is still useful with Experience alone; About is a smaller, independent slice of value (about and experience are independent per the existing schema).

**Independent Test**: Point the pipeline at a Doc containing only an "ABOUT" section with one narrative paragraph and confirm the output's About text matches that paragraph.

**Acceptance Scenarios**:

1. **Given** a Doc with an "ABOUT" heading followed by a single paragraph of narrative text, **When** the pipeline runs, **Then** the output's About value equals that paragraph's text, unsplit.
2. **Given** a Doc with no "ABOUT" heading at all, **When** the pipeline runs, **Then** the output has no About value, without the run failing.

---

### User Story 3 - Reject output that doesn't fit the data model (Priority: P1)

As the resume author, when the Doc doesn't match the structure the pipeline expects (a heading is missing, a role has no achievements, a date can't be parsed), I want the pipeline to stop and tell me what went wrong, so that a malformed Doc edit never silently produces broken or incomplete data for the site to publish.

**Why this priority**: This is the explicit constraint driving the feature ("resume data MUST fit in the data model"). Without it, the pipeline could produce output that compiles into `resume.json` but violates the schema's own rules (e.g. an employer with zero roles), defeating the purpose of having a schema at all.

**Independent Test**: Feed the pipeline a Doc that violates the data model in an isolated way (e.g. an employer heading with no role or achievement content beneath it) and confirm the run stops with an error naming the offending section, and confirm no output file is written or updated as a result.

**Acceptance Scenarios**:

1. **Given** a Doc where an employer under "EXPERIENCE" has no roles listed beneath its heading, **When** the pipeline runs, **Then** it stops with an error identifying that employer, and does not write output.
2. **Given** a Doc where a role has no achievement bullets, **When** the pipeline runs, **Then** it stops with an error identifying that role, and does not write output.
3. **Given** a Doc where a role's dates are in a format the pipeline can't recognize, **When** the pipeline runs, **Then** it stops with an error identifying that role and the unparseable value, and does not write output.
4. **Given** a Doc that fully matches the expected structure, **When** the pipeline runs, **Then** it writes output and reports success, with no error.

---

### Edge Cases

- A Doc section other than "ABOUT" or "EXPERIENCE" (e.g. "EDUCATION", "CERTIFICATIONS", "PERSONAL PROJECTS", "TECHNICAL SKILLS") is present: the pipeline ignores it and does not fail because of it, since those aren't part of the current data model.
- The "ABOUT" heading exists but has no text beneath it before the next heading: treated the same as no "ABOUT" section (no About value in the output), not an error.
- The "EXPERIENCE" heading exists but contains no employers at all: treated the same as no "EXPERIENCE" section (no Experience value in the output), not an error.
- The Doc lists "ABOUT" and "EXPERIENCE" sections in a different order, or with other sections interleaved between them: the pipeline still finds both by their heading text, regardless of position.
- An employer's location, or a role's client, contains a value the pipeline doesn't expect (e.g. empty text): the pipeline still runs, since only the model's required fields (name, location, title, start date, achievements) trigger a failure when missing.
- The pipeline is run against a Doc it cannot fetch or read at all (network/auth failure): this is an existing failure mode of the Doc-fetching step this feature builds on, not new behavior introduced here.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Pipeline MUST locate the "ABOUT" section in the fetched Doc content by its heading text and extract the narrative text that follows it, up to the next heading, as the About value.
- **FR-002**: Pipeline MUST locate the "EXPERIENCE" section in the fetched Doc content by its heading text and extract everything between it and the next section as the Experience value.
- **FR-003**: Within the Experience section, pipeline MUST treat each employer sub-heading as the start of one employer entry, and MUST split that heading's name text from its location text.
- **FR-004**: Pipeline MUST treat each role line beneath an employer heading as the start of one role within that employer, extracting the role's title, its optional client name (when present alongside the title), its start date, and its end date (when present).
- **FR-005**: Pipeline MUST treat a role whose end date reads as "Present" (or is otherwise absent) as an ongoing role, producing no end date for it, rather than failing or inventing a date.
- **FR-006**: Pipeline MUST collect the bulleted list items immediately following a role line as that role's achievements, preserving their Doc order.
- **FR-007**: Pipeline MUST preserve document order: employers in the order their headings appear, and roles within an employer in the order their lines appear.
- **FR-008**: Pipeline MUST ignore all Doc content outside the "ABOUT" and "EXPERIENCE" sections; such content MUST NOT cause the run to fail and MUST NOT appear in the output.
- **FR-009**: Pipeline MUST validate the fully-assembled resume data against the data model defined in `schema/` before writing any output.
- **FR-010**: Pipeline MUST stop the run without writing or modifying output when the assembled data does not satisfy the schema (e.g. an employer with no roles, a role with no achievements, a role missing a required field, or an unparseable date).
- **FR-011**: On a failed run, pipeline MUST report an error that identifies which section, employer, or role failed, and why, so the author can locate and fix the corresponding part of the Doc.
- **FR-012**: On a successful run, pipeline MUST write the validated data as the resume output, matching the schema's shape exactly with no additional, undocumented fields.
- **FR-013**: Pipeline MUST support a Doc where either the "ABOUT" or the "EXPERIENCE" section (or content within them) is absent, producing output that omits the corresponding value rather than failing, consistent with both being independent and optional in the data model.

### Key Entities

This feature produces data that must conform exactly to the entities already defined in `schema/` — it does not introduce new entities:

- **About**: The single narrative text block sourced from the Doc's "ABOUT" section.
- **EmployerEntry**: One organization from the Doc's "EXPERIENCE" section, with a name, a location, and one or more roles, ordered most recent first.
- **Role**: One position (or client engagement) within an EmployerEntry, with a title, an optional client name, a start date, an optional end date (absent = ongoing), and one or more achievement bullets.
- **DatePart**: The month/year pair backing each role's start and end dates.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Running the pipeline once against the author's current resume Doc produces output containing every employer and every role present in the Doc's "EXPERIENCE" section, with zero manual edits needed afterward.
- **SC-002**: An author who edits the Doc (adds a bullet, changes an end date, adds a new role or employer) sees that change reflected correctly the next time they run the pipeline, without any code change.
- **SC-003**: 100% of pipeline runs against a Doc that violates the data model stop with an error identifying the offending section, employer, or role, and produce no output file, rather than publishing invalid or partial data.
- **SC-004**: 100% of pipeline runs against a Doc that matches the expected structure produce output that fits the `schema/` data model, with no manual correction needed before it can be committed.

## Assumptions

- The Doc's structure is the one already observed in the author's real resume Doc and mirrored by `schema/`'s existing test fixtures: a top-level "ABOUT" heading followed by a narrative paragraph, and a top-level "EXPERIENCE" heading containing one sub-heading per employer (name and location together), each followed by one or more role lines (title, optional client, and a date range), each role line followed by its bulleted achievements. This feature assumes the Doc continues to follow that convention rather than defining a new one.
- Fetching the raw Doc content (Google auth, Doc ID, Docs API call) is already implemented (see `pipeline/src/index.ts`); this feature is scoped to turning that already-fetched content into validated resume data and producing the resume output, not to the fetch step itself.
- "Fitting the data model defined in schema/" means the output is checked against that model at run time (not just relying on compile-time types), since content parsed out of a Doc is untyped until it's checked.
- A run that fails validation (User Story 3) leaves any previously-generated output file untouched — it does not partially overwrite it.
- Sections other than "ABOUT" and "EXPERIENCE" (education, certifications, projects, skills) stay out of scope because they aren't part of the current `schema/` data model; adding them is a separate, future schema change.
