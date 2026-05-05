import { DataTable, type Column } from "@/core/components/ui/DataTable";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { Chip, Tooltip } from "@heroui/react";
import { Button } from "@heroui/react";
import { ArrowRight, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";
import {
  useMarkAppointmentPaid,
  useRefundAppointment,
  useUpdateAppointmentStatus,
} from "../appointmentsHooks";
import type { AppointmentDto, AppointmentStatus, DoctorForBranch } from "../types";
import type { ViewMode } from "../viewMode";
import { buildClientPage } from "@/features/admin/utils/clientPagination";
import { ActionsDropdown, NextStatusButton, PatientCell, SlotCell, STATUS_COLOR } from "./appointmentColumns";
import { DoctorCheckInButton } from "./DoctorCheckInButton";

interface DoctorAppointmentsPanelProps {
  doctor: DoctorForBranch;
  appointments: AppointmentDto[];
  isLoading: boolean;
  viewMode: ViewMode;
  searchTerm?: string;
  onAddAppointment?: () => void;
  onEditAppointment?: (a: AppointmentDto) => void;
  onViewPatient?: (patientId: string) => void;
  onViewAll?: (doctorInfoId: string) => void;  // switch to single mode for this doctor
  branchId?: string;
}

const MULTI_PREVIEW = 10;
const SINGLE_PAGE   = 10;
const TERMINAL = new Set<AppointmentStatus>(["Completed", "Cancelled", "NoShow"]);

// ── Panel header ──────────────────────────────────────────────────────────────

function PanelHeader({
  doctor, count, branchId, onAddAppointment,
}: {
  doctor: DoctorForBranch;
  count: number;
  branchId?: string;
  onAddAppointment?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const isAr    = i18n.language === "ar";
  const num     = (n: number) => isAr ? toArabicNumerals(String(n)) : String(n);
  const isQueue = doctor.appointmentType === "Queue";

  return (
    <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/50">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
          {doctor.fullName.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate leading-tight">{doctor.fullName}</p>
          <p className="text-xs text-muted">
            {isQueue ? t("appointments.queueBased") : t("appointments.timeBased")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-xs text-muted">{num(count)}</span>
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
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content><p>{t("appointments.newAppointment")}</p></Tooltip.Content>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export function DoctorAppointmentsPanel({
  doctor, appointments, isLoading, viewMode, searchTerm = "",
  onAddAppointment, onEditAppointment, onViewPatient, onViewAll, branchId,
}: DoctorAppointmentsPanelProps) {
  const { t, i18n } = useTranslation();
  const isAr     = i18n.language === "ar";
  const isSingle = viewMode === "single";
  const [page, setPage] = useState(1);

  const updateStatus = useUpdateAppointmentStatus();
  const markPaid     = useMarkAppointmentPaid();
  const refund       = useRefundAppointment();
  const isPending    = updateStatus.isPending || markPaid.isPending || refund.isPending;

  const onStatusChange = (id: string, status: string) => updateStatus.mutate({ id, status });

  // Sort: active first, terminal at the end
  const sorted = useMemo(() => {
    const active   = appointments.filter((a) => !TERMINAL.has(a.status));
    const terminal = appointments.filter((a) => TERMINAL.has(a.status));
    return [...active, ...terminal];
  }, [appointments]);

  // Filter by search term (name, code, phone — client-side since all loaded)
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return sorted;
    const q = searchTerm.toLowerCase();
    return sorted.filter((a) =>
      a.patientName.toLowerCase().includes(q) ||
      (a.patientCode ?? "").toLowerCase().includes(q)
    );
  }, [sorted, searchTerm]);

  const num = (n: number) => isAr ? toArabicNumerals(String(n)) : String(n);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <PanelHeader doctor={doctor} count={0} branchId={branchId} onAddAppointment={onAddAppointment} />
        <div className="flex flex-col gap-1.5 p-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-9 animate-pulse rounded-lg bg-surface-secondary" />)}
        </div>
      </div>
    );
  }

  // ── Empty — don't render in multi mode ────────────────────────────────────
  if (appointments.length === 0) {
    if (!isSingle) return null;
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <PanelHeader doctor={doctor} count={0} branchId={branchId} onAddAppointment={onAddAppointment} />
        <div className="py-8 text-center text-sm text-muted">{t("appointments.noAppointments")}</div>
      </div>
    );
  }

  // ── Single mode: DataTable + TablePagination ───────────────────────────────
  if (isSingle) {
    const { items: paged, meta: pageData } = buildClientPage(filtered, page, SINGLE_PAGE);

    const columns: Column<AppointmentDto>[] = [
      {
        key: "slot",
        label: doctor.appointmentType === "Queue" ? t("appointments.columns.queue") : t("appointments.columns.time"),
        render: (a) => <SlotCell a={a} isAr={isAr} />,
      },
      {
        key: "patient",
        label: t("appointments.columns.patient"),
        render: (a) => <PatientCell a={a} isAr={isAr} onViewPatient={onViewPatient} t={t} />,
      },
      {
        key: "visitTypeName",
        label: t("appointments.columns.visitType"),
        render: (a) => <span className="text-sm text-muted">{a.visitTypeName}</span>,
      },
      {
        key: "finalPrice",
        label: t("appointments.columns.price"),
        render: (a) => <span className="text-sm tabular-nums text-muted">${a.finalPrice.toFixed(0)}</span>,
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
        key: "actions",
        label: "",
        render: (a) => (
          <div className="flex items-center justify-end gap-0.5">
            <NextStatusButton a={a} t={t} onStatusChange={onStatusChange} isPending={isPending} />
            <ActionsDropdown
              a={a} t={t}
              onStatusChange={onStatusChange}
              onMarkPaid={(id) => markPaid.mutate(id)}
              onRefund={(id) => refund.mutate(id)}
              onViewPatient={onViewPatient}
              onEdit={onEditAppointment}
              isPending={isPending}
            />
          </div>
        ),
      },
    ];

    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <PanelHeader doctor={doctor} count={appointments.length} branchId={branchId} onAddAppointment={onAddAppointment} />
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted">{t("common.noResults")}</div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={paged}
              keyExtractor={(a) => a.id}
              emptyMessage={t("appointments.noAppointments")}
            />
            <TablePagination
              data={pageData}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    );
  }

  // ── Multi mode: compact list, top 10 + "View All" link ────────────────────
  const preview    = filtered.slice(0, MULTI_PREVIEW);
  const hasMore    = filtered.length > MULTI_PREVIEW;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <PanelHeader doctor={doctor} count={appointments.length} branchId={branchId} onAddAppointment={onAddAppointment} />

      {/* Column headers */}
      <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-2 border-b border-border/50 bg-surface-secondary/30 px-3 py-1.5">
        <span className="text-xs font-medium text-muted">
          {doctor.appointmentType === "Queue" ? "#" : t("appointments.columns.time")}
        </span>
        <span className="text-xs font-medium text-muted">{t("appointments.columns.patient")}</span>
        <span className="text-xs font-medium text-muted">{t("appointments.columns.status")}</span>
        <span />
      </div>

      {/* Rows — top 10 only */}
      <div className="flex flex-col">
        {preview.map((appt) => (
          <div
            key={appt.id}
            className="grid grid-cols-[auto_1fr_auto_auto] gap-x-2 items-center border-b border-border/40 px-3 py-2 hover:bg-surface-secondary/30 transition-colors"
          >
            <div className="min-w-[3.5rem]">
              <SlotCell a={appt} isAr={isAr} />
            </div>
            <div className="min-w-0">
              <PatientCell a={appt} isAr={isAr} onViewPatient={onViewPatient} t={t} />
            </div>
            <div>
              <Chip size="sm" variant="soft" color={STATUS_COLOR[appt.status]}>
                {t(`appointments.statuses.${appt.status}`)}
              </Chip>
            </div>
            <div className="flex items-center gap-0.5">
              <NextStatusButton a={appt} t={t} onStatusChange={onStatusChange} isPending={isPending} />
              <ActionsDropdown
                a={appt} t={t}
                onStatusChange={onStatusChange}
                onMarkPaid={(id) => markPaid.mutate(id)}
                onRefund={(id) => refund.mutate(id)}
                onViewPatient={onViewPatient}
                onEdit={onEditAppointment}
                isPending={isPending}
              />
            </div>
          </div>
        ))}
      </div>

      {/* "View All" footer — only when there are more than 10 */}
      {hasMore && onViewAll && (
        <button
          type="button"
          onClick={() => onViewAll(doctor.doctorInfoId)}
          className="flex w-full items-center justify-center gap-1.5 border-t border-border/50 px-3 py-2.5 text-xs font-medium text-accent hover:bg-accent/5 transition-colors"
        >
          {t("appointments.viewAllCount", { count: num(filtered.length) })}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
