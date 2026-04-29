/**
 * ViewMode determines how appointments are displayed based on doctor count.
 *
 * single → 1–3 doctors shown one at a time (with doctor selector if >1)
 * multi  → 2–4 doctors shown side-by-side in a grid
 *
 * Auto rules:
 *   1 doctor  → single
 *   2–4 doctors → multi
 *   5+ doctors  → single (too many to show side-by-side)
 */
export type ViewMode = "single" | "multi";

export function resolveViewMode(doctorCount: number, manualOverride: ViewMode | null): ViewMode {
  if (manualOverride) return manualOverride;
  if (doctorCount >= 2 && doctorCount <= 4) return "multi";
  return "single";
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
  { key: "time",      label: "Time",       priority: 1, visibleIn: ["single", "multi"] },
  { key: "patient",   label: "Patient",    priority: 1, visibleIn: ["single", "multi"] },
  { key: "status",    label: "Status",     priority: 1, visibleIn: ["single", "multi"] },
  { key: "visitType", label: "Visit Type", priority: 2, visibleIn: ["single"] },
  { key: "price",     label: "Price",      priority: 3, visibleIn: ["single"] },
  { key: "actions",   label: "",           priority: 1, visibleIn: ["single", "multi"] },
];

export const QUEUE_COLUMNS: AppointmentColumn[] = [
  { key: "queue",     label: "#",          priority: 1, visibleIn: ["single", "multi"] },
  { key: "patient",   label: "Patient",    priority: 1, visibleIn: ["single", "multi"] },
  { key: "status",    label: "Status",     priority: 1, visibleIn: ["single", "multi"] },
  { key: "visitType", label: "Visit Type", priority: 2, visibleIn: ["single"] },
  { key: "price",     label: "Price",      priority: 3, visibleIn: ["single"] },
  { key: "actions",   label: "",           priority: 1, visibleIn: ["single", "multi"] },
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
