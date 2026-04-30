import { DataTable, type Column } from "@/core/components/ui/DataTable";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";
import { getPatientImageSrc } from "@/core/utils/patientImageUtils";
import { calculateDetailedAge, formatDetailedAge } from "@/core/utils/ageUtils";
import { Avatar, Button, Chip, Tooltip } from "@heroui/react";
import type { TFunction } from "i18next";
import { Calendar, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateAppointmentStatus } from "../appointmentsHooks";
import type { AppointmentDto, AppointmentStatus, DoctorForBranch } from "../types";
import type { ViewMode } from "../viewMode";
import { getVisibleColumns, QUEUE_COLUMNS, TIME_COLUMNS } from "../viewMode";
import { renderActions } from "./appointmentColumns";
import { DoctorCheckInButton } from "./DoctorCheckInButton";

interface DoctorAppointmentsPanelProps {
  doctor: DoctorForBranch;
  appointments: AppointmentDto[];
  isLoading: boolean;
  viewMode: ViewMode;
  onAddAppointment?: () => void;
  onViewPatient?: (patientId: string) => void;
  branchId?: string;
}

const PAGE_SIZE = 10;

const TERMINAL_STATUSES = new Set(["Completed", "Cancelled", "NoShow"]);

const STATUS_COLOR: Record<AppointmentStatus, "warning" | "accent" | "success" | "danger" | "default"> = {
  Pending:    "default",
  Waiting:    "warning",
  InProgress: "accent",
  Completed:  "success",
  Cancelled:  "danger",
  NoShow:     "default",
};

