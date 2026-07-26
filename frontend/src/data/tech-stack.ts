export interface TechStackItem {
  id: string;
  label: string;
}

export interface TechStackCategory {
  id: string;
  label: string;
  items: TechStackItem[];
}

function item(id: string, label: string): TechStackItem {
  return { id, label };
}

// Content contract: contracts/content-data.md's Tech Stack table (FR-003).
// "Snowflake" appears exactly once, under Data Tools only.
export const techStack: TechStackCategory[] = [
  {
    id: "programming-languages",
    label: "Programming Languages",
    items: [
      item("sql", "SQL"),
      item("go", "Go"),
      item("python", "Python"),
      item("bash", "Bash"),
      item("scala", "Scala"),
    ],
  },
  {
    id: "databases-storage",
    label: "Databases & Storage",
    items: [
      item("oracle", "Oracle"),
      item("cassandra", "Cassandra"),
      item("mysql", "MySQL"),
      item("postgresql", "PostgreSQL"),
      item("dynamodb", "DynamoDB"),
      item("elasticsearch", "Elasticsearch"),
      item("aws-s3", "AWS S3"),
      item("redis", "Redis"),
      item("sql-server", "SQL Server"),
    ],
  },
  {
    id: "data-tools",
    label: "Data Tools",
    items: [
      item("airflow", "Apache Airflow"),
      item("kafka", "Apache Kafka"),
      item("databricks", "Databricks"),
      item("dbt", "dbt"),
      item("spark", "Apache Spark"),
      item("snowflake", "Snowflake"),
      item("nifi", "Apache NiFi"),
    ],
  },
  {
    id: "visualization-tools",
    label: "Visualization Tools",
    items: [
      item("power-bi", "Power BI"),
      item("metabase", "Metabase"),
      item("plotly", "Plotly"),
      item("seaborn", "Seaborn"),
      item("matplotlib", "Matplotlib"),
    ],
  },
  {
    id: "cloud",
    label: "Cloud",
    items: [item("aws", "AWS"), item("azure", "Azure")],
  },
  {
    id: "ml-frameworks-tools",
    label: "ML Frameworks & Tools",
    items: [
      item("langchain", "Langchain"),
      item("langgraph", "LangGraph"),
      item("rag", "RAG"),
      item("scikit-learn", "Scikit-Learn"),
    ],
  },
  {
    id: "programming-frameworks",
    label: "Programming Frameworks",
    items: [
      item("fastapi", "FastAPI"),
      item("flask", "Flask"),
      item("streamlit", "Streamlit"),
      item("singer-sdk", "Singer SDK"),
    ],
  },
  {
    id: "others",
    label: "Others",
    items: [
      item("gitlab", "GitLab"),
      item("docker", "Docker"),
      item("kubernetes", "Kubernetes"),
      item("terraform", "Terraform"),
      item("azure-devops", "Azure DevOps"),
      item("aws-lambda", "AWS Lambda"),
      item("unity-catalog", "Unity Catalog"),
    ],
  },
];
