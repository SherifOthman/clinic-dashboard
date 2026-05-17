import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { City, Country, State } from "./types";

// Both EN and AR names always returned.
// Results are cached 24h by React Query — no re-fetching on language switch.

export async function getCountries(): Promise<Country[]> {
  const res = await apiClient.get<Country[]>(`${API_ENDPOINTS.locations}/countries`);
  return res.data;
}

export async function getStates(countryGeonameId: number): Promise<State[]> {
  const res = await apiClient.get<State[]>(`${API_ENDPOINTS.locations}/countries/${countryGeonameId}/states`);
  return res.data;
}

export async function getCities(stateGeonameId: number): Promise<City[]> {
  const res = await apiClient.get<City[]>(`${API_ENDPOINTS.locations}/states/${stateGeonameId}/cities`);
  return res.data;
}
