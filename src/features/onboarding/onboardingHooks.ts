import { tokenManager } from "@/core/api";
import { useToast } from "@/core/hooks/useToast";
import { useCities, useCountries, useStates } from "@/core/location/hooks";
import { createErrorHandler } from "@/core/utils/apiErrorHandler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { onboardingApi } from "./onboardingApi";

// ── Queries ───────────────────────────────────────────────────────────────────

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ["onboarding", "subscription-plans"],
    queryFn: onboardingApi.getSubscriptionPlans,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSpecializations() {
  return useQuery({
    queryKey: ["specializations"],
    queryFn: onboardingApi.getSpecializations,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export { useCities, useCountries, useStates };

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  const { showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: onboardingApi.completeOnboarding,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      await tokenManager.refreshAccessToken();
    },
    onError: createErrorHandler(showError, t),
    throwOnError: false,
  });
}
