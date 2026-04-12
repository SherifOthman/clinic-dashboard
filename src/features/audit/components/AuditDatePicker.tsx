import { Calendar, DateField, DatePicker, Label } from "@heroui/react";
import type { DateValue } from "@internationalized/date";
import { I18nProvider } from "react-aria-components";

interface AuditDatePickerProps {
  label: string;
  value: DateValue | null;
  onChange: (value: DateValue | null) => void;
}

export function AuditDatePicker({
  label,
  value,
  onChange,
}: AuditDatePickerProps) {
  return (
    <I18nProvider locale="en-GB">
      <DatePicker
        className="w-full"
        shouldForceLeadingZeros
        value={value}
        onChange={onChange}
      >
        <Label>{label}</Label>
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
        <DatePicker.Popover>
          <Calendar aria-label={label}>
            <Calendar.Header>
              <Calendar.YearPickerTrigger>
                <Calendar.YearPickerTriggerHeading />
                <Calendar.YearPickerTriggerIndicator />
              </Calendar.YearPickerTrigger>
              <Calendar.NavButton slot="previous" />
              <Calendar.NavButton slot="next" />
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

