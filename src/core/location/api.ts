import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { City, Country, State } from "./types";

export const locationApi = {
  async getCountries(lang: string): Promise<Country[]> {
    const response = await apiClient.get<Country[]>(
      `${API_ENDPOINTS.locations}/countries`,
      { params: { lang } },
    );
    return response.data;
  },

  async getStates(countryGeonameId: number, lang: string): Promise<State[]> {
    const response = await apiClient.get<State[]>(
      `${API_ENDPOINTS.locations}/countries/${countryGeonameId}/states`,
      { params: { lang } },
    );
    return response.data;
  },

  async getCities(stateGeonameId: number, lang: string): Promise<City[]> {
    const response = await apiClient.get<City[]>(
      `${API_ENDPOINTS.locations}/states/${stateGeonameId}/cities`,
      { params: { lang } },
    );
    return response.data;
  },
};

/**
 * Fetches both EN and AR names for a location entity in parallel.
 * GeoNames responses are cached 24h so the second call is usually instant.
 * Returns { en, ar } — either may be null if the fetch fails.
 */
export async function resolveBilingualNames(
  type: "country" | "state" | "city",
  id: number,
  currentLang: "en" | "ar",
  currentName: string,
  parentId?: number,
): Promise<{ en: string | null; ar: string | null }> {
  const altLang = currentLang === "en" ? "ar" : "en";
  let altName: string | null = null;
  try {
    if (type === "country") {
      const list = await locationApi.getCountries(altLang);
      altName = list.find((c) => c.geonameId === id)?.name ?? null;
    } else if (type === "state" && parentId) {
      const list = await locationApi.getStates(parentId, altLang);
      altName = list.find((s) => s.geonameId === id)?.name ?? null;
    } else if (type === "city" && parentId) {
      const list = await locationApi.getCities(parentId, altLang);
      altName = list.find((c) => c.geonameId === id)?.name ?? null;
    }
  } catch {
    // GeoNames unavailable — store what we have, alt stays null
  }
  return currentLang === "en"
    ? { en: currentName, ar: altName }
    : { en: altName, ar: currentName };
}
