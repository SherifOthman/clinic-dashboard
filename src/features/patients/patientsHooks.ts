/**
 * Re-exports from the split hook files.
 * Existing imports keep working without changes.
 *
 * Prefer importing directly in new code:
 *   import { usePaginatedPatients }  from "./patientsQueries"
 *   import { useDeletePatient }      from "./patientsMutations"
 *   import { usePatientForm }        from "./patientForm"
 *   import { usePatientsTableState } from "./patientsTableState"
 */
export * from "./patientForm";
export * from "./patientsMutations";
export * from "./patientsQueries";
export * from "./patientsTableState";
