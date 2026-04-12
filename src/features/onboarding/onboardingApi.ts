import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { CompleteOnboarding } from "./schemas";
import type { Specialization, SubscriptionPlan } from "./types";

export const onboardingApi = {
  async completeOnboarding(data: CompleteOnboarding): Promise<void> {
    // Transform "yes"/"no" to boolean for backend
    // If undefined, default to false (user chose not to provide medical services)
    const payload = {
      ...data,
      provideMedicalServices: data.provideMedicalServices === "yes",
    };
    await apiClient.post(`${API_ENDPOINTS.onboarding}/complete`, payload);
  },

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get<SubscriptionPlan[]>(
      API_ENDPOINTS.subscriptionPlans,
    );
    return response.data;
  },

  async getSpecializations(): Promise<Specialization[]> {
    const response = await apiClient.get<Specialization[]>(
      API_ENDPOINTS.specializations,
    );
    return response.data;
  },
};
