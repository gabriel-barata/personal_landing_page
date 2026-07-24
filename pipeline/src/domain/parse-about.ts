import type { About } from "schema";
import type { DocLine } from "./doc-line.js";

const SECTION_HEADING = "ABOUT";

/**
 * DocLine[] -> the ABOUT section's narrative text, unsplit, or undefined
 * when there's no ABOUT heading or nothing follows it (FR-001;
 * contracts/doc-convention.md). Cannot fail — see data-model.md.
 */
export function parseAbout(lines: DocLine[]): About | undefined {
  const startIndex = lines.findIndex(
    (line) => line.headingLevel === 1 && line.text === SECTION_HEADING,
  );
  if (startIndex === -1) {
    return undefined;
  }

  let endIndex = lines.length;
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (lines[i]!.headingLevel === 1) {
      endIndex = i;
      break;
    }
  }

  const text = lines
    .slice(startIndex + 1, endIndex)
    .map((line) => line.text.trim())
    .filter((line) => line.length > 0)
    .join("\n\n");

  return text.length > 0 ? text : undefined;
}
