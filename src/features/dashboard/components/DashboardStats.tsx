import { StatsCard } from "@/core/components/ui/StatsCard";
import { Card, Chip } from "@heroui/react";
import {
  Activity,
  Calendar,
  CreditCard,
  Mail,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDashboardStats } from "../dashboardHooks";

export function DashboardStats() {
  const { t } = useTranslation();
  const { data, isLoading } = useDashboardStats();

  // Calculate patient trend %
  const patientTrend = (() => {
    if (!data || data.patientsLastMonth === 0) return undefined;
    const pct = Math.round(
      ((data.patientsThisMonth - data.patientsLastMonth) /
        data.patientsLastMonth) *
        100,
    );
    return { value: Math.abs(pct), isPositive: pct >= 0 };
  })();

  return (
    <div className="flex flex-col gap-6">
      {/* Stats grid */}
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
          value={t("common.comingSoon")}
          icon={<Calendar className="h-6 w-6" />}
          iconColor="text-accent-soft"
          comingSoon
        />
      </div>

      {/* Subscription + Revenue row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SubscriptionCard
          data={data?.subscription ?? null}
          isLoading={isLoading}
        />
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

// -- Subscription card ---------------------------------------------------------

interface SubscriptionCardProps {
  data: {
    planName: string;
    status: string;
    daysRemaining: number | null;
    isTrial: boolean;
  } | null;
  isLoading: boolean;
}

function SubscriptionCard({ data, isLoading }: SubscriptionCardProps) {
  const { t } = useTranslation();

  const statusColor = (() => {
    if (!data) return "default" as const;
    if (data.status === "Active") return "success" as const;
    if (data.status === "Trial") return "warning" as const;
    if (data.status === "Expired" || data.status === "Cancelled")
      return "danger" as const;
    return "default" as const;
  })();

  const daysLabel = (() => {
    if (!data?.daysRemaining && data?.daysRemaining !== 0) return null;
    if (data.daysRemaining === 0) return t("dashboard.expirestoday");
    return t("dashboard.daysRemaining", { count: data.daysRemaining });
  })();

  return (
    <Card>
      <Card.Content className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-default-500 mb-2 text-sm">
              {t("dashboard.subscription")}
            </p>
            {isLoading ? (
              <div className="bg-default-100 h-7 w-32 animate-pulse rounded" />
            ) : data ? (
              <div className="flex flex-col gap-2">
                <p className="text-xl font-bold">{data.planName}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip size="sm" variant="soft" color={statusColor}>
                    {data.isTrial
                      ? t("dashboard.trial")
                      : t(`dashboard.status.${data.status}`, {
                          defaultValue: data.status,
                        })}
                  </Chip>
                  {daysLabel && (
                    <span
                      className={`text-xs font-medium ${data.daysRemaining! <= 7 ? "text-danger" : "text-default-500"}`}
                    >
                      {daysLabel}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-default-400 text-sm">
                {t("common.notProvided")}
              </p>
            )}
          </div>
          <div className="bg-default-100 text-accent flex h-12 w-12 items-center justify-center rounded-lg">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

