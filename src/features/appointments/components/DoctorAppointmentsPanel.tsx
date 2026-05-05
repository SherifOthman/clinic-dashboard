import { Chip, Tooltip } from "@heroui/react";
import { Button } from "@heroui/react";
import { Calendar, Plus } from "lucide-react";
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
import { ActionsDropdown, NextStatusButton, PatientCell, SlotCell, STATUS_COLOR } from "./appointmentColumns";
import { DoctorCheckInButton } from "./DoctorCheckInButton";

interface DoctorAppointmentsPanelProps {
  doctor: DoctorForBranch;
  appointments: AppointmentDto[];
  isLoading: boolean;
  viewMode: ViewMode;
  onAddAppointment?: () => void;
  onEditAppointment?: (a: AppointmentDto) => void;
  onViewPatient?: (patientId: string) => void;
  branchId?: string;
}

const PAGE_SIZE = 10;
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
          <p className="text-sm font-semibold truncate leading-tight" dir="auto">{doctor.fullName}</p>
          <p className="text-xs text-muted" dir="auto">
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
  doctor, appointments, isLoading, viewMode,
  onAddAppointment, onEditAppointment, onViewPatient, branchId,
}: DoctorAppointmentsPanelProps) {
  const { t, i18n } = useTranslation();
  const isAr     = i18n.language === "ar";
  const isSingle = viewMode === "single";
  const [page, setPage] = useState(1);

  const updateStatus = useUpdateAppointmentStatus();
  const markPaid     = useMarkAppointmentPaid();
  const refund       = useRefundAppointment();
  const isPending    = updateStatus.isPending || markPaid.isPending || refund.isPending;

  const sorted = useMemo(() => {
    const active   = appointments.filter((a) => !TERMINAL.has(a.status));
    const terminal = appointments.filter((a) => TERMINAL.has(a.status));
    return [...active, ...terminal];
  }, [appointments]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged      = isSingle ? sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : sorted;
  const num        = (n: number) => isAr ? toArabicNumerals(String(n)) : String(n);

  const onStatusChange = (id: string, status: string) => updateStatus.mutate({ id, status });

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
    // In multi mode, return null so the grid doesn't show empty cards
    if (!isSingle) return null;
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <PanelHeader doctor={doctor} count={0} branchId={branchId} onAddAppointment={onAddAppointment} />
        <div className="py-8 text-center text-sm text-muted">{t("appointments.noAppointments")}</div>
      </div>
    );
  }

  // ── Single mode: full table ────────────────────────────────────────────────
  if (isSingle) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <PanelHeader doctor={doctor} count={appointments.length} branchId={branchId} onAddAppointment={onAddAppointment} />
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-24" />   {/* slot */}
            <col />                    {/* patient — flex */}
            <col className="w-28" />   {/* visit type */}
            <col className="w-16" />   {/* price */}
            <col className="w-28" />   {/* status */}
            <col className="w-20" />   {/* actions */}
          </colgroup>
          <thead>
            <tr className="border-b border-border/50 bg-surface-secondary/30">
              <th className="px-3 py-2 text-start text-xs font-medium text-muted">
                {doctor.appointmentType === "Queue" ? t("appointments.columns.queue") : t("appointments.columns.time")}
              </th>
              <th className="px-3 py-2 text-start text-xs font-medium text-muted">{t("appointments.columns.patient")}</th>
              <th className="px-3 py-2 text-start text-xs font-medium text-muted">{t("appointments.columns.visitType")}</th>
              <th className="px-3 py-2 text-start text-xs font-medium text-muted">{t("appointments.columns.price")}</th>
              <th className="px-3 py-2 text-start text-xs font-medium text-muted">{t("appointments.columns.status")}</th>
              <th className="px-2 py-2 text-end text-xs font-medium text-muted" />
            </tr>
          </thead>
          <tbody>
            {paged.map((appt) => (
              <tr key={appt.id} className="border-b border-border/40 hover:bg-surface-secondary/30 transition-colors">
                <td className="px-3 py-2"><SlotCell a={appt} isAr={isAr} /></td>
                <td className="px-3 py-2 min-w-0">
                  <PatientCell a={appt} isAr={isAr} onViewPatient={onViewPatient} t={t} />
                </td>
                <td className="px-3 py-2">
                  <span className="text-xs text-muted truncate block">{appt.visitTypeName}</span>
                </td>
                <td className="px-3 py-2">
                  <span className="text-xs tabular-nums text-muted">${appt.finalPrice.toFixed(0)}</span>
                </td>
                <td className="px-3 py-2">
                  <Chip size="sm" variant="soft" color={STATUS_COLOR[appt.status]}>
                    {t(`appointments.statuses.${appt.status}`)}
                  </Chip>
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center justify-end gap-0.5">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/50 px-4 py-2">
            <span className="text-xs text-muted">
              {num((page - 1) * PAGE_SIZE + 1)}–{num(Math.min(page * PAGE_SIZE, sorted.length))} {t("common.of")} {num(sorted.length)}
            </span>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" isDisabled={page === 1} onPress={() => setPage((p) => p - 1)}>
                {t("common.previous")}
              </Button>
              <span className="min-w-[3rem] text-center text-xs text-muted">{num(page)} / {num(totalPages)}</span>
              <Button size="sm" variant="ghost" isDisabled={page === totalPages} onPress={() => setPage((p) => p + 1)}>
                {t("common.next")}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Multi mode: compact list (no table, no horizontal scroll) ─────────────
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden" dir="ltr">
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

      {/* Rows */}
      <div className="flex flex-col">
        {paged.map((appt) => (
          <div
            key={appt.id}
            className="grid grid-cols-[auto_1fr_auto_auto] gap-x-2 items-center border-b border-border/40 px-3 py-2 hover:bg-surface-secondary/30 transition-colors"
          >
            {/* Slot */}
            <div className="min-w-[3rem]">
              <SlotCell a={appt} isAr={isAr} />
            </div>

            {/* Patient */}
            <div className="min-w-0">
              <PatientCell a={appt} isAr={isAr} onViewPatient={onViewPatient} t={t} />
            </div>

            {/* Status chip */}
            <div>
              <Chip size="sm" variant="soft" color={STATUS_COLOR[appt.status]}>
                {t(`appointments.statuses.${appt.status}`)}
              </Chip>
            </div>

            {/* Quick next-status + dropdown */}
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
    </div>
  );
}
