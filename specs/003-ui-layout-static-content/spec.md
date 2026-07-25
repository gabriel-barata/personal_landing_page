# Feature Specification: Landing Page UI Layout & Static Content Sections

**Feature Branch**: `003-ui-layout-static-content`

**Created**: 2026-07-25

**Status**: Draft

**Input**: User description: "build the UI layout and components for the landing page, following strictly the guidelines defined under docs/visual-direction.md. This FIRST feature must FILL ONLY the static content, this is: tech stack, education, and certifications with REAL DATA, that will be provided below. For the experiences and about use made up data, we will fill it in the future with actual data from the resume.json file." (plus the real Tech Stack, Certifications, and Education data reproduced in the Requirements below)

## Clarifications

### Session 2026-07-25

- Q: SC-002 states "All 39 tech stack items" must appear correctly, but counting the actual FR-003 list gives 44 category-placements (43 unique items, since Snowflake is intentionally listed under both "Databases & Storage" and "Data Tools"). How should SC-002's number be corrected? → A: 43 unique items — Snowflake is removed from "Databases & Storage" and sits only under "Data Tools" (no more double-listing).
- Q: docs/visual-direction.md decision 6 and the spec's own section-order acceptance scenario both describe a single combined "Certifications / Education" section, but User Stories 3 and 4 describe "the Certifications section" and "the Education section" as if separate. Should this be one combined section or two separate top-level sections? → A: One combined "Certifications / Education" section, with Certifications rendered as the first sub-group and Education as the second.
- Q: FR-007/User Story 5 require "multiple" placeholder Experience entries but don't state a count. How many placeholder entries should the Experience section contain? → A: 3 entries.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the whole résumé at a glance (Priority: P1)

As a recruiter or hiring manager, when I open the page, I want to see the
author's name, role, one-line summary, location and years of experience, core
platform stack, and contact links together in one screen, in a sober,
document-like layout with no photo, no shadows, and no rounded corners, so
that I get the essential picture in under 10 seconds without scrolling.

**Why this priority**: This is the page's entire reason for existing — a
living résumé that surfaces recruiter-relevant information immediately. Every
other section is secondary to this first impression.

**Independent Test**: Load the page on a standard laptop viewport
(≥768px wide) and confirm that, without scrolling, all of the following are
visible: monogram + name, role/title line, one-line summary, a location +
years-of-experience metadata row, a row of core platform icons with labels,
and 2–3 contact links/buttons — laid out in a single centered column with
square corners, hairline borders, and no drop shadows.

**Acceptance Scenarios**:

1. **Given** the page is loaded on a viewport ≥768px wide, **When** the page
   finishes rendering, **Then** the monogram, name, role line, summary,
   location/experience metadata, core stack row, and contact row are all
   visible without any scrolling.
2. **Given** the page is loaded, **When** it is inspected visually, **Then**
   no element uses rounded corners or a box shadow, and no profile photo
   appears anywhere on the page.
3. **Given** the page has been scrolled past the hero, **When** the user
   looks at the top-left corner, **Then** the monogram remains pinned there
   (sticky), and the page sections appear in the order: Hero, Experience,
   Tech Stack, Certifications/Education, Contact/footer.

---

### User Story 2 - Browse the categorized technical skill set (Priority: P1)

As a recruiter evaluating technical fit, I want to see the author's tools and
technologies grouped into clear categories, so that I can quickly assess
breadth and depth of expertise across languages, data platforms,
visualization, cloud, ML, frameworks, and other tools.

**Why this priority**: Technical stack is one of the two pieces of content
this feature is required to populate with real data (alongside
certifications/education), and it's core evaluation criteria for a data
engineer's résumé.

**Independent Test**: Scroll to the Tech Stack section and confirm every
category below appears as its own labeled group, listing exactly its items,
with each item shown as an icon + text label, ink-colored at rest and
accent-colored only on hover:

- **Programming Languages**: SQL, Go, Python, Bash, Scala
- **Databases & Storage**: Oracle, Cassandra, MySQL, PostgreSQL,
  DynamoDB, Elasticsearch, AWS S3, Redis, SQL Server
- **Data Tools**: Apache Airflow, Apache Kafka, Databricks, dbt, Apache
  Spark, Snowflake, Apache NiFi
