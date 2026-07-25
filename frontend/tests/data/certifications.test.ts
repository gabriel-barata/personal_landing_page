import assert from "node:assert/strict";
import { test } from "node:test";
import { certifications } from "../../src/data/certifications.js";

// Source of truth: contracts/content-data.md's Certifications table (FR-005).
const EXPECTED: Array<{ name: string; acquired: string }> = [
  { name: "Databricks Certified Data Engineer Professional", acquired: "08/2025" },
  { name: "Databricks Certified Data Engineer Associate", acquired: "06/2025" },
  { name: "AWS Certified Data Engineer Associate", acquired: "09/2025" },
  { name: "AWS Certified Cloud Practitioner", acquired: "04/2023" },
  { name: "dbt Certified Developer", acquired: "04/2026" },
  { name: "Databricks Certified Generative AI Engineer Associate", acquired: "06/2026" },
];

test("certifications: exactly 6 entries", () => {
  assert.equal(certifications.length, 6);
});

test("certifications: each name/acquired pair matches the contract exactly, in order (SC-003)", () => {
  assert.deepEqual(
    certifications.map((c) => ({ name: c.name, acquired: c.acquired })),
    EXPECTED,
  );
});

test("certifications: every badgeImagePath is non-empty", () => {
  for (const cert of certifications) {
    assert.ok(cert.badgeImagePath.length > 0, `${cert.id} has an empty badgeImagePath`);
  }
});
