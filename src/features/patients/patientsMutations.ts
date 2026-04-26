import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { patientsApi } from "./patientsApi";
import type { PatientApiRequest } from "./types";

export function useCreatePatient() {
  return useMutationWithToast<string, PatientApiRequest>({
    mutationFn: (patient) => patientsApi.create(patient),
    successMessage: "toast.patientCreatedSuccessfully",
    invalidateKeys: [["patients"]],
  });
}

export function useUpdatePatient() {
  return useMutationWithToast<void, { id: string; patient: PatientApiRequest }>({
    mutationFn: ({ id, patient }) => patientsApi.update(id, patient),
    successMessage: "toast.patientUpdatedSuccessfully",
    invalidateKeys: [["patients"]],
  });
}

export function useDeletePatient() {
  return useMutationWithToast<void, string>({
    mutationFn: (id) => patientsApi.delete(id),
    successMessage: "toast.patientDeletedSuccessfully",
    invalidateKeys: [["patients"]],
  });
}
