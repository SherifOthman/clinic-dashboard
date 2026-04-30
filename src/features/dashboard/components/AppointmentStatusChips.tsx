import { useTranslation } from "react-i18next";

interface AppointmentStatusChipsProps {
  pending: number;
  active: number;
  completed: number;
}

/**
 * Summary pill row shown at the top of TodayAppointmentsList.
 * Displays pending / in-progress / completed counts.
 */
export function AppointmentStatusChips({
  pending,
  active,
  completed,
}: AppointmentStatusChipsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-3 px-5 pb-3">
      <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
        {pending} {t("appointments.status.pending")}
      </span>
      {active > 0 && (
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
          {active} {t("appointments.status.inprogress")}
        </span>
      )}
      <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
        {completed} {t("appointments.status.completed")}
      </span>
    </div>
  );
}
