import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { PagedResult } from "@/core/types";
import type {
  ChronicDisease,
  PatientApiRequest,
  PatientDetail,
  PatientListItem,
  PatientLocationFilter,
  PatientsSearchParams,
} from "./types";

export const patientsApi = {
  async getPaginated(
    params: PatientsSearchParams = {},
    isSuperAdmin = false,
    lang = "en",
  ): Promise<PagedResult<PatientListItem>> {
    const p = new URLSearchParams();

    if (params.searchTerm) p.append("searchTerm", params.searchTerm);
    if (params.pageNumber) p.append("pageNumber", params.pageNumber.toString());
    if (params.pageSize) p.append("pageSize", params.pageSize.toString());
    if (params.sortBy) p.append("sortBy", params.sortBy);
    if (params.sortDirection) p.append("sortDirection", params.sortDirection);
    if (params.gender) p.append("gender", params.gender);
    if (params.stateGeonameId != null)
      p.append("stateGeonameId", params.stateGeonameId.toString());
    if (params.cityGeonameId != null)
      p.append("cityGeonameId", params.cityGeonameId.toString());
    if (params.countryGeonameId != null)
      p.append("countryGeonameId", params.countryGeonameId.toString());
    if (isSuperAdmin && params.clinicSearch)
      p.append("clinicSearch", params.clinicSearch);
    p.append("lang", lang);

    const endpoint = isSuperAdmin
      ? `${API_ENDPOINTS.patients}/all`
      : API_ENDPOINTS.patients;

    const response = await apiClient.get<PagedResult<PatientListItem>>(
      `${endpoint}?${p.toString()}`,
    );
    return response.data;
  },

  async getDetail(
    id: string,
    isSuperAdmin = false,
    lang = "en",
  ): Promise<PatientDetail> {
    const endpoint = isSuperAdmin
      ? `${API_ENDPOINTS.patients}/all/${id}`
      : `${API_ENDPOINTS.patients}/${id}`;
    const response = await apiClient.get<PatientDetail>(endpoint, {
      params: { lang },
    });
    return response.data;
  },

  async create(patient: PatientApiRequest): Promise<string> {
    const response = await apiClient.post<void>(
      API_ENDPOINTS.patients,
      patient,
      {
        validateStatus: (s) => s === 201,
      },
    );
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

  /**
   * Returns all distinct location IDs from patients with names already resolved.
   * One round trip — backend handles GeoNames resolution with server-side caching.
   */
  async getLocationFilter(lang: string): Promise<PatientLocationFilter> {
    const response = await apiClient.get<PatientLocationFilter>(
      `${API_ENDPOINTS.patients}/location-filter`,
      { params: { lang } },
    );
    return response.data;
  },
};
