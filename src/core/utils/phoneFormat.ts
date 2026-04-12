import { parsePhoneNumber } from "libphonenumber-js/max";

/**
 * Returns the national number in readable format with spaces.
 * e.g. +201098021259 → "010 9802 1259"
 * Falls back to stripping the dial code if parsing fails.
 */
export function formatPhoneNational(e164: string): string {
  if (!e164) return e164;
  try {
    const parsed = parsePhoneNumber(e164);
    return parsed.formatNational(); // keeps libphonenumber spacing e.g. "010 9802 1259"
  } catch {
    return e164.replace(/^\+\d{1,3}\s?/, "");
  }
}

/**
 * Returns the number as: +{countryCode} {nationalNumber}
 * e.g. +201098021259 → "+20 01098021259"
 * The national number includes the leading zero.
 */
export function formatPhoneInternational(e164: string): string {
  if (!e164) return e164;
  try {
    const parsed = parsePhoneNumber(e164);
    const national = parsed.formatNational().replace(/\s|-|\(|\)/g, "");
    return `+${parsed.countryCallingCode} ${national}`;
  } catch {
    return e164;
  }
}
