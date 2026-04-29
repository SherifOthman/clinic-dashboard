import { Button } from "@heroui/react";
import { Calendar, LogIn, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateAppointmentStatus } from "../appointmentsHooks";
import type { AppointmentDto, DoctorForBranch } from "../types";
import type { ViewMode } from "../viewMode";
import { getVisibleColumns, QUEUE_COLUMNS, TIME_COLUMNS } from "../viewMode";
import { AppointmentRow } from "./appointmentColumns";
import { DoctorCheckInButton } from "./DoctorCheckInButton";

interface DoctorAppointmentsPanelProps {
  doctor: DoctorForBranch;
  appointments: AppointmentDto[];
  isLoading: boolean;
  viewMode: ViewMode;
  onAddAppointment?: () => void;
  branchId?: string;
}

export function DoctorAppointmentsPanel({
  doctor,
  appointments,
  isLoading,
  viewMode,
  onAddAppointment,
  branchId,
}: DoctorAppointmentsPanelProps) {
  const { t } = useTranslation();
  const updateStatus = useUpdateAppointmentStatus();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isQueue = doctor.appointmentType === "Queue";
  const columns = isQueue ? QUEUE_COLUMNS : TIME_COLUMNS;
  const visible = useMemo(() => getVisibleColumns(columns, viewMode), [columns, viewMode]);

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {/* ── Doctor header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
            {doctor.fullName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm">{doctor.fullName}</p>
            <p className="flex items-center gap-1 text-xs text-muted">
              {isQueue ? (
                t("appointments.queueBased")
              ) : (
                <><Calendar className="h-3 w-3" />{t("appointments.timeBased")}</>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{appointments.length} {t("appointments.total")}</span>
          {branchId && (
            <DoctorCheckInButton
              doctorInfoId={doctor.doctorInfoId}
              branchId={branchId}
              doctorName={doctor.fullName}
            />
          )}
          {onAddAppointment && (
            <Button size="sm" variant="ghost" isIconOnly onPress={onAddAppointment}
              aria-label={t("appointments.newAppointment")}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex flex-col gap-2 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-surface-secondary" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted">
          {t("appointments.noAppointments")}
        </div>
      ) : (
        <div className="overflow-x-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                {visible.map((col) => (
                  <th key={col.key}
                    className="px-3 py-2 text-left text-xs font-medium text-muted">
                    {col.label ? t(`appointments.columns.${col.key}`, { defaultValue: col.label }) : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <AppointmentRow
                  key={appt.id}
                  appt={appt}
                  t={t}
                  viewMode={viewMode}
                  onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
                  isPending={updateStatus.isPending}
                  isQueue={isQueue}
                  expanded={expandedId === appt.id}
                  onToggleExpand={() => toggleExpand(appt.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
