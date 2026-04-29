import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useContactMessages(page = 1) {
  return useQuery({
    queryKey: ["contact", "messages", page],
    queryFn: () => dashboardApi.getContactMessages(page),
    staleTime: 30 * 1000,
  });
}

export function useAllTestimonials() {
  return useQuery({
    queryKey: ["testimonials", "all"],
    queryFn: () => dashboardApi.getAllTestimonials(),
    staleTime: 30 * 1000,
  });
}

export function useToggleTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dashboardApi.toggleTestimonial(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials", "all"] }),
  });
}
