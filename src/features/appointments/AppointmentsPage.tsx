import { PageHeader } from "@/core/components/ui/PageHeader";
import { useDialogState } from "@/core/hooks/useDialogState";
import { Button } from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBranches } from "../branches/branchesHooks";
import { PatientDetailDialog } from "@/features/patients/components/PatientDetailDialog";
import { useAppointments, useDoctorsForBranch } from "./appointmentsHooks";
import { AppointmentsToolbar } from "./components/AppointmentsToolbar";
import { CreateAppointmentDialog } from "./components/CreateAppointmentDialog";
import { DoctorAppointmentsPanel } from "./components/DoctorAppointmentsPanel";
import { getMultiGridClass, resolveViewMode } from "./viewMode";
import type { ViewMode } from "./types";

export default function AppointmentsPage() {
  const { t } = useTranslation();

  const [dateStr, setDateStr] = useState<string>(() => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  });
  const [branchId, setBranchId] = useState<string | undefined>();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();
  const [manualViewMode, setManualViewMode] = useState<ViewMode | null>(null);
  const [preselectedDoctor, setPreselectedDoctor] = useState<string | undefined>();
  const [viewPatientId, setViewPatientId] = useState<string | null>(null);

  const createDialog = useDialogState();

  const { data: branches = [] } = useBranches();
  const activeBranchId = branchId ?? branches[0]?.id ?? null;

  const { data: doctors = [], isLoading: doctorsLoading } =
    useDoctorsForBranch(activeBranchId);

  const viewMode = resolveViewMode(doctors.length, manualViewMode);
  const isSingle = viewMode === "single";

  const effectiveDoctorId = selectedDoctorId ?? doctors[0]?.doctorInfoId;
  const visibleDoctors =
    isSingle && doctors.length > 1
      ? doctors.filter((d) => d.doctorInfoId === effectiveDoctorId)
      : doctors;

  const { data: appointments = [], isLoading: apptLoading } = useAppointments(
    dateStr,
    activeBranchId,
    visibleDoctors.length > 0
      ? visibleDoctors.map((d) => d.doctorInfoId)
      : undefined,
  );

  const isLoading = doctorsLoading || apptLoading;

  const openCreate = (doctorInfoId?: string) => {
    setPreselectedDoctor(doctorInfoId);
    createDialog.openCreate();
  };

  const handleBranchChange = (id: string | undefined) => {
    setBranchId(id);
    setSelectedDoctorId(undefined);
  };

  return (
    <div>
      <PageHeader
        title={t("navigation.appointments")}
        subtitle={t("appointments.subtitle")}
        action={
          <Button variant="primary" size="sm" onPress={() => openCreate()}>
            + {t("appointments.newAppointment")}
          </Button>
        }
      />

      <AppointmentsToolbar
        dateStr={dateStr}
        onDateChange={setDateStr}
        branches={branches}
        activeBranchId={activeBranchId}
        onBranchChange={handleBranchChange}
        doctors={doctors}
        effectiveDoctorId={effectiveDoctorId}
        onDoctorChange={setSelectedDoctorId}
        viewMode={viewMode}
        manualViewMode={manualViewMode}
        onViewModeChange={setManualViewMode}
        onResetViewMode={() => setManualViewMode(null)}
      />

      {/* Doctor panels */}
      {visibleDoctors.length === 0 && !isLoading ? (
        <div className="rounded-xl border border-border bg-surface py-16 text-center text-muted">
          {t("appointments.noDoctors")}
        </div>
      ) : (
        <div
          className={
            viewMode === "multi" && visibleDoctors.length > 1
              ? getMultiGridClass(visibleDoctors.length)
              : "flex flex-col gap-5"
          }
        >
          {visibleDoctors.map((doctor) => (
            <DoctorAppointmentsPanel
              key={doctor.doctorInfoId}
              doctor={doctor}
              appointments={appointments.filter(
                (a) => a.doctorInfoId === doctor.doctorInfoId,
              )}
              isLoading={isLoading}
              viewMode={viewMode}
              onAddAppointment={() => openCreate(doctor.doctorInfoId)}
              onViewPatient={(patientId) => setViewPatientId(patientId)}
              branchId={activeBranchId ?? undefined}
            />
          ))}
        </div>
      )}

      {activeBranchId && createDialog.state.mode !== "closed" && (
        <CreateAppointmentDialog
          isOpen
          onClose={createDialog.close}
          branchId={activeBranchId}
          doctors={doctors}
          preselectedDoctorInfoId={preselectedDoctor}
        />
      )}

      <PatientDetailDialog
        patientId={viewPatientId}
        onClose={() => setViewPatientId(null)}
      />
    </div>
  );
}
