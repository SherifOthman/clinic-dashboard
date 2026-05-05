import { PageHeader } from "@/core/components/ui/PageHeader";
import { useDialogState } from "@/core/hooks/useDialogState";
import { Button, Input } from "@heroui/react";
import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBranches } from "../branches/branchesHooks";
import { PatientDetailDialog } from "@/features/patients/components/PatientDetailDialog";
import { useAppointments, useDoctorsForBranch } from "./appointmentsHooks";
import { AppointmentsToolbar } from "./components/AppointmentsToolbar";
import { CreateAppointmentDialog } from "./components/CreateAppointmentDialog";
import { DoctorAppointmentsPanel } from "./components/DoctorAppointmentsPanel";
import { getMultiGridClass, resolveViewMode } from "./viewMode";
import type { AppointmentDto, ViewMode } from "./types";

export default function AppointmentsPage() {
  const { t } = useTranslation();

  const [dateStr, setDateStr] = useState<string>(() => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day   = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  });
  const [branchId, setBranchId]               = useState<string | undefined>();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();
  const [manualViewMode, setManualViewMode]     = useState<ViewMode | null>(null);
  const [preselectedDoctor, setPreselectedDoctor] = useState<string | undefined>();
  const [editingAppointment, setEditingAppointment] = useState<AppointmentDto | null>(null);
  const [viewPatientId, setViewPatientId]       = useState<string | null>(null);
  const [searchTerm, setSearchTerm]             = useState("");

  const createDialog = useDialogState();

  const { data: branches = [] } = useBranches();
  const activeBranchId = branchId ?? branches[0]?.id ?? null;

  const { data: doctors = [], isLoading: doctorsLoading } = useDoctorsForBranch(activeBranchId);

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
    visibleDoctors.length > 0 ? visibleDoctors.map((d) => d.doctorInfoId) : undefined,
  );

  const isLoading = doctorsLoading || apptLoading;

  // In multi mode, hide doctors with no appointments
  const displayDoctors = (!isLoading && viewMode === "multi")
    ? visibleDoctors.filter((d) => appointments.some((a) => a.doctorInfoId === d.doctorInfoId))
    : visibleDoctors;

  const openCreate = (doctorInfoId?: string) => {
    setPreselectedDoctor(doctorInfoId);
    createDialog.openCreate();
  };

  const handleBranchChange = (id: string | undefined) => {
    setBranchId(id);
    setSelectedDoctorId(undefined);
  };

  // "View All" from multi mode — switch to single mode for that doctor
  const handleViewAll = (doctorInfoId: string) => {
    setSelectedDoctorId(doctorInfoId);
    setManualViewMode("single");
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

      {/* Search bar — always visible */}
      <div className="mb-4">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("appointments.searchPlaceholder")}
          aria-label={t("appointments.searchPlaceholder")}
          fullWidth
        />
      </div>

      {/* Doctor panels */}
      {visibleDoctors.length === 0 && !isLoading ? (
        <div className="rounded-xl border border-border bg-surface py-16 text-center text-muted">
          {t("appointments.noDoctors")}
        </div>
      ) : (
        <div
          className={
            viewMode === "multi" && displayDoctors.length > 1
              ? getMultiGridClass(displayDoctors.length)
              : "flex flex-col gap-5"
          }
        >
          {displayDoctors.map((doctor) => (
            <DoctorAppointmentsPanel
              key={doctor.doctorInfoId}
              doctor={doctor}
              appointments={appointments.filter((a) => a.doctorInfoId === doctor.doctorInfoId)}
              isLoading={isLoading}
              viewMode={viewMode}
              searchTerm={searchTerm}
              onAddAppointment={() => openCreate(doctor.doctorInfoId)}
              onEditAppointment={(a) => setEditingAppointment(a)}
              onViewPatient={(patientId) => setViewPatientId(patientId)}
              onViewAll={handleViewAll}
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

      {activeBranchId && editingAppointment && (
        <CreateAppointmentDialog
          isOpen
          onClose={() => setEditingAppointment(null)}
          branchId={activeBranchId}
          doctors={doctors}
          preselectedDoctorInfoId={editingAppointment.doctorInfoId}
          editingAppointment={editingAppointment}
        />
      )}

      <PatientDetailDialog
        patientId={viewPatientId}
        onClose={() => setViewPatientId(null)}
      />
    </div>
  );
}
