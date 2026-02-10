import { StatsCard } from "@/core/components/ui/StatsCard";
import { Activity, Calendar, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export function DashboardStats() {
  const { t } = useTranslation();

  // Mock data - replace with real data from API
  const stats = [
    {
      title: t("dashboard.totalPatients"),
      value: "1,234",
      icon: <Users className="w-6 h-6 text-primary" />,
      trend: { value: 12, isPositive: true },
    },
    {
      title: t("dashboard.appointmentsToday"),
      value: "28",
      icon: <Calendar className="w-6 h-6 text-primary" />,
      trend: { value: 8, isPositive: true },
    },
    {
      title: t("dashboard.activeStaff"),
      value: "15",
      icon: <Activity className="w-6 h-6 text-primary" />,
      trend: { value: 2, isPositive: false },
    },
    {
      title: t("dashboard.monthlyRevenue"),
      value: "$45,678",
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      trend: { value: 15, isPositive: true },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}
