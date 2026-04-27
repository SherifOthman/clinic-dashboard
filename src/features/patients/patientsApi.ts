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

function buildPatientQuery(params: PatientsSearchParams, isSuperAdmin: boolean): string {
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
  if (isSuperAdmin && params.clinicSearch) p.append("clinicSearch", params.clinicSearch);
  return p.toString() ? `?${p.toString()}` : "";
}

export const patientsApi = {
  getPaginated: (params: PatientsSearchParams = {}, isSuperAdmin = false): Promise<PagedResult<PatientListItem>> => {
    const base = isSuperAdmin ? `${API_ENDPOINTS.patients}/all` : API_ENDPOINTS.patients;
    return apiClient.get<PagedResult<PatientListItem>>(`${base}${buildPatientQuery(params, isSuperAdmin)}`);
  },

  getDetail: (id: string, isSuperAdmin = false): Promise<PatientDetail> => {
    const endpoint = isSuperAdmin
      ? `${API_ENDPOINTS.patients}/all/${id}`
      : `${API_ENDPOINTS.patients}/${id}`;
    return apiClient.get<PatientDetail>(endpoint);
  },

  // Create returns the new patient ID from the Location header
  create: async (patient: PatientApiRequest): Promise<string> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}${API_ENDPOINTS.patients}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.detail ?? `Error ${res.status}`), { code: err.code, errors: err.errors });
    }
    const location = res.headers.get("location") ?? "";
    return location.split("/").pop() ?? "";
  },

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
