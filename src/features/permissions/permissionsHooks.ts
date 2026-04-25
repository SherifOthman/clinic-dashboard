import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { useQuery } from "@tanstack/react-query";
import { permissionsApi } from "./permissionsApi";

export function useAvailablePermissions() {
  return useQuery({
    queryKey: ["permissions", "available"],
    queryFn: permissionsApi.getAvailable,
    staleTime: Infinity, // permission names never change at runtime
  });
}

export function useRoleDefaults() {
  return useQuery({
    queryKey: ["permissions", "role-defaults"],
    queryFn: permissionsApi.getRoleDefaults,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSetRoleDefaults() {
  return useMutationWithToast<void, { role: string; permissions: string[] }>({
    mutationFn: ({ role, permissions }) =>
      permissionsApi.setRoleDefaults(role, permissions),
    successMessage: "toast.roleDefaultsUpdated",
    invalidateKeys: [["permissions", "role-defaults"]],
  });
}
