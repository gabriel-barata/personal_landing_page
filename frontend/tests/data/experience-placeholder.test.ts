import assert from "node:assert/strict";
import { test } from "node:test";
import { experiencePlaceholder } from "../../src/data/experience-placeholder.js";

test("experiencePlaceholder: array length is exactly 3", () => {
  assert.equal(experiencePlaceholder.length, 3);
});

test("experiencePlaceholder: ordered most-recent-first (each startDate >= the next entry's)", () => {
  for (let i = 0; i < experiencePlaceholder.length - 1; i++) {
    const current = experiencePlaceholder[i]!.startDate;
    const next = experiencePlaceholder[i + 1]!.startDate;
    assert.ok(current >= next, `entry ${i} (${current}) should be >= entry ${i + 1} (${next})`);
  }
});

test("experiencePlaceholder: exactly one entry has isCurrent true, and it is the first element", () => {
  const currentEntries = experiencePlaceholder.filter((entry) => entry.isCurrent);
  assert.equal(currentEntries.length, 1);
  assert.equal(experiencePlaceholder[0]!.isCurrent, true);
});
