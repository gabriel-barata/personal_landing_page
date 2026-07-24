import type { DocLine } from "../domain/doc-line.js";

/**
 * The minimal shape this adapter needs from a Google Docs API response
 * (`docs_v1.Schema$Document`). Defined locally, not imported from
 * `googleapis`, so the domain-facing conversion stays testable with plain
 * JSON fixtures and decoupled from the SDK's full type surface
 * (research.md #3). The real response is structurally compatible.
 */
export interface RawDocument {
  body?: {
    content?: RawStructuralElement[];
  };
}

interface RawStructuralElement {
  paragraph?: RawParagraph;
}

interface RawParagraph {
  paragraphStyle?: { namedStyleType?: string | null };
  bullet?: unknown;
  elements?: { textRun?: { content?: string | null } | null }[];
}

const HEADING_LEVEL_BY_STYLE: Record<string, 0 | 1 | 2> = {
  HEADING_1: 1,
  HEADING_2: 2,
};

/**
 * Raw Google Docs API response -> DocLine[] (data-model.md "Pipeline data
 * flow"). One DocLine per paragraph, in document order; anything that isn't
 * a paragraph (e.g. a section break) is skipped.
 */
export function docLinesFromResponse(document: RawDocument): DocLine[] {
  const content = document.body?.content ?? [];

  return content
    .filter(
      (element): element is RawStructuralElement & { paragraph: RawParagraph } =>
        element.paragraph !== undefined,
    )
    .map((element) => toDocLine(element.paragraph));
}

function toDocLine(paragraph: RawParagraph): DocLine {
  const text = (paragraph.elements ?? [])
    .map((element) => element.textRun?.content ?? "")
    .join("")
    .replace(/\n$/, "");

  const namedStyleType = paragraph.paragraphStyle?.namedStyleType ?? "NORMAL_TEXT";
  const headingLevel = HEADING_LEVEL_BY_STYLE[namedStyleType] ?? 0;

  return {
    text,
    headingLevel,
    bullet: paragraph.bullet !== undefined,
  };
}
