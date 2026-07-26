export interface CoreStackItem {
  id: string;
  label: string;
  iconId: string;
}

export interface Dictionary {
  hero: {
    name: string;
    role: string;
    summary: string;
    location: string;
    yearsExperience: number;
    yearsExperienceSuffix: string;
    coreStack: CoreStackItem[];
  };
  sections: {
    experience: string;
    techStack: string;
    certifications: string;
    educationProjects: string;
    education: string;
    projects: string;
    contact: string;
  };
  microcopy: {
    downloadCv: string;
    langEn: string;
    langPt: string;
    themeLight: string;
    themeDark: string;
  };
}

export const en: Dictionary = {
  hero: {
    name: "Emanuel Barata",
    role: "Data Engineer / Forward Deployed Engineer — FSI",
    summary:
      "Architects scalable Lakehouse platforms and leads cloud migrations using Python, Spark, and Terraform. Recent work: event-driven ELT pipelines, CI/CD infrastructure-as-code governance, and modernizing legacy warehouses into decentralized architectures. Trilingual, focused on robust data engineering.",
    location: "GOIÂNIA, BR",
    yearsExperience: 4,
    yearsExperienceSuffix: "Y EXPERIENCE",
    coreStack: [
      { id: "databricks", label: "Databricks", iconId: "databricks" },
      { id: "aws", label: "AWS", iconId: "aws" },
      { id: "claude", label: "Claude", iconId: "claude" },
      { id: "azure", label: "Azure", iconId: "azure" },
      { id: "snowflake", label: "Snowflake", iconId: "snowflake" },
    ],
  },
  sections: {
    experience: "Experience",
    techStack: "Tech Stack",
    certifications: "Certifications",
    educationProjects: "Education & Projects",
    education: "College",
    projects: "Projects",
    contact: "Contact",
  },
  microcopy: {
    downloadCv: "Download CV",
    langEn: "EN",
    langPt: "PT",
    themeLight: "LIGHT",
    themeDark: "DARK",
  },
};
