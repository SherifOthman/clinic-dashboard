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
  useAdminPatientDetail,
  useUpdatePatient,
} from "../patientsHooks";
import { isSuperAdmin } from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import type { PatientFormData } from "../schemas";
import { PatientForm } from "./PatientForm";

interface PatientDialogProps {
  state: DialogState;
  onClose: () => void;
  onCreated?: (patientId: string, fullName: string) => void;
}

export function PatientDialog({
  state,
  onClose,
  onCreated,
}: PatientDialogProps) {
  const { t } = useTranslation();
  const { user } = useMe();
  const superAdmin = isSuperAdmin(user);
  const isCreate = state.mode === "create";
  const editId = state.mode === "edit" ? state.id : null;

  const draftRef = useRef<Partial<PatientFormData> | undefined>(undefined);

  // SuperAdmin editing uses admin endpoint; clinic users use tenant-scoped
  const tenantDetail = usePatientDetail(superAdmin ? null : editId);
  const adminDetail  = useAdminPatientDetail(superAdmin ? editId : null);
  const { data: patientDetail, isLoading: patientDetailLoading } =
    superAdmin ? adminDetail : tenantDetail;

  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();

  const handleCreateSubmit = (data: PatientFormData) => {
    createPatient.mutate(toPatientApiRequest(data), {
      onSuccess: (newPatientId) => {
        draftRef.current = undefined; // clear draft after successful submit
        onCreated?.(newPatientId, data.fullName);
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
        ariaLabel={t("patients.addPatient")}
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
        ariaLabel={t("patients.editPatient")}
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
