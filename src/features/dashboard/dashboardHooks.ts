import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMe } from "@/features/auth/hooks";
import { isSuperAdmin } from "@/core/utils/permissions";
import {
  getAllTestimonials,
  getBranchTodayAppointments,
  getContactMessages,
  getContactMessagesUnreadCount,
  getDashboardStats,
  getDoctorTodayAppointments,
  getMyTestimonial,
  getRecentPatients,
  getSuperAdminStats,
  getUsageMetrics,
  markContactMessageRead,
  submitTestimonial,
  toggleTestimonial,
  type SubmitTestimonialRequest,
} from "./dashboardApi";

export { markContactMessageRead };

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
    staleTime: 60 * 1000,
  });
}

export function useSuperAdminStats() {
  return useQuery({
    queryKey: ["dashboard", "stats", "superadmin"],
    queryFn: getSuperAdminStats,
    staleTime: 60 * 1000,
  });
}

export function useDoctorTodayAppointments(doctorInfoId: string | undefined, branchId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "doctor-today", doctorInfoId, branchId],
    queryFn: () => getDoctorTodayAppointments(doctorInfoId!, branchId!),
    enabled: !!doctorInfoId && !!branchId,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useBranchTodayAppointments(branchId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "branch-today", branchId],
    queryFn: () => getBranchTodayAppointments(branchId!),
    enabled: !!branchId,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useContactMessages(page = 1) {
  return useQuery({
    queryKey: ["contact", "messages", page],
    queryFn: () => getContactMessages(page),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useContactMessagesUnreadCount() {
  const { user } = useMe();
  const enabled = isSuperAdmin(user);
  return useQuery({
    queryKey: ["contact", "unread-count"],
    queryFn: getContactMessagesUnreadCount,
    enabled,
    staleTime: 30 * 1000,
    refetchInterval: enabled ? 60 * 1000 : false,
  });
}

export function useAllTestimonials(page = 1) {
  return useQuery({
    queryKey: ["testimonials", "all", "paged", page],
    queryFn: () => getAllTestimonials(page),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useToggleTestimonial() {
  return useMutationWithToast<void, string>({
    mutationFn: toggleTestimonial,
    invalidateKeys: [["testimonials", "all", "paged"]],
  });
}

export function useMyTestimonial(enabled = true) {
  return useQuery({
    queryKey: ["testimonial", "mine"],
    queryFn: getMyTestimonial,
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useSubmitTestimonial() {
  const queryClient = useQueryClient();
  return useMutationWithToast<void, SubmitTestimonialRequest>({
    mutationFn: submitTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonial", "mine"] });
    },
  });
}

export function useRecentPatients() {
  return useQuery({
    queryKey: ["dashboard", "recent-patients"],
    queryFn: getRecentPatients,
    staleTime: 60 * 1000,
  });
}

export function useUsageMetrics() {
  return useQuery({
    queryKey: ["dashboard", "usage-metrics"],
    queryFn: getUsageMetrics,
    staleTime: 5 * 60 * 1000,
  });
}
