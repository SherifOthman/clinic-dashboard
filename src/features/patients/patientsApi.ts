import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { PagedResult } from "@/core/types";
import type {
  ChronicDisease,
  PatientApiRequest,
  PatientDetail,
  PatientListItem,
  PatientsSearchParams,
} from "./types";

function buildPatientQuery(params: PatientsSearchParams): string {
  const p = new URLSearchParams();
  if (params.searchTerm)      p.append("searchTerm",      params.searchTerm);
  if (params.pageNumber)      p.append("pageNumber",      params.pageNumber.toString());
  if (params.pageSize)        p.append("pageSize",        params.pageSize.toString());
  if (params.sortBy)          p.append("sortBy",          params.sortBy);
  if (params.sortDirection)   p.append("sortDirection",   params.sortDirection);
  if (params.gender)          p.append("gender",          params.gender);
  if (params.stateGeonameId   != null) p.append("stateGeonameId",   params.stateGeonameId.toString());
  if (params.cityGeonameId    != null) p.append("cityGeonameId",    params.cityGeonameId.toString());
  if (params.countryGeonameId != null) p.append("countryGeonameId", params.countryGeonameId.toString());
  return p.toString() ? `?${p.toString()}` : "";
}

function buildAdminPatientQuery(params: PatientsSearchParams): string {
  const p = new URLSearchParams(buildPatientQuery(params).replace(/^\?/, ""));
  if (params.clinicSearch) p.append("clinicSearch", params.clinicSearch);
  return p.toString() ? `?${p.toString()}` : "";
}

export const patientsApi = {
  getPaginated: (params: PatientsSearchParams = {}): Promise<PagedResult<PatientListItem>> =>
    apiClient.get<PagedResult<PatientListItem>>(`${API_ENDPOINTS.patients}${buildPatientQuery(params)}`),

  getDetail: (id: string): Promise<PatientDetail> =>
    apiClient.get<PatientDetail>(`${API_ENDPOINTS.patients}/${id}`),

  // ── Admin (cross-tenant) ──────────────────────────────────────────────────

  getAdminPaginated: (params: PatientsSearchParams = {}): Promise<PagedResult<PatientListItem>> =>
    apiClient.get<PagedResult<PatientListItem>>(`${API_ENDPOINTS.adminPatients}${buildAdminPatientQuery(params)}`),

  getAdminDetail: (id: string): Promise<PatientDetail> =>
    apiClient.get<PatientDetail>(`${API_ENDPOINTS.adminPatients}/${id}`),

  // Create returns the new patient ID from the Location header
  create: (patient: PatientApiRequest): Promise<string> =>
    apiClient.postForId(API_ENDPOINTS.patients, patient),

  update: (id: string, patient: PatientApiRequest): Promise<void> =>
    apiClient.put(`${API_ENDPOINTS.patients}/${id}`, patient),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`${API_ENDPOINTS.patients}/${id}`),

  getChronicDiseases: (language?: string): Promise<ChronicDisease[]> => {
    const q = language ? `?language=${language}` : "";
    return apiClient.get<ChronicDisease[]>(`${API_ENDPOINTS.chronicDiseases}${q}`);
  },

  getLocationOptions: (
    countryGeonameId?: number,
    stateGeonameId?: number,
  ): Promise<{ geonameId: number; nameEn: string; nameAr: string }[]> => {
    const p = new URLSearchParams();
    if (countryGeonameId != null) p.append("countryGeonameId", countryGeonameId.toString());
    if (stateGeonameId   != null) p.append("stateGeonameId",   stateGeonameId.toString());
    const q = p.toString() ? `?${p.toString()}` : "";
    return apiClient.get(`${API_ENDPOINTS.patients}/location-options${q}`);
  },
};
