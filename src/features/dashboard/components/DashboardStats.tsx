import { StatsCard } from "@/core/components/ui/StatsCard";
import { Activity, Calendar, Mail, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";
import { useDashboardStats } from "../dashboardHooks";
import { SubscriptionCard } from "./SubscriptionCard";
import type { AppointmentDto } from "../../appointments/types";

interface DashboardStatsProps {
  todayAppointments: AppointmentDto[];
  apptLoading: boolean;
}

/**
 * Stats overview for the Clinic Owner dashboard.
 * Receives today's appointments as props — ClinicDashboard already fetches them.
 */
export function DashboardStats({ todayAppointments, apptLoading }: DashboardStatsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { data, isLoading } = useDashboardStats();

  const patientTrend = (() => {
    if (!data || data.patientsLastMonth === 0) return undefined;
    const pct = Math.round(
      ((data.patientsThisMonth - data.patientsLastMonth) / data.patientsLastMonth) * 100,
    );
    return { value: Math.abs(pct), isPositive: pct >= 0 };
  })();

  const todayCompleted = todayAppointments.filter((a) => a.status === "Completed").length;

  // Format "completed/total" — reversed in Arabic (total/completed reads naturally RTL)
  const apptValue = apptLoading ? "—" : isRTL
    ? `${toArabicNumerals(String(todayAppointments.length))}/${toArabicNumerals(String(todayCompleted))}`
    : `${todayCompleted}/${todayAppointments.length}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t("dashboard.totalPatients")}
          value={isLoading ? "—" : (data?.totalPatients ?? 0)}
          icon={<Users className="h-6 w-6" />}
          iconColor="text-accent"
          trend={patientTrend}
          isLoading={isLoading}
        />
        <StatsCard
          title={t("dashboard.activeStaff")}
          value={isLoading ? "—" : (data?.activeStaff ?? 0)}
          icon={<Activity className="h-6 w-6" />}
          iconColor="text-warning"
          isLoading={isLoading}
        />
        <StatsCard
          title={t("dashboard.pendingInvitations")}
          value={isLoading ? "—" : (data?.pendingInvitations ?? 0)}
          icon={<Mail className="h-6 w-6" />}
          iconColor="text-success"
          isLoading={isLoading}
        />
        <StatsCard
          title={t("dashboard.appointmentsToday")}
          value={apptValue}
          icon={<Calendar className="h-6 w-6" />}
          iconColor="text-accent-soft"
          isLoading={apptLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SubscriptionCard data={data?.subscription ?? null} isLoading={isLoading} />
        <StatsCard
          title={t("dashboard.monthlyRevenue")}
          value={t("common.comingSoon")}
          icon={<TrendingUp className="h-6 w-6" />}
          iconColor="text-accent"
          comingSoon
        />
      </div>
    </div>
  );
}
