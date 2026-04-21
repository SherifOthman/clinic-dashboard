/**
 * Formats a patient code for display.
 * Strips leading zeros: "0042" → "42", "0001" → "1"
 * The code is stored as a zero-padded string for StartsWith search,
 * but displayed as a plain number to users.
 */
export function formatPatientCode(code: string): string {
  return String(parseInt(code, 10));
}
