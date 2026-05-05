import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "./adminApi";
import type { UpsertSpecializationRequest, UpsertChronicDiseaseRequest, UpsertSubscriptionPlanRequest } from "./adminApi";

// ── Specializations ───────────────────────────────────────────────────────────

export function useSpecializations(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["admin", "specializations", page, pageSize],
    queryFn:  () => adminApi.getSpecializationsPaginated(page, pageSize),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useCreateSpecialization() {
  return useMutationWithToast<string, UpsertSpecializationRequest>({
    mutationFn: adminApi.createSpecialization,
    successMessage: "toast.specializationCreated",
    invalidateKeys: [["admin", "specializations"]],
  });
}

export function useUpdateSpecialization() {
  return useMutationWithToast<void, { id: string } & UpsertSpecializationRequest & { isActive: boolean }>({
    mutationFn: ({ id, ...data }) => adminApi.updateSpecialization(id, data),
    successMessage: "toast.specializationUpdated",
    invalidateKeys: [["admin", "specializations"]],
  });
}

export function useDeleteSpecialization() {
  return useMutationWithToast<void, string>({
    mutationFn: adminApi.deleteSpecialization,
    successMessage: "toast.specializationDeleted",
    invalidateKeys: [["admin", "specializations"]],
  });
}

// ── Chronic Diseases ──────────────────────────────────────────────────────────

export function useChronicDiseases(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["admin", "chronic-diseases", page, pageSize],
    queryFn:  () => adminApi.getChronicDiseasesPaginated(page, pageSize),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useCreateChronicDisease() {
  return useMutationWithToast<string, UpsertChronicDiseaseRequest>({
    mutationFn: adminApi.createChronicDisease,
    successMessage: "toast.chronicDiseaseCreated",
    invalidateKeys: [["admin", "chronic-diseases"]],
  });
}

export function useUpdateChronicDisease() {
  return useMutationWithToast<void, { id: string } & UpsertChronicDiseaseRequest & { isActive: boolean }>({
    mutationFn: ({ id, ...data }) => adminApi.updateChronicDisease(id, data),
    successMessage: "toast.chronicDiseaseUpdated",
    invalidateKeys: [["admin", "chronic-diseases"]],
  });
}

export function useDeleteChronicDisease() {
  return useMutationWithToast<void, string>({
    mutationFn: adminApi.deleteChronicDisease,
    successMessage: "toast.chronicDiseaseDeleted",
    invalidateKeys: [["admin", "chronic-diseases"]],
  });
}

// ── Subscription Plans ────────────────────────────────────────────────────────

export function useAdminSubscriptionPlans() {
  return useQuery({
    queryKey: ["admin", "subscription-plans"],
    queryFn:  adminApi.getSubscriptionPlans,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSubscriptionPlan() {
  return useMutationWithToast<string, UpsertSubscriptionPlanRequest>({
    mutationFn: adminApi.createSubscriptionPlan,
    successMessage: "toast.subscriptionPlanCreated",
    invalidateKeys: [["admin", "subscription-plans"]],
  });
}

export function useUpdateSubscriptionPlan() {
  return useMutationWithToast<void, { id: string } & UpsertSubscriptionPlanRequest>({
    mutationFn: ({ id, ...data }) => adminApi.updateSubscriptionPlan(id, data),
    successMessage: "toast.subscriptionPlanUpdated",
    invalidateKeys: [["admin", "subscription-plans"]],
  });
}

export function useToggleSubscriptionPlan() {
  const qc = useQueryClient();
  return useMutationWithToast<void, string>({
    mutationFn: adminApi.toggleSubscriptionPlan,
    successMessage: "toast.subscriptionPlanToggled",
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "subscription-plans"] });
    },
  });
}
