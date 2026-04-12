import { DateFormatter } from "@internationalized/date";
import { useTranslation } from "react-i18next";

export function useDateFormat() {
  const { i18n } = useTranslation();
  // ar-EG: Arabic date format with Arabic-Indic digits (١١/٤/٢٠٢٦)
  const locale = i18n.language === "ar" ? "ar-EG" : "en-GB";

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const toDate = (date: Date | string | number): Date =>
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  const fmt = (
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions,
  ): string =>
    new DateFormatter(locale, { ...options, timeZone }).format(toDate(date));

  const formatDateShort = (date: Date | string | number): string =>
    fmt(date, { year: "numeric", month: "numeric", day: "numeric" });

  const formatDateOnly = formatDateShort;

  const formatDateLong = (date: Date | string | number): string =>
    fmt(date, { year: "numeric", month: "long", day: "numeric" });

  const formatDateTime = (date: Date | string | number): string =>
    fmt(date, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const formatTimeOnly = (date: Date | string | number): string =>
    fmt(date, { hour: "2-digit", minute: "2-digit", hour12: true });

  const formatDate = formatDateShort;

  return {
    formatDate,
    formatDateLong,
    formatDateShort,
    formatDateTime,
    formatDateOnly,
    formatTimeOnly,
  };
}
