import { useQuery } from "@tanstack/react-query";
import { locationApi } from "../api/locationApi";

/**
 * Location query hooks
 * All data comes from backend proxy (cached 24h), never directly from GeoNames
 */

export function useCountries() {
  return useQuery({
    queryKey: ["location", "countries"],
    queryFn: () => locationApi.getCountries(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (matches backend cache)
  });
}

export function useStates(countryGeonameId: number | null) {
  return useQuery({
    queryKey: ["location", "states", countryGeonameId],
    queryFn: () => locationApi.getStates(countryGeonameId!),
    enabled: !!countryGeonameId && countryGeonameId > 0,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (matches backend cache)
  });
}

export function useCities(stateGeonameId: number | null) {
  return useQuery({
    queryKey: ["location", "cities", stateGeonameId],
    queryFn: () => locationApi.getCities(stateGeonameId!),
    enabled: !!stateGeonameId && stateGeonameId > 0,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (matches backend cache)
  });
}
