/**
 * Minimal local Result type — predictable failures are values, not thrown
 * exceptions (Constitution Principle III; data-model.md `Result`).
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; errors: E[] };
