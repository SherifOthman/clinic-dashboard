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
  if (params.searchTerm)           p.append("searchTerm",      params.searchTerm);
  if (params.pageNumber)           p.append("pageNumber",      params.pageNumber.toString());
  if (params.pageSize)             p.append("pageSize",        params.pageSize.toString());
  if (params.sortBy)               p.append("sortBy",          params.sortBy);
  if (params.sortDirection)        p.append("sortDirection",   params.sortDirection);
  if (params.gender)               p.append("gender",          params.gender);
  if (params.stateGeonameId   != null) p.append("stateGeonameId",   params.stateGeonameId.toString());
  if (params.cityGeonameId    != null) p.append("cityGeonameId",    params.cityGeonameId.toString());
  if (params.countryGeonameId != null) p.append("countryGeonameId", params.countryGeonameId.toString());
  return p.toString() ? `?${p.toString()}` : "";
}

function buildAdminPatientQuery(params: PatientsSearchParams): string {
  const p = new URLSearchParams(buildPatientQuery(params).replace(/^\?/, ""));
  if (params.clinicSearch)   p.append("clinicSearch",   params.clinicSearch);
  if (params.includeDeleted) p.append("includeDeleted", "true");
  return p.toString() ? `?${p.toString()}` : "";
}

export async function getPatients(params: PatientsSearchParams = {}): Promise<PagedResult<PatientListItem>> {
  const res = await apiClient.get<PagedResult<PatientListItem>>(`${API_ENDPOINTS.patients}${buildPatientQuery(params)}`);
  return res.data;
}

export async function getPatientDetail(id: string): Promise<PatientDetail> {
  const res = await apiClient.get<PatientDetail>(`${API_ENDPOINTS.patients}/${id}`);
  return res.data;
}

export async function getAdminPatients(params: PatientsSearchParams = {}): Promise<PagedResult<PatientListItem>> {
  const res = await apiClient.get<PagedResult<PatientListItem>>(`${API_ENDPOINTS.adminPatients}${buildAdminPatientQuery(params)}`);
  return res.data;
}

export async function getAdminPatientDetail(id: string): Promise<PatientDetail> {
  const res = await apiClient.get<PatientDetail>(`${API_ENDPOINTS.adminPatients}/${id}`);
  return res.data;
}

// Returns the new patient ID from the Location header
export async function createPatient(patient: PatientApiRequest): Promise<string> {
  const res = await apiClient.post(API_ENDPOINTS.patients, patient);
  const location: string = res.headers["location"] ?? "";
  return location.split("/").pop() ?? "";
}

export async function updatePatient(id: string, patient: PatientApiRequest): Promise<void> {
  await apiClient.put(`${API_ENDPOINTS.patients}/${id}`, patient);
}

export async function deletePatient(id: string): Promise<void> {
  await apiClient.delete(`${API_ENDPOINTS.patients}/${id}`);
}

export async function getChronicDiseases(language?: string): Promise<ChronicDisease[]> {
  const q = language ? `?language=${language}` : "";
  const res = await apiClient.get<ChronicDisease[]>(`${API_ENDPOINTS.chronicDiseases}${q}`);
  return res.data;
}

export async function getLocationOptions(
  countryGeonameId?: number,
  stateGeonameId?: number,
): Promise<{ geonameId: number; nameEn: string; nameAr: string }[]> {
  const p = new URLSearchParams();
  if (countryGeonameId != null) p.append("countryGeonameId", countryGeonameId.toString());
  if (stateGeonameId   != null) p.append("stateGeonameId",   stateGeonameId.toString());
  const q = p.toString() ? `?${p.toString()}` : "";
  const res = await apiClient.get<{ geonameId: number; nameEn: string; nameAr: string }[]>(`${API_ENDPOINTS.patients}/location-options${q}`);
  return res.data;
}
