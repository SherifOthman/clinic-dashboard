import type { Column } from "@/core/components/ui/DataTable";
import { Button, Chip } from "@heroui/react";
import type { TFunction } from "i18next";
import { CheckCircle, Clock, UserCheck, XCircle } from "lucide-react";
import type { AppointmentDto, AppointmentStatus } from "../types";

const STATUS_COLOR: Record<AppointmentStatus, "warning" | "accent" | "success" | "danger" | "default"> = {
  Pending:    "default",
  Waiting:    "warning",
  InProgress: "accent",
  Completed:  "success",
  Cancelled:  "danger",
  NoShow:     "default",
};

interface AppointmentColumnsOptions {
  t: TFunction;
  isAr: boolean;
  onStatusChange: (id: string, status: string) => void;
  isPending: boolean;
  showDoctor?: boolean;
  showQueueNumber?: boolean;
  showTime?: boolean;
}

export function getAppointmentColumns({
  t,
  isAr,
  onStatusChange,
  isPending,
  showDoctor = false,
  showQueueNumber = true,
  showTime = false,
}: AppointmentColumnsOptions): Column<AppointmentDto>[] {
  const cols: Column<AppointmentDto>[] = [];

  if (showQueueNumber) {
    cols.push({
      key: "queueNumber",
      label: "#",
      render: (a) => (
        <span className="text-base font-bold text-accent tabular-nums">
          {a.queueNumber ?? "—"}
        </span>
      ),
    });
  }

  if (showTime) {
    cols.push({
      key: "scheduledTime",
      label: t("appointments.time"),
      sortable: true,
      render: (a) => (
        <span className="font-bold text-accent tabular-nums">
          {a.scheduledTime ?? "—"}
          {a.endTime && (
            <span className="text-xs text-muted font-normal"> – {a.endTime}</span>
          )}
        </span>
      ),
    });
  }

  if (showDoctor) {
    cols.push({
      key: "doctorName",
      label: t("appointments.doctor"),
      render: (a) => <span className="font-medium">{a.doctorName}</span>,
    });
  }

  cols.push(
    {
      key: "patientName",
      label: t("appointments.patient"),
      sortable: true,
      render: (a) => (
        <div>
          <div className="font-medium">{a.patientName}</div>
          {a.patientCode && (
            <div className="text-xs text-muted">{a.patientCode}</div>
          )}
        </div>
      ),
    },
    {
      key: "visitTypeName",
      label: t("appointments.visitType"),
      render: (a) => <span className="text-muted">{isAr ? a.visitTypeNameAr : a.visitTypeNameEn}</span>,
    },
    {
      key: "finalPrice",
      label: t("appointments.price"),
      render: (a) => (
        <span className="tabular-nums text-muted">${a.finalPrice.toFixed(0)}</span>
      ),
    },
    {
      key: "status",
      label: t("appointments.status"),
      render: (a) => (
        <Chip size="sm" variant="soft" color={STATUS_COLOR[a.status]}>
          {t(`appointments.statuses.${a.status}`)}
        </Chip>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (a) => (
        <div className="flex gap-1">
          {/* Queue: Pending → Waiting (patient arrived) */}
          {a.status === "Pending" && a.type === "Queue" && (
            <Button
              size="sm" variant="ghost" isIconOnly isDisabled={isPending}
              onPress={() => onStatusChange(a.id, "Waiting")}
              aria-label={t("appointments.markWaiting")}
            >
              <UserCheck className="h-4 w-4 text-warning" />
            </Button>
          )}
          {/* Waiting or Pending → InProgress */}
          {(a.status === "Waiting" || (a.status === "Pending" && a.type === "Time")) && (
            <Button
              size="sm" variant="ghost" isIconOnly isDisabled={isPending}
              onPress={() => onStatusChange(a.id, "InProgress")}
              aria-label={t("appointments.start")}
            >
              <Clock className="h-4 w-4 text-accent" />
            </Button>
          )}
          {a.status === "InProgress" && (
            <Button
              size="sm" variant="ghost" isIconOnly isDisabled={isPending}
              onPress={() => onStatusChange(a.id, "Completed")}
              aria-label={t("appointments.complete")}
            >
              <CheckCircle className="h-4 w-4 text-success" />
            </Button>
          )}
          {(a.status === "Pending" || a.status === "Waiting" || a.status === "InProgress") && (
            <Button
              size="sm" variant="ghost" isIconOnly isDisabled={isPending}
              onPress={() => onStatusChange(a.id, "Cancelled")}
              aria-label={t("appointments.cancel")}
            >
              <XCircle className="h-4 w-4 text-danger" />
            </Button>
          )}
        </div>
      ),
    },
  );

  return cols;
}
