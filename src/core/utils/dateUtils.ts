/**
 * Returns today's date as a "YYYY-MM-DD" string in local time.
 * Used wherever the API expects a date parameter for "today".
 */
export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
