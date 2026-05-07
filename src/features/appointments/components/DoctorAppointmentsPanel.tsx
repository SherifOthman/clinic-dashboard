import { DataTable, type Column } from "@/core/components/ui/DataTable";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { Chip, Tooltip } from "@heroui/react";
import { Button } from "@heroui/react";
import { Ban, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";
import {
  useMarkAppointmentPaid,
  useRefundAppointment,
  useUpdateAppointmentStatus,
} from "../appointmentsHooks";
import type { AppointmentDto, AppointmentStatus, DoctorCheckInResult, DoctorForBranch } from "../types";
import { buildClientPage } from "@/features/admin/utils/clientPagination";
import { ActionsDropdown, NextStatusButton, PatientCell, SlotCell, STATUS_COLOR } from "./appointmentColumns";
import { DoctorCheckInButton } from "./DoctorCheckInButton";
import { DoctorAbsentDialog } from "./DoctorAbsentDialog";
import { RescheduleAppointmentDialog } from "./RescheduleAppointmentDialog";

interface DoctorAppointmentsPanelProps {
  doctor: DoctorForBranch;
  appointments: AppointmentDto[];
  isLoading: boolean;
  searchTerm?: string;
  visitTypeFilter?: string;
  paymentFilter?: string;
  dateStr: string;
  onAddAppointment?: () => void;
  onEditAppointment?: (a: AppointmentDto) => void;
  onViewPatient?: (patientId: string) => void;
  onDoctorLate?: (result: DoctorCheckInResult, doctorName: string) => void;
  branchId?: string;
}

const SINGLE_PAGE   = 10;
const TERMINAL = new Set<AppointmentStatus>(["Completed", "Cancelled", "NoShow"]);

// ── Panel header ──────────────────────────────────────────────────────────────

function PanelHeader({
  doctor, count, filteredCount, branchId, hasActiveAppointments,
  onAddAppointment, onDoctorLate, onAbsent,
}: {
  doctor: DoctorForBranch;
  count: number;
  filteredCount: number;
  branchId?: string;
  hasActiveAppointments: boolean;
  onAddAppointment?: () => void;
  onDoctorLate?: (result: DoctorCheckInResult, doctorName: string) => void;
  onAbsent?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const num  = (n: number) => isAr ? toArabicNumerals(String(n)) : String(n);
  const isFiltered = filteredCount !== count;

  return (
    <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/50">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
          {doctor.fullName.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate leading-tight">{doctor.fullName}</p>
          <p className="text-xs text-muted">{t("appointments.queueBased")}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {/* Count — shows filtered/total when a filter is active */}
        {isFiltered ? (
          <span className="text-xs font-medium text-accent">
            {num(filteredCount)}<span className="text-muted">/{num(count)}</span>
          </span>
        ) : (
          <span className="text-xs text-muted">{num(count)}</span>
        )}
        {branchId && (
          <DoctorCheckInButton
            doctorInfoId={doctor.doctorInfoId}
            branchId={branchId}
            hasSessionToday={doctor.hasSessionToday}
            appointmentType={doctor.appointmentType}
            onLate={(result) => onDoctorLate?.(result, doctor.fullName)}
          />
        )}
        {branchId && hasActiveAppointments && onAbsent && (
          <Tooltip delay={300}>
            <Tooltip.Trigger>
              <Button size="sm" variant="ghost" isIconOnly onPress={onAbsent}
                aria-label={t("appointments.doctorAbsent")}
                className="text-danger hover:bg-danger/10">
                <Ban className="h-3.5 w-3.5" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content><p>{t("appointments.doctorAbsent")}</p></Tooltip.Content>
          </Tooltip>
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
  doctor, appointments, isLoading, searchTerm = "",
  visitTypeFilter = "", paymentFilter = "",
  dateStr,
  onAddAppointment, onEditAppointment, onViewPatient, onDoctorLate, branchId,
}: DoctorAppointmentsPanelProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const [page, setPage] = useState(1);
  const [absentOpen, setAbsentOpen]                         = useState(false);
  const [reschedulingAppt, setReschedulingAppt]             = useState<AppointmentDto | null>(null);

  const updateStatus = useUpdateAppointmentStatus();
  const markPaid     = useMarkAppointmentPaid();
  const refund       = useRefundAppointment();
  const isPending    = updateStatus.isPending || markPaid.isPending || refund.isPending;

  const onStatusChange = (id: string, status: string) => updateStatus.mutate({ id, status });

  const sorted = useMemo(() => {
    const active   = appointments.filter((a) => !TERMINAL.has(a.status));
    const terminal = appointments.filter((a) => TERMINAL.has(a.status));
    return [...active, ...terminal];
  }, [appointments]);

  const filtered = useMemo(() => {
    let result = sorted;

    // Text search — patient name or code
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((a) =>
        a.patientName.toLowerCase().includes(q) ||
        (a.patientCode ?? "").toLowerCase().includes(q)
      );
    }

    // Visit type filter
    if (visitTypeFilter) {
      result = result.filter((a) => a.visitTypeName === visitTypeFilter);
    }

    // Payment status filter
    if (paymentFilter === "unpaid") {
      result = result.filter((a) =>
        !a.invoiceId && a.status !== "Cancelled" && a.status !== "NoShow"
      );
    } else if (paymentFilter === "paid") {
      result = result.filter((a) => !!a.invoiceId);
    }

    return result;
  }, [sorted, searchTerm, visitTypeFilter, paymentFilter]);

  const hasActiveAppointments = appointments.some(
    (a) => a.status === "Pending" || a.status === "Waiting"
  );

  const activeCount = appointments.filter(
    (a) => a.status === "Pending" || a.status === "Waiting"
  ).length;

  const headerProps = {
    doctor,
    branchId,
    count: appointments.length,
    filteredCount: filtered.length,
    hasActiveAppointments,
    onAddAppointment,
    onDoctorLate,
    onAbsent: branchId ? () => setAbsentOpen(true) : undefined,
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <PanelHeader {...headerProps} />
        <div className="flex flex-col gap-1.5 p-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-9 animate-pulse rounded-lg bg-surface-secondary" />)}
        </div>
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <PanelHeader {...headerProps} />
        <div className="py-8 text-center text-sm text-muted">{t("appointments.noAppointments")}</div>
      </div>
    );
  }

  // ── Shared action handlers ─────────────────────────────────────────────────
  const renderActions = (a: AppointmentDto) => (
    <div className="flex items-center justify-end gap-0.5">
      <NextStatusButton a={a} t={t} onStatusChange={onStatusChange} isPending={isPending} />
      <ActionsDropdown
        a={a} t={t}
        onStatusChange={onStatusChange}
        onMarkPaid={(id) => markPaid.mutate(id)}
        onRefund={(id) => refund.mutate(id)}
        onViewPatient={onViewPatient}
        onEdit={onEditAppointment}
        onReschedule={(appt) => setReschedulingAppt(appt)}
        isPending={isPending}
      />
    </div>
  );

  // ── Single mode (always) ───────────────────────────────────────────────────
  const { items: paged, meta: pageData } = buildClientPage(filtered, page, SINGLE_PAGE);

  const columns: Column<AppointmentDto>[] = [
    {
      key: "slot",
      label: t("appointments.columns.queue"),
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
      render: renderActions,
    },
  ];

  return (
    <>
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <PanelHeader {...headerProps} />
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
            <TablePagination data={pageData} currentPage={page} onPageChange={setPage} />
          </>
        )}
      </div>

      {branchId && (
        <DoctorAbsentDialog
          isOpen={absentOpen}
          doctorInfoId={doctor.doctorInfoId}
          branchId={branchId}
          dateStr={dateStr}
          doctorName={doctor.fullName}
          appointmentCount={activeCount}
          onClose={() => setAbsentOpen(false)}
        />
      )}
      <RescheduleAppointmentDialog
        appointment={reschedulingAppt}
        doctorMemberId={doctor.memberId}
        branchId={branchId ?? null}
        onClose={() => setReschedulingAppt(null)}
      />
    </>
  );
}
