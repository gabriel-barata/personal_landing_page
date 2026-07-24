import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ResumeBody } from "schema";

/**
 * Writes a validated ResumeBody to resume.json at the repo root (decision
 * 7). Only ever called on a successful Result — a failed run never calls
 * this, so any existing file is left untouched (contracts/pipeline-cli.md).
 */
export function writeResume(resume: ResumeBody): void {
  const outputPath = resolve(process.cwd(), "..", "resume.json");
  writeFileSync(outputPath, `${JSON.stringify(resume, null, 2)}\n`);
}
