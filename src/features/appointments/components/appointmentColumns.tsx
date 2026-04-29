import { Chip } from "@heroui/react";
import { Button } from "@heroui/react";
import type { TFunction } from "i18next";
import { CheckCircle, Clock, UserCheck, XCircle } from "lucide-react";
import type { AppointmentDto, AppointmentStatus } from "../types";
import type { ViewMode } from "../viewMode";
import { getVisibleColumns, QUEUE_COLUMNS, TIME_COLUMNS } from "../viewMode";

const STATUS_COLOR: Record<AppointmentStatus, "warning" | "accent" | "success" | "danger" | "default"> = {
  Pending:    "default",
  Waiting:    "warning",
  InProgress: "accent",
  Completed:  "success",
  Cancelled:  "danger",
  NoShow:     "default",
};

interface RenderOptions {
  t: TFunction;
  viewMode: ViewMode;
  onStatusChange: (id: string, status: string) => void;
  isPending: boolean;
  isQueue: boolean;
}

/** Renders a single appointment row — adapts columns based on viewMode */
export function AppointmentRow({
  appt,
  t,
  viewMode,
  onStatusChange,
  isPending,
  isQueue,
  expanded,
  onToggleExpand,
}: RenderOptions & {
  appt: AppointmentDto;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const columns = isQueue ? QUEUE_COLUMNS : TIME_COLUMNS;
  const visible = getVisibleColumns(columns, viewMode);
  const hidden  = columns.filter(
    (c) => c.key !== "actions" && !visible.some((v) => v.key === c.key)
  );
  const hasHidden = hidden.length > 0;

  return (
    <>
      <tr
        className={`border-b border-border/40 transition-colors hover:bg-surface-secondary/40 ${
          expanded ? "bg-surface-secondary/30" : ""
        }`}
      >
        {visible.map((col) => (
          <td key={col.key} className="px-3 py-2.5 text-sm">
            {renderCell(col.key, appt, t, onStatusChange, isPending, hasHidden, expanded, onToggleExpand)}
          </td>
        ))}
      </tr>

      {/* Expandable row — shows hidden columns */}
      {expanded && hasHidden && (
        <tr className="border-b border-border/40 bg-surface-secondary/20">
          <td colSpan={visible.length} className="px-4 pb-3 pt-1">
            <div className="flex flex-wrap gap-4 text-xs">
              {hidden.map((col) => (
                <div key={col.key} className="flex items-center gap-1.5">
                  <span className="text-muted">{col.label}:</span>
                  <span className="font-medium">
                    {renderHiddenValue(col.key, appt, t)}
                  </span>
                </div>
              ))}
              {/* Actions in expanded row */}
              <div className="ms-auto flex gap-1">
                {renderActions(appt, t, onStatusChange, isPending)}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function renderCell(
  key: string,
  a: AppointmentDto,
  t: TFunction,
  onStatusChange: (id: string, status: string) => void,
  isPending: boolean,
  hasHidden: boolean,
  expanded: boolean,
  onToggleExpand: () => void,
) {
  switch (key) {
    case "queue":
      return <span className="text-base font-bold text-accent tabular-nums">{a.queueNumber}</span>;

    case "time":
      return (
        <span className="font-bold text-accent tabular-nums">
          {a.scheduledTime ?? "—"}
          {a.endTime && <span className="text-xs text-muted font-normal"> – {a.endTime}</span>}
        </span>
      );

    case "patient":
      return (
        <button
          type="button"
          onClick={hasHidden ? onToggleExpand : undefined}
          className={`text-start ${hasHidden ? "cursor-pointer" : ""}`}
        >
          <div className="font-medium leading-tight">
            {a.patientName}
            {hasHidden && (
              <span className="ms-1 text-muted text-xs">{expanded ? "▲" : "▼"}</span>
            )}
          </div>
          {a.patientCode && <div className="text-xs text-muted">{a.patientCode}</div>}
        </button>
      );

    case "visitType":
      return <span className="text-muted">{a.visitTypeName}</span>;

    case "price":
      return <span className="tabular-nums text-muted">${a.finalPrice.toFixed(0)}</span>;

    case "status":
      return (
        <Chip size="sm" variant="soft" color={STATUS_COLOR[a.status]}>
          {t(`appointments.statuses.${a.status}`)}
        </Chip>
      );

    case "actions":
      // In multi mode with hidden columns, actions are in the expanded row
      if (hasHidden) return null;
      return <div className="flex gap-1">{renderActions(a, t, onStatusChange, isPending)}</div>;

    default:
      return null;
  }
}

function renderHiddenValue(key: string, a: AppointmentDto, t: TFunction): React.ReactNode {
  switch (key) {
    case "visitType": return a.visitTypeName;
    case "price":     return `$${a.finalPrice.toFixed(0)}`;
    case "status":    return (
      <Chip size="sm" variant="soft" color={STATUS_COLOR[a.status]}>
        {t(`appointments.statuses.${a.status}`)}
      </Chip>
    );
    default: return "—";
  }
}

function renderActions(
  a: AppointmentDto,
  t: TFunction,
  onStatusChange: (id: string, status: string) => void,
  isPending: boolean,
) {
  return (
    <>
      {/* Queue: Pending → InProgress directly (no check-in, no waiting) */}
      {a.status === "Pending" && a.type === "Queue" && (
        <Button size="sm" variant="ghost" isIconOnly isDisabled={isPending}
          onPress={() => onStatusChange(a.id, "InProgress")} aria-label={t("appointments.start")}>
          <Clock className="h-4 w-4 text-accent" />
        </Button>
      )}
      {/* Time-based: Pending → Waiting (arrived) → InProgress (started) */}
      {a.status === "Pending" && a.type === "Time" && (
        <Button size="sm" variant="ghost" isIconOnly isDisabled={isPending}
          onPress={() => onStatusChange(a.id, "Waiting")} aria-label={t("appointments.markWaiting")}>
          <UserCheck className="h-4 w-4 text-warning" />
        </Button>
      )}
      {a.status === "Waiting" && (
        <Button size="sm" variant="ghost" isIconOnly isDisabled={isPending}
          onPress={() => onStatusChange(a.id, "InProgress")} aria-label={t("appointments.start")}>
          <Clock className="h-4 w-4 text-accent" />
        </Button>
      )}
      {a.status === "InProgress" && (
        <Button size="sm" variant="ghost" isIconOnly isDisabled={isPending}
          onPress={() => onStatusChange(a.id, "Completed")} aria-label={t("appointments.complete")}>
          <CheckCircle className="h-4 w-4 text-success" />
        </Button>
      )}
      {(a.status === "Pending" || a.status === "Waiting" || a.status === "InProgress") && (
        <Button size="sm" variant="ghost" isIconOnly isDisabled={isPending}
          onPress={() => onStatusChange(a.id, "Cancelled")} aria-label={t("appointments.cancel")}>
          <XCircle className="h-4 w-4 text-danger" />
        </Button>
      )}
    </>
  );
}
