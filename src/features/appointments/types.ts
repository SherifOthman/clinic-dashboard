export type AppointmentType = "Queue" | "Time";
export type AppointmentStatus = "Pending" | "Waiting" | "InProgress" | "Completed" | "Cancelled" | "NoShow";

/**
 * ViewMode drives column visibility and layout:
 * - single:  1 doctor  → full table, all columns
 * - multi:   2–3 docs  → side-by-side cards, priority-1 columns only + expandable rows
 * - compact: >3 docs   → doctor selector + single full table
 */
export type ViewMode = "single" | "multi" | "compact";

export interface AppointmentDto {
  id: string;
  doctorInfoId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  patientCode?: string;
  queueNumber?: number;
  scheduledTime?: string;   // "HH:mm"
  endTime?: string;         // "HH:mm"
  visitDurationMinutes?: number;
  type: AppointmentType;
  status: AppointmentStatus;
  visitTypeName: string;    // single name — no bilingual split
  finalPrice: number;
  createdAt: string;
  patientGender?: string;
  patientDateOfBirth?: string;  // "YYYY-MM-DD"
}

export interface DoctorForBranch {
  doctorInfoId: string;
  memberId: string;
  fullName: string;
  profileImageUrl?: string;
  appointmentType: AppointmentType;
  defaultVisitDurationMinutes: number;
  hasSessionToday: boolean;
}

export interface CreateAppointmentRequest {
  branchId: string;
  patientId: string;
  doctorInfoId: string;
  visitTypeId: string;
  date: string;
  type: AppointmentType;
  scheduledTime?: string;
  discountPercent?: number;
  visitDurationMinutes?: number;
}

export interface DoctorCheckInResult {
  sessionId: string;
  isLate: boolean;
  delayMinutes?: number;
  scheduledStartTime?: string;
}

// ── Column priority system ────────────────────────────────────────────────────

export interface AppointmentColumn {
  key: string;
  label: string;
  /** 1 = always visible, 2 = single+compact only, 3 = single only */
  priority: 1 | 2 | 3;
  visibleIn: ViewMode[];
}

export interface AppointmentFeatureFlags {
  showPrice: boolean;
  showVisitType: boolean;
  showActions: boolean;
}

export const DEFAULT_FLAGS: AppointmentFeatureFlags = {
  showPrice: true,
  showVisitType: true,
  showActions: true,
};
