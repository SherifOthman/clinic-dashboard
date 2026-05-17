export type AppointmentType   = "Queue" | "Time";
export type AppointmentStatus = "Pending" | "Waiting" | "InProgress" | "Completed" | "Cancelled" | "NoShow";

export interface AppointmentDto {
  id: string;
  doctorInfoId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  patientCode?: string;
  queueNumber?: number;
  scheduledTime?: string;         // Time-based only
  endTime?: string;               // Time-based only
  visitDurationMinutes?: number;  // Time-based only
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
  defaultVisitDurationMinutes: number; // Time-based only
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
  scheduledTime?: string;         // Time-based only
  visitDurationMinutes?: number;  // Time-based only
}

export interface DoctorCheckInResult {
  sessionId: string;
  isLate: boolean;
  delayMinutes?: number;
  scheduledStartTime?: string;
}
