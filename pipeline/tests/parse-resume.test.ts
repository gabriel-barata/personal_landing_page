import assert from "node:assert/strict";
import { test } from "node:test";
import type { DocLine } from "../src/domain/doc-line.js";
import { parseResume } from "../src/domain/parse-resume.js";
import fullyValid from "./fixtures/resume-fully-valid.json" with { type: "json" };
import ignoredSection from "./fixtures/ignored-section.json" with { type: "json" };
import sectionOrder from "./fixtures/section-order.json" with { type: "json" };

test("parseResume: a fully valid document produces a complete ResumeBody (quickstart #10)", () => {
  const result = parseResume(fullyValid as DocLine[]);

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.value.about, "Engineer with 5 years of experience building things.");
  assert.equal(result.value.experience?.length, 2);
  assert.equal(result.value.experience?.[0]?.name, "GLOBEX CONSULTING");
  assert.equal(result.value.experience?.[0]?.roles.length, 2);
  assert.equal(result.value.experience?.[1]?.name, "ACME CORP");
});

test("parseResume: content outside ABOUT/EXPERIENCE never causes failure or leaks into output (quickstart #12)", () => {
  const result = parseResume(ignoredSection as DocLine[]);

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.value.about, "Engineer with 5 years of experience building things.");
  assert.equal(result.value.experience?.length, 1);
  assert.equal(result.value.experience?.[0]?.name, "ACME CORP");
  assert.equal(JSON.stringify(result.value).includes("EDUCATION"), false);
  assert.equal(JSON.stringify(result.value).includes("UNIVERSITY"), false);
});

test("parseResume: section order doesn't matter (quickstart #13)", () => {
  const result = parseResume(sectionOrder as DocLine[]);

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.value.about, "Engineer with 5 years of experience building things.");
  assert.equal(result.value.experience?.length, 1);
  assert.equal(result.value.experience?.[0]?.name, "ACME CORP");
});
