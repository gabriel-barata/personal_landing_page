// Compresses a stored "Mon YYYY" date string (e.g. "Mar 2025") down to
// "Mon 'YY" (e.g. "Mar '25") for display — the timeline's date column is
// too narrow for the full year. "Present" and anything not matching the
// expected shape (e.g. a bare "2020") pass through unchanged.
export function formatExperienceDate(value: string): string {
  const match = value.match(/^([A-Za-z]{3}) (\d{4})$/);
  if (!match) return value;
  const [, month, year] = match;
  return `${month} '${year.slice(2)}`;
}
