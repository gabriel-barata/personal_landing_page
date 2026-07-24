import assert from "node:assert/strict";
import { test } from "node:test";
import type { DocLine } from "../src/domain/doc-line.js";
import { parseAbout } from "../src/domain/parse-about.js";
import narrative from "./fixtures/about-narrative.json" with { type: "json" };
import missing from "./fixtures/about-missing.json" with { type: "json" };

test("parseAbout: returns the narrative paragraph unsplit (quickstart #5)", () => {
  const result = parseAbout(narrative as DocLine[]);

  assert.equal(result, "Engineer with 5 years of experience building things.");
});

test("parseAbout: returns undefined when there's no ABOUT heading (quickstart #6)", () => {
  const result = parseAbout(missing as DocLine[]);

  assert.equal(result, undefined);
});
