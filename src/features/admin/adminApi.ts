import { apiClient } from "@/core/api";
import type { PagedResult } from "@/core/types";

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

// ── Specializations ───────────────────────────────────────────────────────────

export async function getSpecializationsPaginated(pageNumber = 1, pageSize = 10): Promise<PagedResult<SpecializationDto>> {
  const res = await apiClient.get<PagedResult<SpecializationDto>>(`/admin/specializations?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return res.data;
}

export async function createSpecialization(data: UpsertSpecializationRequest): Promise<string> {
  const res = await apiClient.post<string>("/admin/specializations", data);
  return res.data;
}

export async function updateSpecialization(id: string, data: UpsertSpecializationRequest & { isActive: boolean }): Promise<void> {
  await apiClient.put(`/admin/specializations/${id}`, data);
}

export async function deleteSpecialization(id: string): Promise<void> {
  await apiClient.delete(`/admin/specializations/${id}`);
}

// ── Chronic Diseases ──────────────────────────────────────────────────────────

export async function getChronicDiseasesPaginated(pageNumber = 1, pageSize = 10): Promise<PagedResult<ChronicDiseaseDto>> {
  const res = await apiClient.get<PagedResult<ChronicDiseaseDto>>(`/admin/chronic-diseases?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return res.data;
}

export async function createChronicDisease(data: UpsertChronicDiseaseRequest): Promise<string> {
  const res = await apiClient.post<string>("/admin/chronic-diseases", data);
  return res.data;
}

export async function updateChronicDisease(id: string, data: UpsertChronicDiseaseRequest & { isActive: boolean }): Promise<void> {
  await apiClient.put(`/admin/chronic-diseases/${id}`, data);
}

export async function deleteChronicDisease(id: string): Promise<void> {
  await apiClient.delete(`/admin/chronic-diseases/${id}`);
}
