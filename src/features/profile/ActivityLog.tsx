import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Activity,
  Calendar,
  FileText,
  LogIn,
  Settings,
  UserPlus,
} from "lucide-react";
import { ActivityLog as ActivityLogType } from "./mockData";

interface ActivityLogProps {
  activities: ActivityLogType[];
}

export function ActivityLog({ activities }: ActivityLogProps) {
  const getActivityIcon = (type: ActivityLogType["type"]) => {
    switch (type) {
      case "login":
        return <LogIn size={16} />;
      case "patient_added":
        return <UserPlus size={16} />;
      case "appointment_scheduled":
        return <Calendar size={16} />;
      case "record_created":
        return <FileText size={16} />;
      case "profile_updated":
        return <Settings size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  const getActivityColor = (type: ActivityLogType["type"]) => {
    switch (type) {
      case "login":
        return "primary";
      case "patient_added":
        return "success";
      case "appointment_scheduled":
        return "warning";
      case "record_created":
        return "secondary";
      case "profile_updated":
        return "default";
      default:
        return "default";
    }
  };

  const getActivityLabel = (type: ActivityLogType["type"]) => {
    switch (type) {
      case "login":
        return "Login";
      case "patient_added":
        return "Patient Added";
      case "appointment_scheduled":
        return "Appointment";
      case "record_created":
        return "Record Created";
      case "profile_updated":
        return "Profile Updated";
      default:
        return "Activity";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const groupActivitiesByDate = (activities: ActivityLogType[]) => {
    const groups: { [key: string]: ActivityLogType[] } = {};

    activities.forEach((activity) => {
      const date = new Date(activity.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });

    return Object.entries(groups).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  };

  const groupedActivities = groupActivitiesByDate(activities);

  const formatGroupDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  return (
    <Card className="shadow-sm border border-divider">
      <CardHeader>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Activity size={20} />
          Recent Activity
        </h2>
        <p className="text-sm text-default-500">
          Your recent actions and system events
        </p>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          {groupedActivities.map(([dateString, dayActivities]) => (
            <div key={dateString}>
              <h3 className="text-sm font-medium text-default-600 mb-3 sticky top-0 bg-background">
                {formatGroupDate(dateString)}
              </h3>
              <div className="space-y-3">
                {dayActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 border border-divider rounded-lg hover:bg-default-50 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        getActivityColor(activity.type) === "primary"
                          ? "bg-primary-50 dark:bg-primary-950"
                          : getActivityColor(activity.type) === "success"
                            ? "bg-success-50 dark:bg-success-950"
                            : getActivityColor(activity.type) === "warning"
                              ? "bg-warning-50 dark:bg-warning-950"
                              : getActivityColor(activity.type) === "secondary"
                                ? "bg-secondary-50 dark:bg-secondary-950"
                                : "bg-default-100"
                      }`}
                    >
                      <div
                        className={`${
                          getActivityColor(activity.type) === "primary"
                            ? "text-primary-500"
                            : getActivityColor(activity.type) === "success"
                              ? "text-success-500"
                              : getActivityColor(activity.type) === "warning"
                                ? "text-warning-500"
                                : getActivityColor(activity.type) ===
                                    "secondary"
                                  ? "text-secondary-500"
                                  : "text-default-500"
                        }`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-default-700">
                          {activity.description}
                        </p>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={getActivityColor(activity.type) as any}
                        >
                          {getActivityLabel(activity.type)}
                        </Chip>
                      </div>
                      <p className="text-xs text-default-500">
                        {formatDateTime(activity.timestamp)}
                      </p>
                      {activity.metadata && (
                        <div className="mt-2 text-xs text-default-400">
                          {activity.type === "login" &&
                            activity.metadata.device && (
                              <span>Device: {activity.metadata.device}</span>
                            )}
                          {activity.type === "patient_added" &&
                            activity.metadata.patientName && (
                              <span>
                                Patient: {activity.metadata.patientName}
                              </span>
                            )}
                          {activity.type === "appointment_scheduled" &&
                            activity.metadata.patientName && (
                              <span>
                                Patient: {activity.metadata.patientName}
                              </span>
                            )}
                          {activity.type === "record_created" &&
                            activity.metadata.patientName && (
                              <span>
                                Patient: {activity.metadata.patientName}
                              </span>
                            )}
                          {activity.type === "profile_updated" &&
                            activity.metadata.fields && (
                              <span>
                                Updated:{" "}
                                {(activity.metadata.fields as string[]).join(
                                  ", "
                                )}
                              </span>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <Activity size={48} className="mx-auto text-default-300 mb-4" />
            <h3 className="text-lg font-medium text-default-500 mb-2">
              No Recent Activity
            </h3>
            <p className="text-sm text-default-400">
              Your recent activities will appear here
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
