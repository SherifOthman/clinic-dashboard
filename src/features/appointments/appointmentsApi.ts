import { apiClient } from "@/core/api";
import type { AppointmentDto, CreateAppointmentRequest, DoctorForBranch } from "./types";

const BASE = "/appointments";

export const appointmentsApi = {
  getAppointments: (date: string, branchId?: string, doctorInfoIds?: string[]): Promise<AppointmentDto[]> => {
    const params = new URLSearchParams({ date });
    if (branchId) params.set("branchId", branchId);
    doctorInfoIds?.forEach((id) => params.append("doctorInfoIds", id));
    return apiClient.get<AppointmentDto[]>(`${BASE}?${params}`);
  },

  getDoctors: (branchId: string): Promise<DoctorForBranch[]> =>
    apiClient.get<DoctorForBranch[]>(`${BASE}/doctors?branchId=${branchId}`),

  create: (data: CreateAppointmentRequest): Promise<string> =>
    apiClient.post<string>(BASE, data),

  updateStatus: (id: string, status: string): Promise<void> =>
    apiClient.patch(`${BASE}/${id}/status`, { status }),

  markPaid: (id: string): Promise<void> =>
    apiClient.patch(`${BASE}/${id}/paid`),

  refund: (id: string): Promise<void> =>
    apiClient.patch(`${BASE}/${id}/refund`),

  update: (id: string, data: {
    visitTypeId: string;
    discountPercent?: number;
  }): Promise<void> =>
    apiClient.put(`${BASE}/${id}`, data),

  checkIn: (doctorInfoId: string, branchId: string) =>
    apiClient.post<import("./types").DoctorCheckInResult>(`${BASE}/sessions/check-in`, { doctorInfoId, branchId }),

  checkOut: (doctorInfoId: string, branchId: string): Promise<void> =>
    apiClient.post(`${BASE}/sessions/check-out`, { doctorInfoId, branchId }),

  bulkCancel: (doctorInfoId: string, branchId: string, date: string): Promise<number> =>
    apiClient.post<number>(`${BASE}/bulk-cancel`, { doctorInfoId, branchId, date }),

  rescheduleDoctor: (doctorInfoId: string, branchId: string, date: string): Promise<number> =>
    apiClient.post<number>(`${BASE}/reschedule-doctor`, { doctorInfoId, branchId, date }),

  rescheduleAppointment: (appointmentId: string, newDate: string, newBranchId?: string): Promise<void> =>
    apiClient.patch(`${BASE}/${appointmentId}/reschedule`, { newDate, newBranchId }),

  handleDelay: (sessionId: string, option: "AutoShift" | "MarkMissed" | "Manual" | "Cancel"): Promise<void> =>
    apiClient.post(`${BASE}/sessions/${sessionId}/handle-delay`, { option }),
};
