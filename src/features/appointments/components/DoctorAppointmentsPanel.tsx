import { DataTable, type Column } from "@/core/components/ui/DataTable";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";
import { Button, Chip, Tooltip } from "@heroui/react";
import { Ban, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { buildClientPage } from "@/features/admin/utils/clientPagination";
import {
  useMarkAppointmentPaid,
  useRefundAppointment,
  useUpdateAppointmentStatus,
} from "../appointmentsHooks";
import type { AppointmentDto, AppointmentStatus, DoctorCheckInResult, DoctorForBranch } from "../types";
import { ActionsDropdown, NextStatusButton, PatientCell, SlotCell, STATUS_COLOR } from "./appointmentColumns";
import { DoctorAbsentDialog } from "./DoctorAbsentDialog";
import { DoctorCheckInButton } from "./DoctorCheckInButton";
import { RescheduleAppointmentDialog } from "./RescheduleAppointmentDialog";

interface DoctorAppointmentsPanelProps {
  doctor: DoctorForBranch;
  appointments: AppointmentDto[];
  isLoading: boolean;
  dateStr: string;
  branchId?: string;
  onAddAppointment?: () => void;
  onEditAppointment?: (a: AppointmentDto) => void;
  onViewPatient?: (patientId: string) => void;
  onDoctorLate?: (result: DoctorCheckInResult, doctorName: string) => void;
}

const PAGE_SIZE = 10;
const ACTIVE_STATUSES = new Set<AppointmentStatus>(["Pending", "Waiting", "InProgress"]);

// ── Panel header ──────────────────────────────────────────────────────────────

function PanelHeader({
  doctor, count, branchId, hasActiveAppointments,
  onAddAppointment, onDoctorLate, onAbsent,
}: {
  doctor: DoctorForBranch;
  count: number;
  branchId?: string;
  hasActiveAppointments: boolean;
  onAddAppointment?: () => void;
  onDoctorLate?: (result: DoctorCheckInResult, doctorName: string) => void;
  onAbsent?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const num = (n: number) => i18n.language === "ar" ? toArabicNumerals(String(n)) : String(n);

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
        <span className="text-xs text-muted">{num(count)}</span>

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
  doctor, appointments, isLoading, dateStr, branchId,
  onAddAppointment, onEditAppointment, onViewPatient, onDoctorLate,
}: DoctorAppointmentsPanelProps) {
  const { t, i18n } = useTranslation();
  const [page, setPage]                         = useState(1);
  const [absentOpen, setAbsentOpen]             = useState(false);
  const [reschedulingAppt, setReschedulingAppt] = useState<AppointmentDto | null>(null);

  const updateStatus = useUpdateAppointmentStatus();
  const markPaid     = useMarkAppointmentPaid();
  const refund       = useRefundAppointment();
  const isPending    = updateStatus.isPending || markPaid.isPending || refund.isPending;

  const activeCount = appointments.filter((a) => ACTIVE_STATUSES.has(a.status)).length;

  const headerProps = {
    doctor, branchId,
    count: appointments.length,
    hasActiveAppointments: activeCount > 0,
    onAddAppointment, onDoctorLate,
    onAbsent: branchId ? () => setAbsentOpen(true) : undefined,
  };

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

  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <PanelHeader {...headerProps} />
        <div className="py-8 text-center text-sm text-muted">{t("appointments.noAppointments")}</div>
      </div>
    );
  }

  const columns: Column<AppointmentDto>[] = [
    {
      key: "slot",
      label: t("appointments.columns.queue"),
      render: (a) => <SlotCell a={a} isAr={i18n.language === "ar"} />,
    },
    {
      key: "patient",
      label: t("appointments.columns.patient"),
      render: (a) => <PatientCell a={a} isAr={i18n.language === "ar"} onViewPatient={onViewPatient} t={t} />,
    },
    {
      key: "visitType",
      label: t("appointments.columns.visitType"),
      render: (a) => <span className="text-sm text-muted">{a.visitTypeName}</span>,
    },
    {
      key: "price",
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
          <NextStatusButton
            a={a} t={t}
            onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
            isPending={isPending}
          />
          <ActionsDropdown
            a={a} t={t}
            onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
            onMarkPaid={(id) => markPaid.mutate(id)}
            onRefund={(id) => refund.mutate(id)}
            onViewPatient={onViewPatient}
            onEdit={onEditAppointment}
            onReschedule={setReschedulingAppt}
            isPending={isPending}
          />
        </div>
      ),
    },
  ];

  const { items: paged, meta: pageData } = buildClientPage(appointments, page, PAGE_SIZE);

  return (
    <>
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <PanelHeader {...headerProps} />
        <DataTable columns={columns} data={paged} keyExtractor={(a) => a.id} />
        <TablePagination data={pageData} currentPage={page} onPageChange={setPage} />
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
