/**
 * Re-exports from the split hook files.
 * Existing imports like `import { useDeletePatient } from "./patientsHooks"` keep working.
 *
 * Prefer importing directly from the specific file in new code:
 *   import { usePaginatedPatients } from "./patientsQueries"
 *   import { useDeletePatient }     from "./patientsMutations"
 *   import { usePatientForm }       from "./patientForm"
 */
export * from "./patientForm";
export * from "./patientsMutations";
export * from "./patientsQueries";
