export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

// Placeholder data (CLAUDE.md's existing placeholder-content scope note,
// same as experience-placeholder.ts) — not yet wired to resume.json.
export const projects: ProjectEntry[] = [
  {
    id: "automated-mlops-pipeline",
    name: "Automated MLOps Pipeline",
    description:
      "End-to-end pipeline automating model training, validation, and deployment, built for a DevOps seminar and later presented across multiple Information Systems classes.",
    tags: ["Python", "MLflow", "GitLab CI"],
  },
  {
    id: "personal-landing-page",
    name: "Personal Landing Page / Living Résumé",
    description:
      "This site — a build-time pipeline that turns a Google Doc into static résumé JSON, rendered as a static Astro page with zero runtime backend.",
    tags: ["Astro", "TypeScript", "Google Docs API"],
  },
  {
    id: "fsi-streaming-data-quality-monitor",
    name: "FSI Streaming Data Quality Monitor",
    description:
      "Streaming data quality monitor for banking transaction pipelines, flagging schema drift and SLA breaches in real time.",
    tags: ["Spark Structured Streaming", "Databricks", "Delta Lake"],
  },
];
