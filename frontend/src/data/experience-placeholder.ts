// A task bullet, optionally with sub-bullets (e.g. a detail nested under a
// broader responsibility) — a plain string renders as a single flat bullet.
export type TaskItem = string | { text: string; children: string[] };

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
  tasks: TaskItem[];
  achievements: string[];
}

// Placeholder content — plausible-but-fictional (spec Assumptions), not
// sourced from resume.json. Structural contract: contracts/content-data.md
// (FR-007) — exactly 3 entries, most-recent-first, only entry 0 is current.
export const experiencePlaceholder: ExperienceEntry[] = [
  {
    id: "data-engineer-indicium",
    role: "Data Engineer",
    company: "Indicium AI",
    startDate: "Mar 2025",
    endDate: "Present",
    summary: "Automating infrastructure and platform migrations for financial and insurance clients.",
    isCurrent: true,
    industry: "Consultancy — Financial Services / Insurance",
    teamSize: "1–8 people, multidisciplinary teams (Data Engineers, Analytics Engineers, etc.)",
    isLead: false,
    tasks: [
      "Architected and deployed a GitOps-driven infrastructure automation solution utilizing Terraform, Python, and Azure DevOps for a UK insurance company. Built robust CI/CD pipelines incorporating YAML abstraction layers and automated quality gates to successfully migrate 90% of manual Snowflake object management into a strictly governed, version-controlled environment, significantly reducing manual overhead.",
      "Designed and orchestrated an ETL pipeline utilizing AWS, Python, dbt, and Snowflake to consolidate Motor insurance data following a major acquisition between the UK's top two insurance providers. Applied Data Vault methodology for data integration before transforming the output into a structured Kimball dimensional model. This end-to-end architecture populated a centralized feature store with 700 curated factors, directly empowering data science teams to train predictive models.",
      "Led the discovery and execution of a data platform migration for a financial services company, utilizing Databricks, Unity Catalog, Spark, and Delta Live Tables to successfully transition 14 pipelines and over 250 tables. Concurrently, leveraged the migration phase to optimize the underlying big data pipelines, implementing PySpark caching strategies and cluster tuning to achieve up to a 50% reduction in execution time and compute resource consumption across the new architecture.",
      "Engineered a comprehensive data architecture and deployment strategy, guiding the discovery and dimensional modeling phases to design scalable SQL-based table structures for long-term business intelligence. To streamline the rollout of these analytical products and cloud resources, architected and integrated automated CI/CD pipelines using GitHub Actions and Databricks Asset Bundles.",
      {
        text: "Architected standardized infrastructure-as-code blueprints within an internal R&D team to unify data platform implementations, using Terraform to deploy production-ready Databricks environments, networking configurations, and Unity Catalog integrations across AWS and Azure; this centralized repository of templates and documentation reduced initial environment setup time and enforced architectural consistency across consulting projects.",
        children: [
          "Developed a reusable Python-based data extraction template utilizing Singer Taps, containerized on Amazon ECS and orchestrated by Apache Airflow, to automate ingestion workflows from SharePoint.",
        ],
      },
    ],
    achievements: [],
  },
  {
    id: "data-engineer-banco-inter",
    role: "Data Engineer",
    company: "Banco Inter",
    startDate: "May 2024",
    endDate: "Mar 2025",
    summary:
      "Led a 3-engineer squad owning 26+ business-critical data products for a financial services fintech.",
    isCurrent: false,
    industry: "Financial Services",
    teamSize: "3 engineers",
    isLead: true,
    tasks: [
      "Implemented an automated cloud data platform for a Brazilian fintech, utilizing Terraform to provision AWS infrastructure and deploy data engineering applications. Within this Infrastructure-as-Code (IaC) framework, designed and optimized AWS EMR clusters to execute Spark applications, ensuring cost-efficiency and high performance for terabyte-scale data workloads.",
      "Led a Data Engineering squad at a financial services company, directing the development and evolution of 26+ business-critical data products and high-volume big data pipelines. Serving as the primary technical point of reference, provided architectural guidance and mentored team members on Python, SQL, Apache Spark, and AWS best practices, accelerating the onboarding of new engineers and ensuring the delivery of scalable infrastructure solutions.",
      "Orchestrated complex data ingestion pipelines into an AWS Data Lake using Apache Airflow, integrating large-scale datasets from Apache Kafka, REST APIs, and relational databases, like SQL Server and Oracle. Within this architecture, engineered and optimized high-volume Python-based Apache Spark jobs, leveraging AWS EMR and AWS Glue, ensuring high-performance data transformation and efficient execution for complex big data workloads.",
    ],
    achievements: [],
  },
  {
    id: "data-engineer-vizentec",
    role: "Data Engineer",
    company: "Vizentec",
    startDate: "Sep 2023",
    endDate: "May 2024",
    summary: "Built a data platform for a mobility tech company, plus internal automation tools.",
    isCurrent: false,
    industry: "Mobility",
    teamSize: "4 engineers",
    isLead: false,
    tasks: [
      "Constructed a Lakehouse analytical platform for a Brazilian mobility tech company to process both batch and streaming workloads. Orchestrated the ingestion of complex datasets from Apache Kafka, Cassandra, Oracle, and APIs utilizing Apache Airflow and Spark Structured Streaming. Transformed the ingested data by implementing a standardized modeling layer with dbt and SQL, unifying the Data Warehouse and Data Mart architectures and improving the team's development workflow.",
      "Managed and optimized legacy data pipelines for a mobility tech company to ensure continuous data integrity and platform availability. Maintained existing ingestion workflows utilizing Apache NiFi, and fine-tuned high-volume Apache Spark workloads with Python and SQL. This optimization effort successfully reduced overall pipeline execution time and compute resource consumption for complex big data processing.",
      "Built custom Python web applications to automate manual workflows for a tech company. Integrated these targeted tools directly into the broader data engineering and big data ecosystem, replacing manual data handling with programmatic solutions to improve overall operational efficiency.",
    ],
    achievements: [],
  },
  {
    id: "data-engineer-cosmefar",
    role: "Data Engineer",
    company: "Cosmefar",
    startDate: "Sep 2022",
    endDate: "Sep 2023",
    summary:
      "Built a pharmaceutics company's first data platform from scratch, powering sales and marketing.",
    isCurrent: false,
    industry: "Pharmaceutics",
    teamSize: "Solo (only engineer)",
    isLead: false,
    tasks: [
      "Engineered an end-to-end data platform from scratch for a growing industrial company, utilizing a Dockerized Apache Airflow infrastructure to orchestrate the ingestion of data from ERP systems, internal CRMs, and the Google Ads API. Loaded this raw data into a PostgreSQL Data Warehouse, where it was transformed into Star Schema dimensional models using SQL. This unified architecture fully automates data delivery from source to visualization, empowering the Sales and Marketing teams with interactive Power BI dashboards.",
      "Created automated web scraping pipelines using Python and Scrapy to replace manual market research workflows for an industrial company. Extracted and processed competitive market data, delivering the final structured datasets directly into Google Sheets to provide the commercial team with an automated, ready-to-use data feed.",
    ],
    achievements: [],
  },
];
