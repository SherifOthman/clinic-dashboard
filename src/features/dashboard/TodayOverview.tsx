import { Card, CardBody, CardHeader } from "@heroui/card";
import { Activity, CheckCircle, Clock, XCircle } from "lucide-react";

interface TodayStats {
  pending: number;
  completed: number;
  cancelled: number;
  total: number;
}

interface TodayOverviewProps {
  stats: TodayStats;
}

export function TodayOverview({ stats }: TodayOverviewProps) {
  const overviewItems = [
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning-50 dark:bg-warning-950",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success-50 dark:bg-success-950",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-danger",
      bgColor: "bg-danger-50 dark:bg-danger-950",
    },
    {
      label: "Total",
      value: stats.total,
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary-50 dark:bg-primary-950",
    },
  ];

  return (
    <Card className="shadow-sm border border-divider bg-content1">
      <CardHeader className="bg-content2/50">
        <h3 className="text-lg font-semibold">Today's Overview</h3>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-4">
          {overviewItems.map((item) => (
            <div key={item.label} className="text-center">
              <div
                className={`inline-flex p-3 rounded-lg ${item.bgColor} mb-2`}
              >
                <item.icon size={20} className={item.color} />
              </div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-default-500">{item.label}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
