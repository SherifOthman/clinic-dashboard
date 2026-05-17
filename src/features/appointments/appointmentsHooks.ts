import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { getErrorMessage } from "@/core/utils/apiErrorHandler";
import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  bulkCancelAppointments,
  checkInDoctor,
  checkOutDoctor,
  checkPatientHasAppointment,
  createAppointment,
  getAppointments,
  getDoctorsForBranch,
  handleSessionDelay,
  markAppointmentPaid,
  refundAppointment,
  rescheduleAppointment,
  rescheduleDoctor,
  updateAppointment,
  updateAppointmentStatus,
  type AppointmentsFilter,
} from "./appointmentsApi";
import type { CreateAppointmentRequest, DoctorCheckInResult } from "./types";

export function useAppointments(date: string, branchId?: string | null, doctorInfoIds?: string[], filter?: AppointmentsFilter) {
  return useQuery({
    queryKey: ["appointments", date, branchId, doctorInfoIds ?? [], filter],
    queryFn: () => getAppointments(date, branchId, doctorInfoIds, filter),
    staleTime: 30_000,
    refetchInterval: 60_000,
    enabled: !!branchId,
  });
}

export function useDoctorsForBranch(branchId: string | null) {
  return useQuery({
    queryKey: ["appointments", "doctors", branchId],
    queryFn: () => getDoctorsForBranch(branchId!),
    enabled: !!branchId,
    staleTime: 5 * 60_000,
  });
}

export function useCheckPatientAppointment(patientId: string, date: string) {
  return useQuery({
    queryKey: ["appointments", "check-patient", patientId, date],
    queryFn: () => checkPatientHasAppointment(patientId, date),
    enabled: !!patientId && !!date,
    staleTime: 15_000,
  });
}

export function useCreateAppointment() {
  return useMutationWithToast<string, CreateAppointmentRequest>({
    mutationFn: createAppointment,
    invalidateKeys: [["appointments"]],
  });
}

export function useUpdateAppointment() {
  return useMutationWithToast<void, { id: string; visitTypeId: string; discountPercent?: number }>({
    mutationFn: ({ id, ...data }) => updateAppointment(id, data),
    invalidateKeys: [["appointments"]],
  });
}

export function useUpdateAppointmentStatus() {
  return useMutationWithToast<void, { id: string; status: string }>({
    mutationFn: ({ id, status }) => updateAppointmentStatus(id, status),
    invalidateKeys: [["appointments"]],
  });
}

export function useMarkAppointmentPaid() {
  return useMutationWithToast<void, string>({
    mutationFn: markAppointmentPaid,
    invalidateKeys: [["appointments"]],
  });
}

export function useRefundAppointment() {
  return useMutationWithToast<void, string>({
    mutationFn: refundAppointment,
    invalidateKeys: [["appointments"]],
  });
}

export function useRescheduleAppointment() {
  return useMutationWithToast<void, { appointmentId: string; newDate: string; newBranchId?: string }>({
    mutationFn: ({ appointmentId, newDate, newBranchId }) =>
      rescheduleAppointment(appointmentId, newDate, newBranchId),
    successMessage: "toast.appointmentRescheduled",
    invalidateKeys: [["appointments"]],
  });
}

export function useRescheduleDoctorAppointments() {
  return useMutationWithToast<number, { doctorInfoId: string; branchId: string; date: string }>({
    mutationFn: ({ doctorInfoId, branchId, date }) => rescheduleDoctor(doctorInfoId, branchId, date),
    successMessage: "toast.appointmentsRescheduled",
    invalidateKeys: [["appointments"]],
  });
}

export function useBulkCancelAppointments() {
  return useMutationWithToast<number, { doctorInfoId: string; branchId: string; date: string }>({
    mutationFn: ({ doctorInfoId, branchId, date }) => bulkCancelAppointments(doctorInfoId, branchId, date),
    successMessage: "toast.appointmentsBulkCancelled",
    invalidateKeys: [["appointments"]],
  });
}

export function useDoctorCheckIn() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorInfoId, branchId }: { doctorInfoId: string; branchId: string }) =>
      checkInDoctor(doctorInfoId, branchId),
    onSuccess: (result: DoctorCheckInResult) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      if (!result.isLate) toast.success(t("toast.checkedIn"));
    },
    onError: (err: unknown) => {
      if ((err as any)?.code === "ALREADY_EXISTS") {
        queryClient.invalidateQueries({ queryKey: ["appointments", "doctors"] });
        return;
      }
      toast.danger(getErrorMessage(err, t));
    },
  });
}

export function useDoctorCheckOut() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doctorInfoId, branchId }: { doctorInfoId: string; branchId: string }) =>
      checkOutDoctor(doctorInfoId, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success(t("toast.checkedOut"));
    },
    onError: (err: unknown) => toast.danger(getErrorMessage(err, t)),
  });
}

export function useHandleDelay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, option }: { sessionId: string; option: "AutoShift" | "MarkMissed" | "Manual" | "Cancel" }) =>
      handleSessionDelay(sessionId, option),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });
}
