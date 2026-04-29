/**
 * ViewMode determines how appointments are displayed based on doctor count.
 *
 * single  → 1 doctor: full table, all columns visible
 * multi   → 2–3 doctors: side-by-side cards, priority-1 columns only + expandable rows
 * compact → 4+ doctors: branch/doctor selector, then single full table
 */
export type ViewMode = "single" | "multi" | "compact";

export const MULTI_THRESHOLD  = 3; // ≤ this → multi; > this → compact

export function resolveViewMode(doctorCount: number, manualOverride: ViewMode | null): ViewMode {
  if (manualOverride) return manualOverride;
  if (doctorCount === 1) return "single";
  if (doctorCount <= MULTI_THRESHOLD) return "multi";
  return "compact";
}

/**
 * Column definition with priority and visibility rules.
 * priority 1 = always shown
 * priority 2 = shown in single only
 * priority 3 = shown in single only (least important)
 */
export interface AppointmentColumn {
  key: string;
  label: string;
  priority: 1 | 2 | 3;
  visibleIn: ViewMode[];
}

export const TIME_COLUMNS: AppointmentColumn[] = [
  { key: "time",        label: "Time",       priority: 1, visibleIn: ["single", "multi", "compact"] },
  { key: "patient",     label: "Patient",    priority: 1, visibleIn: ["single", "multi", "compact"] },
  { key: "status",      label: "Status",     priority: 1, visibleIn: ["single", "multi", "compact"] },
  { key: "visitType",   label: "Visit Type", priority: 2, visibleIn: ["single", "compact"] },
  { key: "price",       label: "Price",      priority: 3, visibleIn: ["single", "compact"] },
  { key: "actions",     label: "",           priority: 1, visibleIn: ["single", "multi", "compact"] },
];

export const QUEUE_COLUMNS: AppointmentColumn[] = [
  { key: "queue",       label: "#",          priority: 1, visibleIn: ["single", "multi", "compact"] },
  { key: "patient",     label: "Patient",    priority: 1, visibleIn: ["single", "multi", "compact"] },
  { key: "status",      label: "Status",     priority: 1, visibleIn: ["single", "multi", "compact"] },
  { key: "visitType",   label: "Visit Type", priority: 2, visibleIn: ["single", "compact"] },
  { key: "price",       label: "Price",      priority: 3, visibleIn: ["single", "compact"] },
  { key: "actions",     label: "",           priority: 1, visibleIn: ["single", "multi", "compact"] },
];

export function getVisibleColumns(columns: AppointmentColumn[], mode: ViewMode): AppointmentColumn[] {
  return columns.filter((col) => {
    if (!col.visibleIn.includes(mode)) return false;
    // In multi mode, only show priority-1 columns (reduce clutter)
    if (mode === "multi") return col.priority === 1;
    return true;
  });
}

/** Keys of columns hidden in current mode — used for expandable row content */
export function getHiddenColumns(columns: AppointmentColumn[], mode: ViewMode): AppointmentColumn[] {
  return columns.filter((col) => col.key !== "actions" && !getVisibleColumns(columns, mode).some((v) => v.key === col.key));
}
