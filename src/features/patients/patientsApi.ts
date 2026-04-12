import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { PagedResult } from "@/core/types";
import type {
  ChronicDisease,
  PatientApiRequest,
  PatientDetail,
  PatientListItem,
  PatientState,
  PatientsSearchParams,
} from "./types";

export const patientsApi = {
  async getPaginated(
    params: PatientsSearchParams = {},
    isSuperAdmin = false,
  ): Promise<PagedResult<PatientListItem>> {
    const p = new URLSearchParams();

    if (params.searchTerm) p.append("searchTerm", params.searchTerm);
    if (params.pageNumber) p.append("pageNumber", params.pageNumber.toString());
    if (params.pageSize) p.append("pageSize", params.pageSize.toString());
    if (params.sortBy) p.append("sortBy", params.sortBy); // same name as backend
    if (params.sortDirection) p.append("sortDirection", params.sortDirection);
    if (params.gender) p.append("gender", params.gender);
    if (params.stateSearch) p.append("stateSearch", params.stateSearch);
    if (params.citySearch) p.append("citySearch", params.citySearch);
    if (params.countrySearch) p.append("countrySearch", params.countrySearch);
    if (isSuperAdmin && params.clinicSearch)
      p.append("clinicSearch", params.clinicSearch);

    const endpoint = isSuperAdmin
      ? `${API_ENDPOINTS.patients}/all`
      : API_ENDPOINTS.patients;

    const response = await apiClient.get<PagedResult<PatientListItem>>(
      `${endpoint}?${p.toString()}`,
    );
    return response.data;
  },

  async getDetail(id: string, isSuperAdmin = false): Promise<PatientDetail> {
    const endpoint = isSuperAdmin
      ? `${API_ENDPOINTS.patients}/all/${id}`
      : `${API_ENDPOINTS.patients}/${id}`;
    const response = await apiClient.get<PatientDetail>(endpoint);
    return response.data;
  },

  async create(patient: PatientApiRequest): Promise<string> {
    const response = await apiClient.post<void>(
      API_ENDPOINTS.patients,
      patient,
      {
        // Capture the Location header returned by CreatedAtAction
        validateStatus: (s) => s === 201,
      },
    );
    // Extract the new patient id from the Location header: /api/patients/{id}
    const location =
      (response.headers as Record<string, string>)["location"] ?? "";
    return location.split("/").pop() ?? "";
  },

  async update(id: string, patient: PatientApiRequest): Promise<void> {
    await apiClient.put(`${API_ENDPOINTS.patients}/${id}`, patient);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.patients}/${id}`);
  },

  async getChronicDiseases(language?: string): Promise<ChronicDisease[]> {
    const response = await apiClient.get<ChronicDisease[]>(
      API_ENDPOINTS.chronicDiseases,
      { params: language ? { language } : {} },
    );
    return response.data;
  },

  async getStates(): Promise<PatientState[]> {
    const response = await apiClient.get<PatientState[]>(
      `${API_ENDPOINTS.patients}/states`,
    );
    return response.data;
  },

  async getCities(): Promise<PatientState[]> {
    const response = await apiClient.get<PatientState[]>(
      `${API_ENDPOINTS.patients}/cities`,
    );
    return response.data;
  },

  async getCountries(): Promise<PatientState[]> {
    const response = await apiClient.get<PatientState[]>(
      `${API_ENDPOINTS.patients}/countries`,
    );
    return response.data;
  },
};
