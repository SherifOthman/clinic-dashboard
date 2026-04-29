import { DataTable } from "@/core/components/ui/DataTable";
import { Button } from "@heroui/react";
import { Calendar, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUpdateAppointmentStatus } from "../appointmentsHooks";
import type { AppointmentDto, DoctorForBranch } from "../types";
import { getAppointmentColumns } from "./appointmentColumns";
import { DoctorCheckInButton } from "./DoctorCheckInButton";

interface DoctorAppointmentsPanelProps {
  doctor: DoctorForBranch;
  appointments: AppointmentDto[];
  isLoading: boolean;
  compact?: boolean;
  onAddAppointment?: () => void;
  branchId?: string;
}

export function DoctorAppointmentsPanel({
  doctor,
  appointments,
  isLoading,
  compact = false,
  onAddAppointment,
  branchId,
}: DoctorAppointmentsPanelProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const updateStatus = useUpdateAppointmentStatus();

  const isQueue = doctor.appointmentType === "Queue";

  const columns = getAppointmentColumns({
    t,
    isAr,
    onStatusChange: (id, status) => updateStatus.mutate({ id, status }),
    isPending: updateStatus.isPending,
    showQueueNumber: isQueue,
    showTime: !isQueue,
  });

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      {/* Doctor header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
            {doctor.fullName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{doctor.fullName}</p>
            <p className="flex items-center gap-1 text-xs text-muted">
              {isQueue ? (
                t("appointments.queueBased")
              ) : (
                <>
                  <Calendar className="h-3 w-3" />
                  {t("appointments.timeBased")}
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">
            {appointments.length} {t("appointments.total")}
          </span>
          {/* Check-in button — only shown for today */}
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

      <DataTable
        columns={columns}
        data={appointments}
        keyExtractor={(a) => a.id}
        isLoading={isLoading}
        emptyMessage={t("appointments.noAppointments")}
      />
    </div>
  );
}
