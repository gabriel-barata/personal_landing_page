// Entry point for `pnpm --filter pipeline generate` — the composition root
// (Constitution Principle I): fetch the resume Google Doc, adapt it into
// the domain's neutral DocLine[], parse/validate it against schema/'s
// ResumeBody, then either write resume.json or report every way the Doc
// doesn't fit, per contracts/pipeline-cli.md.

import { parseResume } from "./domain/parse-resume.js";
import { docLinesFromResponse } from "./infrastructure/doc-lines.js";
import { fetchResumeDocument } from "./infrastructure/google-docs-client.js";
import { writeResume } from "./infrastructure/resume-writer.js";

const document = await fetchResumeDocument();
const lines = docLinesFromResponse(document);
const result = parseResume(lines);

if (!result.ok) {
  console.error("Resume Doc does not fit the schema/ data model:");
  for (const error of result.errors) {
    console.error(`  ${error.path}: ${error.message}`);
  }
  process.exitCode = 1;
} else {
  writeResume(result.value);
  console.log(`Fetched Doc "${document.title}" -> resume.json`);
}
