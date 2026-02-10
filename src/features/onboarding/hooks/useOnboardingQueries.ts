import { locationApi } from "@/features/location/api/locationApi";
import { useQuery } from "@tanstack/react-query";
import { onboardingApi } from "../api/onboardingApi";

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ["onboarding", "subscription-plans"],
    queryFn: onboardingApi.getSubscriptionPlans,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCountries() {
  return useQuery({
    queryKey: ["location", "countries"],
    queryFn: () => locationApi.getCountries(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useStates(countryId: number | null) {
  return useQuery({
    queryKey: ["location", "states", countryId],
    queryFn: () => locationApi.getStates(countryId!),
    enabled: !!countryId && countryId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCities(stateGeonameId: number | null) {
  return useQuery({
    queryKey: ["location", "cities", stateGeonameId],
    queryFn: () => locationApi.getCities(stateGeonameId!),
    enabled: !!stateGeonameId && stateGeonameId > 0,
    staleTime: 5 * 60 * 1000,
  });
}
