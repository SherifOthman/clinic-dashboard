import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "./dashboardApi";
import type { SubmitTestimonialRequest } from "./dashboardApi";

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

export function useDoctorTodayAppointments(doctorInfoId: string | undefined, branchId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "doctor-today", doctorInfoId, branchId],
    queryFn: () => dashboardApi.getDoctorTodayAppointments(doctorInfoId!, branchId!),
    enabled: !!doctorInfoId && !!branchId,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useBranchTodayAppointments(branchId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "branch-today", branchId],
    queryFn: () => dashboardApi.getBranchTodayAppointments(branchId!),
    enabled: !!branchId,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useContactMessages(page = 1) {
  return useQuery({
    queryKey: ["contact", "messages", page],
    queryFn: () => dashboardApi.getContactMessages(page),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev, // keep previous page data while loading next
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
  return useMutationWithToast<void, string>({
    mutationFn: (id) => dashboardApi.toggleTestimonial(id),
    successMessage: "toast.testimonialToggled",
    invalidateKeys: [["testimonials", "all"]],
  });
}

// ── Owner testimonial ─────────────────────────────────────────────────────────

export function useMyTestimonial(enabled = true) {
  return useQuery({
    queryKey: ["testimonial", "mine"],
    queryFn: dashboardApi.getMyTestimonial,
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useSubmitTestimonial() {
  const queryClient = useQueryClient();
  return useMutationWithToast<void, SubmitTestimonialRequest>({
    mutationFn: (data) => dashboardApi.submitTestimonial(data),
    successMessage: "toast.testimonialSubmitted",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonial", "mine"] });
    },
  });
}

// ── Recent patients ───────────────────────────────────────────────────────────

export function useRecentPatients() {
  return useQuery({
    queryKey: ["dashboard", "recent-patients"],
    queryFn: dashboardApi.getRecentPatients,
    staleTime: 60 * 1000,
  });
}

export function useUsageMetrics() {
  return useQuery({
    queryKey: ["dashboard", "usage-metrics"],
    queryFn: dashboardApi.getUsageMetrics,
    staleTime: 5 * 60 * 1000, // 5 min — data is aggregated daily, no need to refetch often
  });
}
