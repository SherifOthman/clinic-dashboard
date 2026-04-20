import { ConfirmDialog } from "@/core/components/ui/ConfirmDialog";
import type { DeleteState, DialogState } from "@/core/types";
import { canDeletePatient, canEditPatient } from "@/core/utils/permissions";
import { isSuperAdmin } from "@/core/utils/roleUtils";
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
  const [patientForm, setPatientForm] = useState<DialogState>({
    mode: "closed",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteState>({
    mode: "closed",
  });

  const deletePatient = useDeletePatient();

  const handleDeleteConfirm = () => {
    if (deleteConfirm.mode !== "confirm") return;
    deletePatient.mutate(deleteConfirm.id, {
      onSuccess: () => {
        setDeleteConfirm({ mode: "closed" });
        setDetailPatientId(null);
      },
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
          {t("patients.title")}
        </h1>
        <p className="text-default-500 text-sm">{t("patients.subtitle")}</p>
      </div>

      <PatientsList
        onPatientCreate={() => setPatientForm({ mode: "create" })}
        onPatientView={(p: PatientListItem) => setDetailPatientId(p.id)}
      />

      <PatientDetailDialog
        patientId={detailPatientId}
        isSuperAdmin={superAdmin}
        onClose={() => setDetailPatientId(null)}
        onEdit={
          canEditPatient(user)
            ? (id) => setPatientForm({ mode: "edit", id })
            : undefined
        }
        onDelete={
          canDeletePatient(user)
            ? (id, name) => setDeleteConfirm({ mode: "confirm", id, name })
            : undefined
        }
      />

      <PatientDialog
        state={patientForm}
        isSuperAdmin={superAdmin}
        onClose={() => setPatientForm({ mode: "closed" })}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.mode === "confirm"}
        onClose={() => setDeleteConfirm({ mode: "closed" })}
        onConfirm={handleDeleteConfirm}
        title={t("patients.deletePatient")}
        message={
          <p className="py-2 leading-relaxed">
            {t("patients.deleteConfirmationBefore")}{" "}
            <span className="text-danger/80 font-semibold">
              {deleteConfirm.mode === "confirm" ? deleteConfirm.name : ""}
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
