import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/constants/app";
import type { CityDto, CountryDto, StateDto } from "../types/location";

export const locationApi = {
  async getCountries(): Promise<CountryDto[]> {
    const response = await apiClient.get<CountryDto[]>(
      `${API_ENDPOINTS.locations}/countries`,
    );
    return response.data;
  },

  async getStates(countryGeonameId: number): Promise<StateDto[]> {
    const response = await apiClient.get<StateDto[]>(
      `${API_ENDPOINTS.locations}/states`,
      { params: { countryGeonameId } },
    );
    return response.data;
  },

  async getCities(stateGeonameId: number): Promise<CityDto[]> {
    const response = await apiClient.get<CityDto[]>(
      `${API_ENDPOINTS.locations}/cities`,
      { params: { stateGeonameId } },
    );
    return response.data;
  },
};
