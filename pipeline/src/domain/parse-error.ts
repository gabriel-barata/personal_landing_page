/**
 * One reason the assembled data doesn't fit the `schema/` data model, tied
 * to where in the Doc it came from (FR-011, data-model.md `ParseError`).
 */
export interface ParseError {
  /** Human-readable location, e.g. `EXPERIENCE > "ACME CORP" > role 2`. */
  path: string;
  /** What's wrong, e.g. "role has no achievement bullets". */
  message: string;
}
