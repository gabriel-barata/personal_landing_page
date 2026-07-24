import type { About } from "./about.js";
import type { Experience } from "./experience.js";

/**
 * `about` and `experience` are independent and each optional, so one can be
 * present without the other (FR-010).
 */
export interface ResumeBody {
  about?: About;
  experience?: Experience;
}
