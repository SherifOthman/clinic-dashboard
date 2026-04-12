import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./dashboardApi";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardApi.getStats(),
    staleTime: 60 * 1000,
  });
}

export function useSuperAdminStats() {
  return useQuery({
    queryKey: ["dashboard", "stats", "superadmin"],
    queryFn: () => dashboardApi.getSuperAdminStats(),
    staleTime: 60 * 1000,
  });
}
