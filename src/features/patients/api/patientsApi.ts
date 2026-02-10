import { apiClient } from "@/core/api/client";
import type { PaginatedResponse } from "@/core/types/api";
import type {
  CreatePatientDto,
  PatientDto,
  PatientsSearchParams,
  UpdatePatientDto,
} from "../types/patient";

export const patientsApi = {
  async getPaginated(
    params: PatientsSearchParams = {},
  ): Promise<PaginatedResponse<PatientDto>> {
    const searchParams = new URLSearchParams();

    if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
    if (params.pageNumber)
      searchParams.append("pageNumber", params.pageNumber.toString());
    if (params.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortDirection) {
      searchParams.append("sortDirection", params.sortDirection);
    }
    if (params.gender !== undefined) {
      searchParams.append("gender", params.gender.toString());
    }
    if (params.dateOfBirthFrom) {
      searchParams.append("dateOfBirthFrom", params.dateOfBirthFrom);
    }
    if (params.dateOfBirthTo) {
      searchParams.append("dateOfBirthTo", params.dateOfBirthTo);
    }
    if (params.createdFrom) {
      searchParams.append("createdFrom", params.createdFrom);
    }
    if (params.createdTo) {
      searchParams.append("createdTo", params.createdTo);
    }
    if (params.minAge !== undefined) {
      searchParams.append("minAge", params.minAge.toString());
    }
    if (params.maxAge !== undefined) {
      searchParams.append("maxAge", params.maxAge.toString());
    }

    const response = await apiClient.get<PaginatedResponse<PatientDto>>(
      `/patients/paginated?${searchParams.toString()}`,
    );

    return response.data;
  },

  async getById(id: string): Promise<PatientDto> {
    const response = await apiClient.get<PatientDto>(`/patients/${id}`);
    return response.data;
  },

  async create(patient: CreatePatientDto): Promise<PatientDto> {
    const response = await apiClient.post<PatientDto>("/patients", patient);
    return response.data;
  },

  async update(id: string, patient: UpdatePatientDto): Promise<PatientDto> {
    const response = await apiClient.put<PatientDto>(
      `/patients/${id}`,
      patient,
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/patients/${id}`);
  },
};
