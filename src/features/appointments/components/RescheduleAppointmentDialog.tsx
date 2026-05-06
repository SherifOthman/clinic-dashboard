import { Dialog } from "@/core/components/ui/Dialog";
import { AppDatePicker } from "@/core/components/ui/AppDatePicker";
import type { DateValue } from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@heroui/react";
import { CalendarClock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWorkingDays } from "@/features/staff/staffQueries";
import { useRescheduleAppointment } from "../appointmentsHooks";
import type { AppointmentDto } from "../types";

interface RescheduleAppointmentDialogProps {
  appointment: AppointmentDto | null;
  doctorMemberId: string | null;
  branchId: string | null;
  onClose: () => void;
}

/**
 * Lets the receptionist move a specific appointment to a future date.
 * Use case: doctor decides to see the last 5 patients tomorrow instead of today.
 * The appointment keeps its queue number; the date changes.
 */
export function RescheduleAppointmentDialog({
  appointment,
  doctorMemberId,
  branchId,
  onClose,
}: RescheduleAppointmentDialogProps) {
  const { t } = useTranslation();
  const reschedule = useRescheduleAppointment();

  const tomorrow = today(getLocalTimeZone()).add({ days: 1 });
  const [newDate, setNewDate] = useState<DateValue | null>(tomorrow);

  const { data: workingDays = [] } = useWorkingDays(doctorMemberId, branchId ?? undefined);
  const workingDayNumbers = new Set(workingDays.filter((d) => d.isAvailable).map((d) => d.day));

  const isDateUnavailable = (d: DateValue) => {
    // Can't pick today or past
    if (d.compare(today(getLocalTimeZone())) <= 0) return true;
    // Must be a working day
    const dow = d.toDate(getLocalTimeZone()).getDay();
    return workingDays.length > 0 && !workingDayNumbers.has(dow);
  };

  const handleSubmit = () => {
    if (!appointment || !newDate) return;
    const dateStr = `${newDate.year}-${String(newDate.month).padStart(2, "0")}-${String(newDate.day).padStart(2, "0")}`;
    reschedule.mutate({ appointmentId: appointment.id, newDate: dateStr }, { onSuccess: onClose });
  };

  const isOpen = !!appointment;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      ariaLabel={t("appointments.reschedulePatient")}
      header={
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
            <CalendarClock className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t("appointments.reschedulePatient")}</h2>
            <p className="text-sm text-muted">{appointment?.patientName}</p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">{t("appointments.reschedulePatientDesc")}</p>

        <AppDatePicker
          label={t("appointments.newDate")}
          value={newDate}
          onChange={setNewDate}
          minValue={today(getLocalTimeZone()).add({ days: 1 })}
          isDateUnavailable={isDateUnavailable}
          className="w-full"
        />

        {workingDays.length > 0 && (
          <p className="text-xs text-muted">
            {t("appointments.doctorWorksOn")}{" "}
            {workingDays
              .filter((d) => d.isAvailable)
              .map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.day])
              .join(", ")}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onPress={onClose}>{t("common.cancel")}</Button>
          <Button
            variant="primary"
            onPress={handleSubmit}
            isDisabled={!newDate}
            isPending={reschedule.isPending}
          >
            {t("appointments.rescheduleConfirm")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
