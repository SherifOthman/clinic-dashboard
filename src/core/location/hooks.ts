import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { locationApi } from "./api";

// Cache location data for 24 hours — it never changes
const STALE_24H = 24 * 60 * 60 * 1000;

// ── Hooks used by the LocationSelector form component ─────────────────────────

/**
 * Fetches all countries. Returns items with { geonameId, name, countryCode }
 * where `name` is already in the current UI language.
 * Cached once — no re-fetch on language switch.
 */
export function useCountries() {
  const lang = useLang();
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["location", "countries"],
    queryFn: () => locationApi.getCountries(),
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
  });

  const data = raw
    .map((c) => ({
      geonameId: c.geonameId,
      name: lang === "ar" ? c.nameAr : c.nameEn,
      countryCode: c.countryCode,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { data, ...rest };
}

/** Fetches states for a country. Only runs when countryGeonameId is provided. */
export function useStates(countryGeonameId: number | null) {
  const lang = useLang();
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["location", "states", countryGeonameId],
    queryFn: () => locationApi.getStates(countryGeonameId!),
    enabled: !!countryGeonameId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const data = raw
    .map((s) => ({
      geonameId: s.geonameId,
      name: lang === "ar" ? s.nameAr : s.nameEn,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { data, ...rest };
}

/** Fetches cities for a state. Only runs when stateGeonameId is provided. */
export function useCities(stateGeonameId: number | null) {
  const lang = useLang();
  const { data: raw = [], ...rest } = useQuery({
    queryKey: ["location", "cities", stateGeonameId],
    queryFn: () => locationApi.getCities(stateGeonameId!),
    enabled: !!stateGeonameId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const data = raw
    .map((c) => ({
      geonameId: c.geonameId,
      name: lang === "ar" ? c.nameAr : c.nameEn,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { data, ...rest };
}

// ── Internal helper ───────────────────────────────────────────────────────────

function useLang(): "en" | "ar" {
  const { i18n } = useTranslation();
  return i18n.language === "ar" ? "ar" : "en";
}

// ── Hook used to display a location name in detail/card views ─────────────────

/**
 * Resolves a GeoNames ID to a display name in the current UI language.
 * Uses already-cached location data — no extra network requests.
 *
 * @param geonameId - The ID to look up
 * @param type      - "country" | "state" | "city"
 * @param parentId  - Required for state (countryGeonameId) and city (stateGeonameId)
 */
export function useGeonameLabel(
  geonameId: number | null | undefined,
  type: "country" | "state" | "city",
  parentId?: number | null,
): string | null {
  const lang = useLang();

  const { data: countries = [] } = useQuery({
    queryKey: ["location", "countries"],
    queryFn: () => locationApi.getCountries(),
    enabled: type === "country" && !!geonameId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
  });

  const { data: states = [] } = useQuery({
    queryKey: ["location", "states", parentId ?? null],
    queryFn: () => locationApi.getStates(parentId!),
    enabled: type === "state" && !!geonameId && !!parentId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["location", "cities", parentId ?? null],
    queryFn: () => locationApi.getCities(parentId!),
    enabled: type === "city" && !!geonameId && !!parentId,
    staleTime: STALE_24H,
    gcTime: STALE_24H,
    retry: false,
  });

  if (!geonameId) return null;

  const pick = (nameEn: string, nameAr: string) =>
    lang === "ar" ? nameAr : nameEn;

  if (type === "country") {
    const c = countries.find((x) => x.geonameId === geonameId);
    return c ? pick(c.nameEn, c.nameAr) : null;
  }
  if (type === "state") {
    const s = states.find((x) => x.geonameId === geonameId);
    return s ? pick(s.nameEn, s.nameAr) : null;
  }
  const c = cities.find((x) => x.geonameId === geonameId);
  return c ? pick(c.nameEn, c.nameAr) : null;
}
