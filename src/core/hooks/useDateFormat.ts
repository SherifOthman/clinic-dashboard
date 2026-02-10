import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

// Function to convert Western numerals to Arabic numerals
const toArabicNumerals = (str: string): string => {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return str.replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
};

export function useDateFormat() {
  const { i18n } = useTranslation();

  const formatDate = (
    date: Date | string | number,
    formatString: string = "dd/MM/yyyy",
  ): string => {
    const dateObj =
      typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date;

    const locale = i18n.language === "ar" ? ar : enUS;
    const formattedDate = format(dateObj, formatString, { locale });

    // Convert to Arabic numerals if language is Arabic
    return i18n.language === "ar"
      ? toArabicNumerals(formattedDate)
      : formattedDate;
  };

  const formatDateLong = (date: Date | string | number): string => {
    const formatString =
      i18n.language === "ar"
        ? "dd MMMM yyyy" // Arabic: "15 يناير 2024" -> "١٥ يناير ٢٠٢٤"
        : "MMMM dd, yyyy"; // English: "January 15, 2024"

    return formatDate(date, formatString);
  };

  const formatDateShort = (date: Date | string | number): string => {
    const formatString =
      i18n.language === "ar"
        ? "yyyy/MM/dd" // Arabic: "٢٠٢٦/٠١/٢٨" (reads RTL as day/month/year)
        : "dd/MM/yyyy"; // English: "28/01/2026"

    return formatDate(date, formatString);
  };

  const formatDateTime = (date: Date | string | number): string => {
    const formatString =
      i18n.language === "ar"
        ? "yyyy/MM/dd HH:mm" // Arabic format: "٢٠٢٦/٠١/٢٨ ١٤:٣٠"
        : "MM/dd/yyyy HH:mm"; // English format: "01/28/2026 14:30"

    return formatDate(date, formatString);
  };

  return {
    formatDate,
    formatDateLong,
    formatDateShort,
    formatDateTime,
  };
}
