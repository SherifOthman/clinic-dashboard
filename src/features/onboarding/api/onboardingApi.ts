import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/constants/app";
import type { SubscriptionPlanDto } from "@/core/types/api";
import type { CompleteOnboardingDto } from "../types/onboarding";

export const onboardingApi = {
  async completeOnboarding(data: CompleteOnboardingDto): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.onboarding}/complete`, data);
  },

  async getSubscriptionPlans(): Promise<SubscriptionPlanDto[]> {
    const response = await apiClient.get<SubscriptionPlanDto[]>(
      API_ENDPOINTS.subscriptionPlans,
    );
    return response.data;
  },
};
