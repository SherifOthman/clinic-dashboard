import { Dialog } from "@/core/components/ui/Dialog";
import { Loading } from "@/core/components/ui/Loading";
import type { DialogState } from "@/core/types";
import { UserCog, UserPlus } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  toPatientApiRequest,
  useCreatePatient,
  usePatientDetail,
  useUpdatePatient,
} from "../patientsHooks";
import type { PatientFormData } from "../schemas";
import { PatientForm } from "./PatientForm";

interface PatientDialogProps {
  state: DialogState;
  isSuperAdmin?: boolean;
  onClose: () => void;
}

export function PatientDialog({
  state,
  isSuperAdmin = false,
  onClose,
}: PatientDialogProps) {
  const { t } = useTranslation();
  const isCreate = state.mode === "create";
  const editId = state.mode === "edit" ? state.id : null;

  // Persist create-form draft across dialog open/close cycles
  const draftRef = useRef<Partial<PatientFormData> | undefined>(undefined);

  const { data: patientDetail, isLoading: patientDetailLoading } =
    usePatientDetail(editId, isSuperAdmin);

  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();

  const handleCreateSubmit = (data: PatientFormData) => {
    createPatient.mutate(toPatientApiRequest(data), {
      onSuccess: () => {
        draftRef.current = undefined; // clear draft after successful submit
        onClose();
      },
    });
  };

  const handleUpdateSubmit = (data: PatientFormData) => {
    if (!editId) return;
    updatePatient.mutate(
      { id: editId, patient: toPatientApiRequest(data) },
      { onSuccess: onClose },
    );
  };

  const handleClearDraft = () => {
    draftRef.current = undefined;
  };

  // ── Headers ─────────────────────────────────────────────────────────────────

  const createHeader = (
    <div className="flex items-center gap-3">
      <div className="bg-accent-soft text-accent-soft-foreground flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
        <UserPlus className="h-6 w-6" />
      </div>
      <h2 className="text-foreground text-xl font-bold">
        {t("patients.addPatient")}
      </h2>
    </div>
  );

  const editHeader = (
    <div className="flex items-center gap-3">
      <div className="bg-accent-soft text-accent-soft-foreground flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
        <UserCog className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-muted text-sm font-medium">
          {t("patients.editPatient")}
        </span>
        {patientDetail && (
          <h2 className="text-foreground truncate text-lg font-bold">
            {patientDetail.fullName}
          </h2>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Create dialog ── */}
      <Dialog
        isOpen={isCreate}
        onClose={onClose}
        header={createHeader}
        size="xl"
      >
        <PatientForm
          draft={draftRef.current}
          onDraftChange={(values: Partial<PatientFormData>) => {
            draftRef.current = values;
          }}
          onSubmit={handleCreateSubmit}
          onCancel={onClose}
          isLoading={createPatient.isPending}
          showReset
          onReset={handleClearDraft}
        />
      </Dialog>

      {/* ── Edit dialog ── */}
      <Dialog
        isOpen={state.mode === "edit"}
        onClose={onClose}
        header={editHeader}
        size="xl"
      >
        {patientDetailLoading || !patientDetail ? (
          <Loading className="h-48" />
        ) : (
          <PatientForm
            patient={patientDetail}
            onSubmit={handleUpdateSubmit}
            onCancel={onClose}
            isLoading={updatePatient.isPending}
          />
        )}
      </Dialog>
    </>
  );
}
