import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { useToast } from "@/core/hooks/useToast";
import { getErrorMessage } from "@/core/utils/apiErrorHandler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { appointmentsApi } from "./appointmentsApi";
import type { DoctorCheckInResult } from "./types";

export function useAppointments(date: string, branchId?: string | null, doctorInfoIds?: string[]) {
  return useQuery({
    queryKey: ["appointments", date, branchId, doctorInfoIds ?? []],
    queryFn:  () => appointmentsApi.getAppointments(date, branchId ?? undefined, doctorInfoIds),
    staleTime:       30_000,
    refetchInterval: 60_000,
    enabled: !!branchId,
  });
}

export function useDoctorsForBranch(branchId: string | null) {
  return useQuery({
    queryKey: ["appointments", "doctors", branchId],
    queryFn:  () => appointmentsApi.getDoctors(branchId!),
    enabled:  !!branchId,
    staleTime: 5 * 60_000,
  });
}

export function useCreateAppointment() {
  return useMutationWithToast<string, Parameters<typeof appointmentsApi.create>[0]>({
    mutationFn:    appointmentsApi.create,
    successMessage: "toast.appointmentCreated",
    invalidateKeys: [["appointments"]],
  });
}

export function useUpdateAppointmentStatus() {
  return useMutationWithToast<void, { id: string; status: string }>({
    mutationFn:    ({ id, status }) => appointmentsApi.updateStatus(id, status),
    successMessage: "toast.appointmentStatusUpdated",
    invalidateKeys: [["appointments"]],
  });
}

export function useSetAppointmentType() {
  return useMutationWithToast<void, { memberId: string; branchId: string; type: string }>({
    mutationFn:    ({ memberId, branchId, type }) => appointmentsApi.setAppointmentType(memberId, branchId, type),
    successMessage: "toast.appointmentTypeUpdated",
    invalidateKeys: [["appointments", "doctors"], ["staff"]],
  });
}

/**
 * Check-in mutation — does NOT invalidate queries automatically.
 * The caller decides when to invalidate (after the delay dialog is resolved,
 * or immediately if the doctor is on time).
 */
export function useDoctorCheckIn() {
  const { showError, showSuccess } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorInfoId, branchId }: { doctorInfoId: string; branchId: string }) =>
      appointmentsApi.checkIn(doctorInfoId, branchId),
    onSuccess: (result: DoctorCheckInResult) => {
      // Always invalidate so the badge updates immediately.
      // For Time doctors that are late, the page-level delay dialog also handles
      // a second invalidation after the dialog is resolved.
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      if (!result.isLate) {
        showSuccess("toast.checkedIn");
      }
    },
    onError: (err: unknown) => {
      if ((err as any)?.code === "ALREADY_EXISTS") {
        // Already checked in — sync the badge
        queryClient.invalidateQueries({ queryKey: ["appointments", "doctors"] });
        return;
      }
      showError(getErrorMessage(err as Error, t));
    },
  });
}

export function useUpdateAppointment() {
  return useMutationWithToast<void, { id: string; visitTypeId: string; scheduledTime?: string; discountPercent?: number; visitDurationMinutes?: number }>({
    mutationFn:    ({ id, ...data }) => appointmentsApi.update(id, data),
    successMessage: "toast.appointmentUpdated",
    invalidateKeys: [["appointments"]],
  });
}

export function useMarkAppointmentPaid() {
  return useMutationWithToast<void, string>({
    mutationFn:    appointmentsApi.markPaid,
    successMessage: "toast.appointmentPaid",
    invalidateKeys: [["appointments"]],
  });
}

export function useRefundAppointment() {
  return useMutationWithToast<void, string>({
    mutationFn:    appointmentsApi.refund,
    successMessage: "toast.appointmentRefunded",
    invalidateKeys: [["appointments"]],
  });
}

export function useHandleDelay() {
  const queryClient = useQueryClient();
  const { showSuccess } = useToast();

  return useMutation({
    mutationFn: ({ sessionId, option }: { sessionId: string; option: "AutoShift" | "MarkMissed" | "Manual" | "Cancel" }) =>
      appointmentsApi.handleDelay(sessionId, option),
    onSuccess: (_data, variables) => {
      // Always refresh after delay is handled (or cancelled)
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      if (variables.option !== "Cancel") {
        showSuccess("toast.delayHandled");
      }
    },
  });
}
