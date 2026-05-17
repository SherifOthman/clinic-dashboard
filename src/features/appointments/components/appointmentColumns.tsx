import { Button, Dropdown, Label, Separator, Tooltip } from "@heroui/react";
import type { TFunction } from "i18next";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  CalendarClock,
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

// ── Initials avatar — pink for female, accent for male ────────────────────────

function PatientAvatar({ name, gender }: { name: string; gender?: string }) {
  const parts  = name.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`
    : parts[0]?.[0] ?? "?";

  const isFemale = gender === "Female";
  const cls = isFemale
    ? "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
    : "bg-accent/10 text-accent";

  return (
    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase ${cls}`}>
      {initials.toUpperCase()}
    </div>
  );
}

// ── Queue slot cell ───────────────────────────────────────────────────────────

export function SlotCell({ a, isAr }: { a: AppointmentDto; isAr: boolean }) {
  const num = (v: string | number) => isAr ? toArabicNumerals(String(v)) : String(v);
  return (
    <span className="text-sm font-bold text-accent tabular-nums" dir="ltr">
      #{num(a.queueNumber ?? "—")}
    </span>
  );
}

// ── Patient cell — avatar + name + code + age ─────────────────────────────────

export function PatientCell({
  a, isAr, onViewPatient, t,
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
      className="flex items-center gap-2 text-start focus:outline-none group"
    >
      <PatientAvatar name={a.patientName} gender={a.patientGender} />

      <div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium leading-tight group-hover:underline">
            {a.patientName}
          </span>
          {isUnpaid && (
            <Tooltip delay={300}>
              <Tooltip.Trigger>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-danger/15 text-danger shrink-0">
                  <BanknoteArrowDown className="h-3 w-3" />
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
      </div>
    </button>
  );
}

// ── Next-status quick button ──────────────────────────────────────────────────

const NEXT_STATUS: Partial<Record<AppointmentStatus, { next: string; icon: React.ReactNode; label: string }>> = {
  Pending:    { next: "Waiting",    icon: <UserCheck className="h-3.5 w-3.5 text-warning" />,  label: "appointments.markWaiting"    },
  Waiting:    { next: "InProgress", icon: <Clock     className="h-3.5 w-3.5 text-accent" />,   label: "appointments.start"          },
  InProgress: { next: "Completed",  icon: <CheckCircle className="h-3.5 w-3.5 text-success" />, label: "appointments.complete"      },
  NoShow:     { next: "Waiting",    icon: <UserCheck className="h-3.5 w-3.5 text-warning" />,  label: "appointments.patientArrived" },
  Cancelled:  { next: "Pending",    icon: <UserCheck className="h-3.5 w-3.5 text-muted" />,    label: "appointments.reactivate"     },
};

export function NextStatusButton({
  a, t, onStatusChange, isPending,
}: {
  a: AppointmentDto;
  t: TFunction;
  onStatusChange: (id: string, status: string) => void;
  isPending: boolean;
}) {
  const transition = NEXT_STATUS[a.status];
  if (!transition) return null;

  return (
    <Tooltip delay={300}>
      <Tooltip.Trigger>
        <Button
          size="sm" variant="ghost" isIconOnly
          isDisabled={isPending}
          onPress={() => onStatusChange(a.id, transition.next)}
          aria-label={t(transition.label)}
        >
          {transition.icon}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content><p>{t(transition.label)}</p></Tooltip.Content>
    </Tooltip>
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
  onReschedule?: (a: AppointmentDto) => void;
  isPending: boolean;
}

export function ActionsDropdown({
  a, t, onStatusChange, onMarkPaid, onRefund, onViewPatient, onEdit, onReschedule, isPending,
}: ActionsDropdownProps) {
  const isActive     = !["Completed", "Cancelled", "NoShow"].includes(a.status);
  const canReschedule = a.status === "Pending" || a.status === "Waiting";

  const handleAction = (key: React.Key) => {
    switch (key) {
      case "view-patient": onViewPatient?.(a.patientId); break;
      case "edit":         onEdit?.(a); break;
      case "reschedule":   onReschedule?.(a); break;
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

            {onReschedule && canReschedule && (
              <Dropdown.Item id="reschedule" textValue={t("appointments.reschedulePatient")}>
                <CalendarClock className="h-3.5 w-3.5 shrink-0 text-muted" />
                <Label>{t("appointments.reschedulePatient")}</Label>
              </Dropdown.Item>
            )}
          </Dropdown.Section>

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
