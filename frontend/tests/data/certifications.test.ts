import assert from "node:assert/strict";
import { test } from "node:test";
import { certifications } from "../../src/data/certifications.js";

// Source of truth: contracts/content-data.md's Certifications table (FR-005).
const EXPECTED: Array<{ issuer: string; name: string; acquired: string }> = [
  { issuer: "Databricks", name: "Databricks Certified Data Engineer Professional", acquired: "08/2025" },
  { issuer: "Databricks", name: "Databricks Certified Data Engineer Associate", acquired: "06/2025" },
  { issuer: "AWS", name: "AWS Certified Data Engineer Associate", acquired: "09/2025" },
  { issuer: "AWS", name: "AWS Certified Cloud Practitioner", acquired: "04/2023" },
  { issuer: "dbt", name: "dbt Certified Developer", acquired: "04/2026" },
  { issuer: "Databricks", name: "Databricks Certified Generative AI Engineer Associate", acquired: "06/2026" },
];

// Most-recent-first, by acquired (MM/YYYY) — the order the component renders,
// computed at render time rather than stored as array order (contracts/content-data.md).
const EXPECTED_DISPLAY_ORDER = [
  "Databricks Certified Generative AI Engineer Associate", // 06/2026
  "dbt Certified Developer", // 04/2026
  "AWS Certified Data Engineer Associate", // 09/2025
  "Databricks Certified Data Engineer Professional", // 08/2025
  "Databricks Certified Data Engineer Associate", // 06/2025
  "AWS Certified Cloud Practitioner", // 04/2023
];

function parseAcquired(acquired: string): number {
  const [month, year] = acquired.split("/").map(Number);
  return year * 12 + month;
}

test("certifications: exactly 6 entries", () => {
  assert.equal(certifications.length, 6);
});

test("certifications: each issuer/name/acquired triple matches the contract exactly (SC-003)", () => {
  assert.deepEqual(
    certifications.map((c) => ({ issuer: c.issuer, name: c.name, acquired: c.acquired })),
    EXPECTED,
  );
});

test("certifications: every issuer is non-empty", () => {
  for (const cert of certifications) {
    assert.ok(cert.issuer.length > 0, `${cert.id} has an empty issuer`);
  }
});

test("certifications: sorting by acquired descending yields most-recent-first display order", () => {
  const sorted = [...certifications].sort((a, b) => parseAcquired(b.acquired) - parseAcquired(a.acquired));
  assert.deepEqual(
    sorted.map((c) => c.name),
    EXPECTED_DISPLAY_ORDER,
  );
});

test("certifications: every badgeImagePath is non-empty", () => {
  for (const cert of certifications) {
    assert.ok(cert.badgeImagePath.length > 0, `${cert.id} has an empty badgeImagePath`);
  }
});

test("certifications: every credentialUrl is a well-formed https URL", () => {
  for (const cert of certifications) {
    assert.doesNotThrow(() => {
      const url = new URL(cert.credentialUrl);
      assert.equal(url.protocol, "https:", `${cert.id}'s credentialUrl must be https`);
    }, `${cert.id} has an invalid credentialUrl`);
  }
});
