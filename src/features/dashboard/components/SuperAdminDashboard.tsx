import { StatsCard } from "@/core/components/ui/StatsCard";
import { Activity, Building2, Calendar, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSuperAdminStats } from "../dashboardHooks";

export function SuperAdminDashboard() {
  const { t } = useTranslation();
  const { data, isLoading } = useSuperAdminStats();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title={t("dashboard.totalClinics")}
        value={isLoading ? "—" : (data?.totalClinics ?? 0)}
        icon={<Building2 className="h-6 w-6" />}
        iconColor="text-accent"
        isLoading={isLoading}
      />
      <StatsCard
        title={t("dashboard.totalPatients")}
        value={isLoading ? "—" : (data?.totalPatients ?? 0)}
        icon={<Users className="h-6 w-6" />}
        iconColor="text-warning"
        isLoading={isLoading}
      />
      <StatsCard
        title={t("dashboard.totalStaff")}
        value={isLoading ? "—" : (data?.totalStaff ?? 0)}
        icon={<Activity className="h-6 w-6" />}
        iconColor="text-accent-soft"
        isLoading={isLoading}
      />
      <StatsCard
        title={t("dashboard.clinicsOnTrial")}
        value={isLoading ? "—" : (data?.clinicsOnTrial ?? 0)}
        icon={<Calendar className="h-6 w-6" />}
        iconColor="text-warning"
        isLoading={isLoading}
      />
      <StatsCard
        title={t("dashboard.clinicsActive")}
        value={isLoading ? "—" : (data?.clinicsActive ?? 0)}
        icon={<Building2 className="h-6 w-6" />}
        iconColor="text-success"
        isLoading={isLoading}
      />
    </div>
  );
}

