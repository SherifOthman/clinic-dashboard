import type { TFunction } from "i18next";

/**
 * Simple utility to translate error messages
 * If message contains a dot, it's a translation key, otherwise return as-is
 */
export function translateError(
  message: string | undefined,
  t: TFunction,
): string | undefined {
  if (!message) return undefined;
  return message.includes(".") ? t(message) : message;
}