- **Visualization Tools**: Power BI, Metabase, Plotly, Seaborn, Matplotlib
- **Cloud**: AWS, Azure
- **ML Frameworks & Tools**: Langchain, LangGraph, RAG, Scikit-Learn
- **Programming Frameworks**: FastAPI, Flask, Streamlit, Singer SDK
- **Others**: GitLab, Docker, Kubernetes, Terraform, Azure DevOps, AWS
  Lambda, Unity Catalog

**Acceptance Scenarios**:

1. **Given** the Tech Stack section is rendered, **When** the items under
   each category are counted, **Then** the count and the exact item names
   under each category match the list above with no additions, omissions, or
   miscategorizations ("Snowflake" appears exactly once, under "Data Tools"
   only).
2. **Given** an item in the Tech Stack section, **When** the user hovers over
   it, **Then** its icon/label transitions to the accent color; **when** the
   pointer leaves, **Then** it returns to the ink color.
3. **Given** the Tech Stack section, **When** viewed at rest, **Then** no
   item uses a filled badge or a brand-colored logo — all icons are
   monochrome.

---

### User Story 3 - Verify professional certifications (Priority: P1)

As a recruiter, I want to see the author's held certifications with their
real provider-issued badge and acquisition date, so that I can verify claimed
credentials at a glance.

**Why this priority**: Certifications are the second piece of content this
feature must populate with real data, and third-party-verifiable credentials
are a high-trust signal for a technical hiring decision.

**Independent Test**: Scroll to the combined Certifications / Education
section and confirm, in its first sub-group (Certifications, rendered above
Education), all six certifications below appear, each with its name and
acquisition date, in a fixed-size badge slot with a hairline frame, shown in
grayscale at rest and in full color on hover:

| Certification | Acquired |
|---|---|
| Databricks Certified Data Engineer Professional | 08/2025 |
| Databricks Certified Data Engineer Associate | 06/2025 |
| AWS Certified Data Engineer Associate | 09/2025 |
| AWS Certified Cloud Practitioner | 04/2023 |
| dbt Certified Developer | 04/2026 |
| Databricks Certified Generative AI Engineer Associate | 06/2026 |

**Acceptance Scenarios**:

1. **Given** the Certifications section, **When** all badge entries are
   listed, **Then** they match the six certifications above with the correct
   acquisition month/year for each.
2. **Given** a certification badge, **When** the page is at rest, **Then**
   the badge image renders in grayscale; **when** the user hovers over it,
   **Then** it renders in full color.
3. **Given** the certification badge slots, **When** compared to each other,
   **Then** all slots share the same fixed height and width regardless of
   each provider's native badge proportions.

---

### User Story 4 - Review educational background (Priority: P2)

As a recruiter, I want to see the author's degrees, institutions, and
completion status, so that I can understand their academic background
alongside their professional certifications.

**Why this priority**: Education is the third required real-data content
type for this feature, but it's typically a secondary evaluation factor for
an experienced data engineer compared to the stack and certifications above.

**Independent Test**: Scroll past the Certifications sub-group into the
Education sub-group (the second sub-group of the same combined Certifications
/ Education section) and confirm both entries below appear with institution,
degree, and completion status:

1. **BSc, Information Systems** — Federal Institute of Goiás — expected
   graduation 2027. Includes a short note on the automated MLOps pipeline
   project (Python, MLflow, GitLab CI) built for a DevOps seminar and later
   presented across multiple Information Systems classes.
2. **BEng, Mechanical Engineering** — Universidade Federal do Pará — 60% of
   credits completed as of 2024.

**Acceptance Scenarios**:

