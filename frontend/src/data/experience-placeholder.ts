export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string | "Present";
  summary: string;
  isCurrent: boolean;
}

// Placeholder content — plausible-but-fictional (spec Assumptions), not
// sourced from resume.json. Structural contract: contracts/content-data.md
// (FR-007) — exactly 3 entries, most-recent-first, only entry 0 is current.
export const experiencePlaceholder: ExperienceEntry[] = [
  {
    id: "senior-data-engineer",
    role: "Senior Data Engineer",
    company: "Meridian Financial Group",
    startDate: "2023",
    endDate: "Present",
    summary:
      "Leading the migration of core risk-reporting pipelines to a Databricks lakehouse, cutting nightly batch runtime by 60% and establishing the team's data quality and observability standards.",
    isCurrent: true,
  },
  {
    id: "data-engineer",
    role: "Data Engineer",
    company: "Norwind Insurance",
    startDate: "2021",
    endDate: "2023",
    summary:
      "Built ingestion and transformation pipelines on AWS and Snowflake for claims and underwriting data, and introduced dbt-based testing to the analytics engineering workflow.",
    isCurrent: false,
  },
  {
    id: "junior-data-engineer",
    role: "Junior Data Engineer",
    company: "Cascata Analytics",
    startDate: "2020",
    endDate: "2021",
    summary:
      "Maintained ETL jobs and internal reporting dashboards, and automated manual data-loading tasks with Python scripts and scheduled Airflow DAGs.",
    isCurrent: false,
  },
];
