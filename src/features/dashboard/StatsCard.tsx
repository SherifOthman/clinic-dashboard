import { Card, CardBody } from "@heroui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  change: string;
  changeType: "increase" | "decrease";
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  change,
  changeType,
}: StatsCardProps) {
  return (
    <Card className="shadow-sm border border-divider bg-content1">
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-default-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p
              className={`text-sm ${
                changeType === "increase" ? "text-success" : "text-danger"
              }`}
            >
              {change} from last month
            </p>
          </div>
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon size={24} className={color} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
