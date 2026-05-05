import { apiClient } from "@/core/api";

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

export type UpsertSpecializationRequest = Omit<SpecializationDto, "id" | "isActive"> & { isActive?: boolean };
export type UpsertChronicDiseaseRequest = Omit<ChronicDiseaseDto, "id" | "isActive"> & { isActive?: boolean };

// ── API ───────────────────────────────────────────────────────────────────────

export const adminApi = {
  // ── Specializations ─────────────────────────────────────────────────────────

  getSpecializationsPaginated: (pageNumber = 1, pageSize = 10): Promise<import("@/core/types").PagedResult<SpecializationDto>> =>
    apiClient.get(`/admin/specializations?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  createSpecialization: (data: UpsertSpecializationRequest): Promise<string> =>
    apiClient.post("/admin/specializations", data),

  updateSpecialization: (id: string, data: UpsertSpecializationRequest & { isActive: boolean }): Promise<void> =>
    apiClient.put(`/admin/specializations/${id}`, data),

  deleteSpecialization: (id: string): Promise<void> =>
    apiClient.delete(`/admin/specializations/${id}`),

  // ── Chronic Diseases ─────────────────────────────────────────────────────────

  getChronicDiseasesPaginated: (pageNumber = 1, pageSize = 10): Promise<import("@/core/types").PagedResult<ChronicDiseaseDto>> =>
    apiClient.get(`/admin/chronic-diseases?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  createChronicDisease: (data: UpsertChronicDiseaseRequest): Promise<string> =>
    apiClient.post("/admin/chronic-diseases", data),

  updateChronicDisease: (id: string, data: UpsertChronicDiseaseRequest & { isActive: boolean }): Promise<void> =>
    apiClient.put(`/admin/chronic-diseases/${id}`, data),

  deleteChronicDisease: (id: string): Promise<void> =>
    apiClient.delete(`/admin/chronic-diseases/${id}`),
};
