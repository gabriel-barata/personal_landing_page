# Phase 1 Data Model: Landing Page UI Layout & Static Content Sections

All types below are framework-free TypeScript (`frontend/src/data/*.ts`,
`frontend/src/lib/*.ts`) — no Astro or DOM types — per Constitution
Principle I. Field names are illustrative for Tasks/Implementation; exact
literal content is fixed by `contracts/content-data.md`, sourced from spec
FR-003/FR-005/FR-006/FR-007.

## TechStackCategory / TechStackItem

Spec Key Entities: *TechStackCategory*, *TechStackItem* (now belonging to
exactly one category — see spec Clarifications session 2026-07-25).

```ts
interface TechStackItem {
  id: string;        // stable slug, e.g. "python"
  label: string;     // display text, e.g. "Python"
  iconId: string;    // key into the self-hosted icon set (research.md #4)
}

interface TechStackCategory {
  id: string;             // stable slug, e.g. "programming-languages"
  label: string;          // display heading, e.g. "Programming Languages"
  items: TechStackItem[]; // exact, ordered list — no item repeated across categories
}

type TechStack = TechStackCategory[]; // exactly 8 categories, 43 unique items total
```

**Validation rules** (enforced by `tests/data/tech-stack.test.ts`):
- Exactly 8 categories, exact labels per FR-003.
- Each category's `items` exactly matches FR-003's list for that category,
  in count and name — no additions, omissions, or cross-category duplicates.
- Every `id` across the whole structure is unique (no item, including
  "Snowflake," appears in more than one category — spec Clarifications).
- Total unique item count across all categories = 43 (SC-002).

## Certification

Spec Key Entity: *Certification*.

```ts
interface Certification {
  id: string;             // stable slug, e.g. "databricks-data-engineer-professional"
  name: string;            // exact credential name, FR-005
  acquired: string;         // "MM/YYYY" display string, FR-005
  badgeImagePath: string;    // path under public/badges/, research.md #5
  badgeAlt: string;           // accessible alt text (provider + credential name)
}

type Certifications = Certification[]; // exactly 6, order per FR-005's list
```

**Validation rules** (`tests/data/certifications.test.ts`): exactly 6
entries; each `name`/`acquired` pair matches FR-005 exactly (SC-003); every
`badgeImagePath` is non-empty (asset existence itself is a build/manual
concern, not a unit-test concern — see `quickstart.md`).

## EducationEntry

Spec Key Entity: *EducationEntry*.

```ts
interface EducationEntry {
  id: string;                // stable slug
  institution: string;        // FR-006
  degree: string;              // FR-006
  completionStatus: string;     // display string, e.g. "Expected graduation 2027"
  note?: string;                 // optional descriptive note, e.g. MLOps pipeline project (FR-006)
}

type Education = EducationEntry[]; // exactly 2, Certifications sub-group renders before this (spec Clarifications)
```

**Validation rules** (`tests/data/education.test.ts`): exactly 2 entries;
each institution/degree/completionStatus matches FR-006 exactly (SC-004);
the Information Systems entry's `note` is present and mentions the MLOps
pipeline project (Python, MLflow, GitLab CI).

## ExperienceEntry (placeholder)

Spec Key Entity: *ExperienceEntry (placeholder)*. Count fixed at exactly 3
by spec Clarifications session 2026-07-25.

```ts
interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  startDate: string;     // display string, tabular-nums friendly, e.g. "2023"
  endDate: string | 'Present';
  summary: string;        // 2–3 lines, plausible-but-fictional (spec Assumptions)
  isCurrent: boolean;      // true for exactly one entry — the first/most recent
}

type ExperiencePlaceholder = ExperienceEntry[]; // exactly 3, ordered most-recent-first
```

**Validation rules** (`tests/data/experience-placeholder.test.ts`): array
length is exactly 3; ordered most-recent-first (each entry's `startDate` ≥
the next entry's); exactly one entry has `isCurrent: true` and it is the
first element (FR-007).

## AboutSummary (placeholder)

Spec Key Entity: *AboutSummary (placeholder)* — resolved by spec framing
(page-section order in US1 scenario 3 lists no standalone "About" section)
to be the hero's one-line/two-sentence summary string itself, not a separate
section. Modeled as a single field on the hero content data, not its own
collection type:

```ts
interface HeroContent {
  name: string;
  role: string;             // e.g. "Data Engineer — FSI"
  summary: string;           // placeholder, 1–2 sentences (FR-008)
  location: string;
  yearsExperience: number;
  coreStack: { id: string; label: string; iconId: string }[]; // 5 curated platform icons, visual-direction decision 3
}
```

## ContactLink

Spec Key Entity: *ContactLink* — shown in the hero and repeated in the
footer (visual-direction decision 6).

```ts
interface ContactLink {
  id: string;                       // "email" | "linkedin" | "cv"
  label: string;
  href: string;                      // placeholder destination (spec Assumptions)
  kind: 'email' | 'linkedin' | 'cv';
}

type ContactLinks = ContactLink[]; // 2–3 entries, shared by hero + footer
```

## Theme / Language state

Not spec Key Entities, but the state shape shared across the inline
bootstrap script, the two toggle islands, and CSS (`research.md` #6, #7;
formalized in `contracts/theme-language-state.md`).

```ts
type Theme = 'light' | 'dark';
type StoredTheme = Theme | null; // null = no manual override yet

type Language = 'en' | 'pt';
type StoredLanguage = Language | null;

// lib/theme.ts
declare function resolveTheme(stored: StoredTheme, prefersDark: boolean): Theme;
declare function readStoredTheme(storage: Pick<Storage, 'getItem'>): StoredTheme; // never throws
declare function persistTheme(storage: Pick<Storage, 'setItem'>, theme: Theme): void; // never throws

// lib/language.ts — same shape, default 'en' instead of an OS signal
declare function resolveLanguage(stored: StoredLanguage): Language;
declare function readStoredLanguage(storage: Pick<Storage, 'getItem'>): StoredLanguage;
declare function persistLanguage(storage: Pick<Storage, 'setItem'>, lang: Language): void;
```

**Validation rules** (`tests/lib/theme.test.ts`, `tests/lib/language.test.ts`):
- `resolveTheme(null, true)` → `'dark'`; `resolveTheme(null, false)` →
  `'light'` (OS fallback, FR-015).
- `resolveTheme('light', true)` → `'light'`; `resolveTheme('dark', false)` →
  `'dark'` (persisted override always wins over OS signal, FR-015, SC-006).
- `readStoredTheme`/`readStoredLanguage` return `null` (not throw) when the
  passed-in storage's `getItem` throws (Edge Cases: storage disabled/cleared).
- `resolveLanguage(null)` → `'en'` (defined default, FR-014's Edge Case
  fallback); `resolveLanguage('pt')` → `'pt'`.
