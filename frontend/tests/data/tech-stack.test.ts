import assert from "node:assert/strict";
import { test } from "node:test";
import { techStack } from "../../src/data/tech-stack.js";

// Source of truth: contracts/content-data.md's Tech Stack table (FR-003).
const EXPECTED: Record<string, string[]> = {
  "Programming Languages": ["SQL", "Go", "Python", "Bash", "Scala"],
  "Databases & Storage": [
    "Oracle",
    "Cassandra",
    "MySQL",
    "PostgreSQL",
    "DynamoDB",
    "Elasticsearch",
    "AWS S3",
    "Redis",
    "SQL Server",
  ],
  "Data Tools": [
    "Apache Airflow",
    "Apache Kafka",
    "Databricks",
    "dbt",
    "Apache Spark",
    "Snowflake",
    "Apache NiFi",
  ],
  "Visualization Tools": ["Power BI", "Metabase", "Plotly", "Seaborn", "Matplotlib"],
  Cloud: ["AWS", "Azure"],
  "ML Frameworks & Tools": ["Langchain", "LangGraph", "RAG", "Scikit-Learn"],
  "Programming Frameworks": ["FastAPI", "Flask", "Streamlit", "Singer SDK"],
  Others: [
    "GitLab",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Azure DevOps",
    "AWS Lambda",
    "Unity Catalog",
  ],
};

test("techStack: has exactly 8 categories with the exact expected labels, in order", () => {
  assert.deepEqual(
    techStack.map((category) => category.label),
    Object.keys(EXPECTED),
  );
});

test("techStack: each category's items exactly match the expected list (count + names, in order)", () => {
  for (const category of techStack) {
    const expected = EXPECTED[category.label];
    assert.ok(expected, `unexpected category: ${category.label}`);
    assert.deepEqual(
      category.items.map((item) => item.label),
      expected,
    );
  }
});

test("techStack: every id is globally unique across all categories (no cross-category duplicate, incl. Snowflake)", () => {
  const ids = techStack.flatMap((category) => category.items.map((item) => item.id));
  assert.equal(ids.length, new Set(ids).size);
});

test('techStack: "Snowflake" appears exactly once, under Data Tools only', () => {
  const categoriesWithSnowflake = techStack.filter((category) =>
    category.items.some((item) => item.label === "Snowflake"),
  );
  assert.deepEqual(
    categoriesWithSnowflake.map((category) => category.label),
    ["Data Tools"],
  );
});

test("techStack: total unique item count across all categories is 43 (SC-002)", () => {
  const totalItems = techStack.reduce((sum, category) => sum + category.items.length, 0);
  assert.equal(totalItems, 43);
});
