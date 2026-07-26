import assert from "node:assert/strict";
import { test } from "node:test";
import { formatExperienceDate } from "../../src/lib/format-date.js";

test("formatExperienceDate: compresses 'Mon YYYY' to \"Mon 'YY\"", () => {
  assert.equal(formatExperienceDate("Mar 2025"), "Mar '25");
  assert.equal(formatExperienceDate("May 2024"), "May '24");
});

test("formatExperienceDate: passes 'Present' through unchanged", () => {
  assert.equal(formatExperienceDate("Present"), "Present");
});

test("formatExperienceDate: passes a bare year through unchanged", () => {
  assert.equal(formatExperienceDate("2020"), "2020");
});
