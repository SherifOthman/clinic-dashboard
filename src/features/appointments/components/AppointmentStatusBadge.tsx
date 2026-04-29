import { Chip } from "@heroui/react";
import type { AppointmentStatus } from "../types";

const CONFIG: Record<AppointmentStatus, { color: "warning" | "accent" | "success" | "danger" | "default"; label: string }> = {
  Pending:    { color: "warning", label: "Pending" },
  InProgress: { color: "accent",  label: "In Progress" },
  Completed:  { color: "success", label: "Completed" },
  Cancelled:  { color: "danger",  label: "Cancelled" },
  NoShow:     { color: "default", label: "No Show" },
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const { color, label } = CONFIG[status] ?? CONFIG.Pending;
  return <Chip size="sm" variant="soft" color={color}>{label}</Chip>;
}
