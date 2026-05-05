export type AppointmentType   = "Queue" | "Time";
export type AppointmentStatus = "Pending" | "Waiting" | "InProgress" | "Completed" | "Cancelled" | "NoShow";
export type ViewMode          = "single" | "multi";

export interface AppointmentDto {
  id: string;
  doctorInfoId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  patientCode?: string;
  queueNumber?: number;
  scheduledTime?: string;       // "HH:mm"
  endTime?: string;             // "HH:mm"
  visitDurationMinutes?: number;
  type: AppointmentType;
  status: AppointmentStatus;
  visitTypeName: string;
  finalPrice: number;
  createdAt: string;
  patientGender?: string;
  patientDateOfBirth?: string;  // "YYYY-MM-DD"
  invoiceId?: string | null;    // non-null = paid/invoiced
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
