import { CheckCircle2, Clock, UserRound, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AppointmentDto, AppointmentStatus } from "../../appointments/types";

interface AppointmentListRowProps {
  appointment: AppointmentDto;
  showDoctor: boolean;
}

const STATUS_CONFIG: Record<AppointmentStatus, { color: string; icon: React.ReactNode }> = {
  Pending:    { color: "text-warning",     icon: <Clock className="h-3.5 w-3.5" /> },
  Waiting:    { color: "text-accent",      icon: <Clock className="h-3.5 w-3.5" /> },
  InProgress: { color: "text-accent",      icon: <Clock className="h-3.5 w-3.5 animate-pulse" /> },
  Completed:  { color: "text-success",     icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  Cancelled:  { color: "text-danger",      icon: <XCircle className="h-3.5 w-3.5" /> },
  NoShow:     { color: "text-default-400", icon: <XCircle className="h-3.5 w-3.5" /> },
};

/**
 * Single row in TodayAppointmentsList.
 * Shows patient avatar, name, visit type (+ doctor if showDoctor),
 * queue/time slot, and status badge.
 */
export function AppointmentListRow({ appointment: appt, showDoctor }: AppointmentListRowProps) {
  const { t } = useTranslation();
  const cfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.Pending;

  return (
    <div className="flex items-center gap-3 border-t border-divider px-5 py-3">
      {/* Patient avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
        <UserRound className="h-4 w-4 text-accent" />
      </div>

      {/* Name + visit type */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{appt.patientName}</p>
        <p className="truncate text-xs text-default-400">
          {appt.visitTypeName}
          {showDoctor && ` · ${appt.doctorName}`}
        </p>
      </div>

      {/* Slot + status */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-xs font-medium text-default-500">
          {appt.type === "Queue" ? `#${appt.queueNumber ?? "—"}` : (appt.scheduledTime ?? "—")}
        </span>
        <span className={`flex items-center gap-1 text-xs font-medium ${cfg.color}`}>
          {cfg.icon}
          {t(`appointments.status.${appt.status.toLowerCase()}`, { defaultValue: appt.status })}
        </span>
      </div>
    </div>
  );
}
