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

export const dashboardApi = {
  getStats: (): Promise<DashboardStatsDto> =>
    apiClient.get<DashboardStatsDto>(`${API_ENDPOINTS.dashboard}/stats`),

  getSuperAdminStats: (): Promise<SuperAdminStatsDto> =>
    apiClient.get<SuperAdminStatsDto>(`${API_ENDPOINTS.dashboard}/stats/superadmin`),
};
