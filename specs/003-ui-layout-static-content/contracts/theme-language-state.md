# Contract: Theme / Language Client State

Three independent pieces of code must agree on this contract without
importing each other's implementation: the inline `<head>` bootstrap script
(`research.md` #6), the two toggle islands (`ThemeToggle.astro`,
`LanguageToggle.astro`), and `src/styles/tokens.css`.

## `localStorage` keys

| Key | Values | Set by |
|---|---|---|
| `resume:theme` | `"light"` \| `"dark"` | `ThemeToggle.astro`, on user click (FR-015) |
| `resume:lang` | `"en"` \| `"pt"` | `LanguageToggle.astro`, on user click (FR-014) |

Absence of a key (or a read failure — storage disabled/cleared, spec Edge
Cases) means "no manual override yet" — never written as an explicit
sentinel value. Reads/writes MUST go through `lib/theme.ts`'s /
`lib/language.ts`'s wrapped helpers (`data-model.md`), which catch storage
exceptions and return/no-op instead of throwing (Constitution Principle
III).

## `<html>` element attributes

| Attribute | Values | Set by | Consumed by |
|---|---|---|---|
| `data-theme` | `"light"` \| `"dark"` | Inline bootstrap script (initial paint), `ThemeToggle.astro` (on click) | `tokens.css` (`:root[data-theme="dark"] { ... }` overrides) |
| `data-lang` | `"en"` \| `"pt"` | Inline bootstrap script (initial paint), `LanguageToggle.astro` (on click) | Components that render language-dependent strings |

Both attributes MUST be set synchronously, before first paint, by the inline
bootstrap script — this is what avoids a flash of the wrong theme
(`research.md` #6). Neither attribute is ever left unset: the bootstrap
script always resolves to a concrete `"light"`/`"dark"` and `"en"`/`"pt"`
value via `resolveTheme`/`resolveLanguage` (`data-model.md`), even with no
stored preference.

## Resolution precedence (implemented once, in `lib/theme.ts` / `lib/language.ts`)

- **Theme**: `resolveTheme(storedTheme, prefersDark)` → `storedTheme` if not
  `null`, else `prefersDark ? 'dark' : 'light'` (FR-015).
- **Language**: `resolveLanguage(storedLang)` → `storedLang` if not `null`,
  else `'en'` (FR-014's Edge Case default — no OS signal for language).

## Toggle behavior contract (FR-014, FR-016)

- Clicking the inactive option in either toggle: (1) persists the new value
  via the wrapped `localStorage` helper, (2) sets the corresponding `<html>`
  attribute directly (no re-resolution needed — the click *is* the new
  source of truth), (3) applies with **no transition/crossfade** for theme
  (FR-016) — `tokens.css` MUST NOT put `data-theme` changes behind a
  `transition` property on root-level custom properties.
- The toggle's own active/inactive label coloring (ink vs. support-gray) is
  a pure function of the current `data-theme`/`data-lang` attribute — no
  separate state needed in the island beyond what's already on `<html>`.
