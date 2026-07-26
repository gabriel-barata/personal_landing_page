export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string | "Present";
  summary: string;
  isCurrent: boolean;
  industry: string;
  teamSize: string;
  isLead: boolean;
  tasks: string[];
  achievements: string[];
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
    industry: "Financial Services",
    teamSize: "6 engineers",
    isLead: true,
    tasks: [
      "Own the technical roadmap for migrating risk-reporting pipelines from on-prem Spark to a Databricks lakehouse",
      "Design and enforce data quality contracts (schema checks, freshness SLAs) across ingestion pipelines",
      "Run weekly architecture reviews and mentor two mid-level data engineers",
      "Coordinate with Risk and Compliance stakeholders on reporting accuracy requirements",
    ],
    achievements: [
      "Cut nightly batch runtime by 60% by re-architecting the transformation layer around Delta Lake",
      "Reduced pipeline incident volume by 45% after introducing automated data quality gates",
      "Brought onboarding time for new data engineers down from 6 weeks to 2 by building a self-serve pipeline template",
    ],
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
    industry: "Insurance",
    teamSize: "4-person team",
    isLead: false,
    tasks: [
      "Build and maintain ingestion pipelines from claims and underwriting source systems into Snowflake",
      "Write and review dbt models and tests for the core analytics marts",
      "Set up AWS Lambda-based ingestion jobs for third-party data feeds",
      "Support analysts with ad-hoc data extracts and pipeline troubleshooting",
    ],
    achievements: [
      "Introduced dbt-based testing, catching an average of 12 data quality issues per month before they reached dashboards",
      "Cut claims-data ingestion latency from 4 hours to 45 minutes by moving to incremental loads",
      "Reduced manual data-fix tickets by 35% by adding source-side validation checks",
    ],
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
    industry: "Analytics Consulting",
    teamSize: "3-person team",
    isLead: false,
    tasks: [
      "Maintain and monitor existing ETL jobs feeding internal reporting dashboards",
      "Write Python scripts to automate previously manual data-loading tasks",
      "Build and schedule Airflow DAGs for recurring data-refresh jobs",
      "Fix data discrepancies flagged by internal report consumers",
    ],
    achievements: [
      "Automated 8 previously manual data-loading tasks, saving roughly 6 hours of manual work per week",
      "Cut dashboard refresh failures by 50% by adding retry logic and alerting to Airflow DAGs",
    ],
  },
];
