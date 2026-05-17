import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { useQuery } from "@tanstack/react-query";
import { createBranch, getBranches, setBranchActiveStatus, updateBranch, type CreateBranchRequest } from "./branchesApi";

export function useBranches(enabled = true) {
  return useQuery({
    queryKey: ["branches"],
    queryFn: getBranches,
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useCreateBranch() {
  return useMutationWithToast<string, CreateBranchRequest>({
    mutationFn: createBranch,
    invalidateKeys: [["branches"]],
  });
}

export function useUpdateBranch() {
  return useMutationWithToast<void, { id: string; data: CreateBranchRequest }>({
    mutationFn: ({ id, data }) => updateBranch(id, data),
    invalidateKeys: [["branches"]],
  });
}

export function useSetBranchActiveStatus() {
  return useMutationWithToast<void, { id: string; isActive: boolean }>({
    mutationFn: ({ id, isActive }) => setBranchActiveStatus(id, isActive),
    invalidateKeys: [["branches"]],
  });
}
