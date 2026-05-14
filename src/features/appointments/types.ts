// AppointmentType kept for backend compatibility — UI only uses Queue for now
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
  // scheduledTime, endTime, visitDurationMinutes kept for future Time-based support
  scheduledTime?: string;
  endTime?: string;
  visitDurationMinutes?: number;
  type: AppointmentType;
  status: AppointmentStatus;
  visitTypeName: string;
  finalPrice: number;
  createdAt: string;
  patientGender?: string;
  patientDateOfBirth?: string;
  invoiceId?: string | null;
}

export interface DoctorForBranch {
  doctorInfoId: string;
  memberId: string;
  fullName: string;
  profileImageUrl?: string;
  appointmentType: AppointmentType;
  // defaultVisitDurationMinutes kept for future Time-based support
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
  discountPercent?: number;
  markAsPaid?: boolean;
  // scheduledTime, visitDurationMinutes kept for future Time-based support
  scheduledTime?: string;
  visitDurationMinutes?: number;
}

export interface DoctorCheckInResult {
  sessionId: string;
  isLate: boolean;
  delayMinutes?: number;
  scheduledStartTime?: string;
}
