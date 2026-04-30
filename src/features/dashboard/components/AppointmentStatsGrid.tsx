import { StatsCard } from "@/core/components/ui/StatsCard";
import { Calendar, CheckCircle2, Clock, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface AppointmentStatsGridProps {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  isLoading: boolean;
  /** Icon for the in-progress card — differs between Doctor (UserRound) and Receptionist (Users) */
  inProgressIcon?: ReactNode;
}

/**
 * 4-card stats grid showing today's appointment breakdown.
 * Shared between DoctorDashboard and ReceptionistDashboard.
 */
export function AppointmentStatsGrid({
  total,
  pending,
  inProgress,
  completed,
  isLoading,
  inProgressIcon,
}: AppointmentStatsGridProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatsCard
        title={t("dashboard.appointmentsToday")}
        value={isLoading ? "—" : total}
        icon={<Calendar className="h-6 w-6" />}
        iconColor="text-accent"
        isLoading={isLoading}
      />
      <StatsCard
        title={t("appointments.status.pending")}
        value={isLoading ? "—" : pending}
        icon={<Clock className="h-6 w-6" />}
        iconColor="text-warning"
        isLoading={isLoading}
      />
      <StatsCard
        title={t("appointments.status.inprogress")}
        value={isLoading ? "—" : inProgress}
        icon={inProgressIcon ?? <Users className="h-6 w-6" />}
        iconColor="text-accent"
        isLoading={isLoading}
      />
      <StatsCard
        title={t("appointments.status.completed")}
        value={isLoading ? "—" : completed}
        icon={<CheckCircle2 className="h-6 w-6" />}
        iconColor="text-success"
        isLoading={isLoading}
      />
    </div>
  );
}
