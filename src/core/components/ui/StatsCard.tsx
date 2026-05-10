import { Card, Skeleton, Text } from "@heroui/react";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; isPositive: boolean };
  iconColor?: string;
  isLoading?: boolean;
  comingSoon?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  iconColor = "text-primary",
  isLoading = false,
  comingSoon = false,
}: StatsCardProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const displayValue = isRTL && typeof value === "number"
    ? toArabicNumerals(String(value))
    : value;

  const displayTrend = isRTL && trend
    ? toArabicNumerals(String(Math.abs(trend.value)))
    : trend ? String(Math.abs(trend.value)) : null;

  return (
    <Card>
      <Card.Content className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-muted mb-2 text-sm">{title}</p>

            {isLoading ? (
              <Skeleton className="h-9 w-20 rounded-md" />
            ) : comingSoon ? (
              <div className="text-default-400 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{value}</span>
              </div>
            ) : (
              <Text type="h3" weight="bold" className="text-3xl">{displayValue}</Text>
            )}

            {trend && !comingSoon && !isLoading && (
              <div
                className={`mt-2 flex items-center gap-1 ${
                  trend.isPositive ? "text-success" : "text-danger"
                }`}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {displayTrend}%
                </span>
              </div>
            )}
          </div>

          <div
            className={`ms-4 bg-default-100 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${iconColor} ${comingSoon ? "opacity-40" : ""}`}
          >
            {icon}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
