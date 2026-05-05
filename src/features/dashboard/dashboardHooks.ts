import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "./dashboardApi";
import type { SubmitTestimonialRequest } from "./dashboardApi";
import { useMe } from "@/features/auth/hooks";
import { isSuperAdmin } from "@/core/utils/permissions";

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

export function useContactMessagesUnreadCount() {
  const { user } = useMe();
  const enabled = isSuperAdmin(user);
  return useQuery({
    queryKey: ["contact", "unread-count"],
    queryFn:  dashboardApi.getContactMessagesUnreadCount,
    enabled,
    staleTime:       30 * 1000,
    refetchInterval: enabled ? 60 * 1000 : false,
  });
}

export function useAllTestimonials(page = 1) {
  return useQuery({
    queryKey: ["testimonials", "all", "paged", page],
    queryFn: () => dashboardApi.getAllTestimonials(page),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useToggleTestimonial() {
  return useMutationWithToast<void, string>({
    mutationFn: (id) => dashboardApi.toggleTestimonial(id),
    successMessage: "toast.testimonialToggled",
    invalidateKeys: [["testimonials", "all", "paged"]],
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
