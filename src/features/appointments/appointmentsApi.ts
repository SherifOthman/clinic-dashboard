import { apiClient } from "@/core/api";
import type { AppointmentDto, CreateAppointmentRequest, DoctorForBranch } from "./types";

const BASE = "/appointments";

export const appointmentsApi = {
  getAppointments: (params: {
    date: string;
    branchId?: string;
    doctorInfoIds?: string[];
    search?: string;
    sortBy?: string;
    sortDirection?: string;
    visitType?: string;
    payment?: string;
  }): Promise<AppointmentDto[]> => {
    const query = new URLSearchParams({ date: params.date });
    if (params.branchId)       query.set("branchId", params.branchId);
    params.doctorInfoIds?.forEach((id) => query.append("doctorInfoIds", id));
    if (params.search)         query.set("search", params.search);
    if (params.sortBy)         query.set("sortBy", params.sortBy);
    if (params.sortDirection)  query.set("sortDirection", params.sortDirection);
    if (params.visitType)      query.set("visitType", params.visitType);
    if (params.payment)        query.set("payment", params.payment);
    return apiClient.get<AppointmentDto[]>(`${BASE}?${query}`);
  },

  getDoctors: (branchId: string): Promise<DoctorForBranch[]> =>
    apiClient.get<DoctorForBranch[]>(`${BASE}/doctors?branchId=${branchId}`),

  checkPatientHasAppointment: (patientId: string, date: string): Promise<boolean> =>
    apiClient.get<boolean>(`${BASE}/check-patient?patientId=${patientId}&date=${encodeURIComponent(date)}`),

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
