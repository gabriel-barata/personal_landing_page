/** 1-12, enforced by the compiler (FR-005, FR-006). */
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface DatePart {
  month: Month;
  year: number;
}
