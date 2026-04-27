import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { City, Country, State } from "./types";

/**
 * Location API — both EN and AR names always returned.
 * Results are cached 24h by React Query — no re-fetching on language switch.
 */
export const locationApi = {
  getCountries: (): Promise<Country[]> =>
    apiClient.get<Country[]>(`${API_ENDPOINTS.locations}/countries`),

  getStates: (countryGeonameId: number): Promise<State[]> =>
    apiClient.get<State[]>(`${API_ENDPOINTS.locations}/countries/${countryGeonameId}/states`),

  getCities: (stateGeonameId: number): Promise<City[]> =>
    apiClient.get<City[]>(`${API_ENDPOINTS.locations}/states/${stateGeonameId}/cities`),
};
