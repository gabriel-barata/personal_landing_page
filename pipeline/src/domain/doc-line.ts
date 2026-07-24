/**
 * The neutral, Google-agnostic representation the domain parses. One entry
 * per paragraph in the Doc, in document order (data-model.md `DocLine`).
 */
export interface DocLine {
  /** Plain text of the paragraph, with the Doc's own trailing newline removed. */
  text: string;
  /**
   * 0 = body text (`NORMAL_TEXT`); 1 = a top-level section heading (e.g.
   * "ABOUT", "EXPERIENCE"); 2 = an employer heading within a section.
   */
  headingLevel: 0 | 1 | 2;
  /** true for a bulleted list item (an achievement line). */
  bullet: boolean;
}
