import assert from "node:assert/strict";
import { test } from "node:test";
import { persistTheme, readStoredTheme, resolveTheme } from "../../src/lib/theme.js";

test("resolveTheme: no stored value falls back to OS preference (dark)", () => {
  assert.equal(resolveTheme(null, true), "dark");
});

test("resolveTheme: no stored value falls back to OS preference (light)", () => {
  assert.equal(resolveTheme(null, false), "light");
});

test("resolveTheme: a persisted value always wins over the OS preference", () => {
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
});

test("readStoredTheme: returns the stored value when it is a valid theme", () => {
  const storage = { getItem: () => "dark" };
  assert.equal(readStoredTheme(storage), "dark");
});

test("readStoredTheme: returns null when nothing is stored", () => {
  const storage = { getItem: () => null };
  assert.equal(readStoredTheme(storage), null);
});

test("readStoredTheme: returns null (not throw) when getItem throws", () => {
  const storage = {
    getItem: () => {
      throw new Error("storage disabled");
    },
  };
  assert.doesNotThrow(() => readStoredTheme(storage));
  assert.equal(readStoredTheme(storage), null);
});

test("persistTheme: does not throw when setItem throws", () => {
  const storage = {
    setItem: () => {
      throw new Error("storage disabled");
    },
  };
  assert.doesNotThrow(() => persistTheme(storage, "dark"));
});
