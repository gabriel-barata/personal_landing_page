import assert from "node:assert/strict";
import { test } from "node:test";
import { education } from "../../src/data/education.js";

// Source of truth: contracts/content-data.md's Education section (FR-006).
const EXPECTED = [
  {
    institution: "Federal Institute of Goiás",
    degree: "BSc, Information Systems",
    completionStatus: "Expected graduation 2027",
  },
  {
    institution: "Universidade Federal do Pará",
    degree: "BEng, Mechanical Engineering",
    completionStatus: "60% of credits completed, 2024",
  },
];

test("education: exactly 2 entries", () => {
  assert.equal(education.length, 2);
});

test("education: each institution/degree/completionStatus matches the contract exactly (SC-004)", () => {
  assert.deepEqual(
    education.map((entry) => ({
      institution: entry.institution,
      degree: entry.degree,
      completionStatus: entry.completionStatus,
    })),
    EXPECTED,
  );
});

test("education: the Information Systems entry's note mentions the MLOps pipeline project (Python, MLflow, GitLab CI)", () => {
  const infoSystems = education.find((entry) => entry.degree === "BSc, Information Systems");
  assert.ok(infoSystems?.note, "expected a note on the Information Systems entry");
  assert.match(infoSystems.note, /MLOps/i);
  assert.match(infoSystems.note, /Python/);
  assert.match(infoSystems.note, /MLflow/);
  assert.match(infoSystems.note, /GitLab CI/);
});
