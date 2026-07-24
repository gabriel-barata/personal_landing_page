// Entry point for `pnpm --filter pipeline generate`.
//
// Current step: fetch the raw Docs API response for the resume Doc and
// write it to tmp/raw-doc.json for inspection. Parsing into the shared
// `schema` package's resume shape is a later step (see
// docs/architecture-decisions.md, decisions 2-8).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { google } from "googleapis";

const { GOOGLE_SERVICE_ACCOUNT_KEY, GOOGLE_DOC_ID } = process.env;

if (!GOOGLE_SERVICE_ACCOUNT_KEY || !GOOGLE_DOC_ID) {
  throw new Error(
    "Missing GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_DOC_ID in the environment.",
  );
}

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY),
  scopes: ["https://www.googleapis.com/auth/documents.readonly"],
});

const docs = google.docs({ version: "v1", auth });

const { data } = await docs.documents.get({ documentId: GOOGLE_DOC_ID });

const outputPath = "tmp/raw-doc.json";
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log(`Fetched Doc "${data.title}" -> ${outputPath}`);
