import { Card, Chip, Text } from "@heroui/react";
import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";
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

export function SubscriptionCard({ data, isLoading }: SubscriptionCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const statusColor = useStatusColor(data?.status);

  const daysLabel = (() => {
    if (!data?.daysRemaining && data?.daysRemaining !== 0) return null;
    if (data.daysRemaining === 0) return t("dashboard.expirestoday");
    // Pass count as number (required by i18next), then replace with Arabic numerals for display
    const label = t("dashboard.daysRemaining", { count: data.daysRemaining });
    return isRTL
      ? label.replace(String(data.daysRemaining), toArabicNumerals(String(data.daysRemaining)))
      : label;
  })();

  return (
    <Card>
      <Card.Content className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Text type="body-sm" color="muted" className="mb-2">{t("dashboard.subscription")}</Text>

            {isLoading ? (
              <div className="h-7 w-32 animate-pulse rounded bg-default-100" />
            ) : data ? (
              <div className="flex flex-col gap-2">
                <Text type="body" weight="bold" className="text-xl">{data.planName}</Text>
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
              <Text type="body-sm" color="muted">{t("common.notProvided")}</Text>
            )}
          </div>

          {/* Icon — shrink-0 prevents it from being squished in RTL */}
          <div className="ms-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-default-100 text-accent">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
