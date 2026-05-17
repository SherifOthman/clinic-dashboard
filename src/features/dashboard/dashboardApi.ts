import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import { todayStr } from "@/core/utils/dateUtils";
import type { PagedResult } from "@/core/types";
import type { AppointmentDto } from "../appointments/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MyTestimonial {
  authorName: string;
  position: string;
  text: string;
  rating: number;
  avatarUrl?: string;
  isApproved: boolean;
}

export interface SubmitTestimonialRequest {
  text: string;
  rating: number;
}

export interface RecentPatientDto {
  id: string;
  patientCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  registeredAt: string;
}

export interface SubscriptionInfoDto {
  planName: string;
  status: string;
  daysRemaining: number | null;
  isTrial: boolean;
}

export interface UsageLimitDto {
  used: number;
  max: number;
  lastUpdatedAt: string | null;
}

export interface UsageMetricsDto {
  patients: UsageLimitDto;
  appointments: UsageLimitDto;
  invoices: UsageLimitDto;
  staff: UsageLimitDto;
  lastAggregatedAt: string | null;
}

export interface DashboardStatsDto {
  totalPatients: number;
  patientsThisMonth: number;
  patientsLastMonth: number;
  activeStaff: number;
  pendingInvitations: number;
  subscription: SubscriptionInfoDto | null;
}

export interface SuperAdminStatsDto {
  totalClinics: number;
  totalPatients: number;
  totalStaff: number;
  clinicsOnTrial: number;
  clinicsActive: number;
}

export interface ContactMessageDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminTestimonialDto {
  id: string;
  authorName: string;
  position: string;
  clinicName: string;
  text: string;
  rating: number;
  avatarUrl?: string;
  isApproved: boolean;
  createdAt: string;
}

// ── API functions ─────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStatsDto> {
  const res = await apiClient.get<DashboardStatsDto>(`${API_ENDPOINTS.dashboard}/stats`);
  return res.data;
}

export async function getSuperAdminStats(): Promise<SuperAdminStatsDto> {
  const res = await apiClient.get<SuperAdminStatsDto>(`${API_ENDPOINTS.dashboard}/stats/superadmin`);
  return res.data;
}

export async function getDoctorTodayAppointments(doctorInfoId: string, branchId: string): Promise<AppointmentDto[]> {
  const params = new URLSearchParams({ date: todayStr(), branchId });
  params.append("doctorInfoIds", doctorInfoId);
  const res = await apiClient.get<AppointmentDto[]>(`${API_ENDPOINTS.appointments}?${params}`);
  return res.data;
}

export async function getBranchTodayAppointments(branchId: string): Promise<AppointmentDto[]> {
  const params = new URLSearchParams({ date: todayStr(), branchId });
  const res = await apiClient.get<AppointmentDto[]>(`${API_ENDPOINTS.appointments}?${params}`);
  return res.data;
}

export async function getContactMessages(page = 1, pageSize = 10): Promise<PagedResult<ContactMessageDto>> {
  const res = await apiClient.get<PagedResult<ContactMessageDto>>(`/contact?pageNumber=${page}&pageSize=${pageSize}`);
  return res.data;
}

export async function getContactMessagesUnreadCount(): Promise<number> {
  const res = await apiClient.get<number>("/contact/unread-count");
  return res.data;
}

export async function markContactMessageRead(id: string): Promise<void> {
  await apiClient.patch(`/contact/${id}/read`);
}

export async function getAllTestimonials(page = 1, pageSize = 12): Promise<PagedResult<AdminTestimonialDto>> {
  const res = await apiClient.get<PagedResult<AdminTestimonialDto>>(`/testimonials/all?pageNumber=${page}&pageSize=${pageSize}`);
  return res.data;
}

export async function toggleTestimonial(id: string): Promise<void> {
  await apiClient.patch(`/testimonials/${id}/toggle`);
}

export async function getMyTestimonial(): Promise<MyTestimonial | null> {
  try {
    const res = await apiClient.get<MyTestimonial>("/testimonials/mine");
    return res.data;
  } catch {
    return null;
  }
}

export async function submitTestimonial(data: SubmitTestimonialRequest): Promise<void> {
  await apiClient.post("/testimonials", data);
}

export async function getRecentPatients(): Promise<RecentPatientDto[]> {
  const res = await apiClient.get<RecentPatientDto[]>(`${API_ENDPOINTS.dashboard}/recent-patients`);
  return res.data;
}

export async function getUsageMetrics(): Promise<UsageMetricsDto> {
  const res = await apiClient.get<UsageMetricsDto>(`${API_ENDPOINTS.dashboard}/usage-metrics`);
  return res.data;
}
