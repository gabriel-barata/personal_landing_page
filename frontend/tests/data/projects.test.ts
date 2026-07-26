import assert from "node:assert/strict";
import { test } from "node:test";
import { projects } from "../../src/data/projects.js";

test("projects: at least one entry", () => {
  assert.ok(projects.length > 0);
});

test("projects: every entry has a non-empty name and description", () => {
  for (const project of projects) {
    assert.ok(project.name.length > 0, `${project.id} has an empty name`);
    assert.ok(project.description.length > 0, `${project.id} has an empty description`);
  }
});

test("projects: every entry has at least one tech tag", () => {
  for (const project of projects) {
    assert.ok(project.tags.length > 0, `${project.id} has no tags`);
  }
});

test("projects: ids are unique", () => {
  const ids = projects.map((project) => project.id);
  assert.equal(new Set(ids).size, ids.length);
});
