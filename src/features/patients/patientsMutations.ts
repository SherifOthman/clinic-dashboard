import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { createPatient, deletePatient, updatePatient } from "./patientsApi";
import type { PatientApiRequest } from "./types";

export function useCreatePatient() {
  return useMutationWithToast<string, PatientApiRequest>({
    mutationFn: createPatient,
    invalidateKeys: [["patients"]],
  });
}

export function useUpdatePatient() {
  return useMutationWithToast<void, { id: string; patient: PatientApiRequest }>({
    mutationFn: ({ id, patient }) => updatePatient(id, patient),
    invalidateKeys: [["patients"]],
  });
}

export function useDeletePatient() {
  return useMutationWithToast<void, string>({
    mutationFn: deletePatient,
    invalidateKeys: [["patients"]],
  });
}
