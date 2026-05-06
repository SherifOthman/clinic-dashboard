/**
 * Converts a 24-hour "HH:mm" string to a 12-hour "h:mm AM/PM" string.
 * Returns the original string unchanged if it can't be parsed.
 */
export function to12h(time24: string | null | undefined): string {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return time24;
  const period = h < 12 ? "AM" : "PM";
  const h12    = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}
