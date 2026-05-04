import { Card, Label, Meter, Skeleton } from "@heroui/react";
import { BarChart3, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import type { UsageLimitDto } from "../dashboardApi";
import { useUsageMetrics } from "../dashboardHooks";

export function UsageMetricsCard() {
  const { t } = useTranslation();
  const { data, isLoading } = useUsageMetrics();
  const { formatDateTime } = useDateFormat();

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <BarChart3 className="text-accent h-5 w-5" />
            </div>
            <div>
              <Card.Title>{t("dashboard.usageMetrics.title")}</Card.Title>
              <Card.Description>{t("dashboard.usageMetrics.subtitle")}</Card.Description>
            </div>
          </div>
          {data?.lastAggregatedAt && (
            <div className="flex items-center gap-1.5 text-xs text-default-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{t("dashboard.usageMetrics.lastUpdated", { time: formatDateTime(data.lastAggregatedAt) })}</span>
            </div>
          )}
        </div>
      </Card.Header>
      <Card.Content className="space-y-5">
        {isLoading ? (
          <div className="space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : !data?.lastAggregatedAt ? (
          <div className="flex items-center gap-2 text-sm text-default-400 py-4">
            <Clock className="h-4 w-4" />
            <span>{t("dashboard.usageMetrics.notYetAvailable")}</span>
          </div>
        ) : (
          <>
            <UsageMeter
              label={t("dashboard.usageMetrics.patients")}
              limit={data.patients}
            />
            <UsageMeter
              label={t("dashboard.usageMetrics.appointments")}
              limit={data.appointments}
            />
            <UsageMeter
              label={t("dashboard.usageMetrics.invoices")}
              limit={data.invoices}
            />
            <UsageMeter
              label={t("dashboard.usageMetrics.staff")}
              limit={data.staff}
            />
          </>
        )}
      </Card.Content>
    </Card>
  );
}

// ── Single meter row ──────────────────────────────────────────────────────────

function UsageMeter({ label, limit }: { label: string; limit: UsageLimitDto }) {
  const { t } = useTranslation();

  // -1 means unlimited in the plan
  if (limit.max <= 0) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-default-400">{limit.used} · {t("common.unlimited")}</span>
      </div>
    );
  }

  const percent = Math.min(Math.round((limit.used / limit.max) * 100), 100);
  const color = percent >= 95 ? "danger" : percent >= 80 ? "warning" : "accent";

  return (
    <Meter value={percent} minValue={0} maxValue={100} color={color} size="sm" className="w-full">
      <div className="flex justify-between mb-1">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-xs text-default-500">
          {limit.used} / {limit.max}
        </span>
      </div>
      <Meter.Track>
        <Meter.Fill />
      </Meter.Track>
    </Meter>
  );
}
