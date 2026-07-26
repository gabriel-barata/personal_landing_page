export interface Certification {
  id: string;
  issuer: string;
  name: string;
  acquired: string;
  badgeImagePath: string;
  badgeAlt: string;
  credentialUrl: string;
}

// Content contract: contracts/content-data.md's Certifications table (FR-005).
export const certifications: Certification[] = [
  {
    id: "databricks-data-engineer-professional",
    issuer: "Databricks",
    name: "Databricks Certified Data Engineer Professional",
    acquired: "08/2025",
    badgeImagePath: "/badges/databricks-data-engineer-professional.png",
    badgeAlt: "Databricks Certified Data Engineer Professional badge",
    credentialUrl: "https://credentials.databricks.com/49108dd8-568d-4b2a-9f27-94f600d8865b",
  },
  {
    id: "databricks-data-engineer-associate",
    issuer: "Databricks",
    name: "Databricks Certified Data Engineer Associate",
    acquired: "06/2025",
    badgeImagePath: "/badges/databricks-data-engineer-associate.png",
    badgeAlt: "Databricks Certified Data Engineer Associate badge",
    credentialUrl: "https://credentials.databricks.com/601cc02d-37eb-4e16-8700-043b6aaefdd6",
  },
  {
    id: "aws-data-engineer-associate",
    issuer: "AWS",
    name: "AWS Certified Data Engineer Associate",
    acquired: "09/2025",
    badgeImagePath: "/badges/aws-data-engineer-associate.png",
    badgeAlt: "AWS Certified Data Engineer Associate badge",
    credentialUrl: "https://www.credly.com/badges/e5c4d2e2-9f8d-496f-85c7-a5834676cbc2/public_url",
  },
  {
    id: "aws-cloud-practitioner",
    issuer: "AWS",
    name: "AWS Certified Cloud Practitioner",
    acquired: "04/2023",
    badgeImagePath: "/badges/aws-cloud-practitioner.png",
    badgeAlt: "AWS Certified Cloud Practitioner badge",
    credentialUrl: "https://www.credly.com/badges/63fb3017-df1d-4708-8c8e-9655e20dadc9/public_url",
  },
  {
    id: "dbt-certified-developer",
    issuer: "dbt",
    name: "dbt Certified Developer",
    acquired: "04/2026",
    badgeImagePath: "/badges/dbt-certified-developer.webp",
    badgeAlt: "dbt Certified Developer badge",
    credentialUrl: "https://credentials.getdbt.com/98757ac6-93dc-4282-9075-daa63101feb5",
  },
  {
    id: "databricks-generative-ai-engineer-associate",
    issuer: "Databricks",
    name: "Databricks Certified Generative AI Engineer Associate",
    acquired: "06/2026",
    badgeImagePath: "/badges/databricks-generative-ai-engineer-associate.png",
    badgeAlt: "Databricks Certified Generative AI Engineer Associate badge",
    credentialUrl: "https://credentials.databricks.com/d8979f22-59ef-4981-95ec-584661690447",
  },
];
