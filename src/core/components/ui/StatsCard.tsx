import { Card, Skeleton } from "@heroui/react";
import { Clock, TrendingDown, TrendingUp } from "lucide-react";
import { ReactNode } from "react";

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
  return (
    <Card>
      <Card.Content className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-default-500 mb-2 text-sm">{title}</p>

            {isLoading ? (
              <Skeleton className="h-9 w-20 rounded-md" />
            ) : comingSoon ? (
              <div className="text-default-400 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{value}</span>
              </div>
            ) : (
              <p className="text-3xl font-bold">{value}</p>
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
                  {Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>

          <div
            className={`bg-default-100 flex h-12 w-12 items-center justify-center rounded-lg ${iconColor} ${comingSoon ? "opacity-40" : ""}`}
          >
            {icon}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

