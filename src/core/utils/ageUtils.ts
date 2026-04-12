import { toArabicNumerals } from "@/core/utils/arabicNumerals";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  parseISO,
  startOfDay,
} from "date-fns";

/** Shape of the detailed age result */
export interface DetailedAge {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

/**
 * Safely parse a date of birth.
 * Ensures "YYYY-MM-DD" is treated as a local date (not UTC).
 */
function parseBirthDate(input: string | Date): Date {
  if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return parseISO(input);
  }
  return new Date(input);
}

/**
 * Normalize a date to the start of the day (00:00:00)
 * This avoids time-related calculation errors.
 */
function normalize(date: Date): Date {
  return startOfDay(date);
}

/**
 * Calculate detailed age (years, months, days, totalDays)
 */
export function calculateDetailedAge(dateOfBirth: string | Date): DetailedAge {
  if (!dateOfBirth) {
    return { years: 0, months: 0, days: 0, totalDays: 0 };
  }

  const today = normalize(new Date());
  const birth = normalize(parseBirthDate(dateOfBirth));

  // Total days (simple difference)
  const totalDays = differenceInDays(today, birth);

  // We'll move forward from birth step-by-step
  let cursor = new Date(birth);

  // 1) Calculate years
  const years = differenceInYears(today, cursor);
  cursor.setFullYear(cursor.getFullYear() + years);

  // 2) Calculate months after removing years
  const months = differenceInMonths(today, cursor);
  cursor.setMonth(cursor.getMonth() + months);

  // 3) Remaining days
  const days = differenceInDays(today, cursor);

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalDays: Math.max(0, totalDays),
  };
}

/**
 * Calculate simple age in years only
 */
export function calculateAge(dateOfBirth: string | Date): number {
  const today = normalize(new Date());
  const birth = normalize(parseBirthDate(dateOfBirth));

  return differenceInYears(today, birth);
}

/**
 * Format age for UI (medical-friendly)
 */
export function formatDetailedAge(age: DetailedAge, isAr = false): string {
  const { years, months, days, totalDays } = age;

  if (totalDays === 0) {
    return isAr ? "حديث الولادة" : "Newborn";
  }

  const formatNumber = (n: number) =>
    isAr ? toArabicNumerals(String(n)) : String(n);

  // ---------------- Arabic ----------------
  if (isAr) {
    // < 1 month → days
    if (years === 0 && months === 0) {
      return `${formatNumber(days)} ${
        days === 1 ? "يوم" : days <= 10 ? "أيام" : "يوم"
      }`;
    }

    // < 1 year → months + optional days
    if (years === 0) {
      const monthText = `${formatNumber(
        months,
      )} ${months === 1 ? "شهر" : months <= 10 ? "أشهر" : "شهراً"}`;

      if (days > 0) {
        return `${monthText} ${formatNumber(days)} ${
          days === 1 ? "يوم" : days <= 10 ? "أيام" : "يوم"
        }`;
      }

      return monthText;
    }

    // 1–2 years → years + optional months
    if (years <= 2) {
      const yearText = years === 1 ? "سنة" : `${formatNumber(years)} سنوات`;

      if (months > 0) {
        return `${yearText} ${formatNumber(months)} ${
          months === 1 ? "شهر" : months <= 10 ? "أشهر" : "شهراً"
        }`;
      }

      return yearText;
    }

    // > 2 years → years only
    return `${formatNumber(years)} ${years <= 10 ? "سنوات" : "سنة"}`;
  }

  // ---------------- English ----------------

  // < 1 month → days
  if (years === 0 && months === 0) {
    return `${days} ${days === 1 ? "day" : "days"}`;
  }

  // < 1 year → months + optional days
  if (years === 0) {
    const monthText = `${months} ${months === 1 ? "month" : "months"}`;

    if (days > 0) {
      return `${monthText} ${days} ${days === 1 ? "day" : "days"}`;
    }

    return monthText;
  }

  // 1–2 years → years + optional months
  if (years <= 2) {
    const yearText = `${years} ${years === 1 ? "year" : "years"}`;

    if (months > 0) {
      return `${yearText} ${months} ${months === 1 ? "month" : "months"}`;
    }

    return yearText;
  }

  // > 2 years → years only
  return `${years} years`;
}
