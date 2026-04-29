import { useToast } from "@/core/hooks/useToast";
import { createErrorHandler } from "@/core/utils/apiErrorHandler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { appointmentsApi } from "./appointmentsApi";

export function useAppointments(date: string, branchId?: string | null, doctorInfoIds?: string[]) {
  return useQuery({
    queryKey: ["appointments", date, branchId, doctorInfoIds ?? []],
    queryFn: () => appointmentsApi.getAppointments(date, branchId ?? undefined, doctorInfoIds),
    staleTime: 30_000,
    refetchInterval: 60_000,
    enabled: !!branchId,
  });
}

export function useDoctorsForBranch(branchId: string | null) {
  return useQuery({
    queryKey: ["appointments", "doctors", branchId],
    queryFn: () => appointmentsApi.getDoctors(branchId!),
    enabled: !!branchId,
    staleTime: 5 * 60_000,
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      showSuccess("toast.appointmentCreated");
    },
    onError: createErrorHandler(showError, t),
  });
}

export function useUpdateAppointmentStatus() {
  const qc = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      appointmentsApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      showSuccess("toast.appointmentStatusUpdated");
    },
    onError: createErrorHandler(showError, t),
  });
}

export function useSetAppointmentType() {
  const qc = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ memberId, type }: { memberId: string; type: string }) =>
      appointmentsApi.setAppointmentType(memberId, type),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments", "doctors"] });
      qc.invalidateQueries({ queryKey: ["staff"] });
      showSuccess("toast.appointmentTypeUpdated");
    },
    onError: createErrorHandler(showError, t),
  });
}

export function useDoctorCheckIn() {
  const qc = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ doctorInfoId, branchId }: { doctorInfoId: string; branchId: string }) =>
      appointmentsApi.checkIn(doctorInfoId, branchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: createErrorHandler(showError, t),
  });
}

export function useHandleDelay() {
  const qc = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ sessionId, option }: { sessionId: string; option: "AutoShift" | "MarkMissed" | "Manual" }) =>
      appointmentsApi.handleDelay(sessionId, option),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      showSuccess("toast.appointmentStatusUpdated");
    },
    onError: createErrorHandler(showError, t),
  });
}
