const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Converts Western (0-9) digits to Arabic-Indic (٠-٩) digits */
export function toArabicNumerals(str: string): string {
  return str.replace(/[0-9]/g, (d) => ARABIC_DIGITS[parseInt(d)]);
}
