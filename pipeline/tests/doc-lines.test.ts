import assert from "node:assert/strict";
import { test } from "node:test";
import { docLinesFromResponse } from "../src/infrastructure/doc-lines.js";
import sample from "./fixtures/raw-doc-response-sample.json" with { type: "json" };

test("docLinesFromResponse: flattens a raw Docs API response into DocLine[]", () => {
  const lines = docLinesFromResponse(sample);

  assert.deepEqual(lines, [
    { text: "EXPERIENCE", headingLevel: 1, bullet: false },
    { text: "ACME CORP\tRemote", headingLevel: 2, bullet: false },
    { text: "Engineer\t01/2023 - Present", headingLevel: 0, bullet: false },
    { text: "Did a thing", headingLevel: 0, bullet: true },
  ]);
});
