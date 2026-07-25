export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  completionStatus: string;
  note?: string;
}

// Content contract: contracts/content-data.md's Education section (FR-006).
export const education: EducationEntry[] = [
  {
    id: "information-systems",
    institution: "Federal Institute of Goiás",
    degree: "BSc, Information Systems",
    completionStatus: "Expected graduation 2027",
    note: "Built an automated MLOps pipeline project (Python, MLflow, GitLab CI) for a DevOps seminar, later presented across multiple Information Systems classes.",
  },
  {
    id: "mechanical-engineering",
    institution: "Universidade Federal do Pará",
    degree: "BEng, Mechanical Engineering",
    completionStatus: "60% of credits completed, 2024",
  },
];
