import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { CompleteOnboarding } from "./schemas";
import type { Specialization, SubscriptionPlan } from "./types";

export async function completeOnboarding(data: CompleteOnboarding): Promise<void> {
  await apiClient.post(`${API_ENDPOINTS.onboarding}/complete`, {
    ...data,
    phoneNumbers: data.phoneNumbers
      ?.filter((p) => p.trim())
      .map((p) => ({ phoneNumber: p })),
  });
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const res = await apiClient.get<SubscriptionPlan[]>(API_ENDPOINTS.subscriptionPlans);
  return res.data;
}

export async function getSpecializations(): Promise<Specialization[]> {
  const res = await apiClient.get<Specialization[]>(API_ENDPOINTS.specializations);
  return res.data;
}
