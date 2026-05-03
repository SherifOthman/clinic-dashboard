import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { AppointmentDto } from "../appointments/types";

// ── Testimonial types (owned by dashboard feature) ────────────────────────────

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

// ── Recent patients ───────────────────────────────────────────────────────────

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

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const dashboardApi = {
  getStats: (): Promise<DashboardStatsDto> =>
    apiClient.get<DashboardStatsDto>(`${API_ENDPOINTS.dashboard}/stats`),

  getSuperAdminStats: (): Promise<SuperAdminStatsDto> =>
    apiClient.get<SuperAdminStatsDto>(`${API_ENDPOINTS.dashboard}/stats/superadmin`),

  /** Appointments for a specific doctor today (used by DoctorDashboard) */
  getDoctorTodayAppointments: (doctorInfoId: string, branchId: string): Promise<AppointmentDto[]> => {
    const params = new URLSearchParams({ date: todayStr(), branchId });
    params.append("doctorInfoIds", doctorInfoId);
    return apiClient.get<AppointmentDto[]>(`${API_ENDPOINTS.appointments}?${params}`);
  },

  /** All appointments for a branch today (used by ReceptionistDashboard) */
  getBranchTodayAppointments: (branchId: string): Promise<AppointmentDto[]> => {
    const params = new URLSearchParams({ date: todayStr(), branchId });
    return apiClient.get<AppointmentDto[]>(`${API_ENDPOINTS.appointments}?${params}`);
  },

  getContactMessages: (page = 1, pageSize = 20): Promise<ContactMessageDto[]> =>
    apiClient.get<ContactMessageDto[]>(`/contact?page=${page}&pageSize=${pageSize}`),

  getAllTestimonials: (): Promise<AdminTestimonialDto[]> =>
    apiClient.get<AdminTestimonialDto[]>(`/testimonials/all`),

  toggleTestimonial: (id: string): Promise<void> =>
    apiClient.patch(`/testimonials/${id}/toggle`),

  // ── Owner testimonial ───────────────────────────────────────────────────────

  getMyTestimonial: (): Promise<MyTestimonial | null> =>
    apiClient.get<MyTestimonial>("/testimonials/mine").catch(() => null),

  submitTestimonial: (data: SubmitTestimonialRequest): Promise<void> =>
    apiClient.post("/testimonials", data),

  // ── Recent patients ─────────────────────────────────────────────────────────

  getRecentPatients: (): Promise<RecentPatientDto[]> =>
    apiClient.get<RecentPatientDto[]>(`${API_ENDPOINTS.dashboard}/recent-patients`),
};
