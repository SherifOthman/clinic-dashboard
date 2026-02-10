import { EntityTable } from "@/core/components/ui/EntityTable";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeletePatient } from "../hooks/usePatientsMutations";
import { usePaginatedPatients } from "../hooks/usePatientsQueries";
import { usePatientsTableState } from "../hooks/usePatientsTableState";
import type { PatientDto } from "../types/patient";
import { PatientDeleteDialog } from "./PatientDeleteDialog";
import { usePatientTableActions } from "./PatientTableActions";
import { usePatientTableColumns } from "./PatientTableColumns";
import { PatientTableHeader } from "./PatientTableHeader";

interface PatientsListProps {
  onPatientEdit?: (patient: PatientDto) => void;
  onPatientCreate?: () => void;
  onPatientDelete?: (patient: PatientDto) => void;
  onPatientView?: (patient: PatientDto) => void;
}

export function PatientsList({
  onPatientEdit,
  onPatientCreate,
  onPatientDelete,
  onPatientView,
}: PatientsListProps) {
  const { t } = useTranslation();
  const { patientsState, updatePatientsState } = usePatientsTableState();
  const [patientToDelete, setPatientToDelete] = useState<PatientDto | null>(
    null,
  );

  const { data, isLoading, error } = usePaginatedPatients(patientsState);
  const deletePatient = useDeletePatient();

  const columns = usePatientTableColumns();
  const actions = usePatientTableActions({
    onEdit: onPatientEdit,
    onDelete: setPatientToDelete,
  });

  const handleGenderChange = (gender?: number) => {
    updatePatientsState({ gender });
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;

    try {
      await deletePatient.mutateAsync(patientToDelete.id);
      onPatientDelete?.(patientToDelete);
      setPatientToDelete(null);
    } catch (error) {
      console.error("Failed to delete patient:", error);
    }
  };

  const cancelDelete = () => {
    setPatientToDelete(null);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger">{t("patients.failedToLoad")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EntityTable
        key={t("patients.title")}
        data={data?.items || []}
        columns={columns}
        actions={actions}
        isLoading={isLoading}
        searchPlaceholder={t("patients.searchPlaceholder")}
        getRowKey={(patient) => patient.id.toString()}
        onRowClick={onPatientView}
        currentSort={
          patientsState.sortBy === "name"
            ? "fullName"
            : patientsState.sortBy === "createdat"
              ? "createdAt"
              : patientsState.sortBy
        }
        sortDirection={patientsState.sortDirection}
        onSort={(sortBy, sortDirection) => {
          const backendSortBy =
            sortBy === "fullName"
              ? "name"
              : sortBy === "createdAt"
                ? "createdat"
                : sortBy;

          updatePatientsState({
            sortBy: backendSortBy,
            sortDirection,
          });
        }}
        onSearch={(searchTerm) => {
          updatePatientsState({ searchTerm });
        }}
        headerAction={
          <PatientTableHeader
            genderFilter={patientsState.gender}
            onGenderChange={handleGenderChange}
            onCreatePatient={onPatientCreate || (() => {})}
          />
        }
        totalCount={data?.totalCount || 0}
        pageNumber={data?.pageNumber || 1}
        pageSize={data?.pageSize || 10}
        totalPages={data?.totalPages || 1}
        onPageChange={(pageNumber) => {
          updatePatientsState({ pageNumber });
        }}
        onPageSizeChange={(pageSize) => {
          updatePatientsState({ pageSize, pageNumber: 1 });
        }}
      />

      <PatientDeleteDialog
        patient={patientToDelete}
        isLoading={deletePatient.isPending}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
