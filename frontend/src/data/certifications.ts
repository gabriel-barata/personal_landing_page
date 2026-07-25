export interface Certification {
  id: string;
  name: string;
  acquired: string;
  badgeImagePath: string;
  badgeAlt: string;
}

// Content contract: contracts/content-data.md's Certifications table (FR-005).
//
// badgeImagePath currently points at placeholder SVGs (public/badges/) — real
// provider-issued badge images (FR-019) are being sourced manually and will
// replace these in a follow-up change; the path/shape contract below is
// already final so that swap is a content-only change.
export const certifications: Certification[] = [
  {
    id: "databricks-data-engineer-professional",
    name: "Databricks Certified Data Engineer Professional",
    acquired: "08/2025",
    badgeImagePath: "/badges/databricks-data-engineer-professional.svg",
    badgeAlt: "Databricks Certified Data Engineer Professional badge",
  },
  {
    id: "databricks-data-engineer-associate",
    name: "Databricks Certified Data Engineer Associate",
    acquired: "06/2025",
    badgeImagePath: "/badges/databricks-data-engineer-associate.svg",
    badgeAlt: "Databricks Certified Data Engineer Associate badge",
  },
  {
    id: "aws-data-engineer-associate",
    name: "AWS Certified Data Engineer Associate",
    acquired: "09/2025",
    badgeImagePath: "/badges/aws-data-engineer-associate.svg",
    badgeAlt: "AWS Certified Data Engineer Associate badge",
  },
  {
    id: "aws-cloud-practitioner",
    name: "AWS Certified Cloud Practitioner",
    acquired: "04/2023",
    badgeImagePath: "/badges/aws-cloud-practitioner.svg",
    badgeAlt: "AWS Certified Cloud Practitioner badge",
  },
  {
    id: "dbt-certified-developer",
    name: "dbt Certified Developer",
    acquired: "04/2026",
    badgeImagePath: "/badges/dbt-certified-developer.svg",
    badgeAlt: "dbt Certified Developer badge",
  },
  {
    id: "databricks-generative-ai-engineer-associate",
    name: "Databricks Certified Generative AI Engineer Associate",
    acquired: "06/2026",
    badgeImagePath: "/badges/databricks-generative-ai-engineer-associate.svg",
    badgeAlt: "Databricks Certified Generative AI Engineer Associate badge",
  },
];
