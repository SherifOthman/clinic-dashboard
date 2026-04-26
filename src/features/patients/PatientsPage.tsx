import { ConfirmDialog } from "@/core/components/ui/ConfirmDialog";
import { PageHeader } from "@/core/components/ui/PageHeader";
import { useDeleteDialogState, useDialogState } from "@/core/hooks/useDialogState";
import { canDeletePatient, canEditPatient, isSuperAdmin } from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PatientDetailDialog } from "./components/PatientDetailDialog";
import { PatientDialog } from "./components/PatientDialog";
import { PatientsList } from "./components/PatientsList";
import { useDeletePatient } from "./patientsHooks";
import type { PatientListItem } from "./types";

export default function PatientsPage() {
  const { t } = useTranslation();
  const { user } = useMe();
  const superAdmin = isSuperAdmin(user);

  const [detailPatientId, setDetailPatientId] = useState<string | null>(null);
  const patientForm = useDialogState();
  const deleteDialog = useDeleteDialogState();
  const deletePatient = useDeletePatient();

  const handleDeleteConfirm = () => {
    if (deleteDialog.state.mode !== "confirm") return;
    deletePatient.mutate(deleteDialog.state.id, {
      onSuccess: () => {
        deleteDialog.close();
        setDetailPatientId(null);
      },
    });
  };

  return (
    <div>
      <PageHeader title={t("patients.title")} subtitle={t("patients.subtitle")} />

      <PatientsList
        onPatientCreate={patientForm.openCreate}
        onPatientView={(p: PatientListItem) => setDetailPatientId(p.id)}
      />

      <PatientDetailDialog
        patientId={detailPatientId}
        isSuperAdmin={superAdmin}
        onClose={() => setDetailPatientId(null)}
        onEdit={canEditPatient(user) ? patientForm.openEdit : undefined}
        onDelete={canDeletePatient(user) ? deleteDialog.open : undefined}
      />

      <PatientDialog
        state={patientForm.state}
        isSuperAdmin={superAdmin}
        onClose={patientForm.close}
      />

      <ConfirmDialog
        isOpen={deleteDialog.state.mode === "confirm"}
        onClose={deleteDialog.close}
        onConfirm={handleDeleteConfirm}
        title={t("patients.deletePatient")}
        message={
          <p className="py-2 leading-relaxed">
            {t("patients.deleteConfirmationBefore")}{" "}
            <span className="text-danger/80 font-semibold">
              {deleteDialog.state.mode === "confirm" ? deleteDialog.state.name : ""}
            </span>
            {"? "}
            {t("patients.deleteConfirmationAfter")}
          </p>
        }
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
        isLoading={deletePatient.isPending}
      />
    </div>
  );
}
