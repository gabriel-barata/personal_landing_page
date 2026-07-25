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
    educationCertifications: string;
    certifications: string;
    education: string;
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
      "Data engineer building reliable pipelines and platforms for banks and insurers, from ingestion through to production ML.",
    location: "LISBON, PT",
    yearsExperience: 6,
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
    educationCertifications: "Education & Certifications",
    certifications: "Certifications",
    education: "College",
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
