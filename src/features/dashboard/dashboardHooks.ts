import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
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
