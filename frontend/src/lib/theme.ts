export type Theme = "light" | "dark";
export type StoredTheme = Theme | null;

const STORAGE_KEY = "resume:theme";

export function resolveTheme(stored: StoredTheme, prefersDark: boolean): Theme {
  if (stored !== null) {
    return stored;
  }
  return prefersDark ? "dark" : "light";
}

export function readStoredTheme(storage: Pick<Storage, "getItem">): StoredTheme {
  try {
    const value = storage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function persistTheme(storage: Pick<Storage, "setItem">, theme: Theme): void {
  try {
    storage.setItem(STORAGE_KEY, theme);
  } catch {
    // storage disabled/cleared — no-op (Constitution Principle III)
  }
}
