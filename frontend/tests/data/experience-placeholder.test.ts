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

test("experiencePlaceholder: every entry has a non-empty industry and teamSize", () => {
  for (const entry of experiencePlaceholder) {
    assert.ok(entry.industry.length > 0, `${entry.id} is missing industry`);
    assert.ok(entry.teamSize.length > 0, `${entry.id} is missing teamSize`);
  }
});

test("experiencePlaceholder: every entry has at least one task and one achievement", () => {
  for (const entry of experiencePlaceholder) {
    assert.ok(entry.tasks.length >= 1, `${entry.id} has no tasks`);
    assert.ok(entry.achievements.length >= 1, `${entry.id} has no achievements`);
  }
});

test("experiencePlaceholder: at least one entry is isLead true and at least one is isLead false", () => {
  assert.ok(experiencePlaceholder.some((entry) => entry.isLead === true));
  assert.ok(experiencePlaceholder.some((entry) => entry.isLead === false));
});
