import { apiClient } from "@/core/api";
import type { AppointmentDto, CreateAppointmentRequest, DoctorCheckInResult, DoctorForBranch } from "./types";

const BASE = "/appointments";

export async function getAppointments(date: string, branchId?: string, doctorInfoIds?: string[]): Promise<AppointmentDto[]> {
  const params = new URLSearchParams({ date });
  if (branchId) params.set("branchId", branchId);
  doctorInfoIds?.forEach((id) => params.append("doctorInfoIds", id));
  const res = await apiClient.get<AppointmentDto[]>(`${BASE}?${params}`);
  return res.data;
}

export async function getDoctorsForBranch(branchId: string): Promise<DoctorForBranch[]> {
  const res = await apiClient.get<DoctorForBranch[]>(`${BASE}/doctors?branchId=${branchId}`);
  return res.data;
}

export async function checkPatientHasAppointment(patientId: string, date: string): Promise<boolean> {
  const res = await apiClient.get<boolean>(`${BASE}/check-patient?patientId=${patientId}&date=${encodeURIComponent(date)}`);
  return res.data;
}

export async function createAppointment(data: CreateAppointmentRequest): Promise<string> {
  const res = await apiClient.post<string>(BASE, data);
  return res.data;
}

export async function updateAppointmentStatus(id: string, status: string): Promise<void> {
  await apiClient.patch(`${BASE}/${id}/status`, { status });
}

export async function markAppointmentPaid(id: string): Promise<void> {
  await apiClient.patch(`${BASE}/${id}/paid`);
}

export async function refundAppointment(id: string): Promise<void> {
  await apiClient.patch(`${BASE}/${id}/refund`);
}

export async function updateAppointment(id: string, data: { visitTypeId: string; discountPercent?: number }): Promise<void> {
  await apiClient.put(`${BASE}/${id}`, data);
}

export async function checkInDoctor(doctorInfoId: string, branchId: string): Promise<DoctorCheckInResult> {
  const res = await apiClient.post<DoctorCheckInResult>(`${BASE}/sessions/check-in`, { doctorInfoId, branchId });
  return res.data;
}

export async function checkOutDoctor(doctorInfoId: string, branchId: string): Promise<void> {
  await apiClient.post(`${BASE}/sessions/check-out`, { doctorInfoId, branchId });
}

export async function bulkCancelAppointments(doctorInfoId: string, branchId: string, date: string): Promise<number> {
  const res = await apiClient.post<number>(`${BASE}/bulk-cancel`, { doctorInfoId, branchId, date });
  return res.data;
}

export async function rescheduleDoctor(doctorInfoId: string, branchId: string, date: string): Promise<number> {
  const res = await apiClient.post<number>(`${BASE}/reschedule-doctor`, { doctorInfoId, branchId, date });
  return res.data;
}

export async function rescheduleAppointment(appointmentId: string, newDate: string, newBranchId?: string): Promise<void> {
  await apiClient.patch(`${BASE}/${appointmentId}/reschedule`, { newDate, newBranchId });
}

export async function handleSessionDelay(sessionId: string, option: "AutoShift" | "MarkMissed" | "Manual" | "Cancel"): Promise<void> {
  await apiClient.post(`${BASE}/sessions/${sessionId}/handle-delay`, { option });
}
