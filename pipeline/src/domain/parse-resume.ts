import type { ResumeBody } from "schema";
import type { DocLine } from "./doc-line.js";
import { parseAbout } from "./parse-about.js";
import { parseExperience } from "./parse-experience.js";
import type { ParseError } from "./parse-error.js";
import type { Result } from "./result.js";

/**
 * DocLine[] -> a ResumeBody that fits schema/'s data model, or every way it
 * doesn't. Combines parseAbout() and parseExperience(); ok: false exactly
 * when parseExperience()'s is, since About can't fail (FR-009, FR-010,
 * FR-013; data-model.md "Parsing entity relationships").
 */
export function parseResume(lines: DocLine[]): Result<ResumeBody, ParseError> {
  const about = parseAbout(lines);
  const experienceResult = parseExperience(lines);

  if (!experienceResult.ok) {
    return experienceResult;
  }

  const value: ResumeBody = {
    ...(about !== undefined ? { about } : {}),
    ...(experienceResult.value !== undefined
      ? { experience: experienceResult.value }
      : {}),
  };

  return { ok: true, value };
}
