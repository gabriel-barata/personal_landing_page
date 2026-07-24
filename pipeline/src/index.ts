// Entry point for `pnpm --filter pipeline generate`.
//
// Intended flow (see docs/architecture-decisions.md, decisions 2-8):
//   1. Authenticate to the Google Docs API with the service account
//      credentials in GOOGLE_SERVICE_ACCOUNT_KEY.
//   2. Fetch the document identified by GOOGLE_DOC_ID via `googleapis`.
//   3. Parse it into the shared `schema` package's resume shape.
//   4. Write the result to resume.json for the frontend to read at build time.
//
// Not implemented yet — this is a placeholder so the workspace, script, and
// GitHub Actions wiring exist ahead of the actual parsing logic.

throw new Error("pipeline: not implemented yet");
