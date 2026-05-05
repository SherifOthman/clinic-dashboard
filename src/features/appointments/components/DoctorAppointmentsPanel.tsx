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
import { ActionsDropdown, PatientCell, SlotCell, STATUS_COLOR } from "./appointmentColumns";
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
  const isAr = i18n.language === "ar";
  const num  = (n: number) => isAr ? toArabicNumerals(String(n)) : String(n);
  const isQueue = doctor.appointmentType === "Queue";

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
          {doctor.fullName.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{doctor.fullName}</p>
          <p className="text-xs text-muted flex items-center gap-1">
            {isQueue ? t("appointments.queueBased") : <><Calendar className="h-3 w-3" />{t("appointments.timeBased")}</>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs text-muted">{num(count)} {t("appointments.total")}</span>
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
}

// ── Main panel ────────────────────────────────────────────────────────────────

export function DoctorAppointmentsPanel({
  doctor, appointments, isLoading, viewMode,
  onAddAppointment, onEditAppointment, onViewPatient, branchId,
}: DoctorAppointmentsPanelProps) {
  const { t, i18n } = useTranslation();
  const isAr   = i18n.language === "ar";
  const isSingle = viewMode === "single";
  const [page, setPage] = useState(1);

  const updateStatus = useUpdateAppointmentStatus();
  const markPaid     = useMarkAppointmentPaid();
  const refund       = useRefundAppointment();

  const isPending = updateStatus.isPending || markPaid.isPending || refund.isPending;

  // Active first, terminal at the end
  const sorted = useMemo(() => {
    const active   = appointments.filter((a) => !TERMINAL.has(a.status));
    const terminal = appointments.filter((a) => TERMINAL.has(a.status));
    return [...active, ...terminal];
  }, [appointments]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged      = isSingle ? sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : sorted;

  const num = (n: number) => isAr ? toArabicNumerals(String(n)) : String(n);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <PanelHeader doctor={doctor} count={0} branchId={branchId} onAddAppointment={onAddAppointment} />
        <div className="flex flex-col gap-2 p-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-surface-secondary" />)}
        </div>
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <PanelHeader doctor={doctor} count={0} branchId={branchId} onAddAppointment={onAddAppointment} />
        <div className="py-10 text-center text-sm text-muted">{t("appointments.noAppointments")}</div>
      </div>
    );
  }

  // ── Table ──────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <PanelHeader doctor={doctor} count={appointments.length} branchId={branchId} onAddAppointment={onAddAppointment} />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-surface-secondary/30">
              {/* Slot (time or queue) */}
              <th className="px-3 py-2 text-start text-xs font-medium text-muted whitespace-nowrap">
                {doctor.appointmentType === "Queue" ? t("appointments.columns.queue") : t("appointments.columns.time")}
              </th>
              {/* Patient */}
              <th className="px-3 py-2 text-start text-xs font-medium text-muted">
                {t("appointments.columns.patient")}
              </th>
              {/* Visit type — only in single mode */}
              {isSingle && (
                <th className="px-3 py-2 text-start text-xs font-medium text-muted whitespace-nowrap">
                  {t("appointments.columns.visitType")}
                </th>
              )}
              {/* Price — only in single mode */}
              {isSingle && (
                <th className="px-3 py-2 text-start text-xs font-medium text-muted">
                  {t("appointments.columns.price")}
                </th>
              )}
              {/* Status */}
              <th className="px-3 py-2 text-start text-xs font-medium text-muted">
                {t("appointments.columns.status")}
              </th>
              {/* Actions */}
              <th className="px-3 py-2 text-end text-xs font-medium text-muted w-10" />
            </tr>
          </thead>
          <tbody>
            {paged.map((appt) => (
              <tr
                key={appt.id}
                className="border-b border-border/40 transition-colors hover:bg-surface-secondary/30"
              >
                {/* Slot */}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <SlotCell a={appt} isAr={isAr} />
                </td>

                {/* Patient */}
                <td className="px-3 py-2.5">
                  <PatientCell a={appt} isAr={isAr} onViewPatient={onViewPatient} />
                </td>

                {/* Visit type */}
                {isSingle && (
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="text-xs text-muted">{appt.visitTypeName}</span>
                  </td>
                )}

                {/* Price */}
                {isSingle && (
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="text-xs tabular-nums text-muted">${appt.finalPrice.toFixed(0)}</span>
                  </td>
                )}

                {/* Status */}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <Chip size="sm" variant="soft" color={STATUS_COLOR[appt.status]}>
                    {t(`appointments.statuses.${appt.status}`)}
                  </Chip>
                </td>

                {/* Actions dropdown */}
                <td className="px-2 py-2.5 text-end">
                  <ActionsDropdown
                    a={appt}
                    t={t}
                    onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
                    onMarkPaid={(id) => markPaid.mutate(id)}
                    onRefund={(id) => refund.mutate(id)}
                    onViewPatient={onViewPatient}
                    onEdit={onEditAppointment}
                    isPending={isPending}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination — single mode only */}
      {isSingle && totalPages > 1 && (
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
