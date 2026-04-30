/**
 * Builds a URL query string from a plain object.
 * Skips keys with undefined, null, or empty-string values.
 *
 * Usage:
 *   buildQuery({ pageNumber: 1, role: "Doctor", search: "" })
 *   // → "?pageNumber=1&role=Doctor"
 */
export function buildQuery(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      q.set(key, String(value));
    }
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}
