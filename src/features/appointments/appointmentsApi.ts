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

  setAppointmentType: (memberId: string, branchId: string, appointmentType: string): Promise<void> =>
    apiClient.patch(`${BASE}/doctors/${memberId}/appointment-type`, { appointmentType, branchId }),

  checkIn: (doctorInfoId: string, branchId: string) =>
    apiClient.post<import("./types").DoctorCheckInResult>(`${BASE}/sessions/check-in`, { doctorInfoId, branchId }),

  handleDelay: (sessionId: string, option: "AutoShift" | "MarkMissed" | "Manual"): Promise<void> =>
    apiClient.post(`${BASE}/sessions/${sessionId}/handle-delay`, { option }),
};
