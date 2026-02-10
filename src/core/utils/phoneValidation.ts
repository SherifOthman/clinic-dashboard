import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export function createPhoneNumberSchema(t: (key: string) => string) {
  return z
    .string()
    .min(1, { message: t("validation.required") })
    .refine(
      (value) => {
        try {
          return isValidPhoneNumber(value);
        } catch {
          return false;
        }
      },
      { message: t("validation.phoneNumber") },
    );
}

export function createOptionalPhoneNumberSchema(t: (key: string) => string) {
  return z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value === "") return true;
        try {
          return isValidPhoneNumber(value);
        } catch {
          return false;
        }
      },
      { message: t("validation.phoneNumber") },
    );
}

export function formatPhoneNumber(phoneNumber: string): string | undefined {
  try {
    const parsed = parsePhoneNumber(phoneNumber);
    return parsed?.formatInternational();
  } catch {
    return undefined;
  }
}
