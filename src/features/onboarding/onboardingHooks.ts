import { getErrorMessage } from "@/core/utils/apiErrorHandler";
import { useCities, useCountries, useStates } from "@/core/location/hooks";
import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { completeOnboarding, getSpecializations, getSubscriptionPlans } from "./onboardingApi";

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ["onboarding", "subscription-plans"],
    queryFn: getSubscriptionPlans,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSpecializations() {
  return useQuery({
    queryKey: ["specializations"],
    queryFn: getSpecializations,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export { useCities, useCountries, useStates };

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error) => toast.danger(getErrorMessage(error, t)),
    throwOnError: false,
  });
}
