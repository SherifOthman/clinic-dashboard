import { Button, Chip, Dropdown, Label, Separator, Tooltip } from "@heroui/react";
import type { TFunction } from "i18next";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Pencil,
  User,
  UserCheck,
  XCircle,
} from "lucide-react";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";
import { calculateDetailedAge, formatDetailedAge } from "@/core/utils/ageUtils";
import type { AppointmentDto, AppointmentStatus } from "../types";

// ── Status colour map ─────────────────────────────────────────────────────────

export const STATUS_COLOR: Record<AppointmentStatus, "warning" | "accent" | "success" | "danger" | "default"> = {
  Pending:    "default",
  Waiting:    "warning",
  InProgress: "accent",
  Completed:  "success",
  Cancelled:  "danger",
  NoShow:     "default",
};

// ── Compact time/queue cell ───────────────────────────────────────────────────

export function SlotCell({ a, isAr }: { a: AppointmentDto; isAr: boolean }) {
  const num = (v: string | number) => isAr ? toArabicNumerals(String(v)) : String(v);

  if (a.type === "Queue") {
    return (
      <span className="text-sm font-bold text-accent tabular-nums whitespace-nowrap">
        #{num(a.queueNumber ?? "—")}
      </span>
    );
  }

  return (
    <span className="text-sm font-bold text-accent tabular-nums whitespace-nowrap" dir="ltr">
      {a.scheduledTime ?? "—"}
      {a.endTime && <span className="text-xs text-muted font-normal"> – {a.endTime}</span>}
    </span>
  );
}

// ── Patient cell — name + code + age, no avatar ───────────────────────────────

export function PatientCell({
  a,
  isAr,
  onViewPatient,
}: {
  a: AppointmentDto;
  isAr: boolean;
  onViewPatient?: (id: string) => void;
}) {
  const age = a.patientDateOfBirth
    ? formatDetailedAge(calculateDetailedAge(a.patientDateOfBirth), isAr)
    : null;

  return (
    <button
      type="button"
      onClick={() => onViewPatient?.(a.patientId)}
      className="text-start hover:underline focus:outline-none focus:underline"
    >
      {/* Unpaid badge */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium leading-tight">{a.patientName}</span>
        {!a.invoiceId && a.status !== "Cancelled" && a.status !== "NoShow" && (
          <Tooltip delay={300}>
            <Tooltip.Trigger>
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-warning/20 text-warning">
                <BanknoteArrowDown className="h-2.5 w-2.5" />
              </span>
            </Tooltip.Trigger>
            <Tooltip.Content><p>Unpaid</p></Tooltip.Content>
          </Tooltip>
        )}
      </div>
      {/* Code + age on same line, muted */}
      {(a.patientCode || age) && (
        <div className="flex items-center gap-1 text-xs text-muted" dir={isAr ? "rtl" : "ltr"}>
          {a.patientCode && <span>{a.patientCode}</span>}
          {a.patientCode && age && <span>·</span>}
          {age && <span>{age}</span>}
        </div>
      )}
    </button>
  );
}

// ── Actions dropdown ──────────────────────────────────────────────────────────

interface ActionsDropdownProps {
  a: AppointmentDto;
  t: TFunction;
  onStatusChange: (id: string, status: string) => void;
  onMarkPaid: (id: string) => void;
  onRefund: (id: string) => void;
  onViewPatient?: (id: string) => void;
  onEdit?: (a: AppointmentDto) => void;
  isPending: boolean;
}

export function ActionsDropdown({
  a, t, onStatusChange, onMarkPaid, onRefund, onViewPatient, onEdit, isPending,
}: ActionsDropdownProps) {
  const isActive = !["Completed", "Cancelled", "NoShow"].includes(a.status);

  const handleAction = (key: React.Key) => {
    switch (key) {
      case "view-patient":  onViewPatient?.(a.patientId); break;
      case "edit":          onEdit?.(a); break;
      case "waiting":       onStatusChange(a.id, "Waiting"); break;
      case "in-progress":   onStatusChange(a.id, "InProgress"); break;
      case "complete":      onStatusChange(a.id, "Completed"); break;
      case "cancel":        onStatusChange(a.id, "Cancelled"); break;
      case "paid":          onMarkPaid(a.id); break;
      case "refund":        onRefund(a.id); break;
    }
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button size="sm" variant="ghost" isIconOnly isDisabled={isPending} aria-label="Actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu onAction={handleAction}>

          {/* ── Patient & appointment ── */}
          <Dropdown.Section>
            <Dropdown.Item id="view-patient" textValue={t("appointments.viewPatient")}>
              <User className="h-3.5 w-3.5 shrink-0 text-muted" />
              <Label>{t("appointments.viewPatient")}</Label>
            </Dropdown.Item>
            {onEdit && isActive && (
              <Dropdown.Item id="edit" textValue={t("appointments.editAppointment")}>
                <Pencil className="h-3.5 w-3.5 shrink-0 text-muted" />
                <Label>{t("appointments.editAppointment")}</Label>
              </Dropdown.Item>
            )}
          </Dropdown.Section>

          {/* ── Status transitions ── */}
          {isActive && (
            <>
              <Separator />
              <Dropdown.Section>
                {a.status === "Pending" && a.type === "Time" && (
                  <Dropdown.Item id="waiting" textValue={t("appointments.markWaiting")}>
                    <UserCheck className="h-3.5 w-3.5 shrink-0 text-warning" />
                    <Label>{t("appointments.markWaiting")}</Label>
                  </Dropdown.Item>
                )}
                {(a.status === "Pending" || a.status === "Waiting") && (
                  <Dropdown.Item id="in-progress" textValue={t("appointments.start")}>
                    <Clock className="h-3.5 w-3.5 shrink-0 text-accent" />
                    <Label>{t("appointments.start")}</Label>
                  </Dropdown.Item>
                )}
                {a.status === "InProgress" && (
                  <Dropdown.Item id="complete" textValue={t("appointments.complete")}>
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-success" />
                    <Label>{t("appointments.complete")}</Label>
                  </Dropdown.Item>
                )}
                <Dropdown.Item id="cancel" textValue={t("appointments.cancel")} variant="danger">
                  <XCircle className="h-3.5 w-3.5 shrink-0 text-danger" />
                  <Label>{t("appointments.cancel")}</Label>
                </Dropdown.Item>
              </Dropdown.Section>
            </>
          )}

          {/* ── Payment ── */}
          <Separator />
          <Dropdown.Section>
            {!a.invoiceId ? (
              <Dropdown.Item id="paid" textValue={t("appointments.markPaid")}>
                <BanknoteArrowUp className="h-3.5 w-3.5 shrink-0 text-success" />
                <Label>{t("appointments.markPaid")}</Label>
              </Dropdown.Item>
            ) : (
              <Dropdown.Item id="refund" textValue={t("appointments.refund")} variant="danger">
                <BanknoteArrowDown className="h-3.5 w-3.5 shrink-0 text-danger" />
                <Label>{t("appointments.refund")}</Label>
              </Dropdown.Item>
            )}
          </Dropdown.Section>

        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
