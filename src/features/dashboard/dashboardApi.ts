import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";

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

export const dashboardApi = {
  getStats: (): Promise<DashboardStatsDto> =>
    apiClient.get<DashboardStatsDto>(`${API_ENDPOINTS.dashboard}/stats`),

  getSuperAdminStats: (): Promise<SuperAdminStatsDto> =>
    apiClient.get<SuperAdminStatsDto>(`${API_ENDPOINTS.dashboard}/stats/superadmin`),

  getContactMessages: (page = 1, pageSize = 20): Promise<ContactMessageDto[]> =>
    apiClient.get<ContactMessageDto[]>(`/contact?page=${page}&pageSize=${pageSize}`),

  getAllTestimonials: (): Promise<AdminTestimonialDto[]> =>
    apiClient.get<AdminTestimonialDto[]>(`/testimonials/all`),

  toggleTestimonial: (id: string): Promise<void> =>
    apiClient.patch(`/testimonials/${id}/toggle`),
};
