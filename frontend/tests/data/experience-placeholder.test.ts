import assert from "node:assert/strict";
import { test } from "node:test";
import { experiencePlaceholder } from "../../src/data/experience-placeholder.js";

test("experiencePlaceholder: array is non-empty", () => {
  assert.ok(experiencePlaceholder.length >= 1);
});

// startDate is a display string ("Mar 2025" or a bare "2021"), not
// lexically sortable (e.g. "Mar 2025" < "May 2024" alphabetically even
// though March 2025 is later) — parse before comparing chronologically.
function parseStartDate(value: string): number {
  return Date.parse(value);
}

test("experiencePlaceholder: ordered most-recent-first (each startDate >= the next entry's)", () => {
  for (let i = 0; i < experiencePlaceholder.length - 1; i++) {
    const current = experiencePlaceholder[i]!.startDate;
    const next = experiencePlaceholder[i + 1]!.startDate;
    assert.ok(
      parseStartDate(current) >= parseStartDate(next),
      `entry ${i} (${current}) should be >= entry ${i + 1} (${next})`,
    );
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
