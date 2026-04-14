import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { City, Country, State } from "./types";

/**
 * API calls for the location dropdowns (country → state → city).
 * All three endpoints accept a ?lang=en|ar param and return names in that language.
 * Results are cached 24h by React Query — no repeated network calls.
 */
export const locationApi = {
  /** Returns all countries ordered by name. */
  getCountries(lang: string): Promise<Country[]> {
    return apiClient
      .get<
        Country[]
      >(`${API_ENDPOINTS.locations}/countries`, { params: { lang } })
      .then((r) => r.data);
  },

  /** Returns all states/governorates for a given country. */
  getStates(countryGeonameId: number, lang: string): Promise<State[]> {
    return apiClient
      .get<
        State[]
      >(`${API_ENDPOINTS.locations}/countries/${countryGeonameId}/states`, { params: { lang } })
      .then((r) => r.data);
  },

  /** Returns all cities for a given state. */
  getCities(stateGeonameId: number, lang: string): Promise<City[]> {
    return apiClient
      .get<
        City[]
      >(`${API_ENDPOINTS.locations}/states/${stateGeonameId}/cities`, { params: { lang } })
      .then((r) => r.data);
  },
};
