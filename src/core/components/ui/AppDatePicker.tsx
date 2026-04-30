/**
 * AppDatePicker — single shared date picker for the entire app.
 *
 * The first day of week is driven by the clinic's WeekStartDay setting
 * (set by the clinic owner in Settings). No per-instance selector.
 *
 * The Unicode locale extension `-u-fw-<day>` controls the calendar grid:
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
import { I18nProvider } from "react-aria-components";
import { useTranslation } from "react-i18next";
import { useWeekStartDay } from "@/core/hooks/useWeekStartDay";

// Day index → Unicode fw tag
const FW_TAGS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

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
  /** Tailwind classes on the root DatePicker */
  className?: string;
  ariaLabel?: string;
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
}: AppDatePickerProps) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const baseLocale = isAr ? "ar-EG" : "en-GB";
  const calLabel = ariaLabel ?? label ?? "Date";

  // Read week start day from clinic settings (via /me response)
  const weekStartDay = useWeekStartDay();
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
        </DatePicker.Popover>
      </DatePicker>
    </I18nProvider>
  );
}
