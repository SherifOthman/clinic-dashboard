import { isValidPhoneNumber } from "libphonenumber-js/max";

/**
 * Validates a phone number for a specific country
 * @param phoneNumber - Phone number in international format (e.g., +966501234567)
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., 'SA', 'EG', 'US')
 * @returns true if valid, error message if invalid
 */
export function validatePhoneNumber(
  phoneNumber: string,
  countryCode?: string,
): true | string {
  if (!phoneNumber || phoneNumber.trim() === "") {
    return "validation.phoneRequired";
  }

  const formattedPhone = phoneNumber.startsWith("+")
    ? phoneNumber
    : `+${phoneNumber}`;

  try {
    const isValid = isValidPhoneNumber(formattedPhone, countryCode as any);

    if (!isValid) {
      return "validation.phoneInvalid";
    }

    return true;
  } catch {
    return "validation.phoneInvalid";
  }
}
