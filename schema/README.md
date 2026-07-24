# schema

Shared TypeScript types for the resume data model, imported by both
`pipeline` and `frontend` as a workspace dependency (`workspace:*`).

The field-level schema (`experience[]`, `skills[]`, etc.) has not been
defined yet — see the "Open / deferred" section of
[docs/architecture-decisions.md](../docs/architecture-decisions.md).
This package is currently a placeholder so the workspace dependency exists
before that schema is designed.
