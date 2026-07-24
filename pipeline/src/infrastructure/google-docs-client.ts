import { google, type docs_v1 } from "googleapis";

/**
 * Fetches the resume Google Doc via the Docs API (decision 4). Unchanged
 * behavior from the pipeline's original fetch-only step — extracted here so
 * `index.ts` can compose it with parsing/writing (plan.md Project Structure).
 */
export async function fetchResumeDocument(): Promise<docs_v1.Schema$Document> {
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

  return data;
}
