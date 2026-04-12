/**
 * Returns the localized value based on the current language direction.
 * Prefers Arabic when RTL, English when LTR, with fallback to the other.
 *
 * Usage:
 *   const name = getLocalizedValue(isRTL, item.nameAr, item.nameEn);
 */
export function getLocalizedValue(
  isRTL: boolean,
  ar: string | null | undefined,
  en: string | null | undefined,
): string | undefined {
  return isRTL ? (ar ?? en ?? undefined) : (en ?? ar ?? undefined);
}
