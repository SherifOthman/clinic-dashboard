/**
 * AuditDatePicker — thin wrapper around AppDatePicker for the audit filters.
 * Kept as a named export so existing imports don't need to change.
 */
import { AppDatePicker } from "@/core/components/ui/AppDatePicker";
import type { DateValue } from "@internationalized/date";

interface AuditDatePickerProps {
  label: string;
  value: DateValue | null;
  onChange: (value: DateValue | null) => void;
}

export function AuditDatePicker({ label, value, onChange }: AuditDatePickerProps) {
  return (
    <AppDatePicker
      label={label}
      value={value}
      onChange={onChange}
      className="w-full"
    />
  );
}
