import { Dialog } from "@/core/components/ui/Dialog";
import { Button } from "@heroui/react";
import { CalendarX2, RefreshCw, UserX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBulkCancelAppointments, useRescheduleDoctorAppointments } from "../appointmentsHooks";

interface DoctorAbsentDialogProps {
  isOpen: boolean;
  doctorInfoId: string;
  branchId: string;
  dateStr: string;
  doctorName: string;
  appointmentCount: number;
  onClose: () => void;
}

/**
 * Shown when the receptionist marks a doctor as absent for the day.
 * Offers two options:
 *   1. Cancel all today's appointments (patients will be notified to rebook)
 *   2. Reschedule all appointments to the next available working days
 */
export function DoctorAbsentDialog({
  isOpen,
  doctorInfoId,
  branchId,
  dateStr,
  doctorName,
  appointmentCount,
  onClose,
}: DoctorAbsentDialogProps) {
  const { t } = useTranslation();
  const bulkCancel   = useBulkCancelAppointments();
  const reschedule   = useRescheduleDoctorAppointments();
  const isPending    = bulkCancel.isPending || reschedule.isPending;

  const handleCancel = () => {
    bulkCancel.mutate({ doctorInfoId, branchId, date: dateStr }, { onSuccess: onClose });
  };

  const handleReschedule = () => {
    reschedule.mutate({ doctorInfoId, branchId, date: dateStr }, { onSuccess: onClose });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      ariaLabel={t("appointments.doctorAbsent")}
      header={
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/10">
            <UserX className="h-5 w-5 text-danger" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t("appointments.doctorAbsent")}</h2>
            <p className="text-sm text-muted">{doctorName}</p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Info */}
        <div className="rounded-lg bg-danger/5 border border-danger/20 px-4 py-3">
          <p className="text-sm text-danger font-medium">
            {t("appointments.doctorAbsentInfo", { count: appointmentCount })}
          </p>
        </div>

        <p className="text-sm text-muted">{t("appointments.doctorAbsentChoose")}</p>

        {/* Option 1: Cancel all */}
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className="flex items-start gap-4 rounded-xl border border-border bg-surface p-4 text-start transition hover:border-danger hover:bg-danger/5 disabled:opacity-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10">
            <CalendarX2 className="h-5 w-5 text-danger" />
          </div>
          <div>
            <p className="font-semibold">{t("appointments.cancelAllToday")}</p>
            <p className="text-sm text-muted">{t("appointments.cancelAllTodayDesc")}</p>
          </div>
        </button>

        {/* Option 2: Reschedule to next available days */}
        <button
          type="button"
          onClick={handleReschedule}
          disabled={isPending}
          className="flex items-start gap-4 rounded-xl border border-border bg-surface p-4 text-start transition hover:border-accent hover:bg-accent/5 disabled:opacity-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
            <RefreshCw className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold">{t("appointments.rescheduleAll")}</p>
            <p className="text-sm text-muted">{t("appointments.rescheduleAllDesc")}</p>
          </div>
        </button>

        <Button variant="ghost" onPress={onClose} isDisabled={isPending} className="self-end">
          {t("common.cancel")}
        </Button>
      </div>
    </Dialog>
  );
}
