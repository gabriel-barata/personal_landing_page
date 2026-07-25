import assert from "node:assert/strict";
import { test } from "node:test";
import {
  persistLanguage,
  readStoredLanguage,
  resolveLanguage,
} from "../../src/lib/language.js";

test("resolveLanguage: no stored value defaults to English", () => {
  assert.equal(resolveLanguage(null), "en");
});

test("resolveLanguage: a stored value is returned as-is", () => {
  assert.equal(resolveLanguage("pt"), "pt");
});

test("readStoredLanguage: returns the stored value when it is a valid language", () => {
  const storage = { getItem: () => "pt" };
  assert.equal(readStoredLanguage(storage), "pt");
});

test("readStoredLanguage: returns null when nothing is stored", () => {
  const storage = { getItem: () => null };
  assert.equal(readStoredLanguage(storage), null);
});

test("readStoredLanguage: returns null (not throw) when getItem throws", () => {
  const storage = {
    getItem: () => {
      throw new Error("storage disabled");
    },
  };
  assert.doesNotThrow(() => readStoredLanguage(storage));
  assert.equal(readStoredLanguage(storage), null);
});

test("persistLanguage: does not throw when setItem throws", () => {
  const storage = {
    setItem: () => {
      throw new Error("storage disabled");
    },
  };
  assert.doesNotThrow(() => persistLanguage(storage, "pt"));
});
