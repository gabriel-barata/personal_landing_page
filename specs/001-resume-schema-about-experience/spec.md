# Feature Specification: Resume Schema — About & Experience

**Feature Branch**: `001-resume-schema-about-experience`

**Created**: 2026-07-24

**Status**: Draft

**Input**: User description: "This feature builds the schema package that defines the body of the shared resume object. The raw return from the Google Doc API is available at `pipeline/tmp/raw-doc.json`. For the application, only the About and Experience sections will be used, the rest of the resume does not need to be mapped at this point."

## Clarifications

### Session 2026-07-24

- Q: How should a role's start/end date be structured within the schema? → A: Separate fields: numeric `month` (1-12) and `year`
- Q: Does the order of employers/roles within the schema's arrays carry meaning? → A: Schema MUST guarantee array order matches reverse-chronological (most recent first), as in the source document
- Q: What shape should the employer's location field take? → A: Single free-text string field (e.g. "London, UK", "Remote")

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Represent an employer with one or more roles (Priority: P1)

The shared data shape must be able to represent everything the resume's "Experience" section conveys about a single employer: who the employer is, where they are located, and every distinct role the candidate held there — including cases where the candidate held multiple, separately-dated roles or client engagements at the same employer.

**Why this priority**: Experience is the core content recruiters evaluate. It is also the structurally hardest part of the resume to model correctly (one employer can list several roles), so getting this shape right first de-risks everything downstream that will read it (parsing and rendering).

**Independent Test**: Can be fully tested by constructing sample data for an employer with a single role and for an employer with multiple roles (mirroring the source document), and confirming both fit the schema without contradictions, omissions, or the need for workaround fields.

**Acceptance Scenarios**:

1. **Given** an employer with a single role held over a fixed date range, **When** that role is expressed using the schema, **Then** the employer's name, location, role title, start date, end date, and list of achievement bullets are all represented.
2. **Given** an employer with three separate roles (each with its own title, date range, and bullets, one of which is still ongoing), **When** all three are expressed using the schema, **Then** each role is distinguishable, correctly grouped under the one employer, and the ongoing role is identifiable as not yet ended.
3. **Given** a role held on behalf of a named client distinct from the employer, **When** that role is expressed using the schema, **Then** the client name is captured separately from the employer name.

---

### User Story 2 - Represent the About narrative (Priority: P2)

The shared data shape must be able to represent the free-text professional summary that appears under the resume's "About" heading.

**Why this priority**: About is simpler than Experience (a single block of narrative text) but is still required content for the application; it is lower priority only because it carries less structural risk.

**Independent Test**: Can be fully tested by taking the About paragraph from the source document and confirming it fits the schema as a single, complete unit of text with nothing truncated or split unexpectedly.

**Acceptance Scenarios**:

1. **Given** the resume's About paragraph, **When** it is expressed using the schema, **Then** the full text is captured as a single piece of content.

---

### Edge Cases

- What happens when an employer has more than one role/engagement recorded against it (e.g., a consulting employer with several distinct client engagements)? The schema must group them under that one employer rather than forcing duplicate employer records.
- What happens when a role has no end date because it is the candidate's current position? The schema must be able to represent "still ongoing" distinctly from a role that has ended.
- What happens when a role has no separate client/engagement name (the common case)? The schema must not require that field.
- What happens when a role has only one achievement bullet, or several? The schema must support a variable-length list, not a fixed number of bullets.
- What happens to resume content outside About and Experience (contact details, Education, Certifications, Personal Projects, Technical Skills)? It is out of scope for this feature and must not be required by the schema.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The schema MUST define a structure for the About section that captures the professional summary as a single block of narrative text.
- **FR-002**: The schema MUST define a structure for the Experience section as a collection of employer entries.
- **FR-003**: Each employer entry MUST capture the employer's name and the employer's location as a single free-text string (not decomposed into city/region/country parts).
- **FR-004**: Each employer entry MUST support one or more roles held at that employer, so that an employer with multiple distinct engagements over time is represented as one employer entry containing multiple roles, not as multiple duplicate employer entries.
- **FR-005**: Each role MUST capture a job title, a start date (a numeric month and year pair), and an achievement/responsibility list containing one or more entries.
- **FR-006**: Each role MUST be able to represent an end date as a numeric month and year pair, and MUST be able to represent that the role is still ongoing (both end-date fields absent) as distinct from a role that has concluded.
- **FR-007**: Each role MUST support an optional client or engagement name, separate from the employer name, for cases where the work was performed for a named client on the employer's behalf.
- **FR-008**: Each achievement/responsibility entry MUST be captured as plain text.
- **FR-009**: The schema MUST NOT require any fields for resume content outside the About and Experience sections (e.g., contact details, Education, Certifications, Personal Projects, Technical Skills are out of scope for this feature).
- **FR-010**: The schema MUST represent the About section and the Experience section as independent parts of the shared resume body, such that one can be present, populated, and consumed without requiring the other to be populated.
- **FR-011**: The Experience section's collection of employer entries, and each employer entry's collection of roles, MUST preserve reverse-chronological order (most recent first), matching the order presented in the source document.

### Key Entities *(include if feature involves data)*

- **Resume Body**: The in-scope portion of the shared resume object for this feature; contains the About content and the Experience content.
- **About**: The narrative professional summary; a single block of text with no further internal structure.
- **Employer Entry**: A single organization the candidate worked for; has a name, a location (single free-text string), and one or more Roles, ordered reverse-chronologically (most recent role first).
- **Role**: A single position held within an Employer Entry; has a job title, an optional client/engagement name, a start date (numeric `month` and `year`), an optional end date (numeric `month` and `year`; absent = ongoing), and one or more achievement bullets.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the About narrative and Experience content (every employer and every role within it) present in the current source resume document can be represented using the schema with no data loss.
- **SC-002**: Adding a new employer, a new role under an existing employer, or a new achievement bullet to the resume content requires zero changes to the schema's structure.
- **SC-003**: For every role represented, it is possible to determine unambiguously which single employer it belongs to and whether it is the candidate's current (ongoing) role, verifiable by inspection alone.

## Assumptions

- Only the About and Experience sections of the resume are in scope for this feature. The document header (name, title, location, contact details) and the Education, Certifications, Personal Projects, and Technical Skills sections are explicitly out of scope and are not represented by this schema at this time.
- Experience content is grouped by employer, with each employer entry able to hold one or more roles — reflecting the source document, where a single employer (e.g., a consulting firm) can list several separately-dated client engagements as distinct roles.
- Dates are captured at month/year granularity, matching the precision present in the source document; day-level precision is not required. Each date is represented as a separate numeric `month` (1-12) and `year` field pair, not a single combined string.
- An ongoing/current role is represented by the absence of the end-date fields rather than a placeholder value such as the text "Present".
- Achievement/responsibility bullets are captured as plain text; no rich-text formatting or markup is preserved.
- The About narrative is captured as a single block of text; no distinction between multiple paragraphs is required at this time.
- This feature defines the data shape only. It does not include mapping the raw Google Doc API response into this shape (pipeline work) or rendering it in the site (frontend work) — both are separate, later features that will depend on this one.
