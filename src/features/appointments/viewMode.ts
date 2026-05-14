/**
 * ViewMode determines how appointments are displayed based on doctor count.
 *
 * single → 1 doctor, full table with all columns
 * multi  → 2–4 doctors shown side-by-side in a grid
 *          2 doctors → 2 columns
 *          3 doctors → 3 columns
 *          4 doctors → 2×2 grid
 * 5+ doctors → single with doctor selector (too many to show side-by-side)
 *
 * Auto rules:
 *   1 doctor    → single
 *   2–4 doctors → multi
 *   5+ doctors  → single
 */
import type { ViewMode } from "./types";
export type { ViewMode };

export function resolveViewMode(doctorCount: number, manualOverride: ViewMode | null): ViewMode {
  if (manualOverride) return manualOverride;
  if (doctorCount >= 2 && doctorCount <= 4) return "multi";
  return "single";
}

/** Returns the Tailwind grid class for the multi-doctor layout */
export function getMultiGridClass(doctorCount: number): string {
  if (doctorCount === 2) return "grid grid-cols-1 gap-5 lg:grid-cols-2";
  if (doctorCount === 3) return "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3";
  return "grid grid-cols-1 gap-5 xl:grid-cols-2"; // 4 doctors → 2×2
}

/**
 * Column definition with priority and visibility rules.
 * priority 1 = always shown
 * priority 2 = hidden in multi mode (shown in expandable row)
 * priority 3 = hidden in multi mode (shown in expandable row)
 */
export interface AppointmentColumn {
  key: string;
  label: string;
  priority: 1 | 2 | 3;
  visibleIn: ViewMode[];
}

export const TIME_COLUMNS: AppointmentColumn[] = [
  { key: "time",      label: "appointments.columns.time",      priority: 1, visibleIn: ["single", "multi"] },
  { key: "patient",   label: "appointments.columns.patient",   priority: 1, visibleIn: ["single", "multi"] },
  { key: "status",    label: "appointments.columns.status",    priority: 1, visibleIn: ["single", "multi"] },
  { key: "visitType", label: "appointments.columns.visitType", priority: 2, visibleIn: ["single"] },
  { key: "price",     label: "appointments.columns.price",     priority: 3, visibleIn: ["single"] },
  { key: "actions",   label: "",                               priority: 1, visibleIn: ["single", "multi"] },
];

export const QUEUE_COLUMNS: AppointmentColumn[] = [
  { key: "queue",     label: "appointments.columns.queue",     priority: 1, visibleIn: ["single", "multi"] },
  { key: "patient",   label: "appointments.columns.patient",   priority: 1, visibleIn: ["single", "multi"] },
  { key: "status",    label: "appointments.columns.status",    priority: 1, visibleIn: ["single", "multi"] },
  { key: "visitType", label: "appointments.columns.visitType", priority: 2, visibleIn: ["single"] },
  { key: "price",     label: "appointments.columns.price",     priority: 3, visibleIn: ["single"] },
  { key: "actions",   label: "",                               priority: 1, visibleIn: ["single", "multi"] },
];

export function getVisibleColumns(columns: AppointmentColumn[], mode: ViewMode): AppointmentColumn[] {
  return columns.filter((col) => {
    if (!col.visibleIn.includes(mode)) return false;
    if (mode === "multi") return col.priority === 1;
    return true;
  });
}

/** Columns hidden in current mode — shown in expandable row */
export function getHiddenColumns(columns: AppointmentColumn[], mode: ViewMode): AppointmentColumn[] {
  return columns.filter(
    (col) => col.key !== "actions" && !getVisibleColumns(columns, mode).some((v) => v.key === col.key),
  );
}
