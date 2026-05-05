import { Card, Label, Meter, Skeleton } from "@heroui/react";
import { Clock, Users, Calendar, FileText, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/core/components/ui/PageHeader";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";
import { useUsageMetrics } from "@/features/dashboard/dashboardHooks";
import type { UsageLimitDto } from "@/features/dashboard/dashboardApi";

export default function UsagePage() {
  const { t } = useTranslation();
  const { data, isLoading } = useUsageMetrics();
  const { formatDateTime } = useDateFormat();

  return (
    <div>
      <PageHeader
        title={t("dashboard.usageMetrics.pageTitle")}
        subtitle={t("dashboard.usageMetrics.pageSubtitle")}
      />

      {/* Last updated notice */}
      {data?.lastAggregatedAt && (
        <div className="mb-6 flex items-center gap-2 text-sm text-default-400">
          <Clock className="h-4 w-4" />
          <span>{t("dashboard.usageMetrics.lastUpdated", { time: formatDateTime(data.lastAggregatedAt) })}</span>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <Card.Content className="p-6 space-y-3">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="h-3 w-full rounded-full" />
                <Skeleton className="h-4 w-24 rounded" />
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : !data?.lastAggregatedAt ? (
        <Card>
          <Card.Content className="flex items-center gap-3 p-8 text-default-400">
            <Clock className="h-5 w-5 shrink-0" />
            <p className="text-sm">{t("dashboard.usageMetrics.noData")}</p>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UsageLimitCard
            label={t("dashboard.usageMetrics.patients")}
            limit={data.patients}
            icon={<Users className="h-5 w-5" />}
          />
          <UsageLimitCard
            label={t("dashboard.usageMetrics.appointments")}
            limit={data.appointments}
            icon={<Calendar className="h-5 w-5" />}
          />
          <UsageLimitCard
            label={t("dashboard.usageMetrics.invoices")}
            limit={data.invoices}
            icon={<FileText className="h-5 w-5" />}
          />
          <UsageLimitCard
            label={t("dashboard.usageMetrics.staff")}
            limit={data.staff}
            icon={<UserCheck className="h-5 w-5" />}
          />
        </div>
      )}
    </div>
  );
}

// ── Single limit card ─────────────────────────────────────────────────────────

function UsageLimitCard({
  label,
  limit,
  icon,
}: {
  label: string;
  limit: UsageLimitDto;
  icon: React.ReactNode;
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const num = (n: number) => isRTL ? toArabicNumerals(String(n)) : String(n);

  const isUnlimited = limit.max <= 0;
  const percent = isUnlimited ? 0 : Math.min(Math.round((limit.used / limit.max) * 100), 100);
  const color = percent >= 95 ? "danger" : percent >= 80 ? "warning" : "accent";
  const iconBg = percent >= 95 ? "bg-danger/10 text-danger" : percent >= 80 ? "bg-warning/10 text-warning" : "bg-accent/10 text-accent";

  return (
    <Card>
      <Card.Content className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-default-500 mb-1">{label}</p>
            {isUnlimited ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold">{num(limit.used)}</span>
                <span className="text-sm text-default-400">/ {t("common.unlimited")}</span>
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-bold">{num(limit.used)}</span>
                  <span className="text-sm text-default-400">/ {num(limit.max)}</span>
                </div>
                <Meter value={percent} minValue={0} maxValue={100} color={color} size="sm" className="w-full">
                  <Label className="sr-only">{label}</Label>
                  <Meter.Track>
                    <Meter.Fill />
                  </Meter.Track>
                </Meter>
                <p className="mt-1.5 text-xs text-default-400">
                  {num(percent)}% {t("dashboard.usageMetrics.used")}
                </p>
              </>
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
