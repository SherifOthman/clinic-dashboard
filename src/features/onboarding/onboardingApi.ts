import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { CompleteOnboarding } from "./schemas";
import type { Specialization, SubscriptionPlan } from "./types";

export const onboardingApi = {
  completeOnboarding: (data: CompleteOnboarding): Promise<void> =>
    apiClient.post(`${API_ENDPOINTS.onboarding}/complete`, {
      ...data,
      provideMedicalServices: data.provideMedicalServices === "yes",
    }),

  getSubscriptionPlans: (): Promise<SubscriptionPlan[]> =>
    apiClient.get<SubscriptionPlan[]>(API_ENDPOINTS.subscriptionPlans),

  getSpecializations: (): Promise<Specialization[]> =>
    apiClient.get<Specialization[]>(API_ENDPOINTS.specializations),
};