1. **Given** the Education section, **When** both entries are inspected,
   **Then** each shows the correct degree title, institution name, and
   completion status text ("Expected graduation 2027" / "60% of credits
   completed, 2024").
2. **Given** the Information Systems entry, **When** it is expanded/read in
   full, **Then** the MLOps pipeline project description is present and
   attributes it to that degree.

---

### User Story 5 - Scan work history in the expected visual shape (Priority: P2)

As a recruiter, I want to see a reverse-chronological Experience section with
a vertical timeline rail — even before it is populated with the author's real
job history — so that the overall page reads as a complete résumé and the
section's visual behavior (timeline styling, current-role marker) can be
verified ahead of the real-data integration.

**Why this priority**: The user description explicitly defers real Experience
content to a future feature (sourced from `resume.json`); this feature only
needs placeholder entries so the layout is complete and demonstrable, not
real employment data.

**Independent Test**: Scroll to the Experience section and confirm exactly
three placeholder entries render with a left-hand vertical hairline rail, a
filled accent square tick beside the most recent (first) entry, outline ticks
beside the other two entries, dates in the left column in tabular numerals,
and role/company/summary in the right column — with no scroll-triggered
animation.

**Acceptance Scenarios**:

1. **Given** the Experience section, **When** it renders, **Then** it shows
   exactly three placeholder entries clearly structured as role, company,
   dates, and a 2–3 line summary, ordered most-recent-first.
2. **Given** the Experience section's timeline rail, **When** the topmost
   (current) entry's tick is compared to the others, **Then** only the
   topmost tick is solid-filled in the accent color and all others are
   outline/support-colored.
3. **Given** the Experience section, **When** the user scrolls past it,
   **Then** no fade-in, slide-in, or progress-fill animation occurs.

---

### User Story 6 - Switch language and theme (Priority: P3)

As a site visitor, I want to toggle the interface between English/Portuguese
and light/dark, so that I can read the page in my preferred language and
under my preferred display mode.

**Why this priority**: Both toggles are specified as in-scope in the visual
direction, but the page is fully usable and evaluable with just its default
language (English) and the OS-detected theme — this is an enhancement on top
of the core content sections above.

**Independent Test**: Toggle `EN`/`PT` and confirm the toggle's active/inactive
states change (without a full page reload); toggle `LIGHT`/`DARK` and confirm
the palette swaps instantly with no transition animation; reload the page and
confirm the last manually chosen theme persists rather than reverting to the
OS default.

**Acceptance Scenarios**:

1. **Given** the top-right control cluster, **When** the user clicks the
   inactive language label, **Then** it becomes the active (ink-colored)
   language and the previously active one becomes inactive (support-gray).
2. **Given** no manual theme choice has ever been made, **When** the page
   loads, **Then** it follows the OS `prefers-color-scheme` setting.
3. **Given** the user manually selects a theme, **When** they reload the
   page or return in a later visit, **Then** the manually selected theme is
   still applied instead of the OS default.
4. **Given** the theme toggle, **When** it is triggered, **Then** the palette
   change is instantaneous with no crossfade or transition.

---

### Edge Cases

- Viewport width crosses the 768px breakpoint: layout must reflow per the
  responsive rules (experience entries stack date-above-role, hero metadata
  row wraps to two lines, section-gap cap drops from 64px to 48px) with no
  horizontal scrolling or clipped content.
- A Tech Stack category with an unusually long item list ("Databases &
  Storage" has 10 items): items must wrap onto additional lines within the
  category block rather than overflowing or being truncated.
- A certification's provider badge image fails to load: the fixed-size
  hairline slot and grayscale/hover behavior must still degrade
  predictably (no layout collapse), even though sourcing a fallback graphic
  is out of scope for this feature.
- Placeholder Experience/About content must be visually indistinguishable in
  structure and styling from what real `resume.json`-sourced content will
  look like, so that swapping in real data later requires no layout changes.
- A user has JavaScript-driven theme/language preference storage disabled or
  cleared: the page must still render correctly, falling back to OS
  preference (theme) and a defined default (language).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST render as a single centered column, top to
  bottom, with no persistent page-wide sidebar or navigation bar, per the
  recorded page architecture.
- **FR-002**: The hero MUST contain, in order and without any headshot or
  profile photo: monogram + name; role/title line; a one-to-two-sentence
  professional summary; a location + years-of-experience metadata row; a core
  platform stack row (icon + label per item); and a contact row of 2–3
  links/buttons — all visible without scrolling on a viewport ≥768px wide.
- **FR-003**: The Tech Stack section MUST group items into exactly these
  eight labeled categories, each containing exactly the listed items, with no
  additions, omissions, or recategorizations: Programming Languages (SQL, Go,
  Python, Bash, Scala); Databases & Storage (Oracle, Cassandra, MySQL,
  PostgreSQL, DynamoDB, Elasticsearch, AWS S3, Redis, SQL Server);
  Data Tools (Apache Airflow, Apache Kafka, Databricks, dbt, Apache Spark,
  Snowflake, Apache NiFi); Visualization Tools (Power BI, Metabase, Plotly,
  Seaborn, Matplotlib); Cloud (AWS, Azure); ML Frameworks & Tools (Langchain,
  LangGraph, RAG, Scikit-Learn); Programming Frameworks (FastAPI, Flask,
  Streamlit, Singer SDK); Others (GitLab, Docker, Kubernetes, Terraform,
  Azure DevOps, AWS Lambda, Unity Catalog). "Snowflake" appears exactly once,
  under Data Tools only.
- **FR-004**: Each Tech Stack item MUST render as a monochrome icon plus a
  text label, ink-colored at rest, switching to accent color only on
  hover/focus, with no filled badges and no brand-colored logos.
- **FR-005**: The Certifications / Education section MUST render as one
  combined section, with Certifications as the first sub-group and Education
  as the second sub-group directly beneath it (not two separate top-level
  sections with their own full section-to-section gaps on both sides). The
  Certifications sub-group MUST list all six of the following credentials,
  each with its name and acquisition month/year, as a real provider-issued
  badge image in a uniform fixed-size hairline-framed slot, grayscale at rest
  and full color on hover: Databricks Certified Data Engineer Professional
  (08/2025); Databricks Certified Data Engineer Associate (06/2025); AWS
  Certified Data Engineer Associate (09/2025); AWS Certified Cloud
  Practitioner (04/2023); dbt Certified Developer (04/2026); Databricks
  Certified Generative AI Engineer Associate (06/2026).
- **FR-006**: The Education sub-group (the second sub-group of the combined
  Certifications / Education section, FR-005) MUST list both of the following
  entries with institution, degree, and completion status: BSc, Information
  Systems,
  Federal Institute of Goiás (expected graduation 2027), including a note on
  the automated MLOps pipeline project (Python, MLflow, GitLab CI) built for
  a DevOps seminar and later presented across Information Systems classes;
  and BEng, Mechanical Engineering, Universidade Federal do Pará (60% of
  credits completed as of 2024).
- **FR-007**: The Experience section MUST render exactly three placeholder
  entries (not real employment data) in the section's full visual shape: a
  left vertical hairline timeline rail, a solid accent-filled square tick
  beside the current/most-recent entry, outline ticks beside the other two
  entries, dates in tabular numerals to the left, and role/company/summary to
  the right, most recent first, with no scroll-triggered animation.
- **FR-008**: The hero's one-line professional summary and any "About"-style
  narrative content MUST use placeholder text (not the author's real
  biography), clearly structured the way real content will be once sourced
  from `resume.json` in a future feature.
- **FR-009**: All corners across every component (buttons, chips, badge
  slots, dividers, timeline ticks) MUST be perfectly square (no border
  radius), all borders MUST be 1px hairlines, and no component MUST use a
  box shadow.
- **FR-010**: The page MUST apply the recorded spacing scale, with
  section-to-section gaps capped at 64px on viewports ≥768px and 48px on
  viewports <768px.
- **FR-011**: The page MUST NOT use scroll-triggered reveal/fade-in
  animations, parallax, hover-lift, shadow-on-hover, or an animated timeline
  fill; the only permitted motion is short (~120–150ms) color transitions on
  hover/focus.
- **FR-012**: Buttons/CTAs MUST render outline-style (accent border, accent
  text, transparent background) at rest and invert to filled accent
  background with base-colored text on hover, with label text no smaller
  than the minimum size defined for accent-colored text.
- **FR-013**: At viewport widths below 768px, the page MUST reflow per the
  recorded responsive rules: Experience entries stack date above
  role/company; hero metadata wraps to two lines instead of truncating; the
  type scale steps down one notch; section gaps cap at 48px.
- **FR-014**: The top-right persistent control cluster MUST include a
  plain-text `EN` / `PT` language toggle and a plain-text `LIGHT` / `DARK`
  theme toggle, each showing its inactive option in support-gray and its
  active option in ink color (never accent), separated by a hairline `/`,
  with no flag or theme icons.
- **FR-015**: The page's color theme MUST default to the operating system's
  `prefers-color-scheme` setting (falling back to light if undetectable);
  once a visitor manually selects a theme, that choice MUST persist across
  reloads and later visits instead of reverting to the OS default.
- **FR-016**: A theme switch MUST apply instantly with no transition or
  crossfade animation.
- **FR-017**: The header MUST show one monogram (top-left) and an outline
  "Download CV" button (top-right), both on a transparent background with no
  surrounding bar/container; the monogram MUST sit inline next to the name
  in the hero at rest and become pinned (sticky) to the top-left once the
  page is scrolled past the hero.
- **FR-018**: All icons (Tech Stack items, hero core-stack row, monogram)
  MUST be self-hosted monochrome graphics recolored via the page's own color
  variables — no icons MUST be fetched from a third-party CDN at runtime.
- **FR-019**: Certification badge images MUST be real provider-issued
  graphics (not generic text tags or recolored icons).

### Key Entities

- **TechStackCategory**: A named grouping (e.g. "Programming Languages") of
  one or more TechStackItems, rendered together as one labeled block.
- **TechStackItem**: A single tool/technology/platform name shown with an
  icon, belonging to exactly one TechStackCategory.
- **Certification**: A held credential with a name, an acquisition
  month/year, and a real badge image.
- **EducationEntry**: A degree with an institution name, a completion status
  (expected graduation year, or percentage/year for in-progress study), and
  an optional descriptive note (e.g. the MLOps pipeline project).
- **ExperienceEntry (placeholder)**: A company/role/date-range/summary
  record used to populate the Experience section's visual shape ahead of
  real `resume.json` data.
- **AboutSummary (placeholder)**: The hero's one-line summary and any
  narrative "About" text, populated with placeholder copy ahead of real
  `resume.json` data.
- **ContactLink**: A single contact affordance (email, LinkedIn, CV
  download) shown in the hero and repeated in the footer.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the hero's required elements (monogram+name, role
  line, summary, location/experience metadata, core stack row, contact row)
  are visible without scrolling on viewports ≥768px wide.
- **SC-002**: All 43 tech stack items appear under their correct category
  with zero misplacements, omissions, or additions when checked against the
  provided list.
- **SC-003**: All 6 certifications display with the exact name and
  acquisition month/year provided, with zero mismatches.
- **SC-004**: Both education entries display with the exact institution,
  degree, and completion-status information provided, with zero mismatches.
- **SC-005**: The page reflows with no horizontal scrolling and no clipped
  or overlapping content at any viewport width from 320px up through
  standard desktop widths.
- **SC-006**: A visitor who manually selects a language or theme sees that
  choice preserved on a subsequent visit, verified across a reload, 100% of
  the time.
- **SC-007**: Zero unintended motion effects (scroll reveals, parallax,
  hover-lift, shadows, animated fills) are present anywhere on the page.

## Assumptions

- **Tech Stack categories**: this feature uses the eight category groups
  supplied with this request (Programming Languages, Databases & Storage,
  Data Tools, Visualization Tools, Cloud, ML Frameworks & Tools, Programming
  Frameworks, Others) as the categories that MUST be used. This supersedes
  the four illustrative category names shown as an example in
  `docs/visual-direction.md` decision 4 ("LANGUAGES", "DATA & PIPELINES",
  "CLOUD & INFRA", "FSI DOMAIN TOOLS") — the visual-direction document should
  be updated separately to reflect this as a documented decision revision,
  since the underlying styling rules (monochrome icon + label, category
  header styling) are unaffected and still apply as written.
- **Placeholder Experience/About data**: "made up" content for the
  Experience section and any About/summary narrative is understood to mean
  plausible-but-fictional résumé content (fictional company names, roles,
  dates, and summary text) that mirrors the real shape and volume expected
  from `resume.json`, not lorem-ipsum filler — this keeps the layout
  demonstrable and makes the future swap to real data a content-only change.
- **Contact links**: real destinations for email, LinkedIn, and CV download
  were not provided with this request; placeholder/non-functional
  destinations are used for now and are expected to be replaced alongside
  the future Experience/About real-data feature.
- **Portuguese translations**: the toggle mechanism (FR-014) is in scope for
  this feature, but actual Portuguese translations of the static content
  supplied here (tech stack labels, certification names, education text) are
  not provided with this request; English content is used for both language
  states for now, with Portuguese strings to be filled in as a follow-up.
- **Certification badge images**: since the actual provider-issued graphic
  files were not supplied with this request, each provider's publicly
  recognizable official badge/logo artwork is used as a stand-in, sized into
  the uniform slot described in FR-005; swapping in the account-specific
  credential image (e.g. a Credly-hosted badge) is a future content update,
  not a layout change.
- **CV download target**: the "Download CV" button (FR-017) is present and
  styled per spec but may point to a placeholder file until a real CV
  document is supplied.
- **Dark mode and language toggle are in scope now**: since
  `docs/visual-direction.md` records both as fully specified, in-scope
  decisions (not deferred), this feature implements both toggles rather than
  treating them as future work.
