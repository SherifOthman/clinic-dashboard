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
      <span className="text-sm font-bold text-accent tabular-nums" dir="ltr">
        #{num(a.queueNumber ?? "—")}
      </span>
    );
  }

  return (
    <span className="text-sm font-bold text-accent tabular-nums" dir="ltr">
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
  t,
}: {
  a: AppointmentDto;
  isAr: boolean;
  onViewPatient?: (id: string) => void;
  t: TFunction;
}) {
  const age = a.patientDateOfBirth
    ? formatDetailedAge(calculateDetailedAge(a.patientDateOfBirth), isAr)
    : null;

  const isUnpaid = !a.invoiceId && a.status !== "Cancelled" && a.status !== "NoShow";

  return (
    <button
      type="button"
      onClick={() => onViewPatient?.(a.patientId)}
      className="text-start focus:outline-none group"
    >
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium leading-tight group-hover:underline">{a.patientName}</span>
        {isUnpaid && (
          <Tooltip delay={300}>
            <Tooltip.Trigger>
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger/15 text-danger shrink-0">
                <BanknoteArrowDown className="h-2 w-2" />
              </span>
            </Tooltip.Trigger>
            <Tooltip.Content><p>{t("appointments.unpaid")}</p></Tooltip.Content>
          </Tooltip>
        )}
      </div>
      {(a.patientCode || age) && (
        <div className="flex items-center gap-1 text-xs text-muted">
          {a.patientCode && <span>{a.patientCode}</span>}
          {a.patientCode && age && <span>·</span>}
          {age && <span>{age}</span>}
        </div>
      )}
    </button>
  );
}

// ── Next-status quick button (inline, before the ⋯ menu) ─────────────────────

export function NextStatusButton({
  a, t, onStatusChange, isPending,
}: {
  a: AppointmentDto;
  t: TFunction;
  onStatusChange: (id: string, status: string) => void;
  isPending: boolean;
}) {
  if (a.status === "Pending" && a.type === "Queue") {
    return (
      <Tooltip delay={300}>
        <Tooltip.Trigger>
          <Button size="sm" variant="ghost" isIconOnly isDisabled={isPending}
            onPress={() => onStatusChange(a.id, "InProgress")} aria-label={t("appointments.start")}>
            <Clock className="h-3.5 w-3.5 text-accent" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content><p>{t("appointments.start")}</p></Tooltip.Content>
      </Tooltip>
    );
  }
  if (a.status === "Pending" && a.type === "Time") {
    return (
      <Tooltip delay={300}>
        <Tooltip.Trigger>
          <Button size="sm" variant="ghost" isIconOnly isDisabled={isPending}
            onPress={() => onStatusChange(a.id, "Waiting")} aria-label={t("appointments.markWaiting")}>
            <UserCheck className="h-3.5 w-3.5 text-warning" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content><p>{t("appointments.markWaiting")}</p></Tooltip.Content>
      </Tooltip>
    );
  }
  if (a.status === "Waiting") {
    return (
      <Tooltip delay={300}>
        <Tooltip.Trigger>
          <Button size="sm" variant="ghost" isIconOnly isDisabled={isPending}
            onPress={() => onStatusChange(a.id, "InProgress")} aria-label={t("appointments.start")}>
            <Clock className="h-3.5 w-3.5 text-accent" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content><p>{t("appointments.start")}</p></Tooltip.Content>
      </Tooltip>
    );
  }
  if (a.status === "InProgress") {
    return (
      <Tooltip delay={300}>
        <Tooltip.Trigger>
          <Button size="sm" variant="ghost" isIconOnly isDisabled={isPending}
            onPress={() => onStatusChange(a.id, "Completed")} aria-label={t("appointments.complete")}>
            <CheckCircle className="h-3.5 w-3.5 text-success" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content><p>{t("appointments.complete")}</p></Tooltip.Content>
      </Tooltip>
    );
  }
  return null;
}

// ── Actions dropdown (⋯) ─────────────────────────────────────────────────────

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
      case "view-patient": onViewPatient?.(a.patientId); break;
      case "edit":         onEdit?.(a); break;
      case "cancel":       onStatusChange(a.id, "Cancelled"); break;
      case "paid":         onMarkPaid(a.id); break;
      case "refund":       onRefund(a.id); break;
    }
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button size="sm" variant="ghost" isIconOnly isDisabled={isPending} aria-label="More actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu onAction={handleAction}>

          {/* Patient & appointment */}
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

          {/* Cancel */}
          {isActive && (
            <>
              <Separator />
              <Dropdown.Section>
                <Dropdown.Item id="cancel" textValue={t("appointments.cancel")} variant="danger">
                  <XCircle className="h-3.5 w-3.5 shrink-0 text-danger" />
                  <Label>{t("appointments.cancel")}</Label>
                </Dropdown.Item>
              </Dropdown.Section>
            </>
          )}

          {/* Payment */}
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
