# Contract: the Google Doc convention this pipeline accepts

This is the "grammar" the pipeline's parser accepts as input — the Doc-side
half of the contract, matching the spec's Assumptions and FR-001–FR-008. The
author's real resume Doc already follows it (confirmed against
`pipeline/tmp/raw-doc.json`); this document generalizes it so it can be used
to build test fixtures without hard-coding the author's actual resume
content into every test.

A Doc that doesn't match this convention is exactly the input User Story 3
(spec.md) is about: the pipeline reports which part didn't match and writes
no output, rather than guessing.

## Section headings

- A **top-level heading** (Google Docs "Heading 1" style) whose text is
  exactly `ABOUT` starts the About section (FR-001).
- A **top-level heading** whose text is exactly `EXPERIENCE` starts the
  Experience section (FR-002).
- Any other top-level heading (e.g. `EDUCATION`, `CERTIFICATIONS`) ends
  whichever of the above sections is open, and everything until the *next*
  recognized section heading (or the end of the Doc) is ignored (FR-008).
- Section headings may appear in any order, with unrecognized sections
  interleaved (spec Edge Cases) — the parser looks for `ABOUT` and
  `EXPERIENCE` by text, not by position.

## The About section

Everything between the `ABOUT` heading and the next top-level heading is one
narrative text block (FR-001). Example:

```text
ABOUT                                          <- Heading 1

Data Engineer with 4 years of experience...    <- becomes About
```

An `ABOUT` heading with nothing but blank paragraphs before the next heading
produces no About value — treated the same as no `ABOUT` heading at all
(spec Edge Cases).

## The Experience section

Within the Experience section, structure repeats per employer:

1. An **employer heading** (Google Docs "Heading 2" style): the employer's
   name and its location, in that order, separated by a tab character.
2. One or more **role lines** (plain paragraph text) immediately below it:
   the role's title, optionally followed by `|` and a client name, then a
   tab, then a date range `MM/YYYY - MM/YYYY` or `MM/YYYY - Present`.
3. Each role line is immediately followed by one or more **bulleted
   paragraphs** — the role's achievements — until the next role line, the
   next employer heading, or the end of the section.

Example (generic, not the author's real content):

```text
EXPERIENCE                                     <- Heading 1

ACME CORP           <TAB>Remote                 <- Heading 2 (employer)
Senior Engineer | Northwind<TAB>01/2023 - Present  <- role line

• Led the migration of ...                      <- bullet (achievement)
• Reduced latency by ...                         <- bullet (achievement)

Senior Engineer<TAB>06/2021 - 12/2022            <- second role line, same employer
• Built the initial ...                          <- bullet (achievement)

OTHER CO<TAB>New York, NY                        <- Heading 2 (next employer)
Engineer<TAB>03/2019 - 05/2021
• Owned ...
```

- Employers appear in the output in the same order their headings appear;
  roles within an employer appear in the same order their lines appear
  (FR-007) — the convention itself is expected to already be
  reverse-chronological (most recent first), but the parser doesn't reorder
  anything; it trusts Doc order.
- A role's end date is omitted, not defaulted, whenever the Doc reads
  `Present` (FR-005).
- An employer heading followed by no role lines, or a role line followed by
  no bulleted paragraphs, is a `ParseError` (User Story 3) — not treated as
  "no roles"/"no achievements" the way a missing `ABOUT`/`EXPERIENCE`
  heading is treated as "no section." The difference: a *missing section* is
  a normal, optional absence (FR-013); an employer or role *heading that
  exists but is empty underneath* is a Doc that started describing something
  and didn't finish it, which is exactly the kind of mistake User Story 3
  exists to catch.
