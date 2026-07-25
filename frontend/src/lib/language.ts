export type Language = "en" | "pt";
export type StoredLanguage = Language | null;

const STORAGE_KEY = "resume:lang";
const DEFAULT_LANGUAGE: Language = "en";

export function resolveLanguage(stored: StoredLanguage): Language {
  return stored ?? DEFAULT_LANGUAGE;
}

export function readStoredLanguage(storage: Pick<Storage, "getItem">): StoredLanguage {
  try {
    const value = storage.getItem(STORAGE_KEY);
    return value === "en" || value === "pt" ? value : null;
  } catch {
    return null;
  }
}

export function persistLanguage(storage: Pick<Storage, "setItem">, lang: Language): void {
  try {
    storage.setItem(STORAGE_KEY, lang);
  } catch {
    // storage disabled/cleared — no-op (Constitution Principle III)
  }
}
