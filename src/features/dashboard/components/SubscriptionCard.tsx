import { Card, Chip } from "@heroui/react";
import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SubscriptionInfoDto } from "../dashboardApi";

interface SubscriptionCardProps {
  data: SubscriptionInfoDto | null;
  isLoading: boolean;
}

function useStatusColor(status: string | undefined) {
  if (!status) return "default" as const;
  if (status === "Active") return "success" as const;
  if (status === "Trial") return "warning" as const;
  if (status === "Expired" || status === "Cancelled") return "danger" as const;
  return "default" as const;
}

/**
 * Displays the clinic's current subscription plan, status, and days remaining.
 * Extracted from DashboardStats to keep each card self-contained.
 */
export function SubscriptionCard({ data, isLoading }: SubscriptionCardProps) {
  const { t } = useTranslation();
  const statusColor = useStatusColor(data?.status);

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
            <p className="mb-2 text-sm text-default-500">{t("dashboard.subscription")}</p>

            {isLoading ? (
              <div className="h-7 w-32 animate-pulse rounded bg-default-100" />
            ) : data ? (
              <div className="flex flex-col gap-2">
                <p className="text-xl font-bold">{data.planName}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip size="sm" variant="soft" color={statusColor}>
                    {data.isTrial
                      ? t("dashboard.trial")
                      : t(`dashboard.status.${data.status}`, { defaultValue: data.status })}
                  </Chip>
                  {daysLabel && (
                    <span
                      className={`text-xs font-medium ${
                        data.daysRemaining! <= 7 ? "text-danger" : "text-default-500"
                      }`}
                    >
                      {daysLabel}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-default-400">{t("common.notProvided")}</p>
            )}
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-default-100 text-accent">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
