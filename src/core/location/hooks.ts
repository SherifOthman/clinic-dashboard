import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { locationApi } from "./api";

// Cache location data for 24 hours — it never changes
const STALE_24H = 24 * 60 * 60 * 1000;

// ── Hooks used by the LocationSelector form component ─────────────────────────

/** Fetches all countries in the current UI language. */
export function useCountries() {
  const lang = useLang();
  return useQuery({
    queryKey: ["location", "countries", lang],
    queryFn: () => locationApi.getCountries(lang),
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
  });
}

/** Fetches states for a country. Only runs when countryGeonameId is provided. */
export function useStates(countryGeonameId: number | null) {
  const lang = useLang();
  return useQuery({
    queryKey: ["location", "states", countryGeonameId, lang],
    queryFn: () => locationApi.getStates(countryGeonameId!, lang),
    enabled: !!countryGeonameId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
    placeholderData: keepPreviousData,
  });
}

/** Fetches cities for a state. Only runs when stateGeonameId is provided. */
export function useCities(stateGeonameId: number | null) {
  const lang = useLang();
  return useQuery({
    queryKey: ["location", "cities", stateGeonameId, lang],
    queryFn: () => locationApi.getCities(stateGeonameId!, lang),
    enabled: !!stateGeonameId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
    placeholderData: keepPreviousData,
  });
}

// ── Hook used to display a location name in detail/card views ─────────────────

/**
 * Resolves a GeoNames ID to a display name in the current UI language.
 *
 * Uses already-cached location lists — no extra network requests if the
 * LocationSelector has already loaded the data.
 *
 * @param geonameId   - The ID to look up (e.g. 349401)
 * @param type        - "country" | "state" | "city"
 * @param parentId    - Required for state (pass countryGeonameId) and city (pass stateGeonameId)
 *
 * @example
 *   const cityName = useGeonameLabel(patient.cityGeonameId, "city", patient.stateGeonameId);
 *   const stateName = useGeonameLabel(patient.stateGeonameId, "state", patient.countryGeonameId);
 *   const countryName = useGeonameLabel(patient.countryGeonameId, "country");
 */
export function useGeonameLabel(
  geonameId: number | null | undefined,
  type: "country" | "state" | "city",
  parentId?: number | null,
): string | null {
  const lang = useLang();

  // Always call all three queries — React hooks must not be called conditionally.
  // The `enabled` flag controls whether each query actually runs.
  const { data: countries = [] } = useQuery({
    queryKey: ["location", "countries", lang],
    queryFn: () => locationApi.getCountries(lang),
    enabled: type === "country" && !!geonameId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
  });

  const { data: states = [] } = useQuery({
    queryKey: ["location", "states", parentId ?? null, lang],
    queryFn: () => locationApi.getStates(parentId!, lang),
    enabled: type === "state" && !!geonameId && !!parentId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["location", "cities", parentId ?? null, lang],
    queryFn: () => locationApi.getCities(parentId!, lang),
    enabled: type === "city" && !!geonameId && !!parentId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
  });

  if (!geonameId) return null;

  if (type === "country")
    return countries.find((c) => c.geonameId === geonameId)?.name ?? null;
  if (type === "state")
    return states.find((s) => s.geonameId === geonameId)?.name ?? null;
  return cities.find((c) => c.geonameId === geonameId)?.name ?? null;
}

// ── Internal helper ───────────────────────────────────────────────────────────

function useLang(): "en" | "ar" {
  const { i18n } = useTranslation();
  return i18n.language === "ar" ? "ar" : "en";
}
