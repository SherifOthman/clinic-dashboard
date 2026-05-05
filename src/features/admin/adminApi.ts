import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SpecializationDto {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  isActive: boolean;
}

export interface ChronicDiseaseDto {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  isActive: boolean;
}
export interface SubscriptionPlanDto {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  monthlyFee: number;
  yearlyFee: number;
  setupFee: number;
  maxBranches: number;
  maxStaff: number;
  maxPatientsPerMonth: number;
  maxAppointmentsPerMonth: number;
  maxInvoicesPerMonth: number;
  storageLimitGB: number;
  hasInventoryManagement: boolean;
  hasReporting: boolean;
  hasAdvancedReporting: boolean;
  hasApiAccess: boolean;
  hasMultipleBranches: boolean;
  hasCustomBranding: boolean;
  hasPrioritySupport: boolean;
  hasBackupAndRestore: boolean;
  hasIntegrations: boolean;
  isActive: boolean;
  isPopular: boolean;
  displayOrder: number;
}

export type UpsertSpecializationRequest = Omit<SpecializationDto, "id" | "isActive"> & { isActive?: boolean };
export type UpsertChronicDiseaseRequest = Omit<ChronicDiseaseDto, "id" | "isActive"> & { isActive?: boolean };
export type UpsertSubscriptionPlanRequest = Omit<SubscriptionPlanDto, "id">;

// ── API ───────────────────────────────────────────────────────────────────────

export const adminApi = {
  // Specializations — paginated (admin, includes inactive)
  getSpecializationsPaginated: (pageNumber = 1, pageSize = 10): Promise<import("@/core/types").PagedResult<SpecializationDto>> =>
    apiClient.get(`/admin/specializations?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  createSpecialization: (data: UpsertSpecializationRequest): Promise<string> =>
    apiClient.post(API_ENDPOINTS.specializations, data),

  updateSpecialization: (id: string, data: UpsertSpecializationRequest & { isActive: boolean }): Promise<void> =>
    apiClient.put(`/admin/specializations/${id}`, data),

  deleteSpecialization: (id: string): Promise<void> =>
    apiClient.delete(`/admin/specializations/${id}`),

  // Chronic Diseases — paginated (admin, includes inactive)
  getChronicDiseasesPaginated: (pageNumber = 1, pageSize = 10): Promise<import("@/core/types").PagedResult<ChronicDiseaseDto>> =>
    apiClient.get(`/admin/chronic-diseases?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  createChronicDisease: (data: UpsertChronicDiseaseRequest): Promise<string> =>
    apiClient.post(API_ENDPOINTS.chronicDiseases, data),

  updateChronicDisease: (id: string, data: UpsertChronicDiseaseRequest & { isActive: boolean }): Promise<void> =>
    apiClient.put(`/admin/chronic-diseases/${id}`, data),

  deleteChronicDisease: (id: string): Promise<void> =>
    apiClient.delete(`/admin/chronic-diseases/${id}`),

  // Subscription Plans
  getSubscriptionPlans: (): Promise<SubscriptionPlanDto[]> =>
    apiClient.get(API_ENDPOINTS.subscriptionPlans),

  createSubscriptionPlan: (data: UpsertSubscriptionPlanRequest): Promise<string> =>
    apiClient.post(`/admin/subscription-plans`, { plan: data }),

  updateSubscriptionPlan: (id: string, data: UpsertSubscriptionPlanRequest): Promise<void> =>
    apiClient.put(`/admin/subscription-plans/${id}`, { id, plan: data }),

  toggleSubscriptionPlan: (id: string): Promise<void> =>
    apiClient.patch(`/admin/subscription-plans/${id}/toggle`),
};
