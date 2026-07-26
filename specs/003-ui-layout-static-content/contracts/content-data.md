# Contract: Static Content Data

This is the literal content contract that `frontend/src/data/*.ts` MUST
match exactly, and that `tests/data/*.test.ts` assert against. It is
reproduced from spec.md's Requirements (FR-003, FR-005, FR-006, FR-007) and
its Clarifications session — this file exists so implementation and tests
have one unambiguous source to diff against, without re-reading the full
spec prose each time.

## Tech Stack (FR-003) — 8 categories, 43 unique items

| Category | Items |
|---|---|
| Programming Languages | SQL, Go, Python, Bash, Scala |
| Databases & Storage | Oracle, Cassandra, MySQL, PostgreSQL, DynamoDB, Elasticsearch, AWS S3, Redis, SQL Server |
| Data Tools | Apache Airflow, Apache Kafka, Databricks, dbt, Apache Spark, Snowflake, Apache NiFi |
| Visualization Tools | Power BI, Metabase, Plotly, Seaborn, Matplotlib |
| Cloud | AWS, Azure |
| ML Frameworks & Tools | Langchain, LangGraph, RAG, Scikit-Learn |
| Programming Frameworks | FastAPI, Flask, Streamlit, Singer SDK |
| Others | GitLab, Docker, Kubernetes, Terraform, Azure DevOps, AWS Lambda, Unity Catalog |

Counts: 5 + 9 + 7 + 5 + 2 + 4 + 4 + 7 = **43**, all unique. "Snowflake"
appears exactly once, under **Data Tools** only (spec Clarifications
session 2026-07-25 — supersedes any earlier double-listing).

## Certifications (FR-005) — exactly 6, rendered most-recent-first by Acquired

| Issuer | Certification | Acquired |
|---|---|---|
| Databricks | Databricks Certified Data Engineer Professional | 08/2025 |
| Databricks | Databricks Certified Data Engineer Associate | 06/2025 |
| AWS | AWS Certified Data Engineer Associate | 09/2025 |
| AWS | AWS Certified Cloud Practitioner | 04/2023 |
| dbt | dbt Certified Developer | 04/2026 |
| Databricks | Databricks Certified Generative AI Engineer Associate | 06/2026 |

Display order is computed from `acquired` (descending) at render time, not
from the underlying data array's insertion order.

## Education (FR-006) — exactly 2, rendered second sub-group of the combined Certifications/Education section

1. **BSc, Information Systems** — Federal Institute of Goiás — "Expected
   graduation 2027". Note: automated MLOps pipeline project (Python,
   MLflow, GitLab CI) built for a DevOps seminar, later presented across
   multiple Information Systems classes.
2. **BEng, Mechanical Engineering** — Universidade Federal do Pará — "60% of
   credits completed, 2024".

## Experience placeholder (FR-007) — exactly 3, most-recent-first

Exact fictional role/company/dates/summary content is authored during
Implementation (spec Assumptions: "plausible-but-fictional," not
lorem-ipsum). Structural contract, fixed by spec Clarifications session
2026-07-25:

- Array length: exactly 3.
- Ordered most-recent-first (entry 0 = current/most recent).
- Entry 0: `isCurrent: true` → solid accent-filled square timeline tick.
- Entries 1–2: `isCurrent: false` → outline/support-colored ticks.
- Each entry: role, company, a date range (tabular numerals), 2–3 line
  summary.

## Section structure (spec Clarifications session 2026-07-25)

Page section order (US1 acceptance scenario 3): Hero → Experience → Tech
Stack → Certifications/Education → Contact/footer.

"Certifications/Education" renders as **one combined section**
(`CertificationsEducation.astro`), not two independent top-level sections:
Certifications sub-group first, Education sub-group second, sharing one
section-to-section gap budget on each outer edge (not two).

## Language (FR-014, spec Assumptions)

`src/data/i18n/pt.ts` MUST contain the same string values as
`src/data/i18n/en.ts` for this feature (no real Portuguese translations were
supplied) — the toggle must be fully functional, only the copy is
English-under-both-keys for now.
