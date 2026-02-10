import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/core/hooks/useToast";
import { patientsApi } from "../api/patientsApi";
import type { CreatePatientDto, UpdatePatientDto } from "../types/patient";

/**
 * Patient mutation hooks
 */

export function useCreatePatient() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (patient: CreatePatientDto) => patientsApi.create(patient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      showSuccess("toast.patientCreatedSuccessfully");
    },
    onError: (error: any) => {
      console.error("Failed to create patient:", error);

      // Handle validation errors
      if (error?.response?.status === 400 && error?.response?.data?.errors) {
        // For now, show generic error - we can enhance this later
        showError("toast.patientCreationFailed");
      } else {
        showError("toast.patientCreationFailed");
      }
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ id, patient }: { id: string; patient: UpdatePatientDto }) =>
      patientsApi.update(id, patient),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.setQueryData(["patients", data.id], data);
      showSuccess("toast.patientUpdatedSuccessfully");
    },
    onError: (error: any) => {
      console.error("Failed to update patient:", error);

      // Handle validation errors
      if (error?.response?.status === 400 && error?.response?.data?.errors) {
        // For now, show generic error - we can enhance this later
        showError("toast.patientUpdateFailed");
      } else {
        showError("toast.patientUpdateFailed");
      }
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => patientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      showSuccess("toast.patientDeletedSuccessfully");
    },
    onError: () => {
      showError("toast.patientDeletionFailed");
    },
  });
}