export function DoctorAppointmentsPanel({
  doctor,
  appointments,
  isLoading,
  viewMode,
  onAddAppointment,
  onViewPatient,
  branchId,
}: DoctorAppointmentsPanelProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const num = (v: string | number) => isAr ? toArabicNumerals(String(v)) : String(v);
  const updateStatus = useUpdateAppointmentStatus();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const isQueue = doctor.appointmentType === "Queue";
  const isSingle = viewMode === "single";

  // Sort: active first, terminal (Completed/Cancelled/NoShow) at the end
  const sortedAppointments = useMemo(() => {
    const active   = appointments.filter((a) => !TERMINAL_STATUSES.has(a.status));
    const terminal = appointments.filter((a) => TERMINAL_STATUSES.has(a.status));
    return [...active, ...terminal];
  }, [appointments]);

  // ── Single mode: use DataTable + client-side pagination ───────────────────
  const totalPages = Math.ceil(sortedAppointments.length / PAGE_SIZE);
  const pagedAppointments = sortedAppointments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Multi mode: compact custom table ─────────────────────────────────────
  const columns = isQueue ? QUEUE_COLUMNS : TIME_COLUMNS;
  const visible = useMemo(() => getVisibleColumns(columns, viewMode), [columns, viewMode]);

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const onStatusChange = (id: string, status: string) =>
    updateStatus.mutate({ id, status });

  // ── DataTable columns for single mode ─────────────────────────────────────
  const dataTableColumns: Column<AppointmentDto>[] = useMemo(() => {
    const cols: Column<AppointmentDto>[] = [];

    if (isQueue) {
      cols.push({
        key: "queueNumber",
        label: t("appointments.columns.queue"),
        render: (a) => (
          <span className="text-base font-bold text-accent tabular-nums">{num(a.queueNumber ?? "")}</span>
        ),
      });
    } else {
      cols.push({
        key: "scheduledTime",
        label: t("appointments.columns.time"),
        render: (a) => (
          <span className="font-bold text-accent tabular-nums" dir="ltr">
            {a.scheduledTime ?? "—"}
            {a.endTime && (
              <span className="text-xs text-muted font-normal"> – {a.endTime}</span>
            )}
          </span>
        ),
      });
    }

    cols.push(
      {
        key: "patientName",
        label: t("appointments.columns.patient"),
        render: (a) => {
          const age = a.patientDateOfBirth
            ? formatDetailedAge(calculateDetailedAge(a.patientDateOfBirth), isAr)
            : null;
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onViewPatient?.(a.patientId)}
                className="shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label={a.patientName}
              >
                <Avatar
                  size="sm"
                  className={`ring-1 ${a.patientGender === "Female" ? "ring-pink-400" : "ring-accent/50"}`}
                >
                  <Avatar.Image
                    className="object-cover"
                    src={getPatientImageSrc(a.patientGender ?? "Male", a.patientDateOfBirth)}
                    alt={a.patientName}
                  />
                  <Avatar.Fallback>
                    {a.patientGender === "Female" ? "♀" : "♂"}
                  </Avatar.Fallback>
                </Avatar>
              </button>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium leading-tight">{a.patientName}</span>
                <div className="flex items-center gap-1.5">
                  {a.patientCode && (
                    <span className="text-xs text-muted">{a.patientCode}</span>
                  )}
                  {age && (
                    <>
                      <span className="text-muted text-xs">·</span>
                      <span className="text-xs font-medium text-foreground" dir="ltr">{age}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        key: "status",
        label: t("appointments.columns.status"),
        render: (a) => (
          <Chip size="sm" variant="soft" color={STATUS_COLOR[a.status]}>
            {t(`appointments.statuses.${a.status}`)}
          </Chip>
        ),
      },
      {
        key: "visitTypeName",
        label: t("appointments.columns.visitType"),
        render: (a) => <span className="text-muted">{a.visitTypeName}</span>,
      },
      {
        key: "finalPrice",
        label: t("appointments.columns.price"),
        render: (a) => <span className="tabular-nums text-muted">${a.finalPrice.toFixed(0)}</span>,
      },
      {
        key: "actions",
        label: "",
        render: (a) => (
          <div className="flex gap-1">
            {renderActions(a, t, onStatusChange, updateStatus.isPending)}
          </div>
        ),
      },
    );

    return cols;
  }, [t, isAr, isQueue, onViewPatient, updateStatus.isPending]);

  // ── Header ─────────────────────────────────────────────────────────────────
  const header = (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
          {doctor.fullName.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm">{doctor.fullName}</p>
          <p className="flex items-center gap-1 text-xs text-muted">
            {isQueue ? (
              t("appointments.queueBased")
            ) : (
              <><Calendar className="h-3 w-3" />{t("appointments.timeBased")}</>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted">{appointments.length} {t("appointments.total")}</span>
        {branchId && (
          <DoctorCheckInButton
            doctorInfoId={doctor.doctorInfoId}
            branchId={branchId}
            doctorName={doctor.fullName}
            hasSessionToday={doctor.hasSessionToday}
            appointmentType={doctor.appointmentType}
          />
        )}
        {onAddAppointment && (
          <Tooltip delay={300}>
            <Tooltip.Trigger>
              <Button size="sm" variant="ghost" isIconOnly onPress={onAddAppointment}
                aria-label={t("appointments.newAppointment")}>
                <Plus className="h-4 w-4" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content><p>{t("appointments.newAppointment")}</p></Tooltip.Content>
          </Tooltip>
        )}
      </div>
    </div>
  );

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {header}
        <div className="flex flex-col gap-2 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-surface-secondary" />
          ))}
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {header}
        <div className="py-10 text-center text-sm text-muted">
          {t("appointments.noAppointments")}
        </div>
      </div>
    );
  }

  // ── Single mode: full DataTable with pagination ────────────────────────────
  if (isSingle) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {header}
        <DataTable
          columns={dataTableColumns}
          data={pagedAppointments}
          keyExtractor={(a) => a.id}
        />
        {/* Simple pagination footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/50 px-4 py-2">
            <span className="text-xs text-muted">
              {t("common.showing")} {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sortedAppointments.length)} {t("common.of")} {sortedAppointments.length}
            </span>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" isDisabled={page === 1}
                onPress={() => setPage((p) => p - 1)}>
                {t("common.previous")}
              </Button>
              <span className="min-w-[3rem] text-center text-xs text-muted">
                {page} / {totalPages}
              </span>
              <Button size="sm" variant="ghost" isDisabled={page === totalPages}
                onPress={() => setPage((p) => p + 1)}>
                {t("common.next")}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Multi mode: compact custom table (priority-1 columns + expandable rows) ─
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {header}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              {visible.map((col) => (
                <th key={col.key}
                  className="px-3 py-2 text-start text-xs font-medium text-muted">
                  {col.label ? t(col.label) : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedAppointments.map((appt) => {
              const hidden = columns.filter(
                (c) => c.key !== "actions" && !visible.some((v) => v.key === c.key)
              );
              const hasHidden = hidden.length > 0;
              const expanded = expandedId === appt.id;

              return (
                <>
                  <tr key={appt.id}
                    className={`border-b border-border/40 transition-colors hover:bg-surface-secondary/40 ${expanded ? "bg-surface-secondary/30" : ""}`}
                  >
                    {visible.map((col) => (
                      <td key={col.key} className="px-3 py-2.5 text-sm">
                        {renderCompactCell(col.key, appt, t, isAr, onStatusChange, updateStatus.isPending, hasHidden, expanded, () => toggleExpand(appt.id), onViewPatient)}
                      </td>
                    ))}
                  </tr>
                  {expanded && hasHidden && (
                    <tr key={`${appt.id}-expanded`} className="border-b border-border/40 bg-surface-secondary/20">
                      <td colSpan={visible.length} className="px-4 pb-3 pt-1">
                        <div className="flex flex-wrap gap-4 text-xs">
                          {hidden.map((col) => (
                            <div key={col.key} className="flex items-center gap-1.5">
                              <span className="text-muted">{t(col.label)}:</span>
                              <span className="font-medium">
                                {col.key === "visitType" ? appt.visitTypeName
                                  : col.key === "price" ? `$${appt.finalPrice.toFixed(0)}`
                                  : col.key === "status" ? (
                                    <Chip size="sm" variant="soft" color={STATUS_COLOR[appt.status]}>
                                      {t(`appointments.statuses.${appt.status}`)}
                                    </Chip>
                                  ) : "—"}
                              </span>
                            </div>
                          ))}
                          <div className="ms-auto flex gap-1">
                            {renderActions(appt, t, onStatusChange, updateStatus.isPending)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Compact cell renderer (multi mode) ────────────────────────────────────────

function renderCompactCell(
  key: string,
  a: AppointmentDto,
  t: TFunction,
  isAr: boolean,
  onStatusChange: (id: string, status: string) => void,
  isPending: boolean,
  hasHidden: boolean,
  expanded: boolean,
  onToggleExpand: () => void,
  onViewPatient?: (patientId: string) => void,
) {
  switch (key) {
    case "queue":
      return <span className="text-base font-bold text-accent tabular-nums">{isAr ? toArabicNumerals(String(a.queueNumber ?? "")) : a.queueNumber}</span>;
    case "time":
      return (
        <span className="font-bold text-accent tabular-nums" dir="ltr">
          {a.scheduledTime ?? "—"}
          {a.endTime && (
            <span className="text-xs text-muted font-normal"> – {a.endTime}</span>
          )}
        </span>
      );
    case "patient":
      return (
        <button type="button" onClick={hasHidden ? onToggleExpand : undefined}
          className={`text-start ${hasHidden ? "cursor-pointer" : ""}`}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onViewPatient?.(a.patientId); }}
              className="shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={a.patientName}
            >
              <Avatar
                size="sm"
                className={`ring-1 ${a.patientGender === "Female" ? "ring-pink-400" : "ring-accent/50"}`}
              >
                <Avatar.Image
                  className="object-cover"
                  src={getPatientImageSrc(a.patientGender ?? "Male", a.patientDateOfBirth)}
                  alt={a.patientName}
                />
                <Avatar.Fallback>
                  {a.patientGender === "Female" ? "♀" : "♂"}
                </Avatar.Fallback>
              </Avatar>
            </button>
            <div className="flex flex-col gap-0.5">
              <div className="font-medium leading-tight">
                {a.patientName}
                {hasHidden && <span className="ms-1 text-muted text-xs">{expanded ? "▲" : "▼"}</span>}
              </div>
              <div className="flex items-center gap-1.5">
                {a.patientCode && (
                  <span className="text-xs text-muted">{a.patientCode}</span>
                )}
                {a.patientDateOfBirth && (
                  <>
                    <span className="text-muted text-xs">·</span>
                    <span className="text-xs font-medium text-foreground" dir="ltr">
                      {formatDetailedAge(calculateDetailedAge(a.patientDateOfBirth), isAr)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
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
      if (hasHidden) return null;
      return <div className="flex gap-1">{renderActions(a, t, onStatusChange, isPending)}</div>;
    default:
      return null;
  }
}
