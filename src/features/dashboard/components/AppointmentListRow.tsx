import { CheckCircle2, Clock, UserRound, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";
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

export function AppointmentListRow({ appointment: appt, showDoctor }: AppointmentListRowProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const cfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.Pending;

  const slotLabel = appt.type === "Queue"
    ? `#${isRTL ? toArabicNumerals(String(appt.queueNumber ?? "—")) : (appt.queueNumber ?? "—")}`
    : (appt.scheduledTime ?? "—");

  return (
    <div className="flex items-center gap-3 border-t border-divider px-5 py-3">
      {/* Patient avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
        <UserRound className="h-4 w-4 text-accent" />
      </div>

      {/* Patient name + visit type + doctor (visually distinct) */}
      <div className="min-w-0 flex-1">
        {/* Patient name — prominent */}
        <p className="truncate text-sm font-medium">{appt.patientName}</p>
        {/* Visit type — muted */}
        <p className="truncate text-xs text-muted">
          {appt.visitTypeName}
          {/* Doctor name — even more muted, separated */}
          {showDoctor && appt.doctorName && (
            <span className="text-default-400"> · {appt.doctorName}</span>
          )}
        </p>
      </div>

      {/* Slot + status */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-xs font-medium text-default-500" dir="ltr">
          {slotLabel}
        </span>
        <span className={`flex items-center gap-1 text-xs font-medium ${cfg.color}`}>
          {cfg.icon}
          {t(`appointments.statuses.${appt.status}`, { defaultValue: appt.status })}
        </span>
      </div>
    </div>
  );
}
