import { Card } from "@heroui/react";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { AppointmentDto } from "../../appointments/types";
import { AppointmentListEmpty } from "./AppointmentListEmpty";
import { AppointmentListRow } from "./AppointmentListRow";
import { AppointmentListSkeleton } from "./AppointmentListSkeleton";
import { AppointmentStatusChips } from "./AppointmentStatusChips";

interface TodayAppointmentsListProps {
  appointments: AppointmentDto[];
  isLoading: boolean;
  title: string;
  /** Show doctor name in each row — used by receptionist/owner views */
  showDoctor?: boolean;
}

const MAX_VISIBLE = 8;

/**
 * Card listing today's appointments with a summary chip row,
 * per-row status badges, and overflow handling.
 *
 * Used by: ClinicDashboard, DoctorDashboard, ReceptionistDashboard
 */
export function TodayAppointmentsList({
  appointments,
  isLoading,
  title,
  showDoctor = false,
}: TodayAppointmentsListProps) {
  const { t } = useTranslation();

  const pending    = appointments.filter((a) => a.status === "Pending" || a.status === "Waiting").length;
  const active     = appointments.filter((a) => a.status === "InProgress").length;
  const completed  = appointments.filter((a) => a.status === "Completed").length;
  const visible    = appointments.slice(0, MAX_VISIBLE);
  const overflow   = appointments.length - MAX_VISIBLE;

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">{title}</h3>
          </div>
          <Link to="/appointments" className="flex items-center gap-1 text-sm text-accent hover:underline">
            {t("common.viewAll")}
          </Link>
        </div>
      </Card.Header>

      {!isLoading && appointments.length > 0 && (
        <AppointmentStatusChips pending={pending} active={active} completed={completed} />
      )}

      <Card.Content className="p-0">
        {isLoading ? (
          <AppointmentListSkeleton />
        ) : appointments.length === 0 ? (
          <AppointmentListEmpty />
        ) : (
          <div className="flex flex-col">
            {visible.map((appt) => (
              <AppointmentListRow key={appt.id} appointment={appt} showDoctor={showDoctor} />
            ))}
            {overflow > 0 && (
              <div className="border-t border-divider px-5 py-3 text-center">
                <Link to="/appointments" className="text-sm text-accent hover:underline">
                  +{overflow} {t("common.more")}
                </Link>
              </div>
            )}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
