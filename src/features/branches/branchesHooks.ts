import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { useQuery } from "@tanstack/react-query";
import { branchesApi, type CreateBranchRequest } from "./branchesApi";

export function useBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: () => branchesApi.getAll(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateBranch() {
  return useMutationWithToast<string, CreateBranchRequest>({
    mutationFn: (data) => branchesApi.create(data),
    successMessage: "toast.branchCreatedSuccessfully",
    invalidateKeys: [["branches"]],
  });
}

export function useUpdateBranch() {
  return useMutationWithToast<void, { id: string; data: CreateBranchRequest }>({
    mutationFn: ({ id, data }) => branchesApi.update(id, data),
    successMessage: "toast.branchUpdatedSuccessfully",
    invalidateKeys: [["branches"]],
  });
}

export function useSetBranchActiveStatus() {
  return useMutationWithToast<void, { id: string; isActive: boolean }>({
    mutationFn: ({ id, isActive }) => branchesApi.setActiveStatus(id, isActive),
    successMessage: "toast.branchStatusUpdated",
    invalidateKeys: [["branches"]],
  });
}
