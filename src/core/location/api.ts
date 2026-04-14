import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { City, Country, State } from "./types";

/**
 * Location API — no ?lang= param needed.
 * Both EN and AR names are always returned; the component picks which to display.
 * Results are cached 24h by React Query — no re-fetching on language switch.
 */
export const locationApi = {
  getCountries(): Promise<Country[]> {
    return apiClient
      .get<Country[]>(`${API_ENDPOINTS.locations}/countries`)
      .then((r) => r.data);
  },

  getStates(countryGeonameId: number): Promise<State[]> {
    return apiClient
      .get<
        State[]
      >(`${API_ENDPOINTS.locations}/countries/${countryGeonameId}/states`)
      .then((r) => r.data);
  },

  getCities(stateGeonameId: number): Promise<City[]> {
    return apiClient
      .get<City[]>(`${API_ENDPOINTS.locations}/states/${stateGeonameId}/cities`)
      .then((r) => r.data);
  },
};
