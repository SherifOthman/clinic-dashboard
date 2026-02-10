import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/constants/app";
import type { ChronicDiseaseDto } from "@/core/types/api";

export const chronicDiseasesApi = {
  async getAll(language?: string): Promise<ChronicDiseaseDto[]> {
    const response = await apiClient.get<ChronicDiseaseDto[]>(
      API_ENDPOINTS.chronicDiseases,
      { params: language ? { language } : {} },
    );
    return response.data;
  },
};
