import { PageHeader } from "@/core/components/ui/PageHeader";
import { useDialogState } from "@/core/hooks/useDialogState";
import { todayStr } from "@/core/utils/dateUtils";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useBranches } from "../branches/branchesHooks";
import { PatientDetailDialog } from "@/features/patients/components/PatientDetailDialog";
import { useAppointments, useDoctorsForBranch } from "./appointmentsHooks";
import { AppointmentsToolbar } from "./components/AppointmentsToolbar";
import { CreateAppointmentDialog } from "./components/CreateAppointmentDialog";
import { DelayHandlingDialog } from "./components/DelayHandlingDialog";
import { DoctorAppointmentsPanel } from "./components/DoctorAppointmentsPanel";
import { getMultiGridClass, resolveViewMode } from "./viewMode";
import type { AppointmentDto, DoctorCheckInResult, ViewMode } from "./types";
import { useState } from "react";

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── URL-synced state ───────────────────────────────────────────────────────
  const dateStr         = searchParams.get("date")   ?? todayStr();
  const selectedDoctorId = searchParams.get("doctor") ?? undefined;
  const manualViewMode  = (searchParams.get("view") as ViewMode | null) ?? null;
  const searchTerm      = searchParams.get("q")      ?? "";

  const setParam = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (!value) p.delete(key);
      else p.set(key, value);
      return p;
    }, { replace: true });
  };

  const setDateStr         = (v: string)          => setParam("date",   v === todayStr() ? null : v);
  const setSelectedDoctorId = (v: string | undefined) => setParam("doctor", v ?? null);
  const setManualViewMode  = (v: ViewMode | null)  => setParam("view",   v ?? null);
  const setSearchTerm      = (v: string)           => setParam("q",      v || null);

  // ── Local-only state (dialogs) ─────────────────────────────────────────────
  const [branchId, setBranchId]                     = useState<string | undefined>();
  const [preselectedDoctor, setPreselectedDoctor]   = useState<string | undefined>();
  const [editingAppointment, setEditingAppointment] = useState<AppointmentDto | null>(null);
  const [viewPatientId, setViewPatientId]           = useState<string | null>(null);
  const [pendingDelay, setPendingDelay]             = useState<{ result: DoctorCheckInResult; doctorName: string } | null>(null);

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
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

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
              onDoctorLate={(result, doctorName) => setPendingDelay({ result, doctorName })}
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

      {pendingDelay && (
        <DelayHandlingDialog
          isOpen
          sessionId={pendingDelay.result.sessionId}
          delayMinutes={pendingDelay.result.delayMinutes ?? 0}
          scheduledTime={pendingDelay.result.scheduledStartTime}
          doctorName={pendingDelay.doctorName}
          onClose={() => setPendingDelay(null)}
        />
      )}
    </div>
  );
}
