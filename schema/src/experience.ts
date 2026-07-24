import type { DatePart } from "./date.js";

/** A single position (or client engagement) held within one EmployerEntry. */
export interface Role {
  title: string;
  /** Named client/engagement, distinct from the employer (FR-007). */
  client?: string;
  startDate: DatePart;
  /** Absent = still ongoing (FR-006); present = concluded. */
  endDate?: DatePart;
  /** One or more plain-text bullets (FR-005, FR-008). */
  achievements: [string, ...string[]];
}

/** A single organization the candidate worked for. */
export interface EmployerEntry {
  name: string;
  /** Single free-text string, e.g. "London, UK", "Remote" (FR-003). */
  location: string;
  /** Reverse-chronological: most recent role first (FR-011). */
  roles: [Role, ...Role[]];
}

/** Reverse-chronological: most recent employer first (FR-011). */
export type Experience = [EmployerEntry, ...EmployerEntry[]];
