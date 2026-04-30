/**
 * AppDatePicker — single shared date picker for the entire app.
 *
 * Includes a week-start-day selector inside the calendar popover,
 * matching the same pattern used in WorkingDaysEditor.
 *
 * The first day of week is controlled by appending the Unicode
 * locale extension `-u-fw-<day>` to the I18nProvider locale:
 *   sun → Sunday, mon → Monday, sat → Saturday, etc.
 *
 * RTL: I18nProvider with locale="ar-EG" makes React Aria automatically
 *   flip the calendar grid direction, swap nav button positions,
 *   and format numbers/month names in Arabic.
 */

import {
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  Label,
} from "@heroui/react";
import type { DateValue } from "@internationalized/date";
import { useState } from "react";
import { I18nProvider } from "react-aria-components";
import { useTranslation } from "react-i18next";

// Day index → Unicode fw tag
const FW_TAGS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

// Short day labels for the selector buttons (locale-aware)
function shortDayLabel(day: number, locale: string): string {
  const date = new Date(2024, 0, 7 + day); // 2024-01-07 = Sunday
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
}

interface AppDatePickerProps {
  label?: string;
  value: DateValue | null;
  onChange: (value: DateValue | null) => void;
  minValue?: DateValue;
  maxValue?: DateValue;
  isDateUnavailable?: (date: DateValue) => boolean;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  /** Tailwind classes on the root DatePicker — default gives a sensible min-width */
  className?: string;
  ariaLabel?: string;
  /** Hide the week-start-day selector (e.g. when space is tight) */
  hideWeekStartSelector?: boolean;
}

export function AppDatePicker({
  label,
  value,
  onChange,
  minValue,
  maxValue,
  isDateUnavailable,
  errorMessage,
  isInvalid,
  isDisabled,
  className = "w-full min-w-[11rem]",
  ariaLabel,
  hideWeekStartSelector = false,
}: AppDatePickerProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const baseLocale = isAr ? "ar-EG" : "en-GB";
  const calLabel = ariaLabel ?? label ?? "Date";

  // Default to Saturday (6) — common in Middle-East clinics
  const [weekStartDay, setWeekStartDay] = useState<number>(6);

  // Build locale string with Unicode first-day-of-week extension
  const locale = `${baseLocale}-u-fw-${FW_TAGS[weekStartDay]}`;

  return (
    <I18nProvider locale={locale}>
      <DatePicker
        value={value}
        onChange={onChange}
        minValue={minValue}
        maxValue={maxValue}
        isDateUnavailable={isDateUnavailable}
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        shouldForceLeadingZeros
        className={className}
      >
        {label && <Label>{label}</Label>}

        {/* fullWidth is required — without it the input collapses */}
        <DateField.Group fullWidth>
          <DateField.Input>
            {(seg) => <DateField.Segment segment={seg} />}
          </DateField.Input>
          <DateField.Suffix>
            <DatePicker.Trigger>
              <DatePicker.TriggerIndicator />
            </DatePicker.Trigger>
          </DateField.Suffix>
        </DateField.Group>

        {isInvalid && errorMessage && (
          <FieldError>{errorMessage}</FieldError>
        )}

        <DatePicker.Popover className="min-w-[320px]">
          <Calendar aria-label={calLabel}>
            <Calendar.Header>
              <Calendar.YearPickerTrigger>
                <Calendar.YearPickerTriggerHeading />
                <Calendar.YearPickerTriggerIndicator
                  className={isAr ? "rotate-180" : ""}
                />
              </Calendar.YearPickerTrigger>

              {/* In RTL: next on left, previous on right */}
              {isAr ? (
                <>
                  <Calendar.NavButton slot="next" />
                  <Calendar.NavButton slot="previous" />
                </>
              ) : (
                <>
                  <Calendar.NavButton slot="previous" />
                  <Calendar.NavButton slot="next" />
                </>
              )}
            </Calendar.Header>

            <Calendar.Grid>
              <Calendar.GridHeader>
                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
              </Calendar.GridHeader>
              <Calendar.GridBody>
                {(date) => <Calendar.Cell date={date} />}
              </Calendar.GridBody>
            </Calendar.Grid>

            <Calendar.YearPickerGrid>
              <Calendar.YearPickerGridBody>
                {({ year }) => <Calendar.YearPickerCell year={year} />}
              </Calendar.YearPickerGridBody>
            </Calendar.YearPickerGrid>
          </Calendar>

          {/* ── Week-start-day selector ─────────────────────────────────── */}
          {!hideWeekStartSelector && (
            <div className="border-divider flex items-center justify-between border-t px-3 py-2">
              <span className="text-default-400 text-xs">
                {t("staff.weekStartDay")}
              </span>
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setWeekStartDay(d)}
                    className={`rounded px-1.5 py-0.5 text-xs font-medium transition-all ${
                      weekStartDay === d
                        ? "bg-accent text-white"
                        : "text-default-500 hover:bg-default-100"
                    }`}
                  >
                    {shortDayLabel(d, baseLocale)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </DatePicker.Popover>
      </DatePicker>
    </I18nProvider>
  );
}
