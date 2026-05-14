import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { useToast } from "@/core/hooks/useToast";
import { getErrorMessage } from "@/core/utils/apiErrorHandler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { appointmentsApi } from "./appointmentsApi";
import type { DoctorCheckInResult } from "./types";

// ── Queries ───────────────────────────────────────────────────────────────────

export function useAppointments(filters: {
  date: string;
  branchId: string;
  doctorInfoIds?: string[];
  search?: string;
  sortBy?: string;
  sortDirection?: string;
  visitType?: string;
  payment?: string;
}) {
  return useQuery({
    queryKey: ["appointments", filters],
    queryFn:  () => appointmentsApi.getAppointments(filters),
    staleTime:       30_000,
    refetchInterval: 60_000,
    enabled: !!filters.branchId,
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

export function useCheckPatientAppointment(patientId: string, date: string) {
  return useQuery({
    queryKey: ["appointments", "check-patient", patientId, date],
    queryFn: () => appointmentsApi.checkPatientHasAppointment(patientId, date),
    enabled: !!patientId && !!date,
    staleTime: 15_000,
  });
}

// ── Appointment mutations ─────────────────────────────────────────────────────

export function useCreateAppointment() {
  return useMutationWithToast<string, Parameters<typeof appointmentsApi.create>[0]>({
    mutationFn:    appointmentsApi.create,
    successMessage: "toast.appointmentCreated",
    invalidateKeys: [["appointments"]],
  });
}

export function useUpdateAppointment() {
  return useMutationWithToast<void, { id: string; visitTypeId: string; discountPercent?: number }>({
    mutationFn:    ({ id, ...data }) => appointmentsApi.update(id, data),
    successMessage: "toast.appointmentUpdated",
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

// ── Reschedule / bulk operations ──────────────────────────────────────────────

export function useRescheduleAppointment() {
  return useMutationWithToast<void, { appointmentId: string; newDate: string; newBranchId?: string }>({
    mutationFn: ({ appointmentId, newDate, newBranchId }) =>
      appointmentsApi.rescheduleAppointment(appointmentId, newDate, newBranchId),
    successMessage: "toast.appointmentRescheduled",
    invalidateKeys: [["appointments"]],
  });
}

export function useRescheduleDoctorAppointments() {
  return useMutationWithToast<number, { doctorInfoId: string; branchId: string; date: string }>({
    mutationFn: ({ doctorInfoId, branchId, date }) =>
      appointmentsApi.rescheduleDoctor(doctorInfoId, branchId, date),
    successMessage: "toast.appointmentsRescheduled",
    invalidateKeys: [["appointments"]],
  });
}

export function useBulkCancelAppointments() {
  return useMutationWithToast<number, { doctorInfoId: string; branchId: string; date: string }>({
    mutationFn: ({ doctorInfoId, branchId, date }) =>
      appointmentsApi.bulkCancel(doctorInfoId, branchId, date),
    successMessage: "toast.appointmentsBulkCancelled",
    invalidateKeys: [["appointments"]],
  });
}

// ── Check-in / Check-out ──────────────────────────────────────────────────────

/**
 * Check-in mutation — does NOT invalidate queries automatically when late.
 * The page-level delay dialog handles invalidation after the dialog is resolved.
 */
export function useDoctorCheckIn() {
  const { showError, showSuccess } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorInfoId, branchId }: { doctorInfoId: string; branchId: string }) =>
      appointmentsApi.checkIn(doctorInfoId, branchId),
    onSuccess: (result: DoctorCheckInResult) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      if (!result.isLate) showSuccess("toast.checkedIn");
    },
    onError: (err: unknown) => {
      if ((err as any)?.code === "ALREADY_EXISTS") {
        queryClient.invalidateQueries({ queryKey: ["appointments", "doctors"] });
        return;
      }
      showError(getErrorMessage(err as Error, t));
    },
  });
}

export function useDoctorCheckOut() {
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorInfoId, branchId }: { doctorInfoId: string; branchId: string }) =>
      appointmentsApi.checkOut(doctorInfoId, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      showSuccess("toast.checkedOut");
    },
    onError: (err: unknown) => {
      showError(getErrorMessage(err as Error, t));
    },
  });
}

// ── Delay handling ────────────────────────────────────────────────────────────

export function useHandleDelay() {
  const queryClient = useQueryClient();
  const { showSuccess } = useToast();

  return useMutation({
    mutationFn: ({ sessionId, option }: { sessionId: string; option: "AutoShift" | "MarkMissed" | "Manual" | "Cancel" }) =>
      appointmentsApi.handleDelay(sessionId, option),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      if (variables.option !== "Cancel") showSuccess("toast.delayHandled");
    },
  });
}
