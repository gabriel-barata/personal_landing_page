import assert from "node:assert/strict";
import { test } from "node:test";
import { nextFocusIndex } from "../../src/lib/experience-panel.js";

test("nextFocusIndex: Shift+Tab from the first control wraps to the last", () => {
  assert.equal(nextFocusIndex(0, 3, -1), 2);
});

test("nextFocusIndex: Tab from the last control wraps to the first", () => {
  assert.equal(nextFocusIndex(2, 3, 1), 0);
});

test("nextFocusIndex: no wrap needed mid-list", () => {
  assert.equal(nextFocusIndex(1, 3, 1), 2);
  assert.equal(nextFocusIndex(1, 3, -1), 0);
});

test("nextFocusIndex: single-control panel stays put on Tab", () => {
  assert.equal(nextFocusIndex(0, 1, 1), 0);
});
