export type AppointmentType = "Queue" | "Time";
export type AppointmentStatus = "Pending" | "Waiting" | "InProgress" | "Completed" | "Cancelled" | "NoShow";

export interface AppointmentDto {
  id: string;
  doctorInfoId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  patientCode?: string;
  queueNumber?: number;
  scheduledTime?: string;     // "HH:mm"
  endTime?: string;           // "HH:mm"
  visitDurationMinutes?: number;
  type: AppointmentType;
  status: AppointmentStatus;
  visitTypeNameEn: string;
  visitTypeNameAr: string;
  finalPrice: number;
  createdAt: string;
}

export interface DoctorForBranch {
  doctorInfoId: string;
  memberId: string;
  fullName: string;
  profileImageUrl?: string;
  appointmentType: AppointmentType;
  defaultVisitDurationMinutes: number;
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
