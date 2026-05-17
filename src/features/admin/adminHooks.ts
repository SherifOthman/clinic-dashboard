import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { useQuery } from "@tanstack/react-query";
import {
  createChronicDisease,
  createSpecialization,
  deleteChronicDisease,
  deleteSpecialization,
  getChronicDiseasesPaginated,
  getSpecializationsPaginated,
  updateChronicDisease,
  updateSpecialization,
  type UpsertChronicDiseaseRequest,
  type UpsertSpecializationRequest,
} from "./adminApi";

export function useSpecializations(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["admin", "specializations", page, pageSize],
    queryFn: () => getSpecializationsPaginated(page, pageSize),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useCreateSpecialization() {
  return useMutationWithToast<string, UpsertSpecializationRequest>({
    mutationFn: createSpecialization,
    invalidateKeys: [["admin", "specializations"]],
  });
}

export function useUpdateSpecialization() {
  return useMutationWithToast<void, { id: string } & UpsertSpecializationRequest & { isActive: boolean }>({
    mutationFn: ({ id, ...data }) => updateSpecialization(id, data),
    invalidateKeys: [["admin", "specializations"]],
  });
}

export function useDeleteSpecialization() {
  return useMutationWithToast<void, string>({
    mutationFn: deleteSpecialization,
    invalidateKeys: [["admin", "specializations"]],
  });
}

export function useChronicDiseases(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["admin", "chronic-diseases", page, pageSize],
    queryFn: () => getChronicDiseasesPaginated(page, pageSize),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useCreateChronicDisease() {
  return useMutationWithToast<string, UpsertChronicDiseaseRequest>({
    mutationFn: createChronicDisease,
    invalidateKeys: [["admin", "chronic-diseases"]],
  });
}

export function useUpdateChronicDisease() {
  return useMutationWithToast<void, { id: string } & UpsertChronicDiseaseRequest & { isActive: boolean }>({
    mutationFn: ({ id, ...data }) => updateChronicDisease(id, data),
    invalidateKeys: [["admin", "chronic-diseases"]],
  });
}

export function useDeleteChronicDisease() {
  return useMutationWithToast<void, string>({
    mutationFn: deleteChronicDisease,
    invalidateKeys: [["admin", "chronic-diseases"]],
  });
}
